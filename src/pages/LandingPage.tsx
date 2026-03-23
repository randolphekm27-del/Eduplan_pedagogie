import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GraduationCap, Bot, Upload, Edit3, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { pricingPlans, premiumBenefits } from '../utils/pricingPlans';

export default function LandingPage() {
  const { user, profile, loading } = useAuth();

  if (!loading && user && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-edu-bg font-sans text-edu-black selection:bg-edu-red selection:text-edu-bg transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-edu-bg/90 backdrop-blur-md border-b border-edu-light/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-edu-red" size={28} />
            <span className="font-serif text-2xl font-bold tracking-wide">EduPlan</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Fonctionnalités</a>
            <a href="#premium" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Premium</a>
            <a href="#pricing" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Tarifs</a>
            <Link to="/blog" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Blog</Link>
            <Link to="/login" className="text-sm font-medium hover:text-edu-red transition-all duration-200 border-b-2 border-transparent hover:border-edu-red">Connexion</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/pricing" className="hidden sm:block">
              <Button variant="secondary" className="text-sm px-6 py-2.5">Voir les offres</Button>
            </Link>
            <Link to="/login" className="hidden sm:block">
              <Button variant="primary" className="text-sm px-6 py-2.5">Accéder à la plateforme</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles size={16} className="text-edu-red" />
            <span className="text-sm font-medium text-edu-red">5 fiches gratuites par mois pour démarrer</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl lg:text-6xl leading-tight text-edu-black mb-6"
          >
            Créez des fiches pédagogiques solides, puis passez en premium quand vous voulez aller plus loin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-edu-dark mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            EduPlan accompagne les enseignants avec un point d'entrée gratuit clair, puis deux offres payantes pensées pour accélérer la préparation, débloquer l'IA et supprimer les limites qui freinent la production.
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
            <Link to="/pricing">
              <Button variant="secondary" className="w-full sm:w-auto px-8 py-3.5">
                Découvrir les offres premium
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 w-full max-w-xl"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-edu-light/40 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,11,11,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.06),transparent_30%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between border-b border-edu-light/30 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-edu-dark/50">Parcours premium</p>
                  <h3 className="font-serif text-2xl">Monétisation simple</h3>
                </div>
                <span className="rounded-full bg-edu-red px-3 py-1 text-xs font-bold text-white">Conversion</span>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-edu-light/30 bg-[#F5F2ED] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-edu-dark/50 mb-2">Gratuit</p>
                  <p className="font-semibold text-edu-black">5 fiches par mois pour découvrir l'outil</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-700/70 mb-2">Standard</p>
                  <p className="font-semibold text-edu-black">30 fiches par mois, IA, import et export HD</p>
                </div>
                <div className="rounded-2xl border border-edu-red/20 bg-edu-dark p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">Premium</p>
                  <p className="font-semibold">Fiches illimitées et accès complet aux fonctionnalités avancées</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="py-24 bg-white border-y border-edu-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-edu-black mb-4">Trois façons de créer vos fiches</h2>
            <p className="text-edu-dark max-w-2xl mx-auto">Le mode gratuit vous laisse tester le cœur du produit. Les plans payants accélèrent ensuite tout le flux de production.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Génération assistée par IA</h3>
              <p className="text-edu-dark text-sm leading-relaxed">Activez un vrai gain de temps avec les offres Standard et Premium pour produire une première version structurée en quelques instants.</p>
            </Card>

            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Import de documents</h3>
              <p className="text-edu-dark text-sm leading-relaxed">Transformez vos cours, notes et supports existants en fiches plus propres, plus rapides à finaliser et prêtes à être réutilisées.</p>
            </Card>

            <Card variant="standard" className="group">
              <div className="w-16 h-16 bg-white border border-edu-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit3 size={32} className="text-edu-red" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Création manuelle guidée</h3>
              <p className="text-edu-dark text-sm leading-relaxed">Commencez gratuitement avec l'éditeur pas à pas, puis montez en gamme dès que votre volume de fiches augmente.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="premium" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-5">
              <Sparkles size={16} className="text-edu-red" />
              <span className="text-sm font-medium text-edu-red">Pourquoi passer au payant</span>
            </div>
            <h2 className="font-serif text-4xl text-edu-black mb-4">Une section claire pour comprendre les avantages du premium</h2>
            <p className="text-edu-dark/70 text-lg max-w-2xl">Le plan Gratuit sert à découvrir. Le plan Standard augmente immédiatement votre capacité. Le plan Premium retire les dernières limites pour un usage intensif.</p>
          </div>
          <div className="rounded-[28px] bg-edu-dark text-white p-8 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,11,11,0.2),transparent_30%)]" />
            <div className="relative space-y-4">
              {premiumBenefits.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-edu-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl mb-4">Tarifs simples et immédiatement compréhensibles</h2>
            <p className="text-edu-light max-w-3xl mx-auto">Chaque plan expose clairement sa promesse, ses avantages et sa limite principale pour aider l'utilisateur gratuit à savoir quand passer au niveau supérieur.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.key}
                className={`rounded-[24px] p-8 flex flex-col border ${plan.highlight ? 'bg-white text-edu-black border-edu-red shadow-2xl md:-translate-y-3' : 'bg-edu-black/40 border-edu-light/20'}`}
              >
                {plan.badge && (
                  <div className={`mb-5 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${plan.highlight ? 'bg-edu-red text-white' : 'bg-white/10 text-white'}`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.priceLabel}<span className={`text-sm font-normal ${plan.highlight ? 'text-edu-dark/60' : 'text-edu-light'}`}>/mois</span></div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-edu-dark/70' : 'text-edu-light'}`}>{plan.description}</p>
                <div className={`rounded-2xl p-4 mb-6 ${plan.highlight ? 'bg-edu-red/5' : 'bg-white/5'}`}>
                  <p className={`text-[10px] uppercase tracking-[0.25em] mb-2 ${plan.highlight ? 'text-edu-red' : 'text-white/60'}`}>Limites</p>
                  <ul className={`space-y-2 text-sm ${plan.highlight ? 'text-edu-dark/70' : 'text-edu-light'}`}>
                    {plan.limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-edu-red" />{limit}</li>
                    ))}
                  </ul>
                </div>
                <ul className={`space-y-3 mb-8 flex-1 text-sm ${plan.highlight ? 'text-edu-dark' : 'text-edu-light'}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-edu-red" /> {feature}</li>
                  ))}
                </ul>
                <Link to={plan.key === 'free' ? '/signup' : '/pricing'} className={`w-full block text-center py-3 rounded-[14px] transition-colors ${plan.highlight ? 'bg-edu-red text-white hover:bg-[#5a0808]' : 'border border-edu-light/40 hover:bg-white/5'}`}>
                  {plan.key === 'free' ? 'Commencer' : 'Souscrire'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
