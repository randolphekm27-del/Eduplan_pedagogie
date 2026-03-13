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
    signup: (email: string, password: string, firstName: string, lastName: string, role: "teacher" | "student") => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUserProfile = async (userId: string) => {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (profileError) {
                console.warn("Profile load error:", profileError);
                return;
            }
            setProfile(profileData as UserProfile);
        } catch (err) {
            console.warn("Error loading profile:", err);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);
                
                if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
                    console.warn("Supabase not configured");
                    setLoading(false);
                    return;
                }

                const { data: dataSession, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    console.warn("Session error:", sessionError);
                    setLoading(false);
                    return;
                }
                
                const existingSession = dataSession?.session;
                setSession(existingSession);

                if (existingSession?.user) {
                    setUser(existingSession.user);
                    await loadUserProfile(existingSession.user.id);
                }
            } catch (err) {
                console.error("Auth init error:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const { data: authData } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setSession(newSession);

                if (newSession?.user) {
                    setUser(newSession.user);
                    await loadUserProfile(newSession.user.id);
                    try {
                        await supabase
                            .from("user_profiles")
                            .update({ last_login: new Date().toISOString() })
                            .eq("id", newSession.user.id);
                    } catch (err) {
                        console.warn("Could not update last_login:", err);
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        return () => authData?.subscription?.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            if (loginData?.user) {
                setUser(loginData.user);
                setSession(loginData.session);
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
        role: "teacher" | "student"
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
                    },
                },
            });

            if (signupError) throw signupError;

            if (signupData?.user) {
                const { error: profileError } = await supabase
                    .from("user_profiles")
                    .insert([
                        {
                            id: signupData.user.id,
                            email,
                            firstname: firstName,
                            lastname: lastName,
                            role,
                        },
                    ]);

                if (profileError) console.warn("Profile creation warning:", profileError);

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
