import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Rocket,
  FolderTree,
  Sparkles,
  Search,
  FileText,
  Download,
  Share2,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
  Play,
  Clock,
  Star,
  CheckCircle2,
  Video,
  FileQuestion,
  LayoutTemplate,
  Globe,
  Zap,
  GraduationCap,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Target,
  Eye
} from 'lucide-react';

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedGuide, setExpandedGuide] = React.useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'Tous les guides', icon: BookOpen, count: 12 },
    { id: 'debutant', name: 'Premiers pas', icon: Rocket, count: 3 },
    { id: 'creation', name: 'Création de contenu', icon: Sparkles, count: 4 },
    { id: 'organisation', name: 'Organisation', icon: FolderTree, count: 2 },
    { id: 'avance', name: 'Fonctionnalités avancées', icon: Zap, count: 3 }
  ];

  const guides = [
    {
      id: 1,
      title: "Vos premiers pas sur EduPlan",
      description: "Découvrez comment créer votre compte, configurer votre profil et naviguer dans l'interface pour commencer à utiliser EduPlan en toute confiance.",
      category: "debutant",
      level: "Débutant",
      duration: "5 min",
      icon: Rocket,
      steps: [
        { title: "Créer un compte", description: "Rendez-vous sur la page d'inscription et renseignez vos informations professionnelles (nom, email, établissement)." },
        { title: "Configurer votre profil", description: "Indiquez votre matière principale et vos niveaux d'enseignement pour personnaliser les suggestions de l'IA." },
        { title: "Découvrir le tableau de bord", description: "Accédez à votre espace personnel avec un aperçu de vos dernières fiches et des recommandations personnalisées." },
        { title: "Première connexion", description: "Explorez le menu de navigation : Ma Bibliothèque, Créer une fiche, et les ressources pédagogiques." }
      ],
      tip: "Plus vous utiliserez EduPlan, plus l'IA apprendra à connaître votre style pédagogique et vous proposera des suggestions adaptées."
    },
    {
      id: 2,
      title: "Le Générateur de Séquences",
      description: "Apprenez à créer des séquences pédagogiques complètes en quelques clics grâce à notre assistant conversationnel alimenté par l'IA.",
      category: "creation",
      level: "Débutant",
      duration: "10 min",
      icon: Sparkles,
      steps: [
        { title: "Accéder au générateur", description: "Cliquez sur 'Créer une fiche' dans le menu de navigation de gauche." },
        { title: "Définir le contexte", description: "Précisez la discipline, le niveau, le thème et les objectifs pédagogiques visés." },
        { title: "Affiner les paramètres", description: "Utilisez les options avancées pour choisir le format, la durée et le type d'activités souhaitées." },
        { title: "Générer et ajuster", description: "L'IA propose une séquence complète. Modifiez, ajoutez ou supprimez des éléments selon vos besoins." },
        { title: "Valider et sauvegarder", description: "Une fois satisfait, sauvegardez votre fiche dans la bibliothèque pour la retrouver plus tard." }
      ],
      tip: "Soyez précis sur vos objectifs terminaux. Plus vous fournirez de détails, plus le résultat sera pertinent et personnalisé."
    },
    {
      id: 3,
      title: "Organiser sa bibliothèque",
      description: "Maîtrisez l'art de l'organisation : créez des dossiers, classez vos fiches et retrouvez facilement vos ressources pédagogiques.",
      category: "organisation",
      level: "Intermédiaire",
      duration: "7 min",
      icon: FolderTree,
      steps: [
        { title: "Créer des dossiers", description: "Dans 'Ma Bibliothèque', créez des dossiers par classe, par matière ou par période scolaire." },
        { title: "Déplacer des fiches", description: "Glissez-déposez vos fiches entre les dossiers pour une organisation flexible." },
        { title: "Utiliser les tags", description: "Ajoutez des mots-clés à vos fiches pour faciliter la recherche ultérieure." },
        { title: "Recherche avancée", description: "Utilisez la barre de recherche combinée aux filtres pour retrouver instantanément une fiche." }
      ],
      tip: "Créez une arborescence simple : 'Année scolaire > Période > Matière > Séquence' pour une organisation optimale."
    },
    {
      id: 4,
      title: "Différenciation pédagogique avec l'IA",
      description: "Adaptez automatiquement vos contenus pour les élèves à besoins spécifiques grâce aux fonctionnalités avancées de personnalisation.",
      category: "avance",
      level: "Avancé",
      duration: "12 min",
      icon: Users,
      steps: [
        { title: "Identifier les besoins", description: "Pour une fiche existante, activez le mode 'Différenciation' depuis le menu d'options." },
        { title: "Choisir le type d'adaptation", description: "Sélectionnez parmi : simplification de vocabulaire, aides visuelles, consignes adaptées ou approfondissement." },
        { title: "Générer les versions", description: "L'IA crée automatiquement des versions adaptées pour chaque profil d'élève." },
        { title: "Personnaliser davantage", description: "Ajustez manuellement chaque version selon les besoins spécifiques de votre classe." }
      ],
      tip: "Commencez par différencier les consignes avant d'adapter le fond. C'est souvent le levier le plus efficace."
    },
    {
      id: 5,
      title: "Exporter et partager vos fiches",
      description: "Diffusez vos créations : exportez en PDF, DOCX, partagez par lien ou collaborez avec vos collègues en temps réel.",
      category: "creation",
      level: "Intermédiaire",
      duration: "8 min",
      icon: Share2,
      steps: [
        { title: "Exporter au format PDF", description: "Cliquez sur 'Exporter' et choisissez PDF pour une impression ou une distribution classique." },
        { title: "Exporter au format DOCX", description: "Obtenez un fichier Word modifiable pour retravailler hors ligne." },
        { title: "Partage par lien", description: "Générez un lien de partage privé à envoyer à vos collègues." },
        { title: "Collaboration en temps réel", description: "Invitez d'autres enseignants à collaborer sur une même fiche pour un travail d'équipe." }
      ],
      tip: "Les liens de partage peuvent être configurés en lecture seule ou en édition collaborative."
    },
    {
      id: 6,
      title: "Analyser les compétences des élèves",
      description: "Utilisez les outils d'analyse pour suivre les progrès de vos élèves et ajuster votre pédagogie.",
      category: "avance",
      level: "Avancé",
      duration: "15 min",
      icon: BarChart3,
      steps: [
        { title: "Créer une évaluation", description: "Générez une évaluation avec des critères alignés sur les programmes officiels." },
        { title: "Saisir les résultats", description: "Renseignez les résultats de vos élèves dans la grille d'évaluation." },
        { title: "Visualiser les analyses", description: "Accédez aux tableaux de bord pour identifier les compétences acquises et celles à renforcer." },
        { title: "Adapter vos séquences", description: "Utilisez les insights pour ajuster vos prochaines séquences en fonction des besoins identifiés." }
      ],
      tip: "Les analyses sont automatiquement sauvegardées et accessibles tout au long de l'année pour suivre l'évolution."
    },
    {
      id: 7,
      title: "Utiliser l'assistant IA conversationnel",
      description: "Posez des questions à l'IA en langage naturel pour obtenir des suggestions, des idées d'activités ou des explications.",
      category: "creation",
      level: "Débutant",
      duration: "6 min",
      icon: MessageSquare,
      steps: [
        { title: "Ouvrir l'assistant", description: "Cliquez sur l'icône de bulle de dialogue en bas à droite de l'écran." },
        { title: "Poser une question", description: "Exemple : 'Propose-moi une activité ludique pour introduire la Révolution française'." },
        { title: "Exploiter les réponses", description: "Intégrez les suggestions directement dans votre fiche en cours." },
        { title: "Affiner les demandes", description: "Posez des questions complémentaires pour approfondir ou préciser." }
      ],
      tip: "L'assistant garde le contexte de votre session. Plus votre dialogue sera précis, plus les réponses seront pertinentes."
    },
    {
      id: 8,
      title: "Paramétrer ses préférences",
      description: "Personnalisez votre expérience : langue, notifications, thème visuel et paramètres de confidentialité.",
      category: "debutant",
      level: "Débutant",
      duration: "4 min",
      icon: Settings,
      steps: [
        { title: "Accéder aux paramètres", description: "Cliquez sur votre avatar en haut à droite puis sur 'Paramètres'." },
        { title: "Préférences générales", description: "Choisissez votre langue, le thème clair/sombre et vos notifications." },
        { title: "Préférences pédagogiques", description: "Ajustez les paramètres d'IA : niveau de langage, style de réponse, format par défaut." },
        { title: "Confidentialité", description: "Gérez vos données, exportez-les ou demandez leur suppression." }
      ],
      tip: "Personnalisez les préférences pédagogiques dès le début pour que l'IA s'adapte à votre style."
    },
    {
      id: 9,
      title: "Créer des templates personnalisés",
      description: "Concevez vos propres modèles de fiches pour gagner du temps et assurer une cohérence dans vos créations.",
      category: "avance",
      level: "Avancé",
      duration: "10 min",
      icon: LayoutTemplate,
      steps: [
        { title: "Créer un modèle", description: "Depuis une fiche existante, cliquez sur 'Enregistrer comme modèle'." },
        { title: "Définir la structure", description: "Choisissez les sections fixes et les parties variables de votre modèle." },
        { title: "Partager vos modèles", description: "Rendez vos templates disponibles pour votre équipe pédagogique." },
        { title: "Utiliser un modèle", description: "Lors de la création d'une nouvelle fiche, sélectionnez votre template préféré." }
      ],
      tip: "Créez des templates par type de séquence (cours magistral, projet, évaluation) pour accélérer votre production."
    }
  ];

  const filteredGuides = React.useMemo(() => {
    return guides.filter(guide => {
      const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
      const matchesSearch = searchTerm === '' ||
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-700';
      case 'Intermédiaire': return 'bg-blue-100 text-blue-700';
      case 'Avancé': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
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

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-4">
          <BookOpen size={18} className="text-edu-red" />
          <span className="text-sm font-medium text-edu-red">Ressources & Formation</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-4 tracking-tight">
          Guides d'utilisation
        </h1>
        <p className="text-lg md:text-xl text-edu-dark/70 max-w-2xl mx-auto">
          Apprenez à maîtriser toutes les subtilités d'EduPlan pour en tirer le meilleur parti.
        </p>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-md mx-auto mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-dark/40" size={18} />
        <input
          type="text"
          placeholder="Rechercher un guide..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-edu-light/40 rounded-full bg-white focus:border-edu-red focus:outline-none focus:ring-2 focus:ring-edu-red/20 transition-all"
        />
      </motion.div>

      {/* Catégories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.id
                ? 'bg-edu-red text-white shadow-md'
                : 'bg-white border border-edu-light/40 text-edu-dark/70 hover:border-edu-red hover:text-edu-red'
              }`}
          >
            <cat.icon size={14} />
            {cat.name}
            <span className={`text-xs ${activeCategory === cat.id ? 'text-white/80' : 'text-edu-dark/40'}`}>
              ({cat.count})
            </span>
          </button>
        ))}
      </motion.div>

      {/* Grille des guides */}
      {filteredGuides.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGuides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* En-tête de la carte */}
              <div className="border-b border-edu-light/20 bg-gradient-to-r from-edu-light/5 to-transparent px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-edu-red/10 rounded-xl">
                      <guide.icon size={20} className="text-edu-red" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-edu-black">
                        {guide.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(guide.level)}`}>
                          {guide.level}
                        </span>
                        <span className="text-xs text-edu-dark/40 flex items-center gap-1">
                          <Clock size={10} /> {guide.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                    className="text-edu-red hover:text-edu-red/80 transition-colors"
                  >
                    <ChevronRight size={20} className={`transition-transform duration-300 ${expandedGuide === guide.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-edu-dark/60 mt-2">
                  {guide.description}
                </p>
              </div>

              {/* Contenu expansible */}
              <motion.div
                initial={false}
                animate={{ height: expandedGuide === guide.id ? 'auto' : 0, opacity: expandedGuide === guide.id ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  <h4 className="font-semibold text-edu-black flex items-center gap-2">
                    <Play size={16} className="text-edu-red" />
                    Étapes à suivre
                  </h4>
                  <div className="space-y-3">
                    {guide.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-edu-red/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-edu-red">{stepIdx + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-edu-black text-sm">{step.title}</p>
                          <p className="text-xs text-edu-dark/60">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-800">Astuce</p>
                        <p className="text-xs text-amber-700">{guide.tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-edu-light/20">
          <FileQuestion size={48} className="mx-auto text-edu-dark/30 mb-4" />
          <p className="text-edu-dark/70">Aucun guide ne correspond à votre recherche.</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="mt-4 text-edu-red hover:underline text-sm"
          >
            Voir tous les guides
          </button>
        </div>
      )}

      {/* Section vidéos tutoriels */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-edu-black/5 via-edu-red/5 to-edu-black/5 rounded-2xl p-8 text-center border border-edu-light/20"
      >
        <Video size={36} className="mx-auto text-edu-red mb-4" />
        <h2 className="font-serif text-2xl text-edu-black mb-2">Formation vidéo</h2>
        <p className="text-edu-dark/70 mb-6 max-w-xl mx-auto">
          Privilégiez le format vidéo ? Accédez à notre playlist complète de tutoriels pour maîtriser EduPlan en moins de 30 minutes.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-edu-red text-white px-6 py-3 rounded-full font-medium hover:bg-edu-red/90 transition-all duration-300"
        >
          <Play size={18} />
          Accéder aux tutoriels vidéo
        </a>
      </motion.div>

      {/* Besoin d'aide ? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/faq"
          className="inline-flex items-center justify-center gap-2 border border-edu-light/40 text-edu-dark bg-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
        >
          <HelpCircle size={16} />
          Consulter la FAQ
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 border border-edu-light/40 text-edu-dark bg-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
        >
          <MessageSquare size={16} />
          Contacter le support
        </Link>
      </motion.div>
    </motion.div>
  );
}