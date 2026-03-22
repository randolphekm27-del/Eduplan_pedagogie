import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'teacher' | 'student' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {
    const { user, profile, loading, refreshProfile, logout } = useAuth();
    // If the profile never loads, stay on a recovery screen instead of bouncing
    // the user between /login and /dashboard.
    const [profileTimedOut, setProfileTimedOut] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (user && !profile && !loading) {
            timerRef.current = setTimeout(() => {
                console.warn("ProtectedRoute: Profile load timeout — redirecting to /login");
                setProfileTimedOut(true);
            }, 30000);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
            setProfileTimedOut(false);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [user, profile, loading]);

    // Afficher un loader uniquement pendant le chargement initial du contexte
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-edu-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-edu-red"></div>
                    <p className="text-edu-black/60 font-medium">Chargement de votre session...</p>
                </div>
            </div>
        );
    }

    // Rediriger vers login si pas connecté (et qu'on ne charge plus)
    if (!user) {
        console.log("ProtectedRoute: No user found, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    if (profileTimedOut) {
        return (
            <div className="flex items-center justify-center h-screen bg-edu-bg">
                <div className="text-center max-w-md p-8 bg-white border border-edu-light shadow-xl rounded-[2px]">
                    <div className="w-16 h-16 border-4 border-edu-red/20 border-t-edu-red rounded-full animate-spin mx-auto mb-6"></div>
                    <h1 className="text-2xl font-serif font-bold text-edu-black mb-4">Compte connecte, profil indisponible</h1>
                    <p className="text-edu-dark mb-6">
                        La session est bien ouverte, mais votre profil applicatif n'a pas encore pu etre charge.
                        Nous evitons maintenant toute redirection automatique pour ne plus vous bloquer dans une boucle.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={async () => {
                                setIsRecovering(true);
                                setProfileTimedOut(false);
                                try {
                                    await refreshProfile();
                                } finally {
                                    setIsRecovering(false);
                                }
                            }}
                            disabled={isRecovering}
                            className="px-6 py-2.5 bg-edu-red text-white font-bold rounded-[2px] hover:bg-[#5a0808] transition-all w-full disabled:opacity-70"
                        >
                            {isRecovering ? "Nouvelle tentative..." : "Reessayer le chargement du profil"}
                        </button>
                        <button
                            onClick={async () => {
                                await logout();
                            }}
                            className="px-6 py-2.5 bg-white text-edu-black font-bold rounded-[2px] border border-edu-light hover:bg-edu-bg transition-all w-full"
                        >
                            Se deconnecter
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-edu-dark/50">Si le probleme persiste, verifiez la table user_profiles et les policies Supabase.</p>
                </div>
            </div>
        );
    }

    // Si on a un user mais que le profil n'est pas encore là
    // On attend un court instant de plus pour laisser le temps à la base de données de se synchroniser
    if (!profile) {
        return (
            <div className="flex items-center justify-center h-screen bg-edu-bg">
                <div className="text-center max-w-md p-8 bg-white border border-edu-light shadow-xl rounded-[2px]">
                    <div className="w-16 h-16 border-4 border-edu-red/20 border-t-edu-red rounded-full animate-spin mx-auto mb-6"></div>
                    <h1 className="text-2xl font-serif font-bold text-edu-black mb-4">Synchronisation de votre compte</h1>
                    <p className="text-edu-dark mb-6">Nous finalisons la configuration de votre espace pédagogique. Cela ne prend que quelques secondes...</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-edu-red text-white font-bold rounded-[2px] hover:bg-[#5a0808] transition-all w-full"
                    >
                        Actualiser maintenant
                    </button>
                    <p className="mt-4 text-xs text-edu-dark/40">Si cet écran persiste plus de 30 secondes, veuillez nous contacter.</p>
                </div>
            </div>
        );
    }

    // Vérifier le rôle si requis
    if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
                    <p className="text-gray-600">Vous n'avez pas les permissions requises pour accéder à cette page.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
