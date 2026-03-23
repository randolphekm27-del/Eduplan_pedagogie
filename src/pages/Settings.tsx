
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ExternalLink,
  Save,
  Sun,
  Languages,
  FileText,
  Building,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getPlanByKey, normalizePlanKey } from '../utils/pricingPlans';

export default function Settings() {
  const { user, profile, updateProfile, resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    establishment: '',
    subject: 'Maintenance Industrielle (MEL)'
  });

  useEffect(() => {
    if (profile || user) {
      setFormData({
        firstname: profile?.firstname || '',
        lastname: profile?.lastname || '',
        email: profile?.email || user?.email || '',
        establishment: (profile as any)?.establishment || '',
        subject: (profile as any)?.subject || 'Maintenance Industrielle (MEL)'
      });
    }
  }, [profile, user]);

  const [autoSave, setAutoSave] = useState(localStorage.getItem('eduplan-autosave') !== 'false');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'fr' | 'en';
    setLanguage(newLang);
    toast.success('Langue mise à jour', { description: `La langue de l'interface a été changée en ${newLang === 'fr' ? 'Français' : 'Anglais'}.` });
  };

  const handlePasswordReset = async () => {
    if (user?.email) {
      try {
        await resetPassword(user.email);
        toast.success('Email envoyé', { description: 'Un email de réinitialisation a été envoyé à votre adresse.' });
        setShowPasswordModal(false);
      } catch (e) {
        toast.error('Erreur', { description: "Impossible d'envoyer l'email de réinitialisation." });
      }
    }
  };

  const handleAutoSaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAutoSave(isChecked);
    localStorage.setItem('eduplan-autosave', isChecked.toString());
    toast.success('Préférence sauvegardée', { description: isChecked ? 'La sauvegarde automatique est activée.' : 'La sauvegarde automatique est désactivée.' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstname: formData.firstname,
        lastname: formData.lastname,
        // email is usually managed by auth.updateUser, but we keep it here if allowed
      } as any);
      
      toast.success('Paramètres enregistrés', {
        description: 'Vos modifications ont été appliquées avec succès.'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'preferences', label: t('settings.tabs.preferences'), icon: Globe },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'security', label: t('settings.tabs.security'), icon: Shield },
    { id: 'billing', label: t('settings.tabs.billing'), icon: CreditCard },
  ];

  const currentPlan = getPlanByKey(normalizePlanKey(profile?.tier));

  const getInitials = () => {
    const f = formData.firstname?.[0] || '';
    const l = formData.lastname?.[0] || '';
    return (f + l).toUpperCase() || '??';
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-edu-red"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-edu-red">Configuration</span>
        </div>
        <h1 className="font-serif text-5xl text-edu-black mb-3">{t('settings.title')}</h1>
        <p className="text-edu-dark font-serif italic">{t('settings.subtitle')}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex-none">
          <div className="bg-white border border-edu-light/30 rounded-[4px] p-2 shadow-sm sticky top-24">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible custom-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap group ${activeTab === tab.id
                      ? 'bg-edu-black text-white shadow-md'
                      : 'text-edu-dark hover:text-edu-black hover:bg-edu-light/20'
                    }`}
                >
                  <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} className={activeTab === tab.id ? 'text-edu-red' : 'group-hover:text-edu-red transition-colors'} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-edu-light/30 rounded-[4px] shadow-xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-edu-red to-edu-black"></div>

              {/* Profile Section */}
              {activeTab === 'profile' && (
                <div className="p-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-8 border-b border-edu-light/20">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-edu-black flex items-center justify-center font-serif text-4xl text-white border-4 border-edu-light/10 shadow-inner overflow-hidden">
                        {getInitials()}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-edu-red text-white p-2 rounded-full shadow-lg border-4 border-white">
                        <User size={16} />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="font-serif text-3xl text-edu-black mb-1">{formData.firstname} {formData.lastname}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-edu-dark">
                        <span className="flex items-center gap-2"><Mail size={12} className="text-edu-red" /> {formData.email}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-edu-light"></span>
                        <span className="flex items-center gap-2"><GraduationCap size={12} className="text-edu-red" /> {profile?.role === 'teacher' ? 'Professeur' : 'Étudiant'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-edu-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} className="text-edu-red" /> Prénom
                      </label>
                      <input 
                        type="text" 
                        value={formData.firstname} 
                        onChange={e => setFormData({...formData, firstname: e.target.value})}
                        className="w-full px-5 py-3.5 bg-edu-bg/20 border border-edu-light/40 rounded-[2px] outline-none focus:border-edu-red focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-edu-black uppercase tracking-[0.2em] flex items-center gap-2">
                         Nom de famille
                      </label>
                      <input 
                        type="text" 
                        value={formData.lastname} 
                        onChange={e => setFormData({...formData, lastname: e.target.value})}
                        className="w-full px-5 py-3.5 bg-edu-bg/20 border border-edu-light/40 rounded-[2px] outline-none focus:border-edu-red focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-edu-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Building size={12} className="text-edu-red" /> Établissement
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Lycée Technique..."
                        value={formData.establishment} 
                        onChange={e => setFormData({...formData, establishment: e.target.value})}
                        className="w-full px-5 py-3.5 bg-edu-bg/20 border border-edu-light/40 rounded-[2px] outline-none focus:border-edu-red focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-edu-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <FileText size={12} className="text-edu-red" /> Matière principale
                      </label>
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-3.5 bg-edu-bg/20 border border-edu-light/40 rounded-[2px] outline-none focus:border-edu-red focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option>Maintenance Industrielle (MEL)</option>
                        <option>Génie Électrique</option>
                        <option>Physique-Chimie</option>
                        <option>Mathématiques</option>
                        <option>Français</option>
                        <option>Histoire-Géographie</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-edu-light/20 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] text-edu-dark font-serif italic text-center md:text-left">Dernière mise à jour du profil le {new Date(profile?.updated_at || '').toLocaleDateString('fr-FR')}</p>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="group relative flex items-center gap-3 bg-edu-black text-white px-10 py-4 rounded-[2px] text-xs font-bold uppercase tracking-widest hover:bg-edu-red transition-all shadow-xl disabled:opacity-50 overflow-hidden"
                    >
                      <div className="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-300"></div>
                      {isSaving ? 'Enregistrement...' : <><Save size={14} /> Sauvegarder</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeTab === 'preferences' && (
                <div className="p-10">
                  <h3 className="font-serif text-2xl text-edu-black mb-1">Préférences</h3>
                  <p className="text-sm text-edu-dark mb-10">Adaptez l'interface à votre environnement de travail.</p>

                  <div className="space-y-10">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-edu-bg/50 rounded-[2px] text-edu-dark group-hover:bg-edu-red group-hover:text-white transition-colors">
                          <Languages size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-edu-black uppercase tracking-tight">Langue système</p>
                          <p className="text-xs text-edu-dark">Le contenu généré respectera cette langue.</p>
                        </div>
                      </div>
                      <select 
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-white border border-edu-light/30 px-4 py-2 rounded-[2px] text-xs font-bold outline-none focus:border-edu-red shadow-sm cursor-pointer"
                      >
                        <option value="fr">Français (France)</option>
                        <option value="en">English (UK)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-edu-bg/50 rounded-[2px] text-edu-dark group-hover:bg-edu-black group-hover:text-white transition-colors">
                          <Sun size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-edu-black uppercase tracking-tight">Apparence visuelle</p>
                          <p className="text-xs text-edu-dark">Basculez entre les différents modes d'affichage.</p>
                        </div>
                      </div>
                      <div className="flex bg-edu-bg p-1 rounded-[2px] border border-edu-light/20">
                        <button 
                          onClick={() => theme !== 'original' && toggleTheme()}
                          className={`px-5 py-2 text-[10px] font-bold transition-all rounded-[2px] ${theme === 'original' ? 'bg-white text-edu-black shadow-md' : 'text-edu-dark hover:text-edu-black'}`}
                        >
                          CLASSIQUE
                        </button>
                        <button 
                          onClick={() => theme !== 'blue' && toggleTheme()}
                          className={`px-5 py-2 text-[10px] font-bold transition-all rounded-[2px] ${theme === 'blue' ? 'bg-white text-edu-black shadow-md' : 'text-edu-dark hover:text-edu-black'}`}
                        >
                          MODERNE (BLEU)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-edu-bg/50 rounded-[2px] text-edu-dark group-hover:bg-green-600 group-hover:text-white transition-colors">
                          <Check size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-edu-black uppercase tracking-tight">Auto-sauvegarde</p>
                          <p className="text-xs text-edu-dark">Prévenez les pertes de données accidentelles.</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={autoSave} onChange={handleAutoSaveChange} />
                        <div className="w-12 h-6 bg-edu-light/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edu-red"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeTab === 'notifications' && (
                <div className="p-10">
                  <h3 className="font-serif text-2xl text-edu-black mb-1">Notifications</h3>
                  <p className="text-sm text-edu-dark mb-10">Gérez comment et quand vous souhaitez être alerté.</p>
                  
                  <div className="space-y-8">
                    {[
                      { id: 'notif-email', title: 'Emails de mise à jour', desc: 'Recevez nos nouveautés et rapports hebdomadaires.' },
                      { id: 'notif-docs', title: 'Activités sur les documents', desc: "Soyez alerté lorsqu'un document est modifié." },
                      { id: 'notif-sec', title: 'Alertes de sécurité', desc: 'Connexions suspectes et modifications de mot de passe.' }
                    ].map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between group border-b border-edu-light/20 pb-6 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold text-edu-black">{item.title}</p>
                          <p className="text-xs text-edu-dark mt-1">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 0} onChange={(e) => toast.success('Mise à jour', { description: 'Préférence de notification modifiée.' })} />
                          <div className="w-12 h-6 bg-edu-light/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edu-red"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Security Section */}
              {activeTab === 'security' && (
                <div className="p-10">
                  <h3 className="font-serif text-2xl text-edu-black mb-1">Sécurité du compte</h3>
                  <p className="text-sm text-edu-dark mb-10">Protégez votre compte personnel avec nos solutions avancées.</p>

                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-edu-bg/30 border border-edu-light/20 rounded-[2px]">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-white shadow-sm border border-edu-light/20 rounded-[2px] text-edu-black"><Lock size={20} /></div>
                        <div>
                          <p className="text-sm font-bold text-edu-black">Mot de passe</p>
                          <p className="text-xs text-edu-dark mt-1">Dernière modification : Il y a 3 mois</p>
                        </div>
                      </div>
                      <button onClick={() => setShowPasswordModal(true)} className="px-5 py-2.5 bg-white border border-edu-light/40 text-xs font-bold uppercase tracking-widest text-edu-black hover:bg-edu-black hover:text-white transition-all rounded-[2px]">{t('settings.security.modify')}</button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-edu-bg/30 border border-edu-light/20 rounded-[2px]">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-white shadow-sm border border-edu-light/20 rounded-[2px] text-edu-black"><Smartphone size={20} /></div>
                        <div>
                          <p className="text-sm font-bold text-edu-black">Authentification à deux facteurs</p>
                          <p className="text-xs text-edu-dark mt-1">Ajoutez une couche de sécurité supplémentaire (2FA).</p>
                        </div>
                      </div>
                      <button onClick={() => toast.error('Non disponible', { description: "Le 2FA n'est pas activé sur votre plan actuel." })} className="px-5 py-2.5 bg-edu-red text-white text-xs font-bold uppercase tracking-widest hover:bg-edu-black transition-all rounded-[2px]">Gérer</button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Billing Section */}
              {activeTab === 'billing' && (
                <div className="p-10">
                  <h3 className="font-serif text-2xl text-edu-black mb-1">Abonnement & Facturation</h3>
                  <p className="text-sm text-edu-dark mb-10">Retrouvez votre plan actuel et comparez les offres Standard et Premium à tout moment.</p>

                  <div className="bg-linear-to-br from-edu-black to-gray-900 border border-gray-800 rounded-[8px] p-8 text-white relative overflow-hidden mb-6">
                    <div className="absolute top-0 right-0 p-10 opacity-10"><CreditCard size={120} /></div>
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 border border-white/20">Plan actuel</div>
                      <h4 className="font-serif text-3xl mb-1">EduPlan {currentPlan.name}</h4>
                      <p className="text-gray-400 text-sm mb-4">{currentPlan.priceLabel}/mois</p>
                      <p className="text-gray-300 text-sm mb-6">{currentPlan.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <Link to="/pricing" className="px-6 py-2.5 bg-white text-edu-black text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-edu-red hover:text-white transition-all">Comparer les offres</Link>
                        <button onClick={() => toast.info('Gestion de compte', { description: 'Ouverture du portail de paiement...' })} className="px-6 py-2.5 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-white/20 transition-all">Gérer l'abonnement</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-10">
                    <div className="border border-edu-light/30 rounded-[8px] p-4 bg-edu-bg/30">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-edu-red mb-2">Gratuit</p>
                      <p className="text-sm text-edu-dark/70">5 fiches par mois et accès limité pour découvrir la plateforme.</p>
                    </div>
                    <div className="border border-amber-200 rounded-[8px] p-4 bg-amber-50">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 mb-2">Standard</p>
                      <p className="text-sm text-edu-dark/70">30 fiches par mois, IA, import de documents et export HD sans filigrane.</p>
                    </div>
                    <div className="border border-edu-red/20 rounded-[8px] p-4 bg-edu-red/5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-edu-red mb-2">Premium</p>
                      <p className="text-sm text-edu-dark/70">Accès étendu ou illimité et toutes les fonctionnalités avancées.</p>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs uppercase text-edu-black tracking-widest mb-4">Historique des factures</h4>
                  <div className="border border-edu-light/30 rounded-[2px] overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-edu-bg/50">
                        <tr>
                          <th className="p-4 font-bold text-edu-black">Date</th>
                          <th className="p-4 font-bold text-edu-black">Montant</th>
                          <th className="p-4 font-bold text-edu-black">Statut</th>
                          <th className="p-4 font-bold text-edu-black text-right">Facture</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-edu-light/20">
                        <tr>
                          <td className="p-4 text-edu-dark">24 Sep 2025</td>
                          <td className="p-4 font-medium text-edu-black">5 000 XOF</td>
                          <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Payé</span></td>
                          <td className="p-4 text-right"><button className="text-edu-red hover:text-edu-black text-xs font-bold uppercase tracking-widest" onClick={() => toast.success('Téléchargement lancé')}>PDF</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Danger Zone */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-8 bg-red-50/50 border border-red-100 rounded-[4px] flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div>
                <h4 className="text-xs font-bold text-red-800 mb-1 uppercase tracking-[0.2em]">Espace Critique</h4>
                <p className="text-xs text-red-700 font-serif">La suppression de votre compte effacera définitivement toutes vos fiches pédagogiques.</p>
              </div>
              <button onClick={() => setShowDeleteModal(true)} className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-[2px]">
                {t('settings.danger.btn')}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-edu-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[4px] shadow-2xl p-8 max-w-md w-full border border-edu-light/30">
              <h3 className="font-serif text-2xl text-edu-black mb-2">Réinitialiser le mot de passe</h3>
              <p className="text-sm text-edu-dark mb-6">Un lien de réinitialisation sera envoyé à <strong>{user?.email}</strong>. Voulez-vous continuer ?</p>
              <div className="flex gap-4 justify-end">
                <button onClick={() => setShowPasswordModal(false)} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-edu-dark hover:text-edu-black transition-colors">Annuler</button>
                <button onClick={handlePasswordReset} className="px-5 py-2.5 bg-edu-black text-white text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-edu-red transition-all shadow-md">Confirmer</button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-edu-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[4px] shadow-2xl p-8 max-w-md w-full border border-red-200">
              <h3 className="font-serif text-2xl text-red-600 mb-2">Supprimer le compte</h3>
              <p className="text-sm text-edu-dark mb-6">Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement effacées. Êtes-vous absolument sûr de vouloir supprimer votre compte ?</p>
              <div className="flex gap-4 justify-end">
                <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-edu-dark hover:text-edu-black transition-colors">Annuler</button>
                <button onClick={() => {toast.error('Action bloquée', { description: 'Veuillez contacter le support pour supprimer.'}); setShowDeleteModal(false);}} className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-[2px] hover:bg-red-700 transition-all shadow-md">Supprimer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
