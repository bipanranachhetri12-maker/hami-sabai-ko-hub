import React, { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';

interface SocialShareBarProps {
  title: string;
  slug: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ title, slug }) => {
  const { language } = useHub();
  const t = UI_COPY[language];
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/#/post/${encodeURIComponent(slug)}`
      : `/#/post/${encodeURIComponent(slug)}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      cls: 'hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400',
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      cls: 'hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400',
    },
    {
      name: 'Viber',
      href: `viber://forward?text=${encodedTitle}%20${encodedUrl}`,
      cls: 'hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400',
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      cls: 'hover:border-slate-900 hover:text-slate-950 dark:hover:text-white',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-y border-slate-200 dark:border-slate-800">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2">
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
        {t.shareTitle}:
      </span>

      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${p.cls}`}
        >
          {p.name}
        </a>
      ))}

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        <span>{copied ? t.copied : t.copyLink}</span>
      </button>
    </div>
  );
};
