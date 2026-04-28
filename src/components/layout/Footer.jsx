// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Vote, Heart, ExternalLink } from "lucide-react";

const links = [
  { label: "Timeline", to: "/timeline" },
  { label: "Voter Journey", to: "/voter-journey" },
  { label: "Quiz", to: "/quiz" },
  { label: "Glossary", to: "/glossary" },
  { label: "Dashboard", to: "/dashboard" },
];

const external = [
  { label: "ECI Official", href: "https://eci.gov.in" },
  { label: "Voter Portal", href: "https://voters.eci.gov.in" },
  { label: "NVSP", href: "https://www.nvsp.in" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1e] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="size-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <Vote size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
                ElectoIQ
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed max-w-xs">
              Empowering every Indian citizen to understand their democratic
              rights and participate confidently in elections.
            </p>
            {/* Tricolor bar */}
            <div className="flex mt-5 h-1.5 rounded-full overflow-hidden w-32">
              <div className="flex-1 bg-india-saffron" />
              <div className="flex-1 bg-slate-200 dark:bg-white" />
              <div className="flex-1 bg-india-green" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Official Resources
            </h4>
            <ul className="space-y-2">
              {external.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-white/30">
            © {new Date().getFullYear()} ElectoIQ. Educational use only. Not
            affiliated with ECI.
          </p>
          <p className="text-xs text-slate-400 dark:text-white/30 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" /> for Indian
            voters
          </p>
        </div>
      </div>
    </footer>
  );
}
