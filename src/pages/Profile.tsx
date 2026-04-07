import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Settings, Mail, Building, GraduationCap, MapPin, Calendar, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, profile } = useAuth();

  const getInitials = () => {
    const f = profile?.firstname?.[0] || '';
    const l = profile?.lastname?.[0] || '';
    return (f + l).toUpperCase() || 'U';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-12">
      <header className="mb-10 flexitems-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-edu-black mb-2">Aperçu du Profil</h1>
          <p className="text-edu-dark font-serif italic">Vos informations personnelles actuelles.</p>
        </div>
      </header>

      <div className="bg-white rounded-[4px] shadow-sm border border-edu-light/30 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-linear-to-r from-edu-red to-edu-black relative">
          <Link to="/dashboard/settings" className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md px-4 py-2 rounded-[2px] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Edit3 size={14} /> Modifier
          </Link>
        </div>

        {/* Profile Info */}
        <div className="px-10 pb-10">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-edu-black flex items-center justify-center font-serif text-4xl text-white shadow-lg z-10">
              {getInitials()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-serif text-3xl text-edu-black mb-1">{profile?.firstname} {profile?.lastname}</h2>
              <p className="text-edu-dark text-sm uppercase tracking-widest font-bold mb-6">
                 {profile?.role === 'teacher' ? 'Enseignant / Professeur' : profile?.role || 'Utilisateur'}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-edu-bg flex items-center justify-center text-edu-red"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] text-edu-dark font-bold uppercase tracking-widest">Email</p>
                    <p className="text-edu-black font-medium">{profile?.email || user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-edu-bg flex items-center justify-center text-edu-red"><Building size={16} /></div>
                  <div>
                    <p className="text-[10px] text-edu-dark font-bold uppercase tracking-widest">Établissement</p>
                    <p className="text-edu-black font-medium">{(profile as any)?.institution || (profile as any)?.establishment || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-edu-bg flex items-center justify-center text-edu-red"><GraduationCap size={16} /></div>
                  <div>
                    <p className="text-[10px] text-edu-dark font-bold uppercase tracking-widest">Spécialité</p>
                    <p className="text-edu-black font-medium">{(profile as any)?.specialties?.[0] || 'Général'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-edu-bg/50 p-6 rounded-[2px] border border-edu-light/20 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-edu-dark mb-4 border-b border-edu-light/30 pb-2">Activité récente</h3>
                <div className="flex items-center gap-3 text-sm mb-3">
                  <Calendar size={16} className="text-edu-red" />
                  <span className="text-edu-dark">Dernière connexion:</span>
                  <span className="font-medium text-edu-black">{new Date((profile as any)?.last_login || new Date()).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Settings size={16} className="text-edu-red" />
                  <span className="text-edu-dark">Profil mis à jour le:</span>
                  <span className="font-medium text-edu-black">{new Date(profile?.updated_at || new Date()).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <Link to="/dashboard/settings" className="w-full text-center mt-6 block py-3 bg-white border border-edu-light/40 text-[10px] font-bold text-edu-black uppercase tracking-widest hover:border-edu-red hover:text-edu-red transition-all">
                Gérer mes préférences
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
