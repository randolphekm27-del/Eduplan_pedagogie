import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Shield,
  AlertCircle,
  RefreshCw,
  CreditCard,
  UserX,
  Scale,
  Mail,
  Clock,
  Lock,
  Server,
  Smartphone,
  Zap,
  BookOpen,
  Users,
  Gavel,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  Calendar,
  Building2,
  Globe,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function ConditionsGénéralesPage() {
  const [lastUpdated] = React.useState("22 mars 2026");
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  // Sections des CGU
  const sections = [
    {
      id: "acceptation",
      icon: FileText,
      title: "1. Acceptation des Conditions",
      content: {
        intro: "L'accès et l'utilisation de la plateforme EduPlan sont soumis aux présentes Conditions Générales d'Utilisation (CGU).",
        points: [
          "La création d'un compte implique l'acceptation formelle et sans réserve de l'intégralité des présentes conditions.",
          "Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser nos services.",
          "Les conditions s'appliquent à tous les utilisateurs, qu'ils soient enseignants, chefs d'établissement ou visiteurs.",
          "Toute utilisation du service par un mineur doit être effectuée sous le contrôle d'un responsable légal."
        ]
      }
    },
    {
      id: "acces",
      icon: Lock,
      title: "2. Accès au Service",
      content: {
        intro: "EduPlan met à disposition une plateforme accessible en ligne, 24h/24 et 7j/7, sous réserve des opérations de maintenance nécessaires.",
        points: [
          "L'accès est conditionné à la création d'un compte utilisateur avec des identifiants uniques.",
          "Vous êtes responsable de la confidentialité de vos identifiants de connexion.",
          "En cas de perte ou d'utilisation frauduleuse, vous devez nous informer immédiatement.",
          "Nous nous réservons le droit de suspendre l'accès en cas de non-respect des présentes conditions.",
          "Les maintenances techniques sont programmées de préférence en dehors des heures de forte affluence (week-ends et vacances scolaires)."
        ]
      }
    },
    {
      id: "utilisation",
      icon: Shield,
      title: "3. Utilisation Loyale",
      content: {
        intro: "Vous vous engagez à utiliser EduPlan de manière éthique et conforme à sa vocation pédagogique.",
        allowed: [
          "Créer et gérer des fiches pédagogiques pour votre usage professionnel",
          "Partager vos ressources avec vos collègues dans le cadre institutionnel",
          "Exporter vos contenus pour une utilisation en classe",
          "Utiliser l'IA générative comme assistant pédagogique"
        ],
        prohibited: [
          "Utiliser l'outil pour générer du contenu frauduleux, illicite ou malveillant",
          "Effectuer des requêtes automatisées ou abusives (bots, scraping)",
          "Tenter de contourner les mesures de sécurité de la plateforme",
          "Revendre ou redistribuer commercialement les contenus générés sans autorisation",
          "Utiliser les fiches générées pour former des modèles concurrents",
          "Partager votre compte avec des personnes non autorisées"
        ]
      }
    },
    {
      id: "propriete",
      icon: Gavel,
      title: "4. Propriété Intellectuelle",
      content: {
        intro: "La propriété intellectuelle des contenus générés par EduPlan respecte un équilibre entre vos droits et les nôtres.",
        points: [
          {
            title: "Vos contenus",
            description: "Vous conservez l'intégralité des droits sur les fiches pédagogiques que vous créez et personnalisez."
          },
          {
            title: "Notre plateforme",
            description: "L'interface, le code, la marque EduPlan et les éléments graphiques sont notre propriété exclusive."
          },
          {
            title: "Contenus générés par l'IA",
            description: "Les propositions générées par l'IA vous sont concédées sous licence d'usage pédagogique non-exclusive."
          },
          {
            title: "Licence d'exploitation",
            description: "En utilisant notre service, vous nous autorisez à héberger et afficher vos contenus pour vous fournir le service."
          }
        ]
      }
    },
    {
      id: "abonnement",
      icon: CreditCard,
      title: "5. Offres & Abonnements",
      content: {
        intro: "EduPlan propose plusieurs formules d'abonnement adaptées aux besoins des enseignants et des établissements.",
        tiers: [
          {
            name: "Gratuit",
            price: "0€",
            features: ["10 fiches pédagogiques", "Génération IA basique", "Export PDF", "Support communautaire"]
          },
          {
            name: "Standard",
            price: "4,90€/mois",
            features: ["Fiches illimitées", "Export DOCX", "Analyses avancées", "Support prioritaire", "Collaboration"]
          },
          {
            name: "Établissement",
            price: "5 000 XOF/mois",
            features: ["Comptes illimités", "Hébergement dédié", "Formation équipe", "Support 24/7", "API dédiée"]
          }
        ],
        conditions: [
          "Les abonnements sont mensuels ou annuels, sans engagement de durée.",
          "La résiliation est possible à tout moment, effective en fin de période.",
          "Les paiements sont sécurisés via Stripe (aucune donnée bancaire stockée).",
          "Des tarifs préférentiels sont proposés aux enseignants sur justificatif."
        ]
      }
    },
    {
      id: "responsabilite",
      icon: AlertCircle,
      title: "6. Responsabilité & Garanties",
      content: {
        intro: "EduPlan s'efforce de fournir un service de qualité, mais des limites de responsabilité s'appliquent.",
        points: [
          "L'IA générative peut produire des contenus approximatifs. Vous restez le garant de la pertinence pédagogique.",
          "Nous ne pouvons être tenus responsables des conséquences liées à l'utilisation des contenus générés.",
          "Le service est fourni 'en l'état' (AS-IS), sans garantie d'indisponibilité.",
          "En cas de litige, la responsabilité d'EduPlan est limitée au montant de l'abonnement payé."
        ]
      }
    },
    {
      id: "suspension",
      icon: UserX,
      title: "7. Suspension & Résiliation",
      content: {
        intro: "Des mesures peuvent être prises en cas de non-respect des présentes conditions.",
        scenarios: [
          "Suspension temporaire en cas d'utilisation abusive ou frauduleuse",
          "Résiliation automatique en cas de non-paiement de l'abonnement",
          "Suppression du compte après 12 mois d'inactivité (avec notification préalable)",
          "Résiliation à tout moment par l'utilisateur via les paramètres du compte"
        ]
      }
    },
    {
      id: "evolution",
      icon: RefreshCw,
      title: "8. Évolution des Conditions",
      content: {
        intro: "EduPlan se réserve le droit de modifier ponctuellement ses conditions pour s'adapter aux évolutions réglementaires et technologiques.",
        points: [
          "Les modifications entrent en vigueur dès leur publication sur le site.",
          "Les utilisateurs sont informés par email des changements significatifs.",
          "La poursuite de l'utilisation après modification vaut acceptation.",
          "Les conditions en vigueur au moment du litige sont celles applicables."
        ]
      }
    },
    {
      id: "droit",
      icon: Scale,
      title: "9. Droit Applicable & Médiation",
      content: {
        intro: "Les présentes conditions sont régies par le droit français.",
        points: [
          "Tout litige relève de la compétence exclusive des tribunaux de Paris.",
          "Avant toute action judiciaire, une procédure de médiation est proposée.",
          "Conformément au Code de la consommation, vous pouvez saisir un médiateur de la consommation.",
          "Pour toute question, contactez-nous à legal@eduplan.fr"
        ]
      }
    }
  ];

  // Fonction pour défiler vers une section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8 md:py-12"
    >
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-edu-dark/70 hover:text-edu-red font-medium uppercase tracking-wider mb-8 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>
      </motion.div>

      {/* En-tête animé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-edu-red/10 rounded-2xl">
              <FileText size={32} className="text-edu-red" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-6xl text-edu-black tracking-tight">
                Conditions Générales
              </h1>
              <p className="text-sm text-edu-dark/50 mt-2 flex items-center gap-2">
                <Calendar size={14} />
                Dernière mise à jour : {lastUpdated}
                <span className="w-1 h-1 bg-edu-dark/30 rounded-full mx-1" />
                Version 2.4
              </p>
            </div>
          </div>
          <motion.a
            href="#sommaire"
            onClick={(e) => { e.preventDefault(); scrollToSection('sommaire'); }}
            className="inline-flex items-center gap-2 text-sm text-edu-red hover:underline"
          >
            <ChevronRight size={16} />
            Accéder au sommaire
          </motion.a>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-edu-dark/70 italic border-l-4 border-edu-red pl-4 py-2 bg-edu-light/10 rounded-r-lg"
        >
          Conditions d'utilisation de la plateforme EduPlan — Version applicable à compter du {lastUpdated}
        </motion.p>
      </motion.div>

      {/* Message d'acceptation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-linear-to-r from-edu-black/5 to-edu-red/5 border border-edu-light/20 rounded-xl p-5 mb-10 flex items-start gap-3"
      >
        <CheckCircle2 size={22} className="text-edu-red shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-edu-black">En utilisant EduPlan, vous acceptez nos conditions</p>
          <p className="text-sm text-edu-dark/70">La création d'un compte implique l'acceptation formelle et sans réserve de l'intégralité des présentes conditions générales d'utilisation.</p>
        </div>
      </motion.div>

      {/* Sommaire interactif */}
      <motion.div
        id="sommaire"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-edu-light/20 rounded-2xl p-6 mb-12 shadow-sm"
      >
        <h2 className="font-serif text-xl text-edu-black mb-4 flex items-center gap-2">
          <Info size={20} className="text-edu-red" />
          Sommaire
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section, idx) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              whileHover={{ x: 4 }}
              className={`text-left text-sm flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${activeSection === section.id
                  ? 'bg-edu-red/10 text-edu-red font-medium'
                  : 'text-edu-dark/70 hover:bg-edu-light/20'
                }`}
            >
              <section.icon size={14} />
              {section.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sections détaillées */}
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.05 }}
            className="scroll-mt-24 bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="border-b border-edu-light/20 bg-linear-to-r from-edu-light/5 to-transparent px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-edu-red/10 rounded-xl">
                  <section.icon size={22} className="text-edu-red" />
                </div>
                <h2 className="font-serif text-xl md:text-2xl text-edu-black">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-edu-dark/80 leading-relaxed">{section.content.intro}</p>

              {/* Points généraux */}
              {'points' in section.content && !('allowed' in section.content) && Array.isArray(section.content.points) && typeof section.content.points[0] === 'string' && (
                <ul className="space-y-2 mt-3">
                  {(section.content.points as string[]).map((point: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 size={16} className="text-edu-red mt-0.5 shrink-0" />
                      <span className="text-edu-dark/70">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Points structurés (propriété intellectuelle) */}
              {'points' in section.content && Array.isArray(section.content.points) && section.content.points[0] !== null && typeof section.content.points[0] === 'object' && 'title' in section.content.points[0] && (
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {(section.content.points as any[]).map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-edu-light/5 p-4 rounded-xl border border-edu-light/20"
                    >
                      <h4 className="font-semibold text-edu-black mb-1">{(point as any).title}</h4>
                      <p className="text-sm text-edu-dark/70">{(point as any).description}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Utilisation : autorisé / interdit */}
              {'allowed' in section.content && (
                <div className="grid md:grid-cols-2 gap-5 mt-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                      <CheckCircle2 size={18} /> Utilisations autorisées
                    </h4>
                    <ul className="space-y-2">
                      {section.content.allowed.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                          <span>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-3">
                      <XCircle size={18} /> Utilisations interdites
                    </h4>
                    <ul className="space-y-2">
                      {section.content.prohibited.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                          <span>✗</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Offres d'abonnement */}
              {'tiers' in section.content && (
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  {section.content.tiers.map((tier: any, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      className={`rounded-xl p-4 border ${i === 1 ? 'border-edu-red/30 bg-edu-red/5 shadow-md' : 'border-edu-light/20 bg-white'
                        }`}
                    >
                      <h4 className="font-serif text-lg font-semibold text-edu-black">{tier.name}</h4>
                      <p className="text-2xl font-bold text-edu-red mt-1">{tier.price}</p>
                      <ul className="mt-3 space-y-1">
                        {tier.features.map((feature: string, j: number) => (
                          <li key={j} className="text-xs text-edu-dark/60 flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-edu-red" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Conditions supplémentaires */}
              {'conditions' in section.content && (
                <div className="bg-edu-light/10 rounded-xl p-4 mt-3">
                  <ul className="space-y-2">
                    {section.content.conditions.map((condition: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-edu-dark/70">
                        <Info size={14} className="text-edu-red mt-0.5" /> {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scénarios de suspension */}
              {'scenarios' in section.content && (
                <ul className="space-y-2 mt-3">
                  {section.content.scenarios.map((scenario: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Clock size={16} className="text-edu-red mt-0.5" />
                      <span className="text-edu-dark/70">{scenario}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Section contact et signature */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-linear-to-br from-edu-black/5 to-edu-red/5 rounded-2xl p-8 text-center border border-edu-light/20"
      >
        <div className="max-w-2xl mx-auto">
          <Mail size={36} className="mx-auto text-edu-red mb-4" />
          <h3 className="font-serif text-2xl text-edu-black mb-3">Une question ?</h3>
          <p className="text-edu-dark/70 mb-6">
            Notre équipe juridique est à votre disposition pour toute question relative à nos conditions générales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@eduplan.fr"
              className="inline-flex items-center justify-center gap-2 bg-edu-red text-white px-6 py-3 rounded-full font-medium hover:bg-edu-red/90 transition-all duration-300"
            >
              <Mail size={18} />
              legal@eduplan.fr
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-edu-red/30 text-edu-dark bg-white px-6 py-3 rounded-full font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
            >
              <HelpCircle size={18} />
              Formulaire de contact
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Pied de page légal */}
      <div className="mt-10 text-center text-xs text-edu-dark/40 border-t border-edu-light/20 pt-6">
        <p>© {new Date().getFullYear()} EduPlan — Tous droits réservés</p>
        <p className="mt-1">
          Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés,
          vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
        </p>
      </div>
    </motion.div>
  );
}