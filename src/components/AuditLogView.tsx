import React, { useState } from 'react';
import { AuditLogItem, Announcement, UserRole } from '../types';
import { BellRing, Shield, PlusCircle, CheckCircle2 } from 'lucide-react';

interface AuditLogViewProps {
  currentRole: UserRole;
  auditLogs: AuditLogItem[];
  announcements: Announcement[];
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  currentRole,
  auditLogs,
  announcements,
  onAddAnnouncement
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddAnnouncement({
      title: newTitle,
      author: `${currentRole} Ops`,
      date: new Date().toISOString().split('T')[0],
      content: newContent,
      priority: 'Normal'
    });

    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Communications & Immutable Audit Log (Module 9)
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
          Company announcements & verifiable audit trail of every state modification
        </p>
      </div>

      {/* Announcements Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-4 h-4 text-sky-500" />
            Company Broadcast Announcements
          </h3>
          {currentRole !== 'Employee' && (
            <button
              onClick={() => setIsPosting(!isPosting)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Broadcast</span>
            </button>
          )}
        </div>

        {isPosting && (
          <form onSubmit={handlePost} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs border border-slate-200 dark:border-slate-700">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Hackathon Judging Schedule Update..."
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Content</label>
              <textarea
                rows={2}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Details of the announcement..."
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 text-white font-semibold rounded-lg"
              >
                Broadcast
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">{ann.title}</div>
              <div className="text-[11px] text-slate-400">
                Posted by {ann.author} · {ann.date}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Immutable Action Audit Trail
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {auditLogs.length} Logged Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{log.actor}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-sky-600 dark:text-sky-400 font-semibold">{log.entity}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
