import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Bell, Loader2 } from 'lucide-react';
import type { ProjectId } from '../../data/types';
import siriusLogo from '../../assets/sirius-logo.png';

interface NavbarProps {
  activeProject: ProjectId;
  onProjectChange: (id: ProjectId) => void;
  isLoading: boolean;
}

const projects: { id: ProjectId; name: string; desc: string }[] = [
  { id: 'sales', name: 'Sales Team', desc: 'Lead qualification & pipeline ops' },
  { id: 'customer-service', name: 'Customer Service Team', desc: 'Support & issue resolution' },
];

const Navbar: React.FC<NavbarProps> = ({ activeProject, onProjectChange, isLoading }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeProjectInfo = projects.find((p) => p.id === activeProject)!;

  return (
    <nav className="h-12 min-h-[48px] bg-[#0A0A0A] border-b border-[#262626] flex items-center px-4 gap-4 z-[100] shrink-0">
      <a className="flex items-center gap-2 no-underline shrink-0" href="#">
        <img src={siriusLogo} alt="Sirius Logo" className="h-[42px] w-auto max-h-[42px] object-contain" />
      </a>

      <div className="w-px h-5 bg-[#262626] shrink-0" />

      <div className="flex-1 flex items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-md text-[#F2F2F2] text-xs font-medium cursor-pointer hover:bg-[#1A1A1A] hover:border-[#EC4899]/50 transition-all whitespace-nowrap"
            onClick={() => setOpen(!open)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin text-[#EC4899]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#EC4899] shrink-0" />
            )}
            {activeProjectInfo.name}
            <ChevronDown size={12} className="text-[#666666]" />
          </button>

          {open && (
            <div className="absolute top-[calc(100%+6px)] left-0 min-w-[220px] bg-[#111111] border border-[#262626] rounded-lg shadow-2xl z-[200] overflow-hidden" role="listbox">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-[#171717] ${
                    p.id === activeProject ? 'bg-[#EC4899]/10' : ''
                  }`}
                  role="option"
                  aria-selected={p.id === activeProject}
                  onClick={() => {
                    if (p.id !== activeProject) {
                      onProjectChange(p.id);
                    }
                    setOpen(false);
                  }}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      p.id === activeProject ? 'bg-[#EC4899]' : 'bg-[#404040]'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#F2F2F2] text-xs">{p.name}</div>
                    <div className="text-[11px] text-[#737373] mt-0.5">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="relative w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-md text-[#737373] hover:bg-[#171717] hover:text-[#F2F2F2] cursor-pointer transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EC4899] rounded-full" />
        </button>
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#EC4899] to-[#38BDF8] flex items-center justify-center text-xs font-bold text-white cursor-pointer ml-1 shadow-sm"
          title="Admin"
          aria-label="Admin profile"
        >
          A
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
