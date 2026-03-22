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
    const loadUserProfile = async (userId: string, retryCount = 0) => {
        try {
            console.log(`🟡 [Attempt ${retryCount + 1}] Loading profile for user:`, userId);

            // Removing the 15s race timeout to let the request finish naturally or fail by network
            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", userId)
                .single();

            // If profile not found (PGRST116), it might be still creating
            if (profileError?.code === 'PGRST116' && retryCount < 5) {
                console.warn(`⏳ Account still initializing for ${userId}. Retrying (${retryCount + 1}/5)...`);
                await new Promise(resolve => setTimeout(resolve, 1500));
                return loadUserProfile(userId, retryCount + 1);
            }

            if (profileError) {
                console.error("❌ Profile fetch error:", profileError);
                setProfile(null);
                return null;
            }

            if (!profileData) {
                console.warn("⚠️ Profile truly missing for ID:", userId);
                setProfile(null);
                return null;
            }

            // Fetch sub-data
            const [subscriptionResult, usageResult] = await Promise.all([
                supabase
                    .from("subscriptions")
                    .select("tier, status")
                    .eq("user_id", userId)
                    .maybeSingle(),
                supabase
                    .from("usage_stats")
                    .select("lessons_count, ai_calls_count")
                    .eq("user_id", userId)
                    .maybeSingle()
            ]);

            const fullProfile = {
                ...profileData,
                tier: subscriptionResult.data?.tier || 'free',
                subscription_status: subscriptionResult.data?.status || 'active',
                lessons_count: usageResult.data?.lessons_count || 0,
                ai_calls_count: usageResult.data?.ai_calls_count || 0,
            };

            console.log("✅ Profile ready:", fullProfile.email);
            setProfile(fullProfile as UserProfile);
            return fullProfile as UserProfile;
        } catch (err: any) {
            console.error("🔥 Global failure in loadUserProfile:", err);
            if (retryCount < 2) return loadUserProfile(userId, retryCount + 1);
            setProfile(null);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                if (!isMounted) return;
                console.log("AuthProvider: Initializing...");
                setLoading(true);

                const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("AuthProvider: Session fetch error:", sessionError);
                    return;
                }

                if (currentSession && isMounted) {
                    console.log("AuthProvider: Found existing session for", currentSession.user.email);
                    setSession(currentSession);
                    setUser(currentSession.user);
                    await loadUserProfile(currentSession.user.id);
                } else {
                    console.log("AuthProvider: No active session found during initialization.");
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                }
            } catch (err) {
                console.error("AuthProvider: Critical initialization error:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log("AuthProvider: Initialization process finished.");
                }
            }
        };

        initializeAuth();

        // Listen for subsequent auth changes
        const { data: authData } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (!isMounted) return;
            console.log("AuthProvider: Auth State Change Event:", event);

            // Only update if we're not currently in the initial load 
            // to avoid mid-initialization state updates
            setSession(newSession);
            
            if (newSession?.user) {
                setUser(newSession.user);
                // In case of SIGNED_IN event (like after a signup or login), we ensure profile is loaded
                if (event === 'SIGNED_IN') {
                    await loadUserProfile(newSession.user.id);
                }
            } else {
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

            // Protect against hanging requests with a timeout
            const signInPromise = supabase.auth.signInWithPassword({ email, password });
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Login timeout')), 10000));

            const { data: loginData, error: loginError } = await Promise.race([signInPromise, timeout]) as any;

            if (loginError) throw loginError;

            if (loginData?.user) {
                setUser(loginData.user);
                setSession(loginData.session);
                // On attend le profil pour garantir la cohérence avant la redirection vers /dashboard
                await loadUserProfile(loginData.user.id);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Login error";
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

            if (signupError) throw signupError;

            if (signupData?.user) {
                console.log("AuthProvider: Signup successful, updating user_profiles record...");
                // Note: The database trigger 'handle_new_user' also creates the profile.
                // We use upsert here to ensure the data is exactly what the user entered,
                // including the 'subject' which is mapped to 'specialties'.
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
                    console.error("AuthProvider: Profile update error:", profileError);
                } else {
                    console.log("AuthProvider: user_profiles record updated successfully.");
                }

                setUser(signupData.user);
                setSession(signupData.session);
                await loadUserProfile(signupData.user.id);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Signup error";
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
