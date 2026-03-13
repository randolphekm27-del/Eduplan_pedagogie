import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Download, 
  ArrowRight, 
  Search, 
  Clock, 
  BarChart, 
  BookOpen, 
  ChevronRight,
  Star,
  Zap,
  Brain,
  Cpu,
  Globe,
  MessageSquare,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Prompt Engineering' | 'Image Gen' | 'Automation' | 'Advanced';
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Expert';
  rating: number;
  students: number;
  image: string;
  link: string;
  isNew?: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Maîtriser le Prompt Engineering pour l\'Éducation',
    description: 'Apprenez à structurer des prompts complexes pour générer des séquences pédagogiques de haute qualité en quelques secondes.',
    category: 'Prompt Engineering',
    duration: '2h 30min',
    level: 'Débutant',
    rating: 4.9,
    students: 1240,
    image: 'https://picsum.photos/seed/ai1/800/600',
    link: 'https://example.com/course/prompt-engineering',
    isNew: true
  },
  {
    id: '2',
    title: 'Génération d\'Images Techniques avec Midjourney',
    description: 'Créez des schémas industriels et des illustrations techniques ultra-réalistes pour vos supports de cours MEL.',
    category: 'Image Gen',
    duration: '4h 15min',
    level: 'Intermédiaire',
    rating: 4.8,
    students: 850,
    image: 'https://picsum.photos/seed/ai2/800/600',
    link: 'https://example.com/course/midjourney-tech'
  },
  {
    id: '3',
    title: 'Automatisation des Évaluations avec l\'IA',
    description: 'Utilisez les agents IA pour corriger et analyser les performances de vos élèves de manière automatisée et personnalisée.',
    category: 'Automation',
    duration: '3h 45min',
    level: 'Expert',
    rating: 4.7,
    students: 620,
    image: 'https://picsum.photos/seed/ai3/800/600',
    link: 'https://example.com/course/ai-automation'
  },
  {
    id: '4',
    title: 'L\'IA Générative : Fondamentaux et Éthique',
    description: 'Comprendre le fonctionnement des LLM et les enjeux éthiques de l\'utilisation de l\'IA en milieu scolaire.',
    category: 'Advanced',
    duration: '1h 50min',
    level: 'Débutant',
    rating: 4.9,
    students: 2100,
    image: 'https://picsum.photos/seed/ai4/800/600',
    link: 'https://example.com/course/ai-ethics'
  },
  {
    id: '5',
    title: 'Création de Chatbots Pédagogiques Personnalisés',
    description: 'Développez vos propres assistants virtuels basés sur vos documents de cours pour aider vos élèves 24h/24.',
    category: 'Automation',
    duration: '5h 20min',
    level: 'Expert',
    rating: 4.6,
    students: 430,
    image: 'https://picsum.photos/seed/ai5/800/600',
    link: 'https://example.com/course/ai-chatbots'
  },
  {
    id: '6',
    title: 'Analyse de Données Scolaires avec l\'IA',
    description: 'Transformez vos tableaux de notes en insights précieux pour identifier les élèves en difficulté plus rapidement.',
    category: 'Advanced',
    duration: '3h 10min',
    level: 'Intermédiaire',
    rating: 4.8,
    students: 740,
    image: 'https://picsum.photos/seed/ai6/800/600',
    link: 'https://example.com/course/ai-data'
  }
];

const categories = [
  { id: 'all', label: 'Toutes les formations', icon: Globe },
  { id: 'Prompt Engineering', label: 'Prompt Engineering', icon: MessageSquare },
  { id: 'Image Gen', label: 'Génération d\'Images', icon: ImageIcon },
  { id: 'Automation', label: 'Automatisation', icon: Zap },
  { id: 'Advanced', label: 'IA Avancée', icon: Brain },
];

