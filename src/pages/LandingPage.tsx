import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Settings, Bot, Upload, Edit3, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/Footer';

import { ThemeToggle } from '../components/ThemeToggle';

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LandingPage() {
  const { user, profile, loading } = useAuth();

  // Redirect to dashboard only when auth and app profile are both ready.
  if (!loading && user && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-edu-bg font-sans text-edu-black selection:bg-edu-red selection:text-edu-bg transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-edu-bg/90 backdrop-blur-md border-b border-edu-light/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-edu-red" size={28} />
            <span className="font-serif text-2xl font-bold tracking-wide">EduPlan</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Fonctionnalités</a>
            <a href="#pricing" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Tarifs</a>
            <Link to="/blog" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Blog</Link>
            <Link to="/login" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Connexion</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="primary" className="text-sm px-6 py-2.5">Accéder à la plateforme</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl lg:text-6xl leading-tight text-edu-black mb-6"
          >
            Créez des fiches pédagogiques d'excellence en quelques minutes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-edu-dark mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            L'assistant IA pour les professeurs de toutes disciplines : Lettres, Sciences, Histoire, Langues et filières techniques.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link to="/signup">
              <Button variant="primary" className="w-full sm:w-auto px-8 py-3.5" icon={ChevronRight} iconPosition="right">
                Commencer gratuitement
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="secondary" className="w-full sm:w-auto px-8 py-3.5">
                Voir une démo
              </Button>
            </a>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Abstract Technical Visualization */}
          <div className="absolute inset-0 bg-gradient-to-tr from-edu-light/20 to-transparent rounded-lg transform rotate-3"></div>
          <div className="bg-[#F5F2ED] border border-edu-light shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2px] p-6 relative z-10">
            <div className="border-b-2 border-edu-black pb-4 mb-6">
              <div className="h-6 w-3/4 bg-edu-light/30 rounded-sm mb-3"></div>
              <div className="flex gap-4">
                <div className="h-3 w-20 bg-edu-light/20 rounded-sm"></div>
                <div className="h-3 w-24 bg-edu-light/20 rounded-sm"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-edu-light pb-2">
                <span className="font-serif text-lg text-edu-red">I.</span>
                <div className="h-4 w-1/2 bg-edu-light/30 rounded-sm"></div>
              </div>
              <div className="h-20 w-full bg-edu-light/10 border border-edu-light/30 rounded-sm"></div>
              
              <div className="flex items-center gap-3 border-b border-edu-light pb-2 mt-6">
                <span className="font-serif text-lg text-edu-red">II.</span>
                <div className="h-4 w-1/3 bg-edu-light/30 rounded-sm"></div>
              </div>
              <table className="w-full border-collapse mt-2">
                <tbody>
                  <tr className="border-b border-edu-light/30">
                    <td className="p-2 w-1/3"><div className="h-3 bg-edu-light/20 rounded-sm"></div></td>
                    <td className="p-2"><div className="h-3 bg-edu-light/10 rounded-sm"></div></td>
                  </tr>
                  <tr className="border-b border-edu-light/30">
                    <td className="p-2 w-1/3"><div className="h-3 bg-edu-light/20 rounded-sm"></div></td>
                    <td className="p-2"><div className="h-3 bg-edu-light/10 rounded-sm"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Floating Elements */}
            <div className="absolute -right-8 top-1/4 bg-white border border-edu-light shadow-lg p-3 rounded-[2px] font-mono text-sm text-edu-red transform rotate-2">
              E = mc²
            </div>
            <div className="absolute -left-6 bottom-1/4 bg-white border border-edu-light shadow-lg p-3 rounded-[2px] font-serif text-xs text-edu-dark transform -rotate-3 italic">
              « Je pense, donc je suis. »
            </div>
          </div>
        </motion.div>
      </section>

      {/* Three Methods Section */}
      <section id="features" className="py-24 bg-white border-y border-edu-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-edu-black mb-4">Trois façons de créer vos fiches techniques</h2>
            <p className="text-edu-dark max-w-2xl mx-auto">Choisissez la méthode qui correspond le mieux à votre flux de travail.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Laissez l'IA s'occuper</h3>
              <p className="text-edu-dark text-sm leading-relaxed">
                Décrivez votre cours en langage naturel. Notre IA spécialisée génère une fiche pédagogique complète, structurée et prête à l'emploi.
              </p>
            </Card>

            {/* Card 2 */}
            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Transformez un document</h3>
              <p className="text-edu-dark text-sm leading-relaxed">
                Importez un PDF ou DOCX existant. L'IA extrait les informations clés et les reformate selon les standards pédagogiques de votre discipline.
              </p>
            </Card>

            {/* Card 3 */}
            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit3 size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Créez pas à pas</h3>
              <p className="text-edu-dark text-sm leading-relaxed">
                Remplissez notre formulaire détaillé et structuré. Gardez un contrôle total sur chaque aspect de votre séquence pédagogique.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Format Preview Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-edu-black mb-4">Des formats adaptatifs pour toutes vos matières</h2>
          <p className="text-edu-dark max-w-2xl mx-auto">Des fiches claires, professionnelles et adaptées aux exigences de l'inspection.</p>
        </div>
        
        <div className="bg-white border border-edu-light shadow-xl rounded-[2px] overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-edu-light/30">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-edu-red mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-edu-black">En-tête structuré</h4>
                  <p className="text-sm text-edu-dark mt-1">Matière, classe, thème, temps imparti et objectifs clairement définis.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-edu-red mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-edu-black">Déroulement sur-mesure</h4>
                  <p className="text-sm text-edu-dark mt-1">Sections adaptées : analyse de corpus, démarches scientifiques ou procédures techniques.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-edu-red mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-edu-black">Support multi-formats</h4>
                  <p className="text-sm text-edu-dark mt-1">Intégration parfaite de textes littéraires, formules mathématiques et données historiques.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-edu-red mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-edu-black">Document élève intégré</h4>
                  <p className="text-sm text-edu-dark mt-1">Générez automatiquement la version élève avec les tâches à accomplir.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#F5F2ED] p-8 flex items-center justify-center">
            {/* Mini Sheet Preview */}
            <div className="w-full max-w-sm bg-white border border-edu-light shadow-md p-6 text-[8px] font-sans">
              <div className="border-b-2 border-edu-black pb-2 mb-4 flex justify-between items-end">
                <div className="font-serif text-lg">La Révolution Française</div>
                <div className="text-right font-mono text-edu-dark">Histoire<br/>Classe de 4ème</div>
              </div>
              <div className="mb-4">
                <div className="font-serif text-edu-red text-xs mb-1 border-b border-edu-light">I. OBJECTIFS</div>
                <div className="text-edu-dark leading-relaxed">Comprendre les causes de la Révolution.<br/>Analyser la Déclaration des droits de l'homme.</div>
              </div>
              <div>
                <div className="font-serif text-edu-red text-xs mb-1 border-b border-edu-light">II. DÉROULEMENT</div>
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-edu-bg/50 border-b border-edu-light">
                      <th className="text-left p-1">Phase</th>
                      <th className="text-left p-1">Activités</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-edu-light/50">
                      <td className="p-1">Introduction</td>
                      <td className="p-1 text-edu-red">Analyse de caricature</td>
                    </tr>
                    <tr className="border-b border-edu-light/50">
                      <td className="p-1">Développement</td>
                      <td className="p-1 text-edu-red">Étude de textes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-edu-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl mb-4">Tarifs simples et transparents</h2>
            <p className="text-edu-light max-w-2xl mx-auto">Investissez dans votre pédagogie.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-edu-black/40 border border-edu-light/20 p-8 rounded-[2px] flex flex-col">
              <h3 className="font-serif text-2xl mb-2">Gratuit</h3>
              <div className="text-3xl font-light mb-6">0 <span className="text-sm text-edu-light">XOF/mois</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-edu-light">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> 3 fiches par mois</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Création manuelle</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Export PDF standard</li>
              </ul>
              <Link to="/signup" className="w-full block text-center border border-edu-light/50 hover:bg-white/5 py-2.5 rounded-[2px] transition-colors">Commencer</Link>
            </div>
            
            {/* Pro */}
            <div className="bg-white text-edu-black border border-edu-red p-8 rounded-[2px] flex flex-col relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-edu-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Populaire</div>
              <h3 className="font-serif text-2xl mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-6">3 000 <span className="text-sm text-edu-dark font-normal">XOF/mois</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-edu-dark">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Fiches illimitées</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Génération par IA</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Import de documents</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Export PDF HD sans filigrane</li>
              </ul>
              <Link to="/signup" className="w-full block text-center bg-edu-red text-white hover:bg-[#5a0808] py-2.5 rounded-[2px] transition-colors shadow-md">S'abonner</Link>
            </div>
            
            {/* Établissement */}
            <div className="bg-edu-black/40 border border-edu-light/20 p-8 rounded-[2px] flex flex-col">
              <h3 className="font-serif text-2xl mb-2">Établissement</h3>
              <div className="text-3xl font-light mb-6">Sur devis</div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-edu-light">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Licences multiples</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Bibliothèque partagée</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-edu-red" /> Modèles personnalisés</li>
              </ul>
              <a href="mailto:contact@eduplan.pro" className="w-full block text-center border border-edu-light/50 hover:bg-white/5 py-2.5 rounded-[2px] transition-colors">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
