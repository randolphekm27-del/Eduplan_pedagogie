import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase configuration missing! Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
    id: string;
    email: string;
    user_metadata?: {
        firstName?: string;
        lastName?: string;
    };
}

export interface UserProfile {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: 'teacher' | 'student' | 'admin';
    created_at: string;
    updated_at: string;
    tier?: 'free' | 'pro' | 'institution';
    subscription_status?: 'active' | 'expired' | 'cancelled';
    lessons_count?: number;
    ai_calls_count?: number;
    avatar_url?: string;
    bio?: string;
    institution?: string;
    specialties?: string[];
    is_verified?: boolean;
}

export const supabaseService = {
    /**
     * Inscription utilisateur
     */
    signup: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: 'teacher' | 'student' = 'teacher'
    ) => {
        try {
            // Créer l'utilisateur
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName,
                        lastName,
                        role,
                    },
                },
            });

            if (error) throw error;

            // Créer le profil utilisateur si l'utilisateur est créé
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: data.user.id,
                        email,
                        firstname: firstName,
                        lastname: lastName,
                        role,
                    });

                if (profileError) {
                    console.error('Erreur création profil:', profileError);
                }
            }

            return { user: data.user, error: null };
        } catch (error) {
            console.error('Erreur inscription:', error);
            return { user: null, error };
        }
    },

    /**
     * Connexion utilisateur
     */
    login: async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { session: data.session, user: data.user, error: null };
        } catch (error) {
            console.error('Erreur connexion:', error);
            return { session: null, user: null, error };
        }
    },

    /**
     * Déconnexion
     */
    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            return { error };
        }
    },

    /**
     * Récupérer l'utilisateur connecté
     */
    getCurrentUser: async () => {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
            return { user: data.user, error: null };
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
            return { user: null, error };
        }
    },

    /**
     * Récupérer le profil utilisateur
     */
    getUserProfile: async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            return { profile: data as UserProfile, error: null };
        } catch (error) {
            console.error('Erreur récupération profil:', error);
            return { profile: null, error };
        }
    },

    /**
     * Mettre à jour le profil utilisateur
     */
    updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', userId);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            return { error };
        }
    },

    /**
     * Vérifier la session
     */
    checkSession: async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session: data.session, error: null };
        } catch (error) {
            console.error('Erreur vérification session:', error);
            return { session: null, error };
        }
    },

    /**
     * Écouter les changements d'authentification
     */
    onAuthStateChange: (callback: (session: any, user: any) => void) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(session, session?.user);
        });
    },

    /**
     * Réinitialiser le mot de passe
     */
    resetPassword: async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${(import.meta as any).env.VITE_APP_URL}/reset-password`,
            });

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Erreur réinitialisation mot de passe:', error);
            return { error };
        }
    },

    /**
     * Mettre à jour le mot de passe
     */
    updatePassword: async (newPassword: string) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Erreur mise à jour mot de passe:', error);
            return { error };
        }
    },
};
