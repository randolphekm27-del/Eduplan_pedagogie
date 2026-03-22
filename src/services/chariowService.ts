// Service Chariow pour gérer les API calls
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
            console.log("🟡 Chariow: Initializing checkout for", email, "tier:", tier);

            // Appeler l'Edge Function Supabase
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Checkout initialization failed");
            }

            const data: ChariowCheckoutResponse = await response.json();
            console.log("✅ Chariow: Checkout initialized", data.checkoutId);
            return data;
        } catch (error) {
            console.error("❌ Chariow checkout error:", error);
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

            console.log("🟡 Chariow: Fetching checkout status:", checkoutId);

            const response = await fetch(
                `${CHARIOW_API_URL}/checkouts/${checkoutId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch checkout status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Chariow: Checkout status retrieved:", data.data?.status);
            return data.data as ChariowOrderStatus;
        } catch (error) {
            console.error("❌ Chariow status error:", error);
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

            console.log("🟡 Chariow: Fetching products...");

            const response = await fetch(`${CHARIOW_API_URL}/products`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Chariow: Products retrieved");
            return data.data;
        } catch (error) {
            console.error("❌ Chariow products error:", error);
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

            console.log("🟡 Chariow: Fetching order:", orderId);

            const response = await fetch(`${CHARIOW_API_URL}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch order: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Chariow: Order retrieved");
            return data.data;
        } catch (error) {
            console.error("❌ Chariow order error:", error);
            throw error;
        }
    },
};
