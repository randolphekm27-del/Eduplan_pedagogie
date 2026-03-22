import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Zap, 
  Star, 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard,
  Target,
  Clock,
  Layout,
  FileText,
  Sparkles,
  Download,
  Users,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: { number: string; country_code: string }) => void;
  isLoading: boolean;
}

function PhoneModal({ isOpen, onClose, onSubmit, isLoading }: PhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('BJ'); // Bénin par défaut (XOF)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-edu-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-edu-red"></div>
        <h3 className="text-2xl font-serif text-edu-black mb-4">Finaliser votre abonnement</h3>
        <p className="text-edu-dark/60 text-sm mb-8 leading-relaxed">
          Pour le paiement mobile (Orange Money, Wave, etc.), veuillez renseigner votre numéro de téléphone.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-edu-dark/40 mb-2">Pays</label>
            <select 
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-edu-light/10 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-edu-red/20 transition-all outline-none"
            >
              <option value="BJ">Bénin (+229)</option>
              <option value="CI">Côte d'Ivoire (+225)</option>
              <option value="SN">Sénégal (+221)</option>
              <option value="BF">Burkina Faso (+226)</option>
              <option value="ML">Mali (+223)</option>
              <option value="TG">Togo (+228)</option>
              <option value="CM">Cameroun (+237)</option>
              <option value="FR">France (+33)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-edu-dark/40 mb-2">Numéro de téléphone</label>
            <input 
              type="tel"
              placeholder="Ex: 0102030405"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-edu-light/10 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-edu-red/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-xl font-bold bg-edu-light/10 text-edu-dark/60 hover:bg-edu-light/20 transition-all text-sm"
          >
            Annuler
          </button>
          <button 
            onClick={() => onSubmit({ number: phoneNumber, country_code: countryCode })}
            disabled={isLoading || !phoneNumber}
            className="flex-[2] py-3 px-6 rounded-xl font-bold bg-edu-red text-white hover:bg-edu-red/90 shadow-lg shadow-edu-red/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Payer maintenant <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PricingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Gratuit",
      price: "0",
      description: "Pour découvrir la plateforme et créer vos premières fiches.",
      features: [
        { name: "3 fiches par mois", included: true },
        { name: "Création manuelle", included: true },
        { name: "Export PDF standard", included: true },
        { name: "Génération par IA", included: false },
        { name: "Import de documents", included: false },
        { name: "Export PDF HD sans filigrane", included: false },
      ],
      buttonText: user ? (profile?.tier === 'free' ? "Plan actuel" : "Basculer") : "Commencer",
      buttonLink: user ? "/dashboard" : "/signup",
      highlight: false,
      icon: Layout
    },
    {
      name: "Pro",
      price: "3 000",
      description: "L'outil complet pour les enseignants qui veulent gagner du temps.",
      features: [
        { name: "Fiches illimitées", included: true },
        { name: "Génération par IA illimitée", included: true },
        { name: "Import de documents (PDF, Word)", included: true },
        { name: "Export PDF HD sans filigrane", included: true },
        { name: "Support prioritaire", included: true },
        { name: "Bibliothèque organisée", included: true },
      ],
      buttonText: profile?.tier === 'pro' ? "Plan actuel" : "S'abonner",
      buttonLink: "/dashboard/billing", // hypothetical or handle with function
      highlight: true,
      badge: "Populaire",
      icon: Sparkles
    },
    {
      name: "Établissement",
      price: "Sur devis",
      description: "Solution collaborative pour les écoles et centres de formation.",
      features: [
        { name: "Licences multiples", included: true },
        { name: "Bibliothèque partagée", included: true },
        { name: "Modèles personnalisés d'établissement", included: true },
        { name: "Statistiques d'utilisation", included: true },
        { name: "Formation des équipes", included: true },
        { name: "SSO / Intégration ENT", included: true },
      ],
      buttonText: "Nous contacter",
      buttonLink: "/contact",
      highlight: false,
      icon: Building2
    }
  ];

  const [showPhoneModal, setShowPhoneModal] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = async (tier: string) => {
    if (!user || !profile) {
      navigate('/login');
      return;
    }
    
    if (tier === 'Pro') {
      setSelectedTier('Pro');
      setShowPhoneModal(true);
    } else if (tier === 'Établissement') {
      navigate('/contact');
    }
  };

  const handleCheckoutInit = async (phone: { number: string; country_code: string }) => {
    if (!user || !profile || !selectedTier) return;
    
    setIsProcessing(true);
    const loadingToast = toast.loading('Préparation du paiement sécurisé...', {
      description: 'Connexion à Chariow...'
    });

    try {
      // Call Chariow Checkout Edge Function
      const { data, error } = await supabase.functions.invoke('chariow-checkout', {
        body: {
          tier: selectedTier,
          userId: user.id,
          email: user.email,
          firstName: profile.firstname || '',
          lastName: profile.lastname || '',
          phone: phone
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast.dismiss(loadingToast);
      toast.success('Prêt !', { description: 'Vous allez être redirigé vers Chariow.' });

      // Redirect to Chariow Checkout
      if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
      } else {
          throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.dismiss(loadingToast);
      toast.error('Erreur d\'initialisation', {
        description: err.message || 'Impossible de lancer le paiement Chariow.'
      });
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8 md:py-16"
    >
      {/* Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-edu-dark/70 hover:text-edu-red font-medium uppercase tracking-wider mb-12 transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Retour
      </Link>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-6"
        >
          <Star size={18} className="text-edu-red fill-edu-red" />
          <span className="text-sm font-medium text-edu-red">Tarification simple et transparente</span>
        </motion.div>
        <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-6 tracking-tight">
          Passez à la vitesse <span className="text-edu-red">supérieure</span>
        </h1>
        <p className="text-lg text-edu-dark/70 max-w-2xl mx-auto">
          Choisissez le plan qui correspond à votre pratique pédagogique. Pas d'engagement, résiliable à tout moment.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
              tier.highlight 
                ? 'bg-edu-dark text-edu-bg shadow-2xl scale-105 z-10 border-edu-red/50' 
                : 'bg-white text-edu-black border-edu-light/30 shadow-sm hover:shadow-xl'
            }`}
          >
            {tier.badge && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-edu-red text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {tier.badge}
              </div>
            )}

            <div className="mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                tier.highlight ? 'bg-edu-red' : 'bg-edu-red/10'
              }`}>
                <tier.icon size={24} className={tier.highlight ? 'text-white' : 'text-edu-red'} />
              </div>
              <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== "Sur devis" && (
                  <span className={`text-sm ${tier.highlight ? 'text-edu-bg/60' : 'text-edu-dark/50'}`}>
                    XOF/mois
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${tier.highlight ? 'text-edu-bg/70' : 'text-edu-dark/60'}`}>
                {tier.description}
              </p>
            </div>

            <div className="space-y-4 flex-1 mb-10">
              {tier.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check size={18} className="text-edu-red flex-shrink-0 mt-0.5" />
                  ) : (
                    <X size={18} className={`${tier.highlight ? 'text-edu-bg/30' : 'text-edu-dark/30'} flex-shrink-0 mt-0.5`} />
                  )}
                  <span className={`text-sm ${
                    !feature.included && (tier.highlight ? 'text-edu-bg/30' : 'text-edu-dark/30')
                  }`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(tier.name)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                tier.highlight
                  ? 'bg-edu-red text-white hover:bg-edu-red/90 shadow-lg shadow-edu-red/20'
                  : 'bg-edu-dark text-white hover:bg-edu-black'
              }`}
            >
              {tier.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison section */}
      <div className="mt-20 text-center">
        <h2 className="font-serif text-3xl text-edu-black mb-12">Pourquoi passer au plan Pro ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: Zap, 
              title: "Productivité x10", 
              desc: "Générez une fiche complète en 30 secondes au lieu de 2 heures." 
            },
            { 
              icon: ShieldCheck, 
              title: "Zéro Limite", 
              desc: "Archivez toute votre carrière sans vous soucier du stockage." 
            },
            { 
              icon: Download, 
              title: "Export HD", 
              desc: "Des documents parfaits pour l'impression et le partage." 
            },
            { 
              icon: Clock, 
              title: "Gain de temps", 
              desc: "Plus de temps pour vos élèves, moins pour l'administratif." 
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-edu-light/20 shadow-sm">
              <div className="w-10 h-10 bg-edu-red/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-edu-red">
                <item.icon size={20} />
              </div>
              <h4 className="font-bold text-edu-black mb-2 text-sm">{item.title}</h4>
              <p className="text-xs text-edu-dark/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Mini */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl text-edu-black mb-8 text-center">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez passer du plan Gratuit au Pro instantanément, ou annuler votre abonnement Pro depuis vos paramètres." },
            { q: "Comment fonctionne le paiement ?", a: "Nous acceptons les cartes bancaires et les paiements mobiles locaux (Orange Money, Wave, etc.) via notre partenaire sécurisé." },
            { q: "Qu'est-ce que le filigrane EduPlan ?", a: "Le plan gratuit ajoute une mention discrète 'Généré par EduPlan' en bas de page. Le plan Pro supprime totalement cette mention." }
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-edu-light/20">
              <p className="font-bold text-edu-black text-sm mb-2">{faq.q}</p>
              <p className="text-sm text-edu-dark/70">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-24 text-center p-12 bg-edu-dark rounded-[40px] text-edu-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-edu-red/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-edu-red/10 blur-[100px] -ml-32 -mb-32"></div>
        
        <h2 className="font-serif text-3xl md:text-5xl mb-6 relative z-10">L'excellence pédagogique <br/>est à portée de clic.</h2>
        <p className="text-edu-bg/70 mb-10 max-w-xl mx-auto relative z-10">Rejoignez des milliers d'enseignants qui ont déjà transformé leur manière de préparer leurs cours.</p>
        <button 
          onClick={() => handleSubscribe('Pro')}
          className="bg-edu-red text-white px-10 py-4 rounded-full font-bold hover:bg-edu-red/90 transition-all shadow-xl shadow-edu-red/20 relative z-10"
        >
          Démarrer mon essai gratuit
        </button>
      </div>

      {/* Phone Modal */}
      <PhoneModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        isLoading={isProcessing}
        onSubmit={handleCheckoutInit}
      />
    </motion.div>
  );
}
