// Service Chariow pour gérer les appels API.
// Fichier: src/services/chariowService.ts

interface ChariowCheckoutResponse {
    checkoutUrl: string;
    checkoutId: string;
}

interface ChariowOrderStatus {
    id: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    customer: {
        email: string;
        name: string;
    };
    product: {
        id: string;
        name: string;
    };
    amount: {
        value: number;
        currency: string;
        formatted: string;
    };
    created_at: string;
    completed_at?: string;
}

const CHARIOW_API_URL = "https://api.chariow.com/v1";

async function readResponseBody(response: Response) {
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    if (!rawText.trim()) {
        return null;
    }

    if (contentType.includes("application/json")) {
        try {
            return JSON.parse(rawText);
        } catch {
            throw new Error("Réponse JSON invalide reçue depuis le service de paiement.");
        }
    }

    return rawText;
}

function getErrorMessage(payload: unknown, fallback: string) {
    if (typeof payload === "string" && payload.trim()) {
        return payload;
    }

    if (payload && typeof payload === "object") {
        const maybeError = (payload as { error?: string; message?: string }).error
            || (payload as { error?: string; message?: string }).message;

        if (maybeError) {
            return maybeError;
        }
    }

    return fallback;
}

export const chariowService = {
    /**
     * Initialiser un checkout Chariow via Edge Function
     */
    initializeCheckout: async (
        tier: string,
        userId: string,
        email: string,
        firstName: string,
        lastName: string,
        phone: { number: string; country_code: string }
    ): Promise<ChariowCheckoutResponse> => {
        try {
            console.log("Chariow: initializing checkout for", email, "tier:", tier);

            const response = await fetch("/api/chariow-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tier,
                    userId,
                    email,
                    firstName,
                    lastName,
                    phone,
                }),
            });

            const payload = await readResponseBody(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(payload, "L'initialisation du paiement a échoué.")
                );
            }

            if (!payload || typeof payload !== "object") {
                throw new Error("Le service de paiement a renvoyé une réponse vide.");
            }

            const data = payload as ChariowCheckoutResponse;

            if (!data.checkoutId || !data.checkoutUrl) {
                throw new Error("Les informations de paiement reçues sont incomplètes.");
            }

            console.log("Chariow: checkout initialized", data.checkoutId);
            return data;
        } catch (error) {
            console.error("Chariow checkout error:", error);
            throw error;
        }
    },

    /**
     * Récupérer le statut d'un checkout/commande
     */
    getCheckoutStatus: async (checkoutId: string): Promise<ChariowOrderStatus> => {
        try {
            const apiKey = (import.meta as any).env.VITE_CHARIOW_SECRET_KEY;

            if (!apiKey) {
                throw new Error("Chariow API key not configured");
            }

            console.log("Chariow: fetching checkout status:", checkoutId);

            const response = await fetch(`${CHARIOW_API_URL}/checkouts/${checkoutId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            const payload = await readResponseBody(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(payload, `Failed to fetch checkout status: ${response.status}`)
                );
            }

            const data = payload as { data?: ChariowOrderStatus };
            console.log("Chariow: checkout status retrieved:", data?.data?.status);
            if (!data?.data) {
                throw new Error("Le statut du paiement est introuvable.");
            }
            return data.data;
        } catch (error) {
            console.error("Chariow status error:", error);
            throw error;
        }
    },

    /**
     * Lister les produits disponibles
     */
    listProducts: async () => {
        try {
            const apiKey = (import.meta as any).env.VITE_CHARIOW_SECRET_KEY;

            if (!apiKey) {
                throw new Error("Chariow API key not configured");
            }

            console.log("Chariow: fetching products...");

            const response = await fetch(`${CHARIOW_API_URL}/products`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            const payload = await readResponseBody(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(payload, `Failed to fetch products: ${response.status}`)
                );
            }

            const data = payload as { data?: unknown };
            console.log("Chariow: products retrieved");
            return data?.data;
        } catch (error) {
            console.error("Chariow products error:", error);
            throw error;
        }
    },

    /**
     * Récupérer les données d'une commande (utilisé pour la confirmation)
     */
    getOrder: async (orderId: string) => {
        try {
            const apiKey = (import.meta as any).env.VITE_CHARIOW_SECRET_KEY;

            if (!apiKey) {
                throw new Error("Chariow API key not configured");
            }

            console.log("Chariow: fetching order:", orderId);

            const response = await fetch(`${CHARIOW_API_URL}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            const payload = await readResponseBody(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(payload, `Failed to fetch order: ${response.status}`)
                );
            }

            const data = payload as { data?: unknown };
            console.log("Chariow: order retrieved");
            return data?.data;
        } catch (error) {
            console.error("Chariow order error:", error);
            throw error;
        }
    },
};
