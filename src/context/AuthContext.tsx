import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import { UserProfile } from "../services/supabaseClient";

interface AuthContextType {
    user: SupabaseUser | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, firstName: string, lastName: string, role: "teacher" | "student", subject?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const buildProfileFallback = (authUser: SupabaseUser) => {
        const metadata = authUser.user_metadata ?? {};
        const firstName = metadata.firstName ?? metadata.firstname ?? "Utilisateur";
        const lastName = metadata.lastName ?? metadata.lastname ?? "";
        const role = metadata.role === "student" || metadata.role === "admin" ? metadata.role : "teacher";
        const subject = metadata.subject;

        return {
            id: authUser.id,
            email: authUser.email ?? "",
            firstname: firstName,
            lastname: lastName,
            role,
            specialties: typeof subject === "string" && subject.trim() ? [subject] : [],
        };
    };

    const ensureUserProfile = async (authUser: SupabaseUser) => {
        const fallbackProfile = buildProfileFallback(authUser);
        console.warn("🟠 AuthProvider: Creating missing profile from auth metadata for", authUser.email);

        const { data: upsertedProfile, error: upsertError } = await supabase
            .from("user_profiles")
            .upsert(fallbackProfile, { onConflict: "id" })
            .select()
            .single();

        if (upsertError) {
            console.error("❌ AuthProvider: Failed to auto-create missing profile:", upsertError);
            return null;
        }

        console.log("✅ AuthProvider: Missing profile recreated successfully");
        setProfile(upsertedProfile as UserProfile);
        return upsertedProfile as UserProfile;
    };

    const loadUserProfile = async (userId: string, retryCount = 0) => {
        try {
            console.log(`🟡 [Try ${retryCount + 1}/5] Loading profile for user:`, userId);

            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", userId)
                .single();

            // Si profil non trouvé (PGRST116), peut être en train d'être créé (trigger)
            if (profileError?.code === 'PGRST116') {
                const {
                    data: { user: authUser },
                } = await supabase.auth.getUser();

                if (authUser?.id === userId) {
                    const recoveredProfile = await ensureUserProfile(authUser);
                    if (recoveredProfile) {
                        return recoveredProfile;
                    }
                }

                console.warn(`⏳ Profile not found yet (attempt ${retryCount + 1}/5). Retrying in 1.5s...`, userId);

                if (retryCount < 4) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return loadUserProfile(userId, retryCount + 1);
                } else {
                    console.error("❌ Profile query exhausted retries:", profileError);
                    setProfile(null);
                    return null;
                }
            }

            if (profileError) {
                console.error("❌ Profile fetch error:", profileError);
                setProfile(null);
                return null;
            }

            if (!profileData) {
                console.warn("⚠️ Profile data is empty for ID:", userId);
                setProfile(null);
                return null;
            }

            // Valider que les données essentielles existent
            if (!profileData.firstname || !profileData.lastname) {
                console.warn("⚠️ Profile missing firstname or lastname:", profileData);
            }

            console.log("✅ Profile loaded successfully:", {
                email: profileData.email,
                firstname: profileData.firstname,
                lastname: profileData.lastname,
                role: profileData.role
            });

            setProfile(profileData as UserProfile);
            return profileData as UserProfile;
        } catch (err: any) {
            console.error("🔥 Critical error in loadUserProfile:", err);
            if (retryCount < 2) {
                console.log(`Retrying on exception (attempt ${retryCount + 1}/3)...`);
                return loadUserProfile(userId, retryCount + 1);
            }
            setProfile(null);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;
        // FIX Bug #1: Blocks onAuthStateChange during app initialization to prevent
        // duplicate loadUserProfile() calls (race condition causing infinite spinner)
        let isInitializing = true;

        const initializeAuth = async () => {
            try {
                if (!isMounted) return;
                console.log("🟠 AuthProvider: Initializing auth state...");
                setLoading(true);

                const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("❌ AuthProvider: Session fetch error:", sessionError);
                    return;
                }

                if (currentSession && isMounted) {
                    console.log("✅ AuthProvider: Found existing session for", currentSession.user.email);
                    setSession(currentSession);
                    setUser(currentSession.user);
                    await loadUserProfile(currentSession.user.id);
                } else {
                    console.log("ℹ️ AuthProvider: No active session found during initialization");
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                }
            } catch (err) {
                console.error("🔥 AuthProvider: Critical initialization error:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    isInitializing = false; // ← Unlock the auth state listener
                    console.log("✅ AuthProvider: Initialization complete");
                }
            }
        };

        initializeAuth();

        // Listen for subsequent auth changes
        const { data: authData } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (!isMounted) return;
            // FIX Bug #1: Ignore events fired during initializeAuth to prevent race condition
            if (isInitializing) {
                console.log("⏳ AuthProvider: Skipping auth event during initialization:", event);
                return;
            }
            console.log("🟡 AuthProvider: Auth State Change Event:", event);

