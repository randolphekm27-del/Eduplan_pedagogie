const fs = require('fs');

const layout = `import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/Footer';

export default function PublicPageLayout() {
  return (
    <div className="min-h-screen bg-edu-bg font-sans text-edu-black flex flex-col transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-edu-bg/90 backdrop-blur-md border-b border-edu-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <GraduationCap className="text-edu-red" size={28} />
            <span className="font-serif text-2xl font-bold tracking-wide">EduPlan</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/dashboard"><Button variant="primary" className="text-sm px-6 py-2.5">Mon Espace de Travail</Button></Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}`;

fs.writeFileSync('src/layouts/PublicPageLayout.tsx', layout);

const pages = {
  'Features': 'Fonctionnalités IA',
  'WhatsNew': 'Nouveautés',
  'Blog': 'Blog Pédagogique',
  'Guides': "Guides d'utilisation",
  'TemplatesGallery': 'Modèles de fiches',
  'FAQ': 'Foire Aux Questions (FAQ)',
  'Privacy': 'Politique de Confidentialité',
  'Terms': 'Conditions Générales de Vente (CGV)',
  'Legal': 'Mentions Légales'
};

for (const [component, title] of Object.entries(pages)) {
  const content = `import React from 'react';
import { motion } from 'motion/react';

export default function ${component}() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg prose-red max-w-none">
      <h1 className="font-serif text-4xl mb-8">${title}</h1>
      <div className="bg-white border border-edu-light/30 p-8 rounded-[4px] shadow-sm">
        <p className="text-edu-dark text-lg focus:outline-none">
          Le contenu de cette page <strong>${title}</strong> est actuellement en cours de rédaction. 
          Revenez très bientôt pour découvrir nos ressources complètes conçues pour optimiser votre productivité pédagogique.
        </p>
        <div className="h-4 w-3/4 bg-edu-bg rounded mt-8 animate-pulse"></div>
        <div className="h-4 w-full bg-edu-bg rounded mt-4 animate-pulse"></div>
        <div className="h-4 w-5/6 bg-edu-bg rounded mt-4 animate-pulse"></div>
      </div>
    </motion.div>
  );
}`;
  fs.writeFileSync(`src/pages/${component}.tsx`, content);
}
console.log('Pages created successfully');
