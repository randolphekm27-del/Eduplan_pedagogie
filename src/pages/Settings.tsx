import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Lock,
  Smartphone,
  Check,
  ChevronRight,
  ExternalLink,
  Save,
  Moon,
  Sun,
  Languages,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Paramètres enregistrés', {
        description: 'Vos modifications ont été appliquées avec succès.'
      });
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Abonnement', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-edu-black mb-2">Paramètres</h1>
        <p className="text-edu-dark">Gérez votre compte, vos préférences et votre abonnement.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-none">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-white text-edu-red shadow-sm border-l-2 border-edu-red'
                    : 'text-edu-dark hover:text-edu-black hover:bg-white/50'
                  }`}
              >
                <tab.icon size={18} strokeWidth={1.5} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-edu-light/30 rounded-[2px] shadow-sm overflow-hidden"
          >
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-edu-bg flex items-center justify-center font-serif text-3xl text-edu-dark border-2 border-edu-light/20 overflow-hidden">
                      PR
                    </div>
                    <button className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase tracking-widest">
                      Modifier
                    </button>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-edu-black">Professeur Randolphe</h3>
                    <p className="text-sm text-edu-dark">Membre depuis Mars 2024</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Nom complet</label>
                    <input type="text" defaultValue="Kodjo Mahulolo Randolphe" className="w-full px-4 py-2.5 bg-edu-bg/30 border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Email</label>
                    <input type="email" defaultValue="kodjomahulolorandolphe@gmail.com" className="w-full px-4 py-2.5 bg-edu-bg/30 border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Établissement</label>
                    <input type="text" defaultValue="Lycée Technique de Maintenance" className="w-full px-4 py-2.5 bg-edu-bg/30 border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-edu-dark uppercase tracking-widest">Matière principale</label>
                    <select className="w-full px-4 py-2.5 bg-edu-bg/30 border border-edu-light/30 rounded-[2px] outline-none focus:border-edu-red transition-all text-sm appearance-none cursor-pointer">
                      <option>Maintenance Industrielle (MEL)</option>
                      <option>Génie Électrique</option>
                      <option>Physique-Chimie</option>
                      <option>Mathématiques</option>
                    </select>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-edu-light/20 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-edu-black text-white px-8 py-2.5 rounded-[2px] font-medium hover:bg-edu-red transition-all shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? 'Enregistrement...' : <><Save size={16} /> Enregistrer les modifications</>}
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeTab === 'preferences' && (
              <div className="p-8">
                <h3 className="font-serif text-xl text-edu-black mb-8">Préférences de l'application</h3>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-edu-bg rounded-[2px] text-edu-dark">
                        <Languages size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-edu-black">Langue de l'interface</p>
                        <p className="text-xs text-edu-dark">Choisissez votre langue préférée.</p>
                      </div>
                    </div>
                    <select className="bg-white border border-edu-light/30 px-3 py-1.5 rounded-[2px] text-sm outline-none focus:border-edu-red">
                      <option>Français</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-edu-bg rounded-[2px] text-edu-dark">
                        <Sun size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-edu-black">Thème visuel</p>
                        <p className="text-xs text-edu-dark">Basculez entre le mode clair et sombre.</p>
                      </div>
                    </div>
                    <div className="flex bg-edu-bg p-1 rounded-[2px]">
                      <button className="px-3 py-1 text-xs font-bold bg-white text-edu-black shadow-sm rounded-[2px]">CLAIR</button>
                      <button className="px-3 py-1 text-xs font-bold text-edu-dark hover:text-edu-black">SOMBRE</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-edu-bg rounded-[2px] text-edu-dark">
                        <Check size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-edu-black">Sauvegarde automatique</p>
                        <p className="text-xs text-edu-dark">Enregistre vos fiches toutes les 2 minutes.</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-edu-light/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edu-red"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h3 className="font-serif text-xl text-edu-black mb-8">Gérer vos alertes</h3>

                <div className="space-y-6">
                  {[
                    { title: 'Nouveaux modèles', desc: 'Recevez une notification quand de nouveaux modèles pédagogiques sont ajoutés.' },
                    { title: 'Conseils IA', desc: 'Recevez des astuces hebdomadaires pour mieux utiliser l\'assistant IA.' },
                    { title: 'Mises à jour produit', desc: 'Soyez informé des nouvelles fonctionnalités et améliorations.' },
                    { title: 'Rappels de cours', desc: 'Notifications pour vos cours programmés dans la semaine.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between pb-6 border-b border-edu-light/10 last:border-0 last:pb-0">
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-edu-black mb-1">{item.title}</p>
                        <p className="text-xs text-edu-dark">{item.desc}</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                        <div className="w-11 h-6 bg-edu-light/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edu-red"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeTab === 'security' && (
              <div className="p-8">
                <h3 className="font-serif text-xl text-edu-black mb-8">Sécurité du compte</h3>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-edu-bg/30 border border-edu-light/20 rounded-[2px]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-[2px] text-edu-dark shadow-sm">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-edu-black">Mot de passe</p>
                        <p className="text-xs text-edu-dark">Dernière modification : il y a 3 mois.</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-edu-red hover:underline uppercase tracking-widest">Changer</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-edu-bg/30 border border-edu-light/20 rounded-[2px]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-[2px] text-edu-dark shadow-sm">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-edu-black">Double authentification (2FA)</p>
                        <p className="text-xs text-edu-dark">Ajoutez une couche de sécurité supplémentaire.</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-edu-red hover:underline uppercase tracking-widest">Activer</button>
                  </div>

                  <div className="pt-6 border-t border-edu-light/20">
                    <p className="text-sm font-medium text-edu-black mb-4">Sessions actives</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-edu-black font-medium">MacBook Pro - Paris, France</span>
                        </div>
                        <span className="text-edu-dark">Session actuelle</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-edu-light"></div>
                          <span className="text-edu-black font-medium">iPhone 15 - Paris, France</span>
                        </div>
                        <button className="text-edu-red hover:underline">Déconnecter</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeTab === 'billing' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-xl text-edu-black">Votre abonnement</h3>
                  <span className="px-3 py-1 bg-edu-red/10 text-edu-red text-[10px] font-bold uppercase tracking-widest rounded-full">Plan Premium</span>
                </div>

                <div className="bg-[#F5F2ED] p-6 rounded-[2px] border border-edu-light/30 mb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-2xl font-serif text-edu-black mb-1">19,99€ <span className="text-sm font-sans text-edu-dark">/ mois</span></p>
                      <p className="text-xs text-edu-dark">Prochain prélèvement le 1er Avril 2026</p>
                    </div>
                    <button className="px-4 py-2 bg-edu-black text-white text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-edu-red transition-all">Changer de plan</button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-edu-black">
                      <Check size={14} className="text-green-600" /> Générations IA illimitées
                    </div>
                    <div className="flex items-center gap-2 text-xs text-edu-black">
                      <Check size={14} className="text-green-600" /> Export PDF & Word haute qualité
                    </div>
                    <div className="flex items-center gap-2 text-xs text-edu-black">
                      <Check size={14} className="text-green-600" /> Support prioritaire 24/7
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-edu-black mb-4 uppercase tracking-widest">Historique des factures</h4>
                <div className="space-y-2">
                  {[
                    { date: '01 Mars 2026', amount: '19,99€', id: 'INV-2026-003' },
                    { date: '01 Fév 2026', amount: '19,99€', id: 'INV-2026-002' },
                    { date: '01 Jan 2026', amount: '19,99€', id: 'INV-2026-001' }
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-edu-light/10 last:border-0">
                      <div className="flex items-center gap-4">
                        <FileText size={16} className="text-edu-dark" />
                        <div>
                          <p className="text-sm font-medium text-edu-black">{inv.date}</p>
                          <p className="text-[10px] text-edu-dark font-mono">{inv.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-edu-black">{inv.amount}</span>
                        <button className="p-1.5 hover:bg-edu-bg rounded-[2px] text-edu-dark transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Danger Zone */}
          {activeTab === 'profile' && (
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-[2px]">
              <h4 className="text-sm font-bold text-red-800 mb-2 uppercase tracking-widest">Zone de danger</h4>
              <p className="text-xs text-red-700 mb-4">La suppression de votre compte est irréversible. Toutes vos fiches pédagogiques seront définitivement effacées.</p>
              <button className="text-xs font-bold text-red-600 hover:text-red-800 underline uppercase tracking-widest">Supprimer mon compte</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
