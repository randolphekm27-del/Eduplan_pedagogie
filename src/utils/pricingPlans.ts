import { Crown, Layers3, LucideIcon, Sparkles } from 'lucide-react';

export type PlanKey = 'free' | 'standard' | 'premium';

export const FREE_PLAN_LIMIT = 5;
export const STANDARD_PLAN_LIMIT = 30;

export interface PricingPlan {
  key: PlanKey;
  name: string;
  price: number;
  priceLabel: string;
  badge?: string;
  description: string;
  audience: string;
  cta: string;
  icon: LucideIcon;
  highlight?: boolean;
  accent: string;
  limits: string[];
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    key: 'free',
    name: 'Gratuit',
    price: 0,
    priceLabel: '0 XOF',
    description: 'Pour tester EduPlan et créer vos premières fiches sans engagement.',
    audience: 'Idéal pour découvrir la plateforme',
    cta: 'Commencer gratuitement',
    icon: Sparkles,
    accent: 'bg-slate-100 text-slate-700',
    limits: [
      `${FREE_PLAN_LIMIT} fiches par mois`,
      'Accès limité aux outils essentiels',
      'Export standard avec filigrane EduPlan'
    ],
    features: [
      'Création manuelle pas à pas',
      'Bibliothèque personnelle',
      'Modèles de base'
    ]
  },
  {
    key: 'standard',
    name: 'Standard',
    price: 3000,
    priceLabel: '3 000 XOF',
    badge: 'Le plus rentable',
    description: 'Le bon équilibre pour produire régulièrement des fiches plus vite.',
    audience: 'Pour les enseignants actifs chaque semaine',
    cta: 'Choisir Standard',
    icon: Layers3,
    accent: 'bg-amber-100 text-amber-800',
    features: [
      `${STANDARD_PLAN_LIMIT} fiches par mois`,
      'Génération IA pour accélérer la préparation',
      'Import de documents PDF, DOCX et TXT',
      'Export HD sans filigrane',
      'Bibliothèque enrichie et modèles avancés'
    ],
    limits: [
      `${STANDARD_PLAN_LIMIT} fiches par mois`,
      'Support prioritaire par email',
      'Pensé pour un usage individuel intensif'
    ]
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 5000,
    priceLabel: '5 000 XOF',
    badge: 'Accès complet',
    description: 'La formule sans friction pour un usage étendu et les fonctionnalités avancées.',
    audience: 'Pour les enseignants qui veulent tout débloquer',
    cta: 'Passer en Premium',
    icon: Crown,
    highlight: true,
    accent: 'bg-edu-red/10 text-edu-red',
    features: [
      'Fiches illimitées',
      'Génération IA avancée et illimitée',
      'Import de documents et enrichissement accéléré',
      'Exports premium sans filigrane',
      'Support prioritaire renforcé'
    ],
    limits: [
      'Aucune limite mensuelle de fiches',
      'Accès étendu à toutes les fonctionnalités',
      'Pensé pour un usage soutenu ou quotidien'
    ]
  }
];

export const premiumBenefits = [
  {
    title: 'Produisez plus vite',
    description: "Générez, importez et finalisez vos fiches en quelques minutes au lieu de repartir de zéro."
  },
  {
    title: 'Débloquez les outils avancés',
    description: "IA, import de documents, exports premium et modèles enrichis deviennent immédiatement accessibles."
  },
  {
    title: 'Évoluez sans frustration',
    description: "Passez d'un quota découverte à une capacité adaptée à votre rythme de préparation."
  }
];

export function normalizePlanKey(tier?: string | null): PlanKey {
  if (tier === 'standard') return 'standard';
  if (tier === 'premium' || tier === 'pro' || tier === 'institution') return 'premium';
  return 'free';
}

export function getPlanByKey(key: PlanKey) {
  return pricingPlans.find((plan) => plan.key === key) ?? pricingPlans[0];
}
