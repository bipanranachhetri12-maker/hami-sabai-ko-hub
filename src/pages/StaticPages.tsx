import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useHub } from '../context/HubContext';

interface StaticPageProps {
  doc: 'about' | 'contact' | 'privacy' | 'advertise';
}

export const StaticPages: React.FC<StaticPageProps> = ({ doc }) => {
  const { language, authors, navigate } = useHub();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (doc === 'about') {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {language === 'ne' ? 'हाम्रो बारेमा · हामी सबैको हब' : 'About Hami Sabai Ko Hub'}
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ne'
              ? 'हामी सबैको हब नेपाली पाठक, विद्यार्थी, यात्री र परिवारका लागि शिक्षा, स्वास्थ्य, पर्यटन र समाचारलाई एउटै भरपर्दो मञ्चमा प्रस्तुत गर्ने द्विभाषी डिजिटल प्रकाशन हो।'
              : 'Hami Sabai Ko Hub is an independent, bilingual Nepali and English publication uniting four essential pillars of daily life in Nepal: Education, Health, Tourism & Travel Vlogs, and News.'}
          </p>
        </header>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'ne' ? 'हाम्रो सम्पादकीय टोली' : 'Editorial Team & Contributors'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {authors.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => navigate({ page: 'author', authorId: a.id })}
                className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-700 transition-colors"
              >
                <p className="font-bold text-slate-900 dark:text-white">
                  {language === 'ne' ? a.nameNe : a.name}
                </p>
                <p className="text-xs font-medium text-blue-800 dark:text-blue-400 mt-0.5">
                  {a.title[language]}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {a.bio[language]}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (doc === 'contact') {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {language === 'ne' ? 'सम्पर्क गर्नुहोस्' : 'Contact Us'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {language === 'ne'
              ? 'समाचार टिप्स, शैक्षिक सूचना वा सुझावका लागि हामीलाई सन्देश पठाउनुहोस्।'
              : 'Reach our Kathmandu newsroom for press releases, scholarship notices, corrections, or travel collaborations.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-blue-800 dark:text-blue-400 mt-1 shrink-0" />
              <span>Anamnagar-29, Kathmandu, Nepal</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-blue-800 dark:text-blue-400 mt-1 shrink-0" />
              <span>editorial@hamisabaikohub.com</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-blue-800 dark:text-blue-400 mt-1 shrink-0" />
              <span className="font-mono-tabular">+977-01-5100240</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setContactName('');
              setContactEmail('');
              setContactMsg('');
            }}
            className="md:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
          >
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={language === 'ne' ? 'पूरा नाम' : 'Full Name'}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
            />
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={language === 'ne' ? 'इमेल ठेगाना' : 'Email Address'}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
            />
            <textarea
              rows={4}
              required
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder={language === 'ne' ? 'तपाईंको सन्देश...' : 'Your message...'}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-900 dark:bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {language === 'ne' ? 'सन्देश पठाउनुहोस्' : 'Send Message'}
            </button>
            {sent && (
              <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Message received! Our editorial desk will respond shortly.</span>
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  if (doc === 'advertise') {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {language === 'ne' ? 'हामीसँग विज्ञापन गर्नुहोस्' : 'Advertise With Hami Sabai Ko Hub'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Reach Nepali students, healthcare seekers, domestic trekkers, and news readers across all 7 provinces with clean, non-intrusive display placements and sponsored educational guides.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="font-bold text-slate-900 dark:text-white">728 × 90 Leaderboard</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              High-visibility header &amp; mid-feed placement across Home, Education, and Health pages.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="font-bold text-slate-900 dark:text-white">300 × 250 Sidebar</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Contextual placement beside Trending News &amp; Destination Guides.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="font-bold text-slate-900 dark:text-white">Google AdSense Ready</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              CLS-safe responsive ad containers engineered for Core Web Vitals compliance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-5">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {language === 'ne' ? 'गोपनीयता नीति' : 'Privacy Policy'}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Hami Sabai Ko Hub respects reader privacy. Language preferences, theme selection, bookmarks, and local draft posts are stored solely in your browser. Newsletter subscriptions and comments are processed cleanly without selling personal data to third parties.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Health articles and BMI tools are provided for educational awareness and do not replace an in-person clinical consultation with a Nepal Medical Council (NMC) registered physician.
      </p>
    </div>
  );
};
