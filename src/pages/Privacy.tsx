import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Trash2,
  Mail,
  Globe,
  Clock,
  FileText,
  Lock,
  Server,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Building2,
  Smartphone,
  CreditCard,
  Cookie
} from 'lucide-react';

export default function PolitiquedeConfidentialitéPage() {
  const [lastUpdated] = React.useState("22 mars 2026");

  // Sections de la politique
  const sections = [
    {
      id: "collecte",
      icon: Database,
      title: "1. Données Collectées",
      content: {
        intro: "Nous collectons uniquement les données strictement nécessaires à l'utilisation optimale de la plateforme EduPlan.",
        lists: [
          {
            title: "Données d'identification",
            items: ["Nom et prénom", "Adresse email professionnelle ou personnelle", "Mot de passe chiffré", "Rôle (enseignant, chef d'établissement, etc.)"]
          },
          {
            title: "Données professionnelles",
            items: ["Établissement scolaire (facultatif)", "Disciplines enseignées", "Niveaux d'enseignement", "Préférences pédagogiques"]
          },
          {
            title: "Contenus générés",
            items: ["Fiches pédagogiques créées", "Séquences de cours", "Évaluations et grilles", "Annotations et commentaires"]
          },
          {
            title: "Données techniques",
            items: ["Adresse IP (anonymisée)", "Type de navigateur", "Pages consultées", "Durée des sessions"]
          }
        ]
      }
    },
    {
      id: "hebergement",
      icon: Server,
      title: "2. Hébergement & Sécurité",
      content: {
        intro: "Vos données sont protégées par des mesures de sécurité avancées et hébergées dans des infrastructures certifiées.",
        points: [
          {
            icon: Shield,
            title: "Hébergement souverain",
            description: "Serveurs sécurisés via Supabase (PostgreSQL) et Vercel, certifiés ISO-27001, localisés dans l'Union Européenne (France et Allemagne)."
          },
          {
            icon: Lock,
            title: "Chiffrement",
            description: "Chiffrement TLS 1.3 en transit et chiffrement AES-256 au repos. Vos fiches pédagogiques sont chiffrées individuellement."
          },
          {
            icon: Clock,
            title: "Sauvegardes",
            description: "Sauvegardes quotidiennes avec rétention de 30 jours. Vos données ne sont jamais exposées sur des serveurs non sécurisés."
          }
        ]
      }
    },
    {
      id: "utilisation",
      icon: Eye,
      title: "3. Utilisation des Données",
      content: {
        intro: "Nous utilisons vos données exclusivement pour améliorer votre expérience et ne les vendons jamais à des tiers.",
        uses: [
          "Fournir et améliorer le service EduPlan",
          "Personnaliser vos fiches pédagogiques",
          "Assurer le support technique et répondre à vos questions",
          "Analyser l'utilisation pour optimiser nos fonctionnalités (données anonymisées)",
          "Vous informer des mises à jour et nouveautés (avec votre consentement)"
        ]
      }
    },
    {
      id: "rgpd",
      icon: UserCheck,
      title: "4. Vos Droits RGPD",
      content: {
        intro: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :",
        rights: [
          {
            title: "Droit d'accès",
            description: "Obtenir la confirmation que vos données sont traitées et y accéder."
          },
          {
            title: "Droit de rectification",
            description: "Modifier vos données personnelles si elles sont inexactes."
          },
          {
            title: "Droit à l'effacement (Droit à l'oubli)",
            description: "Supprimer définitivement votre compte et toutes vos données associées."
          },
          {
            title: "Droit à la portabilité",
            description: "Récupérer vos données dans un format structuré et lisible."
          },
          {
            title: "Droit d'opposition",
            description: "Refuser certains traitements de vos données."
          }
        ]
      }
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "5. Cookies & Technologies",
      content: {
        intro: "Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme.",
        cookies: [
          {
            name: "session_id",
            purpose: "Maintien de votre session de connexion",
            duration: "Session"
          },
          {
            name: "preferences",
            purpose: "Mémorisation de vos préférences d'affichage",
            duration: "12 mois"
          },
          {
            name: "analytics",
            purpose: "Mesure d'audience anonyme (Plausible, sans tracking)",
            duration: "Persistant"
          }
        ],
        note: "Vous pouvez à tout moment gérer vos préférences de cookies via les paramètres de votre navigateur."
      }
    },
    {
      id: "partage",
      icon: Globe,
      title: "6. Partage des Données",
      content: {
        intro: "Nous ne partageons jamais vos données personnelles avec des tiers à des fins commerciales. Les seuls partisaires sont :",
        thirdParties: [
          {
            name: "Supabase",
            purpose: "Hébergement de la base de données",
            location: "UE"
          },
          {
            name: "Vercel",
            purpose: "Hébergement de l'application",
            location: "UE"
          },
          {
            name: "Stripe",
            purpose: "Traitement des paiements (aucune donnée bancaire stockée)",
            location: "UE"
          }
        ]
      }
    },
    {
      id: "conservation",
      icon: Calendar,
      title: "7. Durée de Conservation",
      content: {
        intro: "Vos données sont conservées aussi longtemps que votre compte est actif.",
        durations: [
          "Compte actif : Données conservées intégralement",
          "Compte inactif (12 mois) : Notification et suspension temporaire",
          "Suppression de compte : Effacement immédiat et irréversible",
          "Données anonymisées : Conservées pour analyse statistique"
        ]
      }
    },
    {
      id: "contact",
      icon: Mail,
      title: "8. Contact & DPO",
      content: {
        intro: "Pour toute question relative à vos données personnelles, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :",
        contacts: [
          { method: "Email", value: "dpo@eduplan.fr", icon: Mail },
          { method: "Adresse", value: "EduPlan - 10 rue de l'Éducation, 75001 Paris", icon: Building2 },
          { method: "Formulaire", value: "Disponible dans l'application", icon: FileText }
        ]
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8 md:py-12"
    >
      {/* Navigation */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-edu-dark/70 hover:text-edu-red font-medium uppercase tracking-wider mb-8 transition-all duration-300 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Retour à l'accueil
      </Link>

      {/* En-tête */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-edu-red/10 rounded-full">
            <Shield size={28} className="text-edu-red" />
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-edu-black">
              Politique de Confidentialité
            </h1>
            <p className="text-sm text-edu-dark/50 mt-2 flex items-center gap-2">
              <Calendar size={14} />
              Dernière mise à jour : {lastUpdated}
            </p>
          </div>
        </div>
        <p className="text-lg text-edu-dark/70 italic border-l-4 border-edu-red pl-4 py-2 bg-edu-light/10 rounded-r-lg">
          Nous prenons la protection de vos données très au sérieux. Voici comment nous les traitons de manière transparente et conforme au RGPD.
        </p>
      </div>

      {/* Engagement de transparence */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-green-800 font-medium">Notre engagement</p>
          <p className="text-sm text-green-700">Vos données vous appartiennent. Nous ne les vendons pas, ne les louons pas et ne les utilisons pas pour entraîner des modèles d'IA externes.</p>
        </div>
      </div>

      {/* Sommaire */}
      <div className="bg-edu-light/10 rounded-xl p-5 mb-10 border border-edu-light/20">
        <h2 className="font-serif text-lg font-semibold text-edu-black mb-3 flex items-center gap-2">
          <FileText size={18} />
          Sommaire
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {sections.map(section => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-edu-dark/70 hover:text-edu-red transition-colors flex items-center gap-2"
            >
              <section.icon size={14} />
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections détaillées */}
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-edu-light/30">
              <div className="p-2 bg-edu-red/10 rounded-lg">
                <section.icon size={20} className="text-edu-red" />
              </div>
              <h2 className="font-serif text-2xl text-edu-black">{section.title}</h2>
            </div>

            <div className="space-y-4 text-edu-dark/80 leading-relaxed">
              <p>{section.content.intro}</p>

              {/* Cas des listes imbriquées (section 1) */}
              {'lists' in section.content && (
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  {section.content.lists.map((list, idx) => (
                    <div key={idx} className="bg-edu-light/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-edu-black mb-2">{list.title}</h4>
                      <ul className="space-y-1">
                        {list.items.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-edu-red">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Cas des points avec icônes (section 2) */}
              {'points' in section.content && Array.isArray(section.content.points) && (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {(section.content.points as any[]).map((point, idx) => (
                    <div key={idx} className="bg-edu-light/5 p-4 rounded-lg">
                      {point.icon && <point.icon size={24} className="text-edu-red mb-2" />}
                      <h4 className="font-semibold text-edu-black mb-1">{point.title}</h4>
                      <p className="text-sm text-edu-dark/70">{point.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cas des listes simples (section 3, 7) */}
              {'uses' in section.content && (
                <ul className="space-y-2 mt-2">
                  {section.content.uses.map((use, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-edu-red mt-0.5 flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              )}

              {'durations' in section.content && (
                <ul className="space-y-2 mt-2">
                  {section.content.durations.map((duration, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Clock size={16} className="text-edu-red mt-0.5 flex-shrink-0" />
                      <span>{duration}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Cas des droits RGPD (section 4) */}
              {'rights' in section.content && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {section.content.rights.map((right, idx) => (
                    <div key={idx} className="border-l-2 border-edu-red pl-3 py-1">
                      <h4 className="font-semibold text-edu-black text-sm">{right.title}</h4>
                      <p className="text-xs text-edu-dark/60">{right.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cas des cookies (section 5) */}
              {'cookies' in section.content && (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-edu-light/30">
                        <th className="text-left py-2 font-semibold text-edu-black">Nom</th>
                        <th className="text-left py-2 font-semibold text-edu-black">Finalité</th>
                        <th className="text-left py-2 font-semibold text-edu-black">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.content.cookies.map((cookie, idx) => (
                        <tr key={idx} className="border-b border-edu-light/20">
                          <td className="py-2 font-mono text-xs">{cookie.name}</td>
                          <td className="py-2">{cookie.purpose}</td>
                          <td className="py-2">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-edu-dark/50 mt-2 italic">{section.content.note}</p>
                </div>
              )}

              {/* Cas des tiers (section 6) */}
              {'thirdParties' in section.content && (
                <div className="space-y-2 mt-4">
                  {section.content.thirdParties.map((party, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-edu-light/20">
                      <span className="font-medium text-edu-black">{party.name}</span>
                      <span className="text-sm text-edu-dark/60">{party.purpose}</span>
                      <span className="text-xs bg-edu-light/20 px-2 py-0.5 rounded">{party.location}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cas des contacts (section 8) */}
              {'contacts' in section.content && (
                <div className="bg-edu-light/10 rounded-lg p-4 mt-4 space-y-2">
                  {section.content.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <contact.icon size={18} className="text-edu-red" />
                      <span className="font-medium text-edu-black text-sm">{contact.method}:</span>
                      <span className="text-sm text-edu-dark/70">{contact.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Réclamation CNIL */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">Droit de réclamation</p>
          <p className="text-amber-700">
            Si vous estimez que vos droits ne sont pas respectés, vous avez la possibilité d'introduire une réclamation auprès de la
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-1 text-edu-red hover:underline">
              CNIL <ExternalLink size={12} />
            </a>.
          </p>
        </div>
      </div>

      {/* Modification de la politique */}
      <div className="mt-8 text-center text-xs text-edu-dark/40 border-t border-edu-light/20 pt-6">
        <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication.</p>
        <p className="mt-2">© {new Date().getFullYear()} EduPlan - Tous droits réservés</p>
      </div>
    </motion.div>
  );
}