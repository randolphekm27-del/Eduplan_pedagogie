import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Mail,
  BookOpen,
  Shield,
  Users,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function FoireAuxQuestionsPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqCategories = [
    {
      title: 'Utilisation & Fonctionnalités',
      icon: Zap,
      questions: [
        {
          q: "Est-ce que l'IA remplace mon travail de conception ?",
          a: "Absolument pas. EduPlan agit comme un assistant brouillon très performant. Vous restez le garant de la cohérence didactique et de la transposition pédagogique. L'outil vous fait simplement gagner du temps sur la rédaction et l'idéation."
        },
        {
          q: 'Puis-je exporter mes fiches dans différents formats ?',
          a: 'Oui. EduPlan permet d’exporter vos fiches pédagogiques au format PDF, DOCX (Word) et Markdown. Vous pouvez également les partager par lien privé avec vos collègues ou les intégrer dans vos LMS préférés.'
        },
        {
          q: "L'outil fonctionne-t-il sans connexion internet ?",
          a: "EduPlan est une application web qui nécessite une connexion internet pour fonctionner. Cependant, vos fiches sont automatiquement sauvegardées localement pendant votre session, et une version hors ligne limitée est en développement."
        },
        {
          q: "Puis-je collaborer avec d'autres enseignants sur une même fiche ?",
          a: 'Oui. Notre fonctionnalité de collaboration permet à plusieurs enseignants de travailler simultanément sur une même fiche pédagogique.'
        }
      ]
    },
    {
      title: 'Confidentialité & Sécurité',
      icon: Shield,
      questions: [
        {
          q: "Mes données sont-elles utilisées pour entraîner l'IA ?",
          a: "Non. Vos fiches et vos contenus personnels restent confidentiels. Nous n'utilisons aucun de vos documents pour entraîner des modèles externes, conformément à nos engagements de confidentialité."
        },
        {
          q: 'Où sont stockées mes données et qui y a accès ?',
          a: 'Vos données sont hébergées sur des serveurs sécurisés en Europe. Seuls les administrateurs techniques peuvent intervenir dans le cadre strict de la maintenance.'
        },
        {
          q: 'Que se passe-t-il si je supprime mon compte ?',
          a: 'Toutes vos données sont effacées définitivement de nos systèmes. Vous pouvez demander une exportation complète de vos données avant suppression.'
        },
        {
          q: 'Mes établissements peuvent-ils passer un contrat avec EduPlan ?',
          a: 'Oui. Nous proposons des offres établissements avec gestion centralisée, support prioritaire et accompagnement dédié.'
        }
      ]
    },
    {
      title: 'Assistance & Support',
      icon: HelpCircle,
      questions: [
        {
          q: "Comment obtenir de l'aide rapidement ?",
          a: "Vous pouvez nous contacter via le chat en ligne, notre centre d'aide ou par email. Les clients Premium bénéficient aussi d'un support renforcé."
        },
        {
          q: "Proposez-vous des formations à l'utilisation ?",
          a: 'Oui. Nous organisons régulièrement des webinaires gratuits et pouvons mettre en place des formations personnalisées pour les établissements.'
        },
        {
          q: 'Puis-je suggérer une fonctionnalité ?',
          a: 'Oui. Vos retours sont précieux. Vous pouvez proposer et voter pour de nouvelles fonctionnalités depuis votre tableau de bord.'
        },
        {
          q: 'Que faire en cas de bug ou de problème technique ?',
          a: "Signalez tout bug depuis l'application ou écrivez-nous avec une description précise du problème et, si possible, une capture d'écran."
        }
      ]
    },
    {
      title: 'Compte & Abonnement',
      icon: Users,
      questions: [
        {
          q: 'Existe-t-il une version gratuite ?',
          a: "Oui. EduPlan propose un niveau gratuit pour découvrir l'outil et créer vos premières fiches pédagogiques."
        },
        {
          q: 'Puis-je résilier mon abonnement à tout moment ?',
          a: "Oui. Vous pouvez résilier votre abonnement depuis votre espace personnel. La résiliation prend effet à la fin de la période en cours."
        },
        {
          q: 'Proposez-vous des tarifs spécifiques pour les enseignants ?',
          a: 'Nous proposons des offres adaptées selon le profil et le volume. Contactez-nous pour en savoir plus.'
        }
      ]
    }
  ];

  const filteredFaq = React.useMemo(() => {
    if (!searchTerm.trim()) return faqCategories;

    const term = searchTerm.toLowerCase();
    return faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) => item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
        )
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchTerm]);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8 md:py-12"
    >
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-edu-dark/70 hover:text-edu-red font-medium uppercase tracking-wider mb-6 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-4">
            <HelpCircle size={18} className="text-edu-red" />
            <span className="text-sm font-medium text-edu-red">Support & Assistance</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-4 tracking-tight">
            Foire aux questions
          </h1>
          <p className="text-lg md:text-xl text-edu-dark/70 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions. Cette section est mise à jour régulièrement.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-dark/40" size={20} />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-edu-light/40 rounded-xl bg-white/50 backdrop-blur-sm focus:border-edu-red focus:outline-none focus:ring-2 focus:ring-edu-red/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-edu-dark/40 hover:text-edu-red transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div className="mb-6 text-center text-sm text-edu-dark/60">
          {filteredFaq.reduce((acc, cat) => acc + cat.questions.length, 0)} résultat(s) trouvé(s)
        </div>
      )}

      <div className="space-y-8">
        {filteredFaq.map((category, catIdx) => (
          <div key={catIdx} className="bg-white rounded-2xl border border-edu-light/20 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-edu-black/5 to-transparent px-6 py-4 border-b border-edu-light/20 flex items-center gap-3">
              <category.icon size={24} className="text-edu-red" />
              <h2 className="font-serif text-xl font-semibold text-edu-black">{category.title}</h2>
            </div>

            <div className="divide-y divide-edu-light/20">
              {category.questions.map((item, idx) => {
                const globalIndex = catIdx * 100 + idx;
                const isOpen = openIndex === globalIndex;

                return (
                  <div key={idx} className="transition-all duration-200">
                    <button
                      onClick={() => toggleQuestion(globalIndex)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 hover:bg-edu-light/5 transition-colors group"
                    >
                      <span className="font-medium text-edu-dark group-hover:text-edu-red transition-colors pr-4">
                        {item.q}
                      </span>
                      <div className="shrink-0">
                        {isOpen ? (
                          <ChevronUp size={20} className="text-edu-red" />
                        ) : (
                          <ChevronDown size={20} className="text-edu-dark/40 group-hover:text-edu-red transition-colors" />
                        )}
                      </div>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-edu-dark/80 leading-relaxed border-l-2 border-edu-red/30 ml-6 mr-6 mb-4">
                        {item.a}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredFaq.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-edu-light/20">
            <HelpCircle size={48} className="mx-auto text-edu-dark/30 mb-4" />
            <p className="text-edu-dark/70">Aucune question ne correspond à votre recherche.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-edu-red hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        )}
      </div>

      <div className="mt-16 bg-linear-to-br from-edu-black/5 to-edu-red/5 rounded-2xl p-8 md:p-10 text-center border border-edu-light/20">
        <div className="max-w-2xl mx-auto">
          <MessageCircle size={32} className="mx-auto text-edu-red mb-4" />
          <h3 className="font-serif text-2xl text-edu-black mb-3">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-edu-dark/70 mb-6">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
            Nous nous engageons à vous répondre sous 24 h ouvrées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-edu-red text-white px-6 py-3 rounded-full font-medium hover:bg-edu-red/90 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Mail size={18} />
              Nous contacter
            </Link>
            <a
              href="https://aide.eduplan.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-edu-red/30 text-edu-dark bg-white px-6 py-3 rounded-full font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
            >
              <BookOpen size={18} />
              Centre d'aide
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqCategories.flatMap((cat) =>
            cat.questions.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a
              }
            }))
          )
        })}
      </script>
    </motion.div>
  );
}
