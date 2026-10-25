import React, { useState } from 'react';
import { UserRole, Employee, AttendanceRecord, LeaveRequest, AuditLogItem, Announcement } from '../types';
import { calculateSalaryBreakdown } from '../mockData';
import {
  TrendingUp,
  Users,
  Clock,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  BellRing
} from 'lucide-react';

interface DashboardViewProps {
  currentRole: UserRole;
  currentEmpId: string;
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  announcements: Announcement[];
  auditLogs: AuditLogItem[];
  selectedDepts: string[];
  onOpenCheckIn: () => void;
  onOpenSmartLeave: () => void;
  onOpenAI: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  currentEmpId,
  employees,
  attendance,
  leaves,
  announcements,
  auditLogs,
  selectedDepts,
  onOpenCheckIn,
  onOpenSmartLeave,
  onOpenAI
}) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Filtered by department selection
  const filteredEmployees = employees.filter((e) => selectedDepts.includes(e.dept));
  const filteredEmpIds = new Set(filteredEmployees.map((e) => e.id));
  const filteredAttendance = attendance.filter((a) => filteredEmpIds.has(a.emp_id));

  // Current date in simulation: 2026-10-24
  const todayIso = '2026-10-24';
  const todayAttendance = filteredAttendance.filter((a) => a.date === todayIso);

  // Core metrics
  const totalHeadcount = filteredEmployees.length;
  const presentToday = todayAttendance.filter((a) => a.status === 'present').length;
  const lateToday = todayAttendance.filter((a) => a.status === 'late').length;
  const onLeaveToday = todayAttendance.filter((a) => a.status === 'on_leave').length;
  const pendingApprovals = leaves.filter((l) => l.status === 'Pending').length;

  // Monthly payroll calculation
  const totalPayrollCost = filteredEmployees.reduce((sum, e) => {
    return sum + calculateSalaryBreakdown(e.basic_salary).monthly_gross;
  }, 0);
  const averageSalary = totalHeadcount > 0 ? totalPayrollCost / totalHeadcount : 0;

  // Attrition YTD formula: Exits in period / Average headcount * 100
  const exitedCount = employees.filter((e) => e.status === 'Exited').length;
  const attritionYTD = ((exitedCount / Math.max(employees.length, 1)) * 100).toFixed(1);

  // Attendance rate formula from Section 7:
  // (present + late + missing_checkout + 0.5 * half_day) / (working_days_records - on_leave)
  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter((a) => a.status === 'present').length;
  const totalLate = filteredAttendance.filter((a) => a.status === 'late').length;
  const halfDayCount = filteredAttendance.filter((a) => a.status === 'half_day').length;
  const onLeaveTotal = filteredAttendance.filter((a) => a.status === 'on_leave').length;

  const validDenominator = Math.max(1, totalRecords - onLeaveTotal);
  const attendanceRate = (((presentCount + totalLate + 0.5 * halfDayCount) / validDenominator) * 100).toFixed(1);

  // Current Employee metrics
  const currentEmp = employees.find((e) => e.id === currentEmpId) || employees[0];
  const myAttendance = attendance.filter((a) => a.emp_id === currentEmpId);
  const myTotalHours = myAttendance.reduce((sum, a) => sum + a.hours, 0);
  const myLates = myAttendance.filter((a) => a.status === 'late').length;
  const mySalary = calculateSalaryBreakdown(currentEmp.basic_salary);

  // Top 5 Late Comers calculation
  const lateCountsByEmp: Record<string, { name: string; dept: string; count: number }> = {};
  filteredAttendance
    .filter((a) => a.status === 'late')
    .forEach((a) => {
      if (!lateCountsByEmp[a.emp_id]) {
        lateCountsByEmp[a.emp_id] = { name: a.name, dept: a.dept, count: 0 };
      }
      lateCountsByEmp[a.emp_id].count += 1;
    });
  const topLateComers = Object.values(lateCountsByEmp)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // AI Summarize handler (Section 4 M8)
  const handleGenerateSummary = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      setIsSummarizing(false);
      setAiSummary(
        `• Active Headcount: ${totalHeadcount} employees active across ${selectedDepts.length} departments with ${attritionYTD}% YTD attrition.\n` +
        `• Punctuality & Turnout: Today's turnout is ${Math.round((presentToday / Math.max(1, totalHeadcount)) * 100)}% with ${lateToday} late arrivals (post-09:15 AM grace).\n` +
        `• Monthly Payroll Commitment: ₨ ${totalPayrollCost.toLocaleString()} gross, with an average employee compensation of ₨ ${Math.round(averageSalary).toLocaleString()}.\n` +
        `• Punctuality Risk: Top late-comers account for ${topLateComers.reduce((s, c) => s + c.count, 0)} total grace violations this cycle.\n` +
        `• Overall Attendance Health: ${attendanceRate}% overall rate adhering to Saylani working day policy.`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* View Title + Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentRole === 'Admin'
              ? 'Executive Company Dashboard'
              : currentRole === 'HR'
              ? 'People Operations & HR Analytics'
              : 'Employee Self-Service Dashboard'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Real-time database calculations · Zaitoon Ashraf IT Park Rules (09:00 start · 15m grace · 150m geofence)
          </p>
        </div>

        {/* AI Summarize action button for Admin & HR */}
        {currentRole !== 'Employee' && (
          <button
            onClick={handleGenerateSummary}
            disabled={isSummarizing}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSummarizing ? 'Computing AI Summary...' : 'Summarize with AI (M8)'}</span>
          </button>
        )}
      </div>

      {/* AI Summary Box */}
      {aiSummary && (
        <div className="p-4 bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
              AI Operational Summary (Grounded in Active Filters)
            </span>
          </div>
          <div className="text-xs text-sky-950 dark:text-sky-100 whitespace-pre-line leading-relaxed font-normal">
            {aiSummary}
          </div>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {currentRole === 'Admin' ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Headcount</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {totalHeadcount}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 100% Retained Active
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Attrition Rate (YTD)</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {attritionYTD}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">
                Formula: Exits ÷ Avg Headcount
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Gross Payroll Cost</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 truncate">
                ₨ {(totalPayrollCost / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-1">
                1.5 × Basic (HRA+Med)
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Average Salary</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 truncate">
                ₨ {Math.round(averageSalary).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">
                Per Employee Mean
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Attendance Rate</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {attendanceRate}%
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">
                Working Days Standard
              </span>
            </div>
          </>
        ) : currentRole === 'HR' ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Present Today</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {presentToday}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">
                {Math.round((presentToday / Math.max(1, totalHeadcount)) * 100)}% of filtered
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Late Arrivals Today</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-500 mt-1">
                {lateToday}
              </div>
              <span className="text-[11px] text-amber-600 font-medium mt-1">
                Checked in post-09:15 AM
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">On Approved Leave</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-1">
                {onLeaveToday}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">
                Annual / Sick / Casual
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Pending Approvals</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-rose-500 mt-1">
                {pendingApprovals}
              </div>
              <span className="text-[11px] text-rose-500 font-medium mt-1">
                Action Required
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Turnout Ratio</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {attendanceRate}%
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">
                Section 7 Formula
              </span>
            </div>
          </>
        ) : (
          /* Employee Self-Service Dashboard */
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Hours Logged (Month)</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {myTotalHours.toFixed(1)} h
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Target: 40h/week</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Late Arrivals</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-500 mt-1">
                {myLates}
              </div>
              <span className="text-[11px] text-amber-600 font-medium mt-1">Grace limit: 15 mins</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Casual Leave Left</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-1">
                8 / 10
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Annual Quota: 10</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Sick Leave Left</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                6 / 8
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Annual Quota: 8</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Net Estimated Pay</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 truncate">
                ₨ {Math.round(mySalary.net_salary).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">October Cycle</span>
            </div>
          </>
        )}
      </div>

      {/* Quick Action Bar for Employee Mode */}
      {currentRole === 'Employee' && (
        <div className="p-4 bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-200 dark:border-sky-800/60 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Check-in & Geofence Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You are currently inside the Zaitoon Ashraf IT Park geofence boundary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCheckIn}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors"
            >
              Camera Check-in (GPS)
            </button>
            <button
              onClick={onOpenSmartLeave}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
            >
              Smart Leave (NLP)
            </button>
            <button
              onClick={onOpenAI}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Ask Assistant
            </button>
          </div>
        </div>
      )}

      {/* Visualizations Section: Donut + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Attendance Breakdown Donut */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Attendance Breakdown (October 2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribution across {filteredAttendance.length} records
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">
              {attendanceRate}% Turnout
            </span>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {(() => {
                  const total = Math.max(filteredAttendance.length, 1);
                  const pPct = (presentCount / total) * 100;
                  const lPct = (totalLate / total) * 100;
                  const hPct = (halfDayCount / total) * 100;
                  const oPct = (onLeaveTotal / total) * 100;

                  const circumference = 2 * Math.PI * 38;
                  const strokeWidth = 14;

                  let accumulated = 0;
                  const pOffset = circumference - (pPct / 100) * circumference;
                  accumulated += pPct;

                  const lDash = (lPct / 100) * circumference;
                  const lOffset = circumference - accumulated * (circumference / 100) + lDash;

                  return (
                    <>
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                      {/* Present - Emerald */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${(pPct / 100) * circumference} ${circumference}`}
                        strokeDashoffset="0"
                      />
                      {/* Late - Amber */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${(lPct / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-(pPct / 100) * circumference}`}
                      />
                      {/* Half Day - Indigo */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${(hPct / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-((pPct + lPct) / 100) * circumference}`}
                      />
                      {/* On Leave - Sky */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#0284c7"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${(oPct / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-((pPct + lPct + hPct) / 100) * circumference}`}
                      />
                    </>
                  );
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400 font-medium">Logged</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-white">
                  {filteredAttendance.length}
                </span>
                <span className="text-[10px] text-slate-400">Records</span>
              </div>
            </div>

            {/* Legend & Stats */}
            <div className="space-y-2 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Present (On-time)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{presentCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Late (&gt;09:15 AM)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{totalLate}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Half Day (&lt;5 hrs)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{halfDayCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Approved Leave</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{onLeaveTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Headcount & Gross Payroll by Department */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Gross Payroll by Department (PKR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregated 1.5 × Basic salary structures
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400">
              ₨ {totalPayrollCost.toLocaleString()} Total
            </span>
          </div>

          <div className="space-y-3 py-1">
            {selectedDepts.map((dept) => {
              const deptEmps = filteredEmployees.filter((e) => e.dept === dept);
              const deptCost = deptEmps.reduce(
                (sum, e) => sum + calculateSalaryBreakdown(e.basic_salary).monthly_gross,
                0
              );
              const maxCost = totalPayrollCost > 0 ? totalPayrollCost : 1;
              const pct = Math.round((deptCost / maxCost) * 100);

              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {dept} ({deptEmps.length} {deptEmps.length === 1 ? 'staff' : 'staff'})
                    </span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                      ₨ {deptCost.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 dark:bg-sky-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Insights & Feed (Top Late Comers & Announcements & Audit Log Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Late-Comers Panel (Section 7 HR Dashboard) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Top Late-Comers (October)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Arrivals past 09:15 AM grace threshold
          </p>

          <div className="space-y-2.5">
            {topLateComers.length > 0 ? (
              topLateComers.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.dept}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {item.count} lates
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No late arrivals recorded.</p>
            )}
          </div>
        </div>

        {/* Company Announcements (M9 Comms) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <BellRing className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Announcements Board
            </h3>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{ann.title}</div>
                <div className="text-[11px] text-slate-400 mb-1">
                  By {ann.author} · {ann.date}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Audit Log Feed (M9 Audit) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Audit Activity
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Immutable</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{log.action}</span>
                  <span className="font-mono">{log.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
