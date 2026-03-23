import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Target,
  BarChart3,
  FileText,
  Brain,
  Clock,
  Languages,
  GraduationCap,
  Lightbulb,
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  Wand2,
  BookOpen,
  UserCircle,
  MessagesSquare,
  PieChart
} from 'lucide-react';

export default function FonctionnalitésIAPage() {
  // Structure des fonctionnalités principales
  const mainFeatures = [
    {
      icon: Wand2,
      title: "Génération automatique de Séquences",
      description: "Créez des séquences pédagogiques structurées en quelques clics. Indiquez simplement votre niveau, votre discipline et le thème abordé, l'IA génère une proposition complète.",
      details: [
        "Objectifs pédagogiques alignés sur les programmes officiels",
        "Déroulement détaillé avec timing suggéré",
        "Évaluations formatives et sommatives intégrées",
        "Activités variées et engageantes pour les élèves"
      ],
      status: "disponible",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Target,
      title: "Différenciation Pédagogique",
      description: "Adaptez automatiquement vos contenus pour tous les élèves grâce à notre moteur de reformulation intelligent.",
      details: [
        "Adaptation pour élèves DYS (dyslexie, dysorthographie)",
        "Contenus simplifiés pour allophones (FLE/FLS)",
        "Approfondissements pour élèves en avance",
        "Consignes adaptées à différents niveaux de lecture"
      ],
      status: "coming",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: PieChart,
      title: "Analyse des Compétences",
      description: "Évaluez rapidement les productions d'élèves et suivez leurs progrès dans le temps grâce à nos analyses intelligentes.",
      details: [
        "Grilles critériées personnalisables",
        "Suggestions d'évaluations alignées sur les textes officiels",
        "Suivi individuel et collectif des acquis",
        "Tableaux de bord visuels pour les bilans"
      ],
      status: "disponible",
      color: "from-purple-500 to-pink-600"
    }
  ];

  // Fonctionnalités secondaires
  const secondaryFeatures = [
    {
      icon: Brain,
      title: "Assistant de rédaction",
      description: "Rédigez vos supports de cours plus rapidement avec des suggestions contextuelles et une reformulation intelligente.",
      benefits: ["Gain de temps", "Qualité rédactionnelle", "Cohérence pédagogique"]
    },
    {
      icon: Clock,
      title: "Planification automatique",
      description: "Structurez votre année scolaire en un clin d'œil avec un calendrier pédagogique personnalisé.",
      benefits: ["Vision annuelle", "Anticipation des périodes", "Équilibre des charges"]
    },
    {
      icon: Languages,
      title: "Multilingue & Adaptatif",
      description: "Créez des contenus dans plusieurs langues et adaptez automatiquement le niveau de langage.",
      benefits: ["Français, anglais, espagnol", "Niveau CE1 à Terminale", "Vocabulaire technique"]
    },
    {
      icon: Shield,
      title: "Conformité académique",
      description: "L'IA s'appuie sur les programmes officiels (BO) pour garantir la pertinence pédagogique.",
      benefits: ["Alignement programmes", "Mise à jour continue", "Références vérifiées"]
    },
    {
      icon: GraduationCap,
      title: "Support par niveau",
      description: "De la maternelle à l'enseignement supérieur, l'IA s'adapte à tous les cycles.",
      benefits: ["École primaire", "Collège/Lycée", "BTS/Université"]
    },
    {
      icon: MessagesSquare,
      title: "Suggestions d'activités",
      description: "Recevez des idées d'activités variées et innovantes pour dynamiser vos cours.",
      benefits: ["Pédagogie active", "Travail collaboratif", "Projets interdisciplinaires"]
    }
  ];

  // Témoignages
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Professeure de français, Collège",
      content: "La génération automatique de séquences me fait gagner au moins 3 heures par semaine. Je peux enfin me concentrer sur l'essentiel : l'accompagnement de mes élèves.",
      rating: 5
    },
    {
      name: "Thomas Dubois",
      role: "Professeur de mathématiques, Lycée",
      content: "L'analyse des compétences est bluffante. Les grilles d'évaluation suggérées correspondent parfaitement aux attendus du baccalauréat.",
      rating: 5
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 md:py-12"
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-edu-red/10 px-4 py-2 rounded-full mb-4">
          <Sparkles size={18} className="text-edu-red" />
          <span className="text-sm font-medium text-edu-red">Intelligence Artificielle</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-4 tracking-tight">
          Fonctionnalités IA
        </h1>
        <p className="text-lg md:text-xl text-edu-dark/70 max-w-3xl mx-auto">
          Découvrez comment notre technologie d'intelligence artificielle transforme la préparation de vos cours
          et allège votre charge mentale au quotidien.
        </p>
      </div>

      {/* Section Lead */}
      <div className="bg-linear-to-r from-edu-black/5 to-edu-red/5 rounded-2xl p-6 md:p-8 mb-12 text-center border border-edu-light/20">
        <p className="text-xl italic text-edu-dark/80 max-w-3xl mx-auto">
          "Notre mission : vous faire gagner du temps sur la préparation pour vous permettre de vous concentrer
          sur ce qui compte vraiment — l'accompagnement humain de vos élèves."
        </p>
      </div>

      {/* Fonctionnalités principales en cartes */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {mainFeatures.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-edu-light/20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className={`h-2 bg-linear-to-r ${feature.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-edu-red/10 rounded-xl">
                  <feature.icon size={28} className="text-edu-red" />
                </div>
                {feature.status === "coming" ? (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                    Prochainement
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Disponible
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl font-semibold text-edu-black mb-3">
                {feature.title}
              </h3>
              <p className="text-edu-dark/70 text-sm mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2 mb-6">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-edu-dark/80">
                    <CheckCircle2 size={14} className="text-edu-red mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section des fonctionnalités secondaires */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-edu-black mb-3">
            Et bien plus encore
          </h2>
          <p className="text-edu-dark/70">
            Un ensemble d'outils conçus pour vous accompagner au quotidien
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {secondaryFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-edu-light/20 rounded-xl p-5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-edu-black/5 rounded-lg group-hover:bg-edu-red/10 transition-colors">
                  <feature.icon size={20} className="text-edu-dark/70 group-hover:text-edu-red transition-colors" />
                </div>
                <h3 className="font-semibold text-edu-black">{feature.title}</h3>
              </div>
              <p className="text-sm text-edu-dark/70 mb-3">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.benefits.map((benefit, i) => (
                  <span key={i} className="text-xs bg-edu-light/20 px-2 py-1 rounded-full text-edu-dark/60">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="mb-16 bg-edu-black/5 rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-edu-black mb-2">
            Ils utilisent déjà EduPlan
          </h2>
          <p className="text-edu-dark/70">
            Découvrez les retours d'enseignants qui ont adopté notre solution
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-edu-light/20">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-edu-dark/80 italic mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-edu-red/20 rounded-full flex items-center justify-center">
                  <UserCircle size={20} className="text-edu-red" />
                </div>
                <div>
                  <p className="font-semibold text-edu-black text-sm">{testimonial.name}</p>
                  <p className="text-xs text-edu-dark/50">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section FAQ spécifique IA */}
      <div className="mb-12 bg-white border border-edu-light/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb size={24} className="text-edu-red" />
          <h2 className="font-serif text-xl font-semibold text-edu-black">Questions fréquentes sur l'IA</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-edu-black mb-2">L'IA est-elle vraiment fiable ?</h4>
            <p className="text-sm text-edu-dark/70">Oui, nos modèles sont entraînés spécifiquement sur les programmes officiels français et les bonnes pratiques pédagogiques. Chaque génération est vérifiable et modifiable.</p>
          </div>
          <div>
            <h4 className="font-semibold text-edu-black mb-2">Puis-je personnaliser les résultats ?</h4>
            <p className="text-sm text-edu-dark/70">Absolument ! L'IA génère des propositions que vous pouvez modifier, enrichir ou adapter selon vos besoins et votre style pédagogique.</p>
          </div>
          <div>
            <h4 className="font-semibold text-edu-black mb-2">Mes données sont-elles sécurisées ?</h4>
            <p className="text-sm text-edu-dark/70">Oui, toutes les données sont chiffrées et ne sont jamais utilisées pour entraîner des modèles externes. Votre travail reste votre propriété.</p>
          </div>
          <div>
            <h4 className="font-semibold text-edu-black mb-2">Faut-il des compétences techniques ?</h4>
            <p className="text-sm text-edu-dark/70">Aucune compétence technique requise. L'interface est conçue pour être intuitive et accessible à tous les enseignants.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link
          to="/inscription"
          className="inline-flex items-center gap-2 bg-edu-red text-white px-8 py-4 rounded-full font-semibold hover:bg-edu-red/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <Zap size={20} />
          Commencer gratuitement
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-xs text-edu-dark/50 mt-4">
          Gratuit pour les enseignants vérifiés • Sans engagement
        </p>
      </div>
    </motion.div>
  );
}
