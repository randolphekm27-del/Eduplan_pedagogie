import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup, user, profile, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<'teacher' | 'student'>('teacher');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirection automatique si déjà connecté
    React.useEffect(() => {
        if (!loading && user && profile) {
            console.log('SignupPage: User already authenticated, redirecting to /dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [user, profile, loading, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
            toast.error('Erreur', { description: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Erreur', { description: 'Les mots de passe ne correspondent pas' });
            return;
        }

        setIsLoading(true);
        try {
            await signup(
                email,
                password,
                firstName,
                lastName,
                role
            );

            toast.success('Compte créé avec succès!', {
                description: 'Vous pouvez maintenant vous connecter.'
            });
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Erreur d\'inscription', {
                description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-edu-light flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 border border-edu-light">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-bold text-edu-black mb-2">EduPlan</h2>
                    <p className="text-edu-black/60">Créez votre compte enseignant</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-edu-black">Prénom</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-edu-black/40" />
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jean"
                                    className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-edu-black">Nom</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-edu-black/40" />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Dupont"
                                    className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-edu-black">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-edu-black/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jean.dupont@ecole.fr"
                                className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                                required
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-edu-black">Matière principale</label>
                        <div className="relative">
                            <BookOpen size={18} className="absolute left-3 top-3 text-edu-black/40" />
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20 appearance-none bg-white font-sans"
                                required
                            >
                                <option value="">Sélectionner une matière</option>
                                <option value="MEL">MEL (Maintenance des Équipements)</option>
                                <option value="ELEC">Électrotechnique</option>
                                <option value="MEI">MEI (Maintenance Industrielle)</option>
                                <option value="TECH">Technologie</option>
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-edu-black">Mot de passe</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-edu-black/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-edu-black">Confirmation</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-edu-black/40" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2 border border-edu-light rounded-md focus:outline-none focus:border-edu-red focus:ring-2 focus:ring-edu-red/20"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-edu-red text-white font-semibold rounded-md hover:bg-edu-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-md active:scale-95 transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Création du compte...
                            </>
                        ) : (
                            <>
                                Créer mon compte
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-edu-black/60 font-sans">
                    Déjà un compte?{' '}
                    <Link to="/login" className="text-edu-red font-semibold hover:underline">
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}