export default function LearnAI() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (link: string, title: string) => {
    toast.success(`Accès à la formation : ${title}`, {
      description: "Vous allez être redirigé vers la plateforme de formation externe."
    });
    setTimeout(() => {
      window.open(link, '_blank');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-[2px] overflow-hidden bg-edu-black p-12 lg:p-20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-edu-red/40 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-edu-red/20 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edu-red/20 border border-edu-red/30 text-edu-red text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={12} /> Académie EduPlan
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            Maîtrisez l'IA pour <br /> <span className="text-edu-red italic">révolutionner</span> vos cours.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-edu-bg/70 mb-10 leading-relaxed"
          >
            Des formations exclusives conçues pour les enseignants techniques. Apprenez à utiliser les outils d'IA générative pour gagner du temps et engager vos élèves.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-edu-red text-white px-8 py-4 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-edu-black transition-all shadow-xl">
              Commencer maintenant
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
              Voir le catalogue
            </button>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-widest transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-edu-black text-white border-edu-black shadow-md' 
                  : 'bg-white text-edu-dark border-edu-light/30 hover:border-edu-red hover:text-edu-red'
              }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-dark" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une formation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white border border-edu-light/30 rounded-[2px] overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-edu-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button 
                    onClick={() => handleDownload(course.link, course.title)}
                    className="w-full bg-white text-edu-black py-3 rounded-[2px] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <Play size={14} fill="currentColor" /> Voir la formation
                  </button>
                </div>
                {course.isNew && (
                  <div className="absolute top-4 left-4 bg-edu-red text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-[2px] shadow-lg">
                    Nouveau
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-edu-black text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-[2px] shadow-sm">
                  {course.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-edu-black">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-edu-dark">
                    <BookOpen size={14} />
                    <span className="text-[10px] font-medium uppercase tracking-wider">{course.students} élèves</span>
                  </div>
                </div>
                
                <h3 className="font-serif text-xl text-edu-black mb-3 leading-tight group-hover:text-edu-red transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm text-edu-dark mb-6 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-edu-light/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-edu-dark">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-edu-dark">
                      <BarChart size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(course.link, course.title)}
                    className="text-edu-black hover:text-edu-red transition-colors"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-24 bg-white border border-dashed border-edu-light/50 rounded-[2px]">
          <div className="w-20 h-20 bg-edu-bg rounded-full flex items-center justify-center mx-auto mb-6 text-edu-dark">
            <Search size={40} />
          </div>
          <h3 className="font-serif text-2xl text-edu-black mb-3">Aucune formation trouvée</h3>
          <p className="text-edu-dark max-w-md mx-auto">Nous n'avons pas trouvé de formation correspondant à votre recherche. Essayez d'autres mots-clés ou changez de catégorie.</p>
        </div>
      )}

      {/* Newsletter / CTA Section */}
      <section className="mt-24 bg-[#F5F2ED] rounded-[2px] p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 border border-edu-light/30">
        <div className="flex-1">
          <h2 className="font-serif text-3xl text-edu-black mb-4">Restez à la pointe de l'IA</h2>
          <p className="text-edu-dark mb-8 leading-relaxed">
            Inscrivez-vous à notre newsletter mensuelle pour recevoir les derniers tutoriels, les nouveaux modèles de prompts et les actualités de l'IA éducative directement dans votre boîte mail.
          </p>
          <div className="flex gap-2 max-w-md">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="flex-1 px-4 py-3 bg-white border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all text-sm"
            />
            <button className="bg-edu-black text-white px-6 py-3 rounded-[2px] font-bold text-xs uppercase tracking-widest hover:bg-edu-red transition-all">
              S'inscrire
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2px] shadow-sm border border-edu-light/20 text-center">
            <p className="text-3xl font-serif text-edu-red mb-1">15+</p>
            <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Formations</p>
          </div>
          <div className="bg-white p-6 rounded-[2px] shadow-sm border border-edu-light/20 text-center">
            <p className="text-3xl font-serif text-edu-red mb-1">5k+</p>
            <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Apprenants</p>
          </div>
          <div className="bg-white p-6 rounded-[2px] shadow-sm border border-edu-light/20 text-center">
            <p className="text-3xl font-serif text-edu-red mb-1">4.9</p>
            <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Note Moyenne</p>
          </div>
          <div className="bg-white p-6 rounded-[2px] shadow-sm border border-edu-light/20 text-center">
            <p className="text-3xl font-serif text-edu-red mb-1">24/7</p>
            <p className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Accès Libre</p>
          </div>
        </div>
      </section>
    </div>
  );
}