            setSession(newSession);

            if (newSession?.user) {
                setUser(newSession.user);
                // Load profile on SIGNED_IN event (after signup or login)
                if (event === 'SIGNED_IN') {
                    console.log("🟡 AuthProvider: SIGNED_IN event - loading profile...");
                    await loadUserProfile(newSession.user.id);
                }
            } else {
                console.log("ℹ️ AuthProvider: User signed out or session invalid");
                setUser(null);
                setProfile(null);
            }
        });

        return () => {
            isMounted = false;
            authData?.subscription?.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            console.log("🟠 AuthProvider.login: Starting login for", email);

            // FIX Bug #2: Timeout applies ONLY to the network auth call (~100-460ms per logs).
            // loadUserProfile is called AFTER (can take up to 7.5s for new accounts with retries).
            console.log("🟡 AuthProvider.login: Signing in...");
            let loginData;
            try {
                const signInPromise = supabase.auth.signInWithPassword({ email, password });
                const timeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Login timeout — vérifiez votre connexion réseau.')), 15000)
                );
                const result = await Promise.race([signInPromise, timeout]) as any;
                const { data, error: loginError } = result;
                if (loginError) throw loginError;
                loginData = data;
            } catch (authErr: any) {
                console.error("❌ AuthProvider.login: Authentication failed", authErr);
                const errorMessage = authErr?.message || "Authentification échouée. Vérifiez vos identifiants.";
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            if (!loginData?.user) {
                throw new Error("Aucun utilisateur retourné lors de l'authentification");
            }

            console.log("✅ AuthProvider.login: User authenticated", loginData.user.email);
            setUser(loginData.user);
            setSession(loginData.session);

            // 2. Profile loading phase (timeout: 15 secondes)
            console.log("🟡 AuthProvider.login: Loading user profile...");
            try {
                await loadUserProfile(loginData.user.id);
                console.log("✅ AuthProvider.login: Profile loaded successfully");
            } catch (profileErr) {
                console.warn("⚠️ AuthProvider.login: Profile loading encountered issue (user still logged in)", profileErr);
                // Profile loading failure is not critical - user still authenticated
                // The profile will be retried on next page load
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur de connexion";
            console.error("🔥 AuthProvider.login: Critical error", err);
            setError(errorMessage);
            throw err;
        }
    };

    const signup = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: "teacher" | "student",
        subject?: string
    ) => {
        try {
            setError(null);
            console.log("🟠 AuthProvider.signup: Starting signup for", email);

            // 1. Créer l'utilisateur en auth
            console.log("🟡 AuthProvider.signup: Creating auth user...");
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName,
                        lastName,
                        role,
                        subject,
                    },
                },
            });

            if (signupError) {
                throw signupError;
            }

            if (!signupData?.user) {
                throw new Error("Aucun utilisateur créé");
            }

            console.log("✅ AuthProvider.signup: Auth user created", signupData.user.id);

            // 2. Mettre à jour le profil (le trigger l'aura déjà créé)
            console.log("🟡 AuthProvider.signup: Updating user_profiles record...");
            const { error: profileError } = await supabase
                .from("user_profiles")
                .upsert({
                    id: signupData.user.id,
                    email,
                    firstname: firstName,
                    lastname: lastName,
                    role,
                    specialties: subject ? [subject] : [],
                }, { onConflict: 'id' });

            if (profileError) {
                console.error("⚠️ AuthProvider.signup: Profile error:", profileError);
            } else {
                console.log("✅ AuthProvider.signup: Profile record ready");
            }

            setUser(signupData.user);
            if (signupData.session) {
                setSession(signupData.session);
            }

            // 3. Charger le profil pour vérifier
            console.log("🟡 AuthProvider.signup: Loading profile for verification...");
            await loadUserProfile(signupData.user.id);
            console.log("✅ AuthProvider.signup: Signup complete");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur d'inscription";
            console.error("🔥 AuthProvider.signup: Error", err);
            setError(errorMessage);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            const { error: logoutError } = await supabase.auth.signOut();
            if (logoutError) throw logoutError;

            setUser(null);
            setProfile(null);
            setSession(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Logout error";
            setError(errorMessage);
            throw err;
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        try {
            if (!user) throw new Error("Not logged in");

            setError(null);
            const { error: updateError } = await supabase
                .from("user_profiles")
                .update(data)
                .eq("id", user.id);

            if (updateError) throw updateError;

            setProfile(prev => prev ? { ...prev, ...data } : null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Update error";
            setError(errorMessage);
            throw err;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setError(null);
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
            if (resetError) throw resetError;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Reset error";
            setError(errorMessage);
            throw err;
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await loadUserProfile(user.id);
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        session,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        resetPassword,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
