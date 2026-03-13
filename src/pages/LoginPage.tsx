import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error('Erreur', { description: 'Veuillez remplir tous les champs' });
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Connecté avec succès!', {
                description: `Bienvenue ${email}`
            });
            console.log('Connexion réussie via AuthContext, redirection vers /dashboard');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Erreur de connexion', {
                description: error instanceof Error ? error.message : 'Email ou mot de passe incorrect'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-edu-light flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-edu-light">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-bold text-edu-black mb-2">Editplan</h2>
                    <p className="text-edu-black/60">Connectez-vous à votre compte</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-edu-black">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-edu-black/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.fr"
                                className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-edu-black">Mot de passe</label>
                            <Link to="/forgot-password" className="text-xs text-edu-red hover:underline">
                                Oublié?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3 text-edu-black/40" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-edu-red text-white font-semibold rounded-md hover:bg-edu-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            <>
                                Se connecter
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 text-center text-sm text-edu-black/60">
                    Pas encore de compte?{' '}
                    <Link to="/signup" className="text-edu-red font-semibold hover:underline">
                        S'inscrire
                    </Link>
                </div>
            </div>
        </div>
    );
}
