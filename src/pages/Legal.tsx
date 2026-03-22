import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Server,
  Mail,
  Globe,
  Phone,
  MapPin,
  Shield,
  FileText,
  Scale,
  Database,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Calendar,
  Info,
  Lock,
  Cpu,
  Award,
  Heart,
  BadgeCheck
} from 'lucide-react';

export default function MentionsLégalesPage() {
  const [lastUpdated] = React.useState("22 mars 2026");

  const legalInfo = {
    editor: {
      name: "EduPlan Corporation",
      legalForm: "Société par Actions Simplifiée (SAS)",
      capital: "10 000 €",
      rcs: "Paris B 123 456 789",
      siret: "123 456 789 00012",
      ape: "6201Z - Programmation informatique",
      vat: "FR12 345678901",
      address: "10 rue de l'Éducation, 75001 Paris, France",
      email: "contact@eduplan.fr",
      phone: "+33 (0)1 23 45 67 89",
      director: "Marie Dupont",
      directorTitle: "Directrice Générale"
    },
    hosting: [
      {
        name: "Vercel Inc.",
        address: "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
        phone: "+1 555-123-4567",
        website: "https://vercel.com",
        purpose: "Hébergement de l'application web"
      },
      {
        name: "Supabase, Inc.",
        address: "970 Toa Payoh North, #07-04, Singapore 318992",
        phone: "+65 1234 5678",
        website: "https://supabase.com",
        purpose: "Hébergement de la base de données"
      },
      {
        name: "Stripe, Inc.",
        address: "510 Townsend St, San Francisco, CA 94103, États-Unis",
        website: "https://stripe.com",
        purpose: "Traitement des paiements"
      }
    ],
    intellectualProperty: {
      owner: "EduPlan Corporation",
      registeredDesigns: ["EduPlan", "Logo EduPlan", "Interface pédagogique"],
      licenses: [
        "Fonts : Inter (SIL Open Font License)",
        "Icônes : Lucide (ISC License)",
        "Bibliothèques : React, Next.js, Framer Motion (MIT)"
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-8 md:py-12"
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

      {/* En-tête animé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-edu-red/10 rounded-2xl">
            <FileText size={32} className="text-edu-red" />
          </div>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-edu-black tracking-tight">
              Mentions Légales
            </h1>
            <p className="text-sm text-edu-dark/50 mt-2 flex items-center gap-2">
              <Calendar size={14} />
              Dernière mise à jour : {lastUpdated}
            </p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-edu-dark/70 italic border-l-4 border-edu-red pl-4 py-2 bg-edu-light/10 rounded-r-lg"
        >
          Informations légales et obligatoires relatives à l'éditeur du site EduPlan — Conformément aux articles 6-III et 19 de la loi n°2004-575 pour la confiance dans l'économie numérique (LCEN).
        </motion.p>
      </motion.div>

      {/* Badges de conformité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-10 justify-center"
      >
        {[
          { icon: Shield, text: "RGPD Conforme", color: "bg-green-100 text-green-700" },
          { icon: Lock, text: "Sécurisé (TLS 1.3)", color: "bg-blue-100 text-blue-700" },
          { icon: Award, text: "Certifié Éducation Nationale", color: "bg-amber-100 text-amber-700" },
          { icon: BadgeCheck, text: "Entreprise responsable", color: "bg-purple-100 text-purple-700" }
        ].map((badge, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.color} text-sm font-medium`}
          >
            <badge.icon size={14} />
            {badge.text}
          </motion.div>
        ))}
      </motion.div>

      {/* Section Éditeur */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-10 bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="border-b border-edu-light/20 bg-gradient-to-r from-edu-light/5 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-edu-red/10 rounded-xl">
              <Building2 size={22} className="text-edu-red" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-edu-black">Éditeur de la plateforme</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Raison sociale</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Scale size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Forme juridique</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.legalForm}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Capital social</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.capital}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">RCS</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.rcs}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">SIRET</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.siret}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Code APE</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.ape}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">TVA intracommunautaire</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.vat}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Siège social</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Contact</p>
                  <a href={`mailto:${legalInfo.editor.email}`} className="text-edu-red hover:underline">
                    {legalInfo.editor.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-edu-black">Téléphone</p>
                  <p className="text-edu-dark/70">{legalInfo.editor.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-edu-light/20">
            <div className="flex items-start gap-3">
              <UserCheck size={18} className="text-edu-red mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-edu-black">Directrice de la publication</p>
                <p className="text-edu-dark/70">{legalInfo.editor.director}, {legalInfo.editor.directorTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Hébergement */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-10 bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="border-b border-edu-light/20 bg-gradient-to-r from-edu-light/5 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-edu-red/10 rounded-xl">
              <Server size={22} className="text-edu-red" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-edu-black">Hébergement</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {legalInfo.hosting.map((host, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-edu-light/5 rounded-xl p-4 border border-edu-light/20"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-edu-black text-lg">{host.name}</h3>
                    <p className="text-sm text-edu-dark/60 mt-1">{host.address}</p>
                    <p className="text-xs text-edu-dark/50 mt-1 flex items-center gap-2">
                      <Cpu size={12} />
                      {host.purpose}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {host.phone && (
                      <a href={`tel:${host.phone}`} className="text-xs text-edu-red hover:underline">
                        {host.phone}
                      </a>
                    )}
                    <a
                      href={host.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-edu-red hover:underline"
                    >
                      {host.website.replace('https://', '')} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section Propriété intellectuelle */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mb-10 bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="border-b border-edu-light/20 bg-gradient-to-r from-edu-light/5 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-edu-red/10 rounded-xl">
              <Shield size={22} className="text-edu-red" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-edu-black">Propriété Intellectuelle</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-edu-black mb-2 flex items-center gap-2">
              <Globe size={16} className="text-edu-red" />
              Titulaire des droits
            </h3>
            <p className="text-edu-dark/70">{legalInfo.intellectualProperty.owner}</p>
          </div>

          <div>
            <h3 className="font-semibold text-edu-black mb-2 flex items-center gap-2">
              <FileText size={16} className="text-edu-red" />
              Éléments protégés
            </h3>
            <div className="flex flex-wrap gap-2">
              {legalInfo.intellectualProperty.registeredDesigns.map((design, idx) => (
                <span key={idx} className="bg-edu-light/20 px-3 py-1 rounded-full text-sm text-edu-dark/70">
                  {design}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-edu-black mb-2 flex items-center gap-2">
              <Database size={16} className="text-edu-red" />
              Licences tierces
            </h3>
            <ul className="space-y-1">
              {legalInfo.intellectualProperty.licenses.map((license, idx) => (
                <li key={idx} className="text-sm text-edu-dark/70 flex items-start gap-2">
                  <ChevronRight size={14} className="text-edu-red mt-0.5" />
                  {license}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Section Protection des données */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mb-10 bg-white border border-edu-light/20 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="border-b border-edu-light/20 bg-gradient-to-r from-edu-light/5 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-edu-red/10 rounded-xl">
              <Lock size={22} className="text-edu-red" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-edu-black">Protection des Données (RGPD)</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <UserCheck size={18} className="text-edu-red mt-0.5" />
                <div>
                  <p className="font-semibold text-edu-black">Délégué à la Protection des Données (DPO)</p>
                  <p className="text-edu-dark/70">dpo@eduplan.fr</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-edu-red mt-0.5" />
                <div>
                  <p className="font-semibold text-edu-black">Exercice des droits</p>
                  <p className="text-edu-dark/70">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-edu-red mt-0.5" />
                <div>
                  <p className="font-semibold text-edu-black">Déclaration CNIL</p>
                  <p className="text-edu-dark/70">Numéro de déclaration : 2234567 v 0</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={18} className="text-edu-red mt-0.5" />
                <div>
                  <p className="font-semibold text-edu-black">Transferts de données</p>
                  <p className="text-edu-dark/70">Les données sont hébergées exclusivement dans l'Union Européenne.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Médiation */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mb-10 bg-gradient-to-r from-edu-black/5 to-edu-red/5 rounded-2xl p-6 border border-edu-light/20"
      >
        <div className="flex items-start gap-4">
          <Heart size={28} className="text-edu-red flex-shrink-0" />
          <div>
            <h3 className="font-serif text-xl text-edu-black mb-2">Médiation et résolution des litiges</h3>
            <p className="text-edu-dark/70 text-sm mb-3">
              En cas de plainte ou de requête légale, merci de vous adresser initialement par courrier électronique au service contact pour une médiation prioritaire.
            </p>
            <p className="text-edu-dark/70 text-sm">
              Conformément aux articles L.616-1 et R.616-1 du code de la consommation, nous proposons un dispositif de médiation de la consommation.
              Après une réclamation écrite, vous pouvez saisir le médiateur de la consommation :
              <a href="#" className="text-edu-red hover:underline ml-1">Médiation CNPM</a>.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Liens vers autres documents légaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
      >
        <Link
          to="/politique-confidentialite"
          className="inline-flex items-center justify-center gap-2 border border-edu-light/40 text-edu-dark bg-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
        >
          <Shield size={16} />
          Politique de confidentialité
        </Link>
        <Link
          to="/conditions"
          className="inline-flex items-center justify-center gap-2 border border-edu-light/40 text-edu-dark bg-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
        >
          <FileText size={16} />
          Conditions générales
        </Link>
        <Link
          to="/cookies"
          className="inline-flex items-center justify-center gap-2 border border-edu-light/40 text-edu-dark bg-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-edu-red hover:text-edu-red transition-all duration-300"
        >
          <Globe size={16} />
          Gestion des cookies
        </Link>
      </motion.div>

      {/* Pied de page */}
      <div className="mt-10 text-center text-xs text-edu-dark/40 border-t border-edu-light/20 pt-6">
        <p>© {new Date().getFullYear()} {legalInfo.editor.name} — Tous droits réservés</p>
        <p className="mt-1">
          Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés,
          vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
        </p>
      </div>
    </motion.div>
  );
}