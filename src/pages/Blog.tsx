import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Clock,
  Tag,
  Search,
  TrendingUp,
  MessageCircle,
  Share2,
  Eye,
  Heart,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Lightbulb,
  FileText,
  Users,
  Zap,
  Star
} from 'lucide-react';

export default function BlogPédagogiquePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Tous', icon: BookOpen },
    { id: 'methodology', name: 'Méthodologie', icon: Lightbulb },
    { id: 'testimonial', name: 'Témoignages', icon: Users },
    { id: 'tech', name: 'Innovation', icon: Sparkles },
    { id: 'resources', name: 'Ressources', icon: FileText }
  ];

  // Articles du blog
  const articles = [
    {
      id: 1,
      title: "L'IA, alliée de la classe inversée",
      excerpt: "Découvrez comment générer facilement des capsules vidéo de qualité grâce à des scripts co-construits avec l'IA. Une approche qui transforme la préparation et l'engagement des élèves.",
      category: "methodology",
      author: "Marie Lemoine",
      authorRole: "Professeure de lettres",
      date: "15 mars 2026",
      readTime: "8 min",
      image: null,
      tags: ["IA", "Classe inversée", "Vidéo"],
      likes: 124,
      comments: 18,
      views: 2340,
      featured: true
    },
    {
      id: 2,
      title: "De 15h à 5h de préparation hebdo",
      excerpt: "L'interview exclusive d'un enseignant en Histoire-Géo qui a divisé par 3 son temps de préparation formelle grâce à EduPlan. Découvrez sa méthode et ses astuces.",
      category: "testimonial",
      author: "Thomas Bernard",
      authorRole: "Professeur d'Histoire-Géo",
      date: "8 mars 2026",
      readTime: "12 min",
      image: null,
      tags: ["Témoignage", "Gain de temps", "Productivité"],
      likes: 256,
      comments: 42,
      views: 5120,
      featured: true
    },
    {
      id: 3,
      title: "Personnaliser les apprentissages grâce à l'IA",
      excerpt: "Comment adapter vos cours pour chaque élève sans multiplier les préparations. Stratégies et exemples concrets pour mettre en place une différenciation efficace.",
      category: "methodology",
      author: "Sophie Moreau",
      authorRole: "Conseillère pédagogique",
      date: "1 mars 2026",
      readTime: "10 min",
      image: null,
      tags: ["Différenciation", "Personnalisation", "Pédagogie"],
      likes: 89,
      comments: 12,
      views: 1870,
      featured: false
    },
    {
      id: 4,
      title: "Les 5 tendances éducatives à suivre en 2026",
      excerpt: "IA générative, classes flexibles, compétences psychosociales... Notre analyse des innovations qui vont marquer l'année scolaire.",
      category: "tech",
      author: "Lucas Girard",
      authorRole: "Chercheur en sciences de l'éducation",
      date: "22 février 2026",
      readTime: "15 min",
      image: null,
      tags: ["Tendances", "Innovation", "Veille"],
      likes: 312,
      comments: 28,
      views: 8450,
      featured: true
    },
    {
      id: 5,
      title: "Créer des évaluations formatives avec l'IA",
      excerpt: "Générez des quiz, des exercices et des grilles d'évaluation personnalisées en quelques secondes. Exemples concrets pour toutes les disciplines.",
      category: "resources",
      author: "Isabelle Durand",
      authorRole: "Professeure de SVT",
      date: "15 février 2026",
      readTime: "9 min",
      image: null,
      tags: ["Évaluation", "Quiz", "Formation"],
      likes: 167,
      comments: 23,
      views: 3210,
      featured: false
    },
    {
      id: 6,
      title: "Retour d'expérience : 6 mois avec EduPlan",
      excerpt: "Un professeur de mathématiques partage son ressenti après un semestre d'utilisation intensive. Bénéfices, limites et conseils pratiques.",
      category: "testimonial",
      author: "Pierre Dubois",
      authorRole: "Professeur de mathématiques",
      date: "5 février 2026",
      readTime: "11 min",
      image: null,
      tags: ["Retour d'expérience", "Témoignage", "Conseils"],
      likes: 203,
      comments: 31,
      views: 4020,
      featured: false
    }
  ];

  // Filtrer les articles
  const filteredArticles = React.useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Articles en vedette
  const featuredArticles = articles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

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
          <BookOpen size={18} className="text-edu-red" />
          <span className="text-sm font-medium text-edu-red">Ressources & Inspirations</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-edu-black mb-4 tracking-tight">
          Blog Pédagogique
        </h1>
        <p className="text-lg md:text-xl text-edu-dark/70 max-w-2xl mx-auto">
          Ressources, dossiers et retours d'expériences d'enseignants passionnés par l'innovation éducative.
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-10">
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-dark/40" size={18} />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-edu-light/40 rounded-full bg-white focus:border-edu-red focus:outline-none focus:ring-2 focus:ring-edu-red/20 transition-all"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat.id
                  ? 'bg-edu-red text-white shadow-md'
                  : 'bg-white border border-edu-light/40 text-edu-dark/70 hover:border-edu-red hover:text-edu-red'
                }`}
            >
              <cat.icon size={14} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles en vedette */}
      {selectedCategory === 'all' && searchTerm === '' && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-amber-500 fill-amber-500" />
            <h2 className="font-serif text-2xl text-edu-black">À la une</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-edu-red bg-edu-red/10 px-2 py-1 rounded">
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                    <span className="text-xs text-edu-dark/40 flex items-center gap-1">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-edu-black mb-3 group-hover:text-edu-red transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-edu-dark/70 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-xs bg-edu-light/20 px-2 py-1 rounded-full text-edu-dark/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-edu-light/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-edu-red/10 rounded-full flex items-center justify-center">
                        <User size={14} className="text-edu-red" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-edu-black">{article.author}</p>
                        <p className="text-[10px] text-edu-dark/40">{article.authorRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-edu-dark/40 text-xs">
                      <span className="flex items-center gap-1"><Heart size={12} /> {article.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {article.comments}</span>
                      <Link
                        to={`/blog/${article.id}`}
                        className="text-edu-red hover:underline flex items-center gap-1 text-xs font-medium"
                      >
                        Lire <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Grille d'articles */}
      {filteredArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-edu-light/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-edu-red bg-edu-red/10 px-2 py-0.5 rounded">
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  <span className="text-[10px] text-edu-dark/40 flex items-center gap-1">
                    <Calendar size={10} /> {article.date.slice(0, -5)}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-edu-black mb-2 group-hover:text-edu-red transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-edu-dark/60 text-xs mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-edu-light/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-edu-black/5 rounded-full flex items-center justify-center">
                      <User size={10} className="text-edu-dark/40" />
                    </div>
                    <span className="text-[10px] text-edu-dark/50">{article.author.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-edu-dark/40"><Eye size={10} /> {Math.floor(article.views / 1000)}k</span>
                    <Link
                      to={`/blog/${article.id}`}
                      className="text-edu-red text-xs font-medium hover:underline flex items-center gap-0.5"
                    >
                      Lire <ChevronRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-edu-light/20">
          <BookOpen size={48} className="mx-auto text-edu-dark/30 mb-4" />
          <p className="text-edu-dark/70">Aucun article ne correspond à votre recherche.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="mt-4 text-edu-red hover:underline text-sm"
          >
            Voir tous les articles
          </button>
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-16 bg-linear-to-r from-edu-black/5 via-edu-red/5 to-edu-black/5 rounded-2xl p-8 md:p-10 text-center border border-edu-light/20">
        <div className="max-w-2xl mx-auto">
          <TrendingUp size={32} className="mx-auto text-edu-red mb-4" />
          <h3 className="font-serif text-2xl text-edu-black mb-2">Ne manquez aucun article</h3>
          <p className="text-edu-dark/70 mb-6">
            Recevez chaque semaine notre sélection des meilleurs articles et ressources pédagogiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-edu-light/40 rounded-full bg-white focus:border-edu-red focus:outline-none focus:ring-2 focus:ring-edu-red/20"
            />
            <button className="bg-edu-red text-white px-6 py-3 rounded-full font-medium hover:bg-edu-red/90 transition-all duration-300 whitespace-nowrap">
              S'abonner
            </button>
          </div>
          <p className="text-xs text-edu-dark/40 mt-4">
            Non, nous n'aimons pas le spam. Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}