import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Mail, Lock, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? 'Connexion réussie' : 'Compte créé avec succès');
    navigate('/dashboard');
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Bientôt disponible', {
      description: 'Cette fonctionnalité est en cours de développement.'
    });
  };

  return (
    <div className="min-h-screen flex bg-edu-bg font-sans text-edu-black">
      {/* Left Column - Form (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative z-10">
        <div className="absolute top-8 left-8 sm:left-16 md:left-24 lg:left-32">
          <Link to="/" className="flex items-center gap-2">
            <Settings className="text-edu-red" size={24} />
            <span className="font-serif text-xl font-bold">EduPlan</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-16"
        >
          <h1 className="font-serif text-4xl mb-2">Bienvenue sur EduPlan</h1>
          <p className="text-edu-dark mb-10">L'assistant pédagogique pour les professeurs de matières techniques.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-edu-light group-focus-within:text-edu-red transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-edu-light group-focus-within:text-edu-red transition-colors" />
              </div>
              <input 
                type="email" 
                placeholder="Adresse email" 
                className="w-full pl-10 pr-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-edu-light group-focus-within:text-edu-red transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Mot de passe" 
                className="w-full pl-10 pr-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-edu-light group-focus-within:text-edu-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Confirmer le mot de passe" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all"
                    required
                  />
                </div>
                
                <div className="relative group">
                  <select className="w-full px-4 py-3 bg-white border border-edu-light/50 rounded-[2px] outline-none focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all appearance-none text-edu-dark">
                    <option value="" disabled selected>Matière principale enseignée</option>
                    <option value="mel">Maintenance des Équipements (MEL)</option>
                    <option value="elec">Génie Électrique</option>
                    <option value="meca">Mécanique Industrielle</option>
                    <option value="auto">Automatisme</option>
                    <option value="other">Autre matière technique</option>
                  </select>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button onClick={handleComingSoon} className="text-sm text-edu-dark hover:text-edu-red transition-colors">Mot de passe oublié ?</button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-edu-red text-white py-3.5 rounded-[2px] font-medium hover:bg-[#5a0808] transition-colors shadow-[0_4px_14px_rgba(126,11,11,0.2)] flex items-center justify-center gap-2"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'} <ChevronRight size={18} />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-edu-light/30"></div>
            <span className="text-sm text-edu-dark">ou</span>
            <div className="flex-1 h-px bg-edu-light/30"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button onClick={handleComingSoon} className="flex items-center justify-center gap-2 py-2.5 border border-edu-light/50 rounded-[2px] hover:bg-white transition-colors text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button onClick={handleComingSoon} className="flex items-center justify-center gap-2 py-2.5 border border-edu-light/50 rounded-[2px] hover:bg-white transition-colors text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path fill="#f25022" d="M1 1h9v9H1z" />
                <path fill="#00a4ef" d="M1 11h9v9H1z" />
                <path fill="#7fba00" d="M11 1h9v9h-9z" />
                <path fill="#ffb900" d="M11 11h9v9h-9z" />
              </svg>
              Microsoft
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-edu-dark">
            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-edu-red font-medium hover:underline"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Visual (40%) */}
      <div className="hidden lg:block w-[40%] bg-edu-dark relative overflow-hidden">
        {/* Abstract Technical Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-lg max-h-lg p-12">
            {/* Stylized Circuit/Formula Art */}
            <svg viewBox="0 0 400 400" className="w-full h-full text-white/10 stroke-current" fill="none" strokeWidth="1">
              <circle cx="200" cy="200" r="150" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="100" />
              <path d="M50 200 H150 M250 200 H350 M200 50 V150 M200 250 V350" strokeWidth="2" />
              <rect x="150" y="150" width="100" height="100" className="text-edu-red/20 fill-current" />
              <path d="M175 175 L225 225 M225 175 L175 225" strokeWidth="2" className="text-edu-red/50" />
            </svg>
            
            <div className="absolute top-1/4 left-1/4 font-mono text-2xl text-white/30 transform -rotate-12">
              P = U × I × cos(φ)
            </div>
            <div className="absolute bottom-1/3 right-1/4 font-mono text-xl text-edu-red/40 transform rotate-6">
              Z = √(R² + (Lω - 1/Cω)²)
            </div>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-edu-black/80 to-transparent"></div>
      </div>
    </div>
  );
}
