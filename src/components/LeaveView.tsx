import React, { useState } from 'react';
import { UserRole, Employee, LeaveRequest, LeaveType } from '../types';
import { parseSmartLeaveNLP } from '../mockData';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  ShieldAlert,
  Info
} from 'lucide-react';

interface LeaveViewProps {
  currentRole: UserRole;
  currentEmpId: string;
  employees: Employee[];
  leaves: LeaveRequest[];
  onApplyLeave: (req: Omit<LeaveRequest, 'id' | 'applied_on' | 'status'>) => void;
  onApproveRejectLeave: (id: string, status: 'Approved' | 'Rejected', comment?: string) => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({
  currentRole,
  currentEmpId,
  employees,
  leaves,
  onApplyLeave,
  onApproveRejectLeave
}) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'inbox' | 'policy'>('apply');
  const [smartNlpInput, setSmartNlpInput] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual');
  const [startDate, setStartDate] = useState('2026-10-26');
  const [endDate, setEndDate] = useState('2026-10-27');
  const [reason, setReason] = useState("Sister's wedding reception");
  const [validationError, setValidationError] = useState<string | null>(null);

  // HR comment input state
  const [hrComments, setHrComments] = useState<Record<string, string>>({});

  const currentEmp = employees.find((e) => e.id === currentEmpId) || employees[0];

  // Pre-set smart NLP test queries from Section 4 of brief
  const sampleNlpQueries = [
    "Need next Monday and Tuesday off for my sister's wedding",
    "High fever and doctor prescribed 2 days rest (Medical)",
    "Planning 5 days annual vacation with family next month",
    "Meri tabiyat theek nahi kal chutti chahiye (Roman Urdu)"
  ];

  const handleApplySmartNLP = (query: string) => {
    setSmartNlpInput(query);
    const parsed = parseSmartLeaveNLP(query);
    setLeaveType(parsed.type);
    setStartDate(parsed.startDate);
    setEndDate(parsed.endDate);
    setReason(parsed.reason);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setValidationError('Validation Error (422): End date cannot precede start date.');
      return;
    }

    // Overlap check (Section 3 M5 Rule)
    const hasOverlap = leaves.some(
      (l) =>
        l.emp_id === currentEmp.id &&
        l.status === 'Approved' &&
        !(new Date(l.end_date) < start || new Date(l.start_date) > end)
    );

    if (hasOverlap) {
      setValidationError('Conflict Error (422): Leave dates overlap with an existing approved leave record!');
      return;
    }

    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    onApplyLeave({
      emp_id: currentEmp.id,
      name: currentEmp.name,
      type: leaveType,
      start_date: startDate,
      end_date: endDate,
      days: diffDays,
      reason
    });

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setActiveTab('inbox');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave Management & Smart Leave NLP (M5 + M8)
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Quotas: Annual (14) · Sick (8) · Casual (10) · Unpaid (Unlimited) · Weekends/Holidays excluded
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'apply'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ✍️ Smart Apply Form
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Approval Inbox</span>
            {leaves.filter((l) => l.status === 'Pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'policy'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            📋 Leave Rules
          </button>
        </div>
      </div>

      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Smart Leave NLP & Application Form */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            {/* AI Smart Leave Bar (Section 4 M8) */}
            <div className="p-4 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-sky-950 dark:text-sky-200">
                  Smart Leave Assistant (Natural Language to JSON)
                </span>
              </div>
              <p className="text-xs text-sky-800/80 dark:text-sky-300">
                Type what you need in natural English or Roman Urdu — the AI automatically extracts leave type, dates, and pre-fills the form below.
              </p>

              {/* Sample queries chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sampleNlpQueries.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleApplySmartNLP(q)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-slate-700 dark:text-slate-200 hover:bg-sky-100/60 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={smartNlpInput}
                  onChange={(e) => setSmartNlpInput(e.target.value)}
                  placeholder="e.g. Taking 2 days off for sister's wedding starting next Monday..."
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleApplySmartNLP(smartNlpInput)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shrink-0"
                >
                  Parse & Pre-fill
                </button>
              </div>
            </div>

            {/* Structured Pre-filled Form */}
            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Leave Application Details (Applying as {currentEmp.name})
              </h3>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="Casual">Casual Leave (Quota: 10)</option>
                    <option value="Sick">Sick Leave (Quota: 8)</option>
                    <option value="Annual">Annual Leave (Quota: 14)</option>
                    <option value="Unpaid">Unpaid Leave (Unlimited)</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State clear reason for HR review..."
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Request</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Quota Balance Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentEmp.name}'s Quota Balance
              </h3>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Casual Leave</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">8 / 10 days</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Sick Leave</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">6 / 8 days</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Annual Leave</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">14 / 14 days</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                ⚡ Unpaid leaves are deducted automatically from monthly payroll calculation (Gross ÷ 22 days).
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inbox' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Leave Request Queue & Decisions
            </h3>
            <span className="text-xs text-slate-500">
              {currentRole === 'Employee' ? 'Your Submitted Applications' : 'All Department Submissions'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaves
              .filter((l) => (currentRole === 'Employee' ? l.emp_id === currentEmp.id : true))
              .map((lv) => (
                <div key={lv.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{lv.name}</span>
                        <span className="font-mono text-slate-400">({lv.id})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            lv.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : lv.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {lv.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Type: <strong>{lv.type}</strong> · Duration: <strong>{lv.days} days</strong> ({lv.start_date} to {lv.end_date})
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 italic">
                        "{lv.reason}"
                      </p>
                    </div>

                    {/* HR Action Buttons */}
                    {(currentRole === 'Admin' || currentRole === 'HR') && lv.status === 'Pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onApproveRejectLeave(lv.id, 'Approved', hrComments[lv.id] || 'Approved by HR')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onApproveRejectLeave(lv.id, 'Rejected', hrComments[lv.id] || 'Rejected')}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md flex items-center gap-1 shadow-2xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'policy' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 text-xs leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Saylani Hackathon Leave Policy Rules (Section 3 M5)
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Working Days Only:</strong> Leave deductions count only official business days. Saturday and Sunday weekends and declared holidays are automatically skipped.
            </li>
            <li>
              <strong>Yearly Quotas:</strong> Annual Leave = 14 days, Sick Leave = 8 days, Casual Leave = 10 days.
            </li>
            <li>
              <strong>Unpaid Leave:</strong> Unlimited quota. Unpaid days are fed into payroll and deducted at the calculated daily gross rate ($Gross \div 22$).
            </li>
            <li>
              <strong>Overlap & Over-balance Checks:</strong> Overlapping date requests with an existing approved record or requests exceeding balance return status code <strong>422 Unprocessable Entity</strong>.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
