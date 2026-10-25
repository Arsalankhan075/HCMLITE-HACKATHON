import React, { useState } from 'react';
import { UserRole, Employee, AttendanceRecord, LeaveRequest } from '../types';
import { calculateSalaryBreakdown } from '../mockData';
import {
  Search,
  UserPlus,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Shield,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';

interface EmployeeDirectoryViewProps {
  currentRole: UserRole;
  currentEmpId: string;
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  selectedDepts: string[];
  onAddEmployee: (emp: Partial<Employee>) => void;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  currentRole,
  currentEmpId,
  employees,
  attendance,
  leaves,
  selectedDepts,
  onAddEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmp360, setSelectedEmp360] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // New Employee Form State
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    dept: 'Engineering',
    designation: '',
    basic_salary: 120000,
    gender: 'Male' as const,
    phone: '+92 300 0000000',
    address: 'Karachi, Pakistan',
    status: 'Active' as const,
    role: 'Employee' as const
  });

  // Filtered employees
  const filtered = employees.filter((e) => {
    const matchesDept = selectedDepts.includes(e.dept);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.dept.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Department,Designation,Status,Gender,JoinDate,BasicSalary,GrossSalary\n';
    const rows = filtered
      .map((e) => {
        const sal = calculateSalaryBreakdown(e.basic_salary);
        return `"${e.id}","${e.name}","${e.email}","${e.dept}","${e.designation}","${e.status}","${e.gender}","${e.join_date}",${e.basic_salary},${sal.monthly_gross}`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saylani_hcm_employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.designation) return;

    onAddEmployee({
      ...newEmp,
      join_date: new Date().toISOString().split('T')[0]
    });

    setIsAddModalOpen(false);
    setNewEmp({
      name: '',
      email: '',
      dept: 'Engineering',
      designation: '',
      basic_salary: 120000,
      gender: 'Male',
      phone: '+92 300 0000000',
      address: 'Karachi, Pakistan',
      status: 'Active',
      role: 'Employee'
    });
  };

  return (
    <div className="space-y-5">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Employee Directory & 360 Profiles
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Module 3 · Centralized staff repository with RBAC permission boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole !== 'Employee' && (
            <>
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>CSV Import (Dry Run)</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Employee</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by employee name, code (e.g. EMP-003), designation, or department..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 shadow-2xs"
        />
      </div>

      {/* Employee Data Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Employee Details</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Compensation (PKR)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((emp) => {
                const sal = calculateSalaryBreakdown(emp.basic_salary);
                const isSelf = emp.id === currentEmpId;
                const canViewSalary = currentRole === 'Admin' || currentRole === 'HR' || isSelf;

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">
                      {emp.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{emp.dept}</div>
                      <div className="text-[11px] text-slate-400">{emp.designation}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {emp.join_date}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canViewSalary ? (
                        <div>
                          <div className="font-mono font-semibold text-slate-900 dark:text-white">
                            ₨ {sal.monthly_gross.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">1.5 × Basic</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono italic">
                          🔒 Confidential
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedEmp360(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360 Profile</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee 360 Modal Drawer */}
      {selectedEmp360 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedEmp360.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedEmp360.name} (Employee 360)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: {selectedEmp360.id} · {selectedEmp360.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmp360(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmp360.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmp360.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmp360.address || 'Karachi, Pakistan'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dept: <strong>{selectedEmp360.dept}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Access Role: <strong>{selectedEmp360.role}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span>Joined: <strong>{selectedEmp360.join_date}</strong> ({selectedEmp360.status})</span>
                  </div>
                </div>
              </div>

              {/* Salary Structure (Section 3 M6 Rule) */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  Compensation & Salary Structure (Gross = 1.5 × Basic)
                </h4>
                {currentRole === 'Admin' || currentRole === 'HR' || selectedEmp360.id === currentEmpId ? (
                  (() => {
                    const sal = calculateSalaryBreakdown(selectedEmp360.basic_salary);
                    return (
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Basic Salary</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ₨ {sal.basic.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">HRA (40%)</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ₨ {sal.hra.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Medical (10%)</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ₨ {sal.medical.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-sky-50 dark:bg-sky-950/50 rounded-lg border border-sky-200 dark:border-sky-800">
                          <span className="text-[10px] text-sky-600 block font-semibold">Total Gross (1.5x)</span>
                          <span className="font-mono font-bold text-sky-700 dark:text-sky-300 text-sm">
                            ₨ {sal.monthly_gross.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 italic">
                    🔒 Salary information is restricted by RBAC rules to HR and Admin roles.
                  </div>
                )}
              </div>

              {/* Attendance Log Preview */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  Recent Attendance Logs (October)
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-36 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">In</th>
                        <th className="p-2">Out</th>
                        <th className="p-2">Hours</th>
                        <th className="p-2">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {attendance
                        .filter((a) => a.emp_id === selectedEmp360.id)
                        .slice(0, 5)
                        .map((att) => (
                          <tr key={att.id}>
                            <td className="p-2 font-mono">{att.date}</td>
                            <td className="p-2 font-semibold capitalize">{att.status}</td>
                            <td className="p-2 font-mono">{att.check_in || '-'}</td>
                            <td className="p-2 font-mono">{att.check_out || '-'}</td>
                            <td className="p-2 font-mono">{att.hours} h</td>
                            <td className="p-2 text-slate-400">{att.source}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Register New Employee (M3)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg text-sky-900 dark:text-sky-200">
                ⚡ Creating this employee automatically issues their login account with a temporary password (must change on first sign-in).
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="e.g. Asad Rehman"
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Company Email</label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="asad@saylaniit.com"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    value={newEmp.dept}
                    onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Basic Salary (PKR)</label>
                  <input
                    type="number"
                    min="30000"
                    step="5000"
                    required
                    value={newEmp.basic_salary}
                    onChange={(e) => setNewEmp({ ...newEmp, basic_salary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
                >
                  Create Employee & Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Dry Run Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  CSV Import Dry-Run Validator (M3 Rule)
                </h3>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Simulating upload dry run for <code>staff_batch_q4.csv</code> (3 rows analyzed):
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                      Row 1: Farhan Akhtar · Engineering
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Valid email, known dept, positive basic salary (₨ 140,000). PASS.
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-900 dark:text-amber-200">
                      Row 2: Rehan Sheikh · Invalid Department "GrowthLab"
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-300">
                      Warning: Department not recognized. Will map to fallback "Marketing".
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                      Row 3: Nida Batool · Product
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Valid email, known dept, positive basic salary (₨ 165,000). PASS.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg"
                >
                  Acknowledge & Close Dry Run
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
