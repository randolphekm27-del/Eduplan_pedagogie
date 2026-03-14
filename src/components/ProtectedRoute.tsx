import React from 'react';
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
    const { user, profile, loading } = useAuth();

    // Afficher un loader uniquement si on charge ET qu'on n'a pas d'utilisateur
    if (loading && !user) {
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

    // Si on a un user mais vraiment pas de profil après chargement, c'est un problème d'inscription
    if (!profile) {
        console.warn("ProtectedRoute: User logged in but no profile found.");
        // On pourrait rediriger vers une page de complétion de profil ici
        return <Navigate to="/login" replace />;
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
