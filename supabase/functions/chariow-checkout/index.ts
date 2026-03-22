// Deno Edge Function pour Supabase - Initialiser le checkout Chariow
// Fichier: supabase/functions/chariow-checkout/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const CHARIOW_API_URL = "https://api.chariow.com/v1";
const CHARIOW_SECRET_KEY = Deno.env.get("CHARIOW_SECRET_KEY");

interface CheckoutRequest {
    tier: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: {
        number: string;
        country_code: string;
    };
}

interface ChariowProduct {
    [key: string]: string;
}

const PRODUCT_MAPPING: ChariowProduct = {
    "Pro": Deno.env.get("CHARIOW_PRODUCT_ID_PRO") || "prd_eumj8o",
    "Établissement": Deno.env.get("CHARIOW_PRODUCT_ID_INSTITUTION") || "prd_by8qtf",
};

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Valider la clé secrète
        if (!CHARIOW_SECRET_KEY) {
            throw new Error("CHARIOW_SECRET_KEY not configured");
        }

        const body: CheckoutRequest = await req.json();
        const { tier, userId, email, firstName, lastName, phone } = body;

        // Valider les données
        if (!tier || !userId || !email) {
            return new Response(
                JSON.stringify({
                    error: "Missing required fields: tier, userId, email"
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Récupérer l'ID du produit
        const productId = PRODUCT_MAPPING[tier];
        if (!productId) {
            return new Response(
                JSON.stringify({
                    error: `Invalid tier: ${tier}`
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Créer le checkout via Chariow API
        const checkoutResponse = await fetch(
            `${CHARIOW_API_URL}/checkouts`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${CHARIOW_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    customer: {
                        email: email,
                        name: `${firstName} ${lastName}`,
                        phone: `${phone.country_code}${phone.number}`,
                    },
                    metadata: {
                        user_id: userId,
                        tier: tier,
                        first_name: firstName,
                        last_name: lastName,
                    },
                    return_url: `${new URL(req.url).origin
                        }/checkout-success?session_id={checkout_id}`,
                    cancel_url: `${new URL(req.url).origin}/pricing`,
                }),
            }
        );

        if (!checkoutResponse.ok) {
            const errorData = await checkoutResponse.text();
            console.error("Chariow API Error:", checkoutResponse.status, errorData);
            throw new Error(
                `Chariow API error: ${checkoutResponse.status} - ${errorData}`
            );
        }

        const checkoutData = await checkoutResponse.json();

        // Vérifier la structure de réponse Chariow
        if (!checkoutData.data || !checkoutData.data.checkout_url) {
            console.error("Unexpected Chariow response:", checkoutData);
            throw new Error("Invalid Chariow response: missing checkout_url");
        }

        return new Response(
            JSON.stringify({
                checkoutUrl: checkoutData.data.checkout_url,
                checkoutId: checkoutData.data.id,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Checkout error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
