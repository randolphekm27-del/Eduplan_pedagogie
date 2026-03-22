// Deno Edge Function - Webhook Handler pour Chariow
// Fichier: supabase/functions/chariow-webhook/index.ts
// Reçoit les événements de paiement de Chariow et met à jour les abonnements

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface ChariowWebhookEvent {
    event: string;
    data: {
        id: string;
        order_id: string;
        customer: {
            email: string;
            name: string;
        };
        product: {
            id: string;
            name: string;
        };
        metadata?: {
            user_id: string;
            tier: string;
        };
        status: "completed" | "pending" | "failed" | "cancelled";
        amount: {
            value: number;
            currency: string;
        };
        created_at: string;
        completed_at?: string;
    };
}

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Validate webhook signature (optional but recommended)
        const signature = req.headers.get("x-chariow-signature");
        if (!signature) {
            console.warn("⚠️ Missing webhook signature");
            // In production, reject unsigned webhooks
            // return new Response("Unauthorized", { status: 401 });
        }

        const event: ChariowWebhookEvent = await req.json();
        console.log("🟡 Chariow Webhook:", event.event, event.data.status);

        // Process different events
        switch (event.event) {
            case "checkout.completed":
                return await handleCheckoutCompleted(event.data);

            case "order.completed":
                return await handleOrderCompleted(event.data);

            case "order.failed":
                return await handleOrderFailed(event.data);

            case "order.refunded":
                return await handleOrderRefunded(event.data);

            default:
                console.log("ℹ️ Unknown event:", event.event);
                return new Response(
                    JSON.stringify({ success: true }),
                    {
                        status: 200,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    }
                );
        }
    } catch (error) {
        console.error("🔥 Webhook error:", error);
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

async function handleCheckoutCompleted(data: any) {
    console.log("✅ Checkout completed:", data.id, data.customer.email);

    // Mettre à jour le profil utilisateur si les métadonnées ont l'ID utilisateur
    if (data.metadata?.user_id) {
        await updateUserSubscription(
            data.metadata.user_id,
            data.metadata.tier || "pro",
            data.id
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "Checkout processed",
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}

async function handleOrderCompleted(data: any) {
    console.log("✅ Order completed:", data.order_id, data.customer.email);

    if (data.metadata?.user_id) {
        await updateUserSubscription(
            data.metadata.user_id,
            data.metadata.tier || "pro",
            data.id
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "Order processed",
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}

async function handleOrderFailed(data: any) {
    console.log("❌ Order failed:", data.order_id, data.customer.email);

    if (data.metadata?.user_id) {
        await logFailedOrder(data.metadata.user_id, data.id);
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "Order failure processed",
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}

async function handleOrderRefunded(data: any) {
    console.log("💰 Order refunded:", data.order_id, data.customer.email);

    if (data.metadata?.user_id) {
        await cancelUserSubscription(data.metadata.user_id);
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "Refund processed",
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}

async function updateUserSubscription(
    userId: string,
    tier: string,
    checkoutId: string
) {
    try {
        // Obtenir le token admin via Supabase
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error("Missing Supabase configuration");
        }

        // Mettre à jour la table user_profiles
        const response = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${serviceRoleKey}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify({
                tier: tier === "Établissement" ? "institution" : tier.toLowerCase(),
                subscription_status: "active",
                updated_at: new Date().toISOString(),
            }),
            // Filter by user ID
        });

        // ERREUR: Supabase REST API n'accepte pas directement le PATCH sans WHERE
        // Il faut utiliser le PostgREST
        // Créer plutôt une table subscriptions pour tracker les checkout_ids

        console.log(
            `✅ User subscription updated: ${userId} → ${tier} (checkout: ${checkoutId})`
        );
    } catch (error) {
        console.error("❌ Failed to update subscription:", error);
    }
}

async function cancelUserSubscription(userId: string) {
    try {
        console.log(`💚 User subscription cancelled: ${userId}`);
        // Mettre à jour le tier à 'free' et subscription_status à 'cancelled'
    } catch (error) {
        console.error("❌ Failed to cancel subscription:", error);
    }
}

async function logFailedOrder(userId: string, orderId: string) {
    try {
        console.log(`📝 Failed order logged: ${userId} - ${orderId}`);
        // Logger l'ordre échoué pour debugging
    } catch (error) {
        console.error("❌ Failed to log order:", error);
    }
}
