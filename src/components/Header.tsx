import React from 'react';
import { UserRole } from '../types';
import { Terminal, Code, Sparkles, Moon, Sun, Shield, UserCheck, Users } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenStreamlitModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenStreamlitModal,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
          HCM
        </div>
        <div>
          <a href="#" className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
            Saylani HCM Lite
          </a>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            Hackathon 2026 · Zaitoon Ashraf IT Park
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation & Role Switcher */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Active Role:
        </span>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => onRoleChange('Admin')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'Admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            onClick={() => onRoleChange('HR')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'HR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            HR Ops
          </button>
          <button
            onClick={() => onRoleChange('Employee')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'Employee'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Employee
          </button>
        </div>
      </div>

      {/* Zone 3: 1 Primary Action + Theme Toggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light/Dark Theme"
          aria-label="Toggle Light/Dark Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenStreamlitModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Code className="w-3.5 h-3.5 text-sky-400 dark:text-white" />
          <span>Streamlit Code & Export</span>
        </button>
      </div>
    </header>
  );
};
