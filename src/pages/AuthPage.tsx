import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Mail, Lock, User, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  
  // Default to login mode if not on /signup path explicitly
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup Form Additional State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  
  // Sync state if url changes
  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
        toast.error('Erreur', { description: 'Veuillez remplir les champs obligatoires.' });
        return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
          await login(email, password);
          toast.success('Connecté avec succès!', { description: `Ravi de vous revoir.` });
          setTimeout(() => {
              navigate('/dashboard', { replace: true });
          }, 100);
      } else {
          if (!firstName.trim() || !lastName.trim() || !subject.trim()) {
              toast.error('Erreur', { description: 'Veuillez remplir votre nom et matière.' });
              setIsLoading(false);
              return;
          }
          if (password !== confirmPassword) {
              toast.error('Erreur', { description: 'Les mots de passe ne correspondent pas.' });
              setIsLoading(false);
              return;
          }
          await signup(email, password, firstName, lastName, 'teacher', subject);
          toast.success('Compte créé avec succès!', { description: 'Bienvenue sur EduPlan.' });
          
          setIsLogin(true); // Switch to login to force them to sign in, or auto redirect
          navigate('/login');
      }
    } catch (error) {
        console.error('Auth error:', error);
        toast.error(isLogin ? "Erreur de connexion" : "Erreur d'inscription", {
            description: error instanceof Error ? error.message : 'Identifiants incorrects.'
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Bientôt disponible', { description: 'Cette fonctionnalité est en cours de configuration.' });
  };

  const toggleMode = () => {
    navigate(isLogin ? '/signup' : '/login');
  };

  return (
    <div className="min-h-screen flex bg-edu-bg font-sans text-edu-black selection:bg-edu-red selection:text-edu-bg">
      {/* Left Column - Form (50% to 60%) */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center px-8 sm:px-16 md:px-24 relative z-10 bg-white shadow-[20px_0_40px_rgba(0,0,0,0.05)]">
        <div className="absolute top-8 left-8 sm:left-16 md:left-24">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-edu-red flex items-center justify-center text-white group-hover:scale-110 transition-transform"><Settings size={20} /></div>
            <span className="font-serif text-2xl font-bold tracking-wide">EduPlan</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm w-full mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
              <h1 className="font-serif text-4xl mb-3 text-edu-black">{isLogin ? 'Bon retour' : 'Rejoindre EduPlan'}</h1>
              <p className="text-edu-dark font-medium">L'assistant pédagogique pour les professeurs de matières techniques.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative group">
                        <User size={18} className="absolute left-3 top-3 text-edu-light group-focus-within:text-edu-red transition-colors" />
                        <input type="text" placeholder="Prénom" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all" />
                    </div>
                    <div className="relative group">
                        <User size={18} className="absolute left-3 top-3 text-edu-light group-focus-within:text-edu-red transition-colors" />
                        <input type="text" placeholder="Nom" value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all" />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            <div className="relative group">
              <Mail size={18} className="absolute left-3 top-3.5 text-edu-light group-focus-within:text-edu-red transition-colors" />
              <input type="email" placeholder="Adresse email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all" required />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-3 top-3.5 text-edu-light group-focus-within:text-edu-red transition-colors" />
              <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all" required />
            </div>

            <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <Lock size={18} className="absolute left-3 top-3 text-edu-light group-focus-within:text-edu-red transition-colors" />
                      <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all" />
                    </div>
                    
                    <div className="relative group">
                      <BookOpen size={18} className="absolute left-3 top-3 text-edu-light group-focus-within:text-edu-red transition-colors z-10" />
                      <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F2ED] border border-transparent rounded-[4px] outline-none focus:border-edu-red focus:bg-white focus:ring-1 focus:ring-edu-red transition-all appearance-none text-edu-black relative z-0">
                        <option value="" disabled>Matière principale</option>
                        <option value="mel">Maintenance des Équipements (MEL)</option>
                        <option value="elec">Génie Électrique</option>
                        <option value="meca">Mécanique Industrielle</option>
                        <option value="auto">Automatisme</option>
                        <option value="other">Autre matière technique</option>
                      </select>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <button type="button" onClick={handleComingSoon} className="text-sm font-semibold text-edu-dark hover:text-edu-red transition-colors hover:underline">Mot de passe oublié ?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-edu-red text-white py-3.5 rounded-[4px] font-bold hover:bg-[#5a0808] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Se connecter' : 'Créer mon compte')} 
              {!isLoading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-edu-light/50"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-edu-dark">Ou</span>
            <div className="flex-1 h-px bg-edu-light/50"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button type="button" onClick={handleComingSoon} className="flex items-center justify-center gap-2 py-3 border border-edu-light/50 rounded-[4px] hover:bg-[#F5F2ED] hover:border-edu-dark/20 transition-all text-sm font-bold text-edu-black opacity-60">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button type="button" onClick={handleComingSoon} className="flex items-center justify-center gap-2 py-3 border border-edu-light/50 rounded-[4px] hover:bg-[#F5F2ED] hover:border-edu-dark/20 transition-all text-sm font-bold text-edu-black opacity-60">
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path fill="#f25022" d="M1 1h9v9H1z" />
                <path fill="#00a4ef" d="M1 11h9v9H1z" />
                <path fill="#7fba00" d="M11 1h9v9h-9z" />
                <path fill="#ffb900" d="M11 11h9v9h-9z" />
              </svg>
              Microsoft
            </button>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-edu-dark">
            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
            <button 
              type="button"
              onClick={toggleMode} 
              className="text-edu-red font-bold hover:underline"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Visual (50% to 55%) */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[55%] bg-edu-black relative overflow-hidden">
        {/* Abstract Technical Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Dynamic Light Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-edu-red/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-edu-light/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-full max-w-2xl max-h-[800px] p-12"
          >
            {/* Stylized Circuit/Formula Art */}
            <svg viewBox="0 0 400 400" className="w-full h-full text-white/10 stroke-current drop-shadow-2xl" fill="none" strokeWidth="1.5">
              <circle cx="200" cy="200" r="150" strokeDasharray="4 8" className="animate-[spin_60s_linear_infinite]" />
              <circle cx="200" cy="200" r="100" strokeDasharray="8 4" className="animate-[spin_40s_linear_infinite_reverse]" />
              <path d="M50 200 H150 M250 200 H350 M200 50 V150 M200 250 V350" strokeWidth="2" strokeLinecap="round" />
              <rect x="150" y="150" width="100" height="100" className="text-edu-red/20 fill-current" rx="8" />
              <path d="M175 175 L225 225 M225 175 L175 225" strokeWidth="2" strokeLinecap="round" className="text-edu-red/60" />
            </svg>
            
            <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 left-1/4 font-mono text-3xl font-bold tracking-tighter text-white/50 transform -rotate-12 backdrop-blur-sm bg-white/5 px-6 py-3 rounded-lg border border-white/10 shadow-2xl"
            >
              P = U × I × cos(φ)
            </motion.div>
            <motion.div 
               animate={{ y: [0, 15, 0] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-1/3 right-1/4 font-mono text-2xl font-bold tracking-tighter text-edu-red/60 transform rotate-6 backdrop-blur-sm bg-black/20 px-6 py-3 rounded-lg border border-edu-red/20 shadow-2xl"
            >
              Z = √(R² + (Lω - 1/Cω)²)
            </motion.div>
          </motion.div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-16 bg-gradient-to-t from-edu-black via-edu-black/80 to-transparent">
            <h2 className="font-serif text-3xl text-white mb-4">La préparation de cours, <span className="text-edu-red italic">réinventée.</span></h2>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">Générez des séquences complètes, évaluez par compétences et gagnez des heures précieuses chaque semaine grâce à l'intelligence artificielle spécialisée.</p>
        </div>
      </div>
    </div>
  );
}
