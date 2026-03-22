import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  return (
    <footer className="bg-edu-black text-edu-light border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
        <GraduationCap size={400} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-max">
              <GraduationCap className="text-edu-red group-hover:rotate-12 transition-transform duration-300" size={32} />
              <span className="font-serif text-2xl font-bold text-white tracking-wide">EduPlan</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm">
              L'assistant IA de nouvelle génération conçu spécifiquement pour alléger la charge de travail des enseignants, toutes disciplines confondues.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-edu-red hover:text-white transition-all text-white/70">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-edu-red hover:text-white transition-all text-white/70">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-edu-red hover:text-white transition-all text-white/70">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-edu-red text-transparent rounded-full block"></span> Produit
            </h4>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-sm hover:text-edu-red transition-colors duration-200">Fonctionnalités IA</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-edu-red transition-colors duration-200">Tarification</Link></li>
              <li><Link to="/learn-ai" className="text-sm hover:text-edu-red transition-colors duration-200">Formation IA</Link></li>
              <li><Link to="/whats-new" className="text-sm hover:text-edu-red transition-colors duration-200 flex items-center gap-2">Nouveautés <span className="bg-edu-red/20 text-edu-red text-[10px] px-2 py-0.5 rounded-full font-bold">PRO</span></Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-edu-red text-transparent rounded-full block"></span> Ressources
            </h4>
            <ul className="space-y-4">
              <li><Link to="/blog" className="text-sm hover:text-edu-red transition-colors duration-200">Blog Pédagogique</Link></li>
              <li><Link to="/guides" className="text-sm hover:text-edu-red transition-colors duration-200">Guides d'utilisation</Link></li>
              <li><Link to="/templates-gallery" className="text-sm hover:text-edu-red transition-colors duration-200">Modèles de fiches</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-edu-red transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-edu-red text-transparent rounded-full block"></span> Restez informé
            </h4>
            <p className="text-sm opacity-80 mb-4">
              Recevez nos conseils sur l'IA dans l'éducation.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); toast.success('Inscription réussie !', { description: 'Merci de vous être abonné.'}); }}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-edu-light/50" size={16} />
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-edu-light/50 focus:outline-none focus:border-edu-red transition-colors"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-edu-red hover:bg-[#5a0808] text-white py-2.5 rounded-[2px] text-sm font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} EduPlan. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm opacity-60">
            <Link to="/privacy" className="hover:text-edu-red hover:opacity-100 transition-colors">Confidentialité</Link>
            <Link to="/terms" className="hover:text-edu-red hover:opacity-100 transition-colors">CGV</Link>
            <Link to="/legal" className="hover:text-edu-red hover:opacity-100 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
