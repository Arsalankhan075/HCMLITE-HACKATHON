import React from 'react';
import { UserRole, Employee } from '../types';
import {
  LayoutDashboard,
  Users,
  Camera,
  CalendarDays,
  Receipt,
  Bot,
  Building2,
  FileText,
  Filter,
  MapPin,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentEmpId: string;
  onEmpChange: (empId: string) => void;
  employees: Employee[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedDepts: string[];
  onToggleDept: (dept: string) => void;
  allDepts: string[];
  statusFilter: string;
  onChangeStatusFilter: (status: string) => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentEmpId,
  onEmpChange,
  employees,
  activeTab,
  onSelectTab,
  selectedDepts,
  onToggleDept,
  allDepts,
  statusFilter,
  onChangeStatusFilter,
  onResetData
}) => {
  // Navigation modules according to RBAC in Section 8 of brief
  const navItems = [
    { id: 'dashboard', label: 'Dashboards & Analytics', icon: LayoutDashboard, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'employees', label: 'Employee Directory & 360', icon: Users, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'attendance', label: 'Attendance & Camera GPS', icon: Camera, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'leave', label: 'Leave & Smart Leave NLP', icon: CalendarDays, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'payroll', label: 'Payroll Lite & Payslip', icon: Receipt, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'ai', label: 'AI Assistant (Tool Calling)', icon: Bot, roles: ['Admin', 'HR', 'Employee'] },
    { id: 'setup', label: 'Org Setup & Rules', icon: Building2, roles: ['Admin'] },
    { id: 'audit', label: 'Comms & Audit Log', icon: FileText, roles: ['Admin', 'HR'] }
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(currentRole));
  const currentEmp = employees.find((e) => e.id === currentEmpId) || employees[0];

  return (
    <aside className="w-72 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto">
      {/* Streamlit Brand Kicker */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Streamlit Dashboard Mode
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            Live Reactive
          </span>
        </div>

        {/* Current User Card */}
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentRole === 'Employee' ? currentEmp.name.charAt(0) : currentRole.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentRole === 'Employee' ? currentEmp.name : `${currentRole} Console`}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentRole === 'Employee' ? currentEmp.designation : `Scoped: ${currentRole} Authority`}
              </div>
            </div>
          </div>

          {currentRole === 'Employee' && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Switch Simulated Employee:
              </label>
              <select
                value={currentEmpId}
                onChange={(e) => onEmpChange(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.dept})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Modules */}
      <div className="p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1.5">
          Modules (M1–M9)
        </span>
        <nav className="space-y-0.5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Interactive Filters (Streamlit Style) */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 px-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Interactive Filters
          </span>
        </div>

        {/* Department Multiselect */}
        <div className="mb-3 px-2">
          <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Departments ({selectedDepts.length}/{allDepts.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {allDepts.map((d) => {
              const isSelected = selectedDepts.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => onToggleDept(d)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter */}
        <div className="px-2 mb-3">
          <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
            Employment Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onChangeStatusFilter(e.target.value)}
            className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Probation">Probation Only</option>
          </select>
        </div>
      </div>

      {/* Geofence & Location Card */}
      <div className="mt-auto p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Zaitoon Ashraf IT Park
            </span>
            <span className="text-[11px] text-slate-500 block">
              Radius: 150m · Haversine Geofenced
            </span>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset to Fresh Install</span>
        </button>
      </div>
    </aside>
  );
};
