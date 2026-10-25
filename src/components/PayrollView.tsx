import React, { useState } from 'react';
import { UserRole, Employee, PayrollRecord } from '../types';
import { calculateSalaryBreakdown } from '../mockData';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  Printer,
  Download,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Building,
  ShieldCheck
} from 'lucide-react';

interface PayrollViewProps {
  currentRole: UserRole;
  currentEmpId: string;
  employees: Employee[];
  selectedDepts: string[];
  isLocked: boolean;
  onFinalizePayroll: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  currentRole,
  currentEmpId,
  employees,
  selectedDepts,
  isLocked,
  onFinalizePayroll
}) => {
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((e) => selectedDepts.includes(e.dept));
  const currentEmp = employees.find((e) => e.id === currentEmpId) || employees[0];

  // RBAC scope for visible employees
  const displayEmployees =
    currentRole === 'Employee'
      ? filteredEmployees.filter((e) => e.id === currentEmpId)
      : filteredEmployees;

  const totalGrossCost = displayEmployees.reduce(
    (sum, e) => sum + calculateSalaryBreakdown(e.basic_salary).monthly_gross,
    0
  );
  const totalTaxDeductions = displayEmployees.reduce(
    (sum, e) => sum + calculateSalaryBreakdown(e.basic_salary).monthly_tax,
    0
  );
  const totalNetDisbursement = displayEmployees.reduce(
    (sum, e) => sum + calculateSalaryBreakdown(e.basic_salary).net_salary,
    0
  );

  const handleFinalizeClick = () => {
    onFinalizePayroll();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payroll Lite & Payslip Generation (M6)
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Formula: Gross = 1.5 × Basic (HRA 40% + Medical 10%) · Section 3 Pakistani Tax Slabs Applied
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLocked ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>October Cycle Finalized & Locked</span>
            </div>
          ) : currentRole === 'Admin' ? (
            <button
              onClick={handleFinalizeClick}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Finalize & Lock Payroll (Admin Only)</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 italic">
              HR Draft View · Pending Admin Lock
            </div>
          )}
        </div>
      </div>

      {/* Aggregate Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Monthly Gross</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₨ {totalGrossCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Basic + Allowances</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Income Tax Withheld</span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">
            ₨ {Math.round(totalTaxDeductions).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Section 3 Tax Slabs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Net Bank Disbursement</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            ₨ {Math.round(totalNetDisbursement).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600">Net Payable Amount</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            October 2026 Monthly Payroll Ledger
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {displayEmployees.length} Records Processed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Basic</th>
                <th className="py-3 px-4 text-right">HRA (40%)</th>
                <th className="py-3 px-4 text-right">Med (10%)</th>
                <th className="py-3 px-4 text-right font-bold">Gross (1.5x)</th>
                <th className="py-3 px-4 text-right text-amber-600">Tax Slab</th>
                <th className="py-3 px-4 text-right font-bold text-emerald-600">Net Payable</th>
                <th className="py-3 px-4 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayEmployees.map((emp) => {
                const sal = calculateSalaryBreakdown(emp.basic_salary);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{emp.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{emp.dept}</td>
                    <td className="py-3 px-4 font-mono text-right">₨ {sal.basic.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-right text-slate-500">₨ {sal.hra.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-right text-slate-500">₨ {sal.medical.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-slate-900 dark:text-white">
                      ₨ {sal.monthly_gross.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-amber-600">
                      ₨ {Math.round(sal.monthly_tax).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ₨ {Math.round(sal.net_salary).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedPayslipEmp(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 rounded-md transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Corporate Payslip Modal */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-xs font-semibold text-slate-500">
                Official Compensation Statement
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Print Payslip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPayslipEmp(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payslip body */}
            <div className="p-6 space-y-5 text-xs text-slate-800 dark:text-slate-200">
              {/* Company Header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <h2 className="text-base font-bold text-sky-600 dark:text-sky-400">
                    Saylani Tech Hub - HCM Lite
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zaitoon Ashraf IT Park, Karachi · NTN: 9021834-7
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">Pay Slip: October 2026</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    {isLocked ? '✓ Finalized & Released' : 'Draft Copy'}
                  </div>
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg">
                <div>
                  <p><strong>Employee:</strong> {selectedPayslipEmp.name}</p>
                  <p><strong>ID:</strong> {selectedPayslipEmp.id}</p>
                  <p><strong>Department:</strong> {selectedPayslipEmp.dept}</p>
                </div>
                <div>
                  <p><strong>Designation:</strong> {selectedPayslipEmp.designation}</p>
                  <p><strong>Working Days:</strong> 22 Days</p>
                  <p><strong>Disbursement:</strong> Direct Bank Transfer</p>
                </div>
              </div>

              {/* Itemized Table */}
              {(() => {
                const s = calculateSalaryBreakdown(selectedPayslipEmp.basic_salary);
                return (
                  <div>
                    <table className="w-full border-collapse border border-slate-200 dark:border-slate-700 text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <th className="p-2 border border-slate-200 dark:border-slate-700 text-left">Earnings</th>
                          <th className="p-2 border border-slate-200 dark:border-slate-700 text-right">Amount (PKR)</th>
                          <th className="p-2 border border-slate-200 dark:border-slate-700 text-left">Deductions</th>
                          <th className="p-2 border border-slate-200 dark:border-slate-700 text-right">Amount (PKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Basic Salary</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">
                            ₨ {s.basic.toLocaleString()}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Income Tax (Pak Slabs)</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right text-amber-600">
                            ₨ {Math.round(s.monthly_tax).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">House Rent (HRA 40%)</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">
                            ₨ {s.hra.toLocaleString()}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Loss of Pay (Absences)</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">
                            ₨ {Math.round(s.loss_of_pay).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Medical Allowance (10%)</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">
                            ₨ {s.medical.toLocaleString()}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">-</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">-</td>
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold">
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Total Gross Earnings</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right">
                            ₨ {s.monthly_gross.toLocaleString()}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">Total Deductions</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono text-right text-amber-600">
                            ₨ {Math.round(s.monthly_tax + s.loss_of_pay).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-bold">Net Bank Disbursement:</span>
                      </div>
                      <span className="font-mono font-bold text-base text-emerald-700 dark:text-emerald-200">
                        ₨ {Math.round(s.net_salary).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
