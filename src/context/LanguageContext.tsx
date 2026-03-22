import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

type Translations = Record<string, Record<string, string>>;

const translations: Translations = {
  fr: {
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Personnalisez votre expérience Eduplan et gérez vos informations personnelles.',
    'settings.tabs.profile': 'Profil',
    'settings.tabs.preferences': 'Préférences',
    'settings.tabs.notifications': 'Notifications',
    'settings.tabs.security': 'Sécurité',
    'settings.tabs.billing': 'Abonnement',
    'settings.profile.firstName': 'Prénom',
    'settings.profile.lastName': 'Nom de famille',
    'settings.profile.establishment': 'Établissement',
    'settings.profile.subject': 'Matière principale',
    'settings.profile.save': 'Sauvegarder',
    'settings.profile.saving': 'Enregistrement...',
    'settings.prefs.title': 'Préférences',
    'settings.prefs.subtitle': "Adaptez l'interface à votre environnement de travail.",
    'settings.prefs.langTitle': 'Langue système',
    'settings.prefs.langDesc': 'Le contenu généré respectera cette langue.',
    'settings.prefs.themeTitle': 'Apparence visuelle',
    'settings.prefs.themeDesc': "Basculez entre les différents modes d'affichage.",
    'settings.prefs.autoSaveTitle': 'Auto-sauvegarde',
    'settings.prefs.autoSaveDesc': 'Prévenez les pertes de données accidentelles.',
    'settings.security.title': 'Sécurité du compte',
    'settings.security.subtitle': 'Protégez votre compte personnel avec nos solutions avancées.',
    'settings.security.password': 'Mot de passe',
    'settings.security.passwordDesc': 'Mettre à jour votre mot de passe pour plus de sécurité.',
    'settings.security.twoFactor': 'Authentification à deux facteurs',
    'settings.security.twoFactorDesc': 'Ajoutez une couche de sécurité supplémentaire (2FA).',
    'settings.security.modify': 'Modifier',
    'settings.security.manage': 'Gérer',
    'settings.danger.title': 'Espace Critique',
    'settings.danger.desc': 'La suppression de votre compte effacera définitivement toutes vos fiches pédagogiques.',
    'settings.danger.btn': 'Supprimer le compte',
  },
  en: {
    'settings.title': 'Settings',
    'settings.subtitle': 'Personalize your Eduplan experience and manage your personal information.',
    'settings.tabs.profile': 'Profile',
    'settings.tabs.preferences': 'Preferences',
    'settings.tabs.notifications': 'Notifications',
    'settings.tabs.security': 'Security',
    'settings.tabs.billing': 'Billing',
    'settings.profile.firstName': 'First Name',
    'settings.profile.lastName': 'Last Name',
    'settings.profile.establishment': 'Establishment',
    'settings.profile.subject': 'Main Subject',
    'settings.profile.save': 'Save Changes',
    'settings.profile.saving': 'Saving...',
    'settings.prefs.title': 'Preferences',
    'settings.prefs.subtitle': 'Adapt the interface to your work environment.',
    'settings.prefs.langTitle': 'System Language',
    'settings.prefs.langDesc': 'Generated content will respect this language.',
    'settings.prefs.themeTitle': 'Visual Appearance',
    'settings.prefs.themeDesc': 'Switch between different display modes.',
    'settings.prefs.autoSaveTitle': 'Auto-Save',
    'settings.prefs.autoSaveDesc': 'Prevent accidental data loss.',
    'settings.security.title': 'Account Security',
    'settings.security.subtitle': 'Protect your personal account with our advanced solutions.',
    'settings.security.password': 'Password',
    'settings.security.passwordDesc': 'Update your password for better security.',
    'settings.security.twoFactor': 'Two-Factor Authentication',
    'settings.security.twoFactorDesc': 'Add an extra layer of security (2FA).',
    'settings.security.modify': 'Modify',
    'settings.security.manage': 'Manage',
    'settings.danger.title': 'Danger Zone',
    'settings.danger.desc': 'Deleting your account will permanently erase all your educational sheets.',
    'settings.danger.btn': 'Delete account',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('eduplan-lang') as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('eduplan-lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['fr'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
