import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, Crown, Sparkles, Info, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { chariowService } from '../services/chariowService';
import { getPlanByKey, normalizePlanKey, PlanKey, premiumBenefits, pricingPlans } from '../utils/pricingPlans';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: { number: string; country_code: string }) => void;
  isLoading: boolean;
  selectedPlanName?: string;
}

function PhoneModal({ isOpen, onClose, onSubmit, isLoading, selectedPlanName }: PhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('BJ');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-edu-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-edu-red"></div>
        <h3 className="text-2xl font-serif text-edu-black mb-4">Finaliser votre abonnement</h3>
        <p className="text-edu-dark/60 text-sm mb-2 leading-relaxed">
          Vous êtes sur le point de souscrire à l'offre <strong>{selectedPlanName}</strong>.
        </p>
        <p className="text-edu-dark/60 text-sm mb-8 leading-relaxed">
          Pour le paiement mobile, veuillez renseigner votre numéro de téléphone.
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
            className="flex-1 py-3 px-6 rounded-xl font-bold bg-edu-red text-white hover:bg-edu-red/90 shadow-lg shadow-edu-red/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
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
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const currentPlan = normalizePlanKey(profile?.tier);
  const [showPhoneModal, setShowPhoneModal] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<PlanKey | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = async (planKey: PlanKey) => {
    if (planKey === 'free') {
      navigate(user ? '/dashboard' : '/signup');
      return;
    }

    if (!user || !profile) {
      navigate('/login');
      return;
    }

    setSelectedTier(planKey);
    setShowPhoneModal(true);
  };

  const handleCheckoutInit = async (phone: { number: string; country_code: string }) => {
    if (!user || !profile || !selectedTier) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Préparation du paiement sécurisé...', {
      description: 'Connexion au service de paiement...'
    });

    try {
      const plan = getPlanByKey(selectedTier);
      const checkoutData = await chariowService.initializeCheckout(
        plan.name,
        user.id,
        user.email,
        profile.firstname || '',
        profile.lastname || '',
        phone
      );

      toast.dismiss(loadingToast);
      toast.success('Prêt !', {
        description: 'Vous allez être redirigé vers la page de paiement.'
      });

      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error('Paiement indisponible', {
        description: err?.message || "La session de paiement n'a pas pu être initialisée."
      });
    } finally {
      setIsProcessing(false);
      setShowPhoneModal(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-edu-dark/70 hover:text-edu-red font-medium uppercase tracking-wider mb-12 transition-all group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Retour
      </Link>

      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-6">
          <Crown size={18} className="text-edu-red" />
          <span className="text-sm font-medium text-edu-red">Offres conçues pour convertir sans confusion</span>
        </motion.div>
        <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-6 tracking-tight">
          Choisissez le niveau qui accompagne vraiment votre rythme
        </h1>
        <p className="text-lg text-edu-dark/70 max-w-3xl mx-auto">
          Le plan Gratuit permet de découvrir EduPlan avec 5 fiches par mois. Le plan Standard augmente fortement votre capacité. Le plan Premium ouvre un usage étendu ou illimité avec les fonctionnalités avancées.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 mb-14">
        <div className="rounded-[32px] bg-edu-dark text-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-edu-red/10 blur-[100px] -mr-28 -mt-24"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] mb-5">
              <Sparkles size={14} />
              Avantages premium
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Une section claire pour donner envie de passer au payant</h2>
            <p className="text-white/70 max-w-2xl mb-8">Nous mettons en évidence le moment où l'offre gratuite atteint sa limite, puis la différence entre Standard et Premium pour aider à décider rapidement.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {premiumBenefits.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/70">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-edu-light/30 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-edu-red mb-3">Différences immédiates</p>
          <div className="space-y-4">
            {pricingPlans.map((plan) => (
              <div key={plan.key} className="rounded-2xl border border-edu-light/20 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-serif text-2xl text-edu-black">{plan.name}</p>
                    <p className="text-sm text-edu-dark/60">{plan.priceLabel}/mois</p>
                  </div>
                  {plan.badge && <span className="rounded-full bg-edu-red/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-edu-red">{plan.badge}</span>}
                </div>
                <p className="text-sm text-edu-dark/70 mb-2">{plan.audience}</p>
                <p className="text-sm text-edu-dark/60">{plan.limits[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan, idx) => {
          const isCurrent = currentPlan === plan.key || (plan.key === 'premium' && currentPlan === 'premium');
          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${plan.highlight ? 'bg-edu-dark text-edu-bg shadow-2xl scale-[1.02] z-10 border-edu-red/50' : 'bg-white text-edu-black border-edu-light/30 shadow-sm hover:shadow-xl'}`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-edu-red text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-edu-red' : 'bg-edu-red/10'}`}>
                  <plan.icon size={24} className={plan.highlight ? 'text-white' : 'text-edu-red'} />
                </div>
                <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.priceLabel}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-edu-bg/60' : 'text-edu-dark/50'}`}>/mois</span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-edu-bg/70' : 'text-edu-dark/60'}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${plan.highlight ? 'text-edu-bg/50' : 'text-edu-red'}`}>Avantages</p>
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check size={18} className="text-edu-red shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10 rounded-2xl p-4 border border-current/10 bg-black/5">
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${plan.highlight ? 'text-edu-bg/50' : 'text-edu-dark/60'}`}>Limites et cadre</p>
                <ul className="space-y-2">
                  {plan.limits.map((limit) => (
                    <li key={limit} className={`text-sm ${plan.highlight ? 'text-edu-bg/75' : 'text-edu-dark/70'}`}>{limit}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.key)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-edu-red text-white hover:bg-edu-red/90 shadow-lg shadow-edu-red/20' : 'bg-edu-dark text-white hover:bg-edu-black'}`}
              >
                {isCurrent ? 'Plan actuel' : plan.cta}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white border border-edu-light/20 rounded-3xl shadow-sm overflow-hidden mb-20">
        <div className="grid md:grid-cols-4 border-b border-edu-light/20 bg-edu-bg/40 text-sm font-bold text-edu-black">
          <div className="p-4">Critère</div>
          <div className="p-4">Gratuit</div>
          <div className="p-4">Standard</div>
          <div className="p-4">Premium</div>
        </div>
        {[
          ['Fiches par mois', '5 fiches', '30 fiches', 'Illimité'],
          ['IA', 'Non incluse', 'Incluse', 'Incluse sans contrainte'],
          ['Import de documents', 'Non inclus', 'Inclus', 'Inclus'],
          ['Export premium', 'Standard avec filigrane', 'HD sans filigrane', 'Premium sans filigrane'],
          ['Support', 'Standard', 'Prioritaire email', 'Prioritaire renforcé']
        ].map((row) => (
          <div key={row[0]} className="grid md:grid-cols-4 border-b border-edu-light/10 last:border-0 text-sm">
            {row.map((cell, index) => (
              <div key={cell} className={`p-4 ${index === 0 ? 'font-semibold text-edu-black bg-edu-bg/20' : 'text-edu-dark/70'}`}>{cell}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl text-edu-black mb-8 text-center">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui. Vous pouvez passer du plan Gratuit à Standard ou Premium dès que votre usage augmente, puis ajuster votre abonnement depuis votre espace.' },
            { q: 'Comment fonctionne le paiement ?', a: 'Nous acceptons les cartes bancaires et les paiements mobiles locaux via notre partenaire sécurisé.' },
            { q: 'Comment choisir entre Standard et Premium ?', a: 'Standard convient à un usage régulier avec des limites raisonnables. Premium est préférable si vous voulez un accès étendu ou illimité et le niveau de service le plus complet.' }
          ].map((faq) => (
            <div key={faq.q} className="p-5 bg-white rounded-xl border border-edu-light/20">
              <p className="font-bold text-edu-black text-sm mb-2">{faq.q}</p>
              <p className="text-sm text-edu-dark/70">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center p-12 bg-edu-dark rounded-[40px] text-edu-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-edu-red/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-edu-red/10 blur-[100px] -ml-32 -mb-32"></div>

        <h2 className="font-serif text-3xl md:text-5xl mb-6 relative z-10">Passez du quota découverte à un vrai rythme de production</h2>
        <p className="text-edu-bg/70 mb-10 max-w-xl mx-auto relative z-10">Choisissez Standard pour un volume confortable, ou Premium pour débloquer un usage étendu sans friction.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button onClick={() => handleSubscribe('standard')} className="bg-white text-edu-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all shadow-xl">
            Souscrire à Standard
          </button>
          <button onClick={() => handleSubscribe('premium')} className="bg-edu-red text-white px-8 py-4 rounded-full font-bold hover:bg-edu-red/90 transition-all shadow-xl shadow-edu-red/20">
            Passer en Premium
          </button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-edu-bg/60 relative z-10">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Paiement sécurisé</span>
          <span className="inline-flex items-center gap-2"><Clock size={16} /> Activation rapide</span>
          <span className="inline-flex items-center gap-2"><Info size={16} /> Sans engagement long terme</span>
        </div>
      </div>

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        isLoading={isProcessing}
        onSubmit={handleCheckoutInit}
        selectedPlanName={selectedTier ? getPlanByKey(selectedTier).name : undefined}
      />
    </motion.div>
  );
}
