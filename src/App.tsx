import React, { useState, useEffect } from 'react';
import { UserRole, Employee, AttendanceRecord, LeaveRequest, CompanySettings, Announcement, AuditLogItem } from './types';
import {
  INITIAL_SETTINGS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  generateInitialAttendance
} from './mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EmployeeDirectoryView } from './components/EmployeeDirectoryView';
import { AttendanceView } from './components/AttendanceView';
import { LeaveView } from './components/LeaveView';
import { PayrollView } from './components/PayrollView';
import { AIAssistantView } from './components/AIAssistantView';
import { OrgSetupView } from './components/OrgSetupView';
import { AuditLogView } from './components/AuditLogView';
import { StreamlitExportModal } from './components/StreamlitExportModal';

export default function App() {
  // App state
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [currentEmpId, setCurrentEmpId] = useState<string>('EMP-003'); // Muhammad Hamza
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isStreamlitModalOpen, setIsStreamlitModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Data Collections
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateInitialAttendance());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [isPayrollLocked, setIsPayrollLocked] = useState<boolean>(false);

  // Interactive Sidebar Filters
  const allDepts = Array.from(new Set(employees.map((e) => e.dept))).sort();
  const [selectedDepts, setSelectedDepts] = useState<string[]>(allDepts);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter department toggle
  const handleToggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? (prev.length > 1 ? prev.filter((d) => d !== dept) : prev) : [...prev, dept]
    );
  };

  // Reset to Fresh Install (Judges' requirement: Figure 4)
  const handleResetData = () => {
    if (window.confirm('Reset application to clean hackathon starting state?')) {
      setEmployees(INITIAL_EMPLOYEES);
      setAttendance(generateInitialAttendance());
      setLeaves(INITIAL_LEAVES);
      setIsPayrollLocked(false);
      setAuditLogs([
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'Admin',
          action: 'CREATE',
          entity: 'CompanySetup',
          details: 'Application reset to initial judging demo state.'
        }
      ]);
    }
  };

  // Action handlers
  const handleAddEmployee = (newEmpData: Partial<Employee>) => {
    const newId = `EMP-0${employees.length + 1 < 10 ? '0' + (employees.length + 1) : employees.length + 1}`;
    const fullEmp: Employee = {
      id: newId,
      name: newEmpData.name || 'New Employee',
      email: newEmpData.email || `${newId.toLowerCase()}@saylaniit.com`,
      role: newEmpData.role || 'Employee',
      dept: newEmpData.dept || 'Engineering',
      designation: newEmpData.designation || 'Specialist',
      basic_salary: newEmpData.basic_salary || 120000,
      gender: newEmpData.gender || 'Male',
      join_date: newEmpData.join_date || '2026-10-24',
      status: newEmpData.status || 'Active',
      phone: newEmpData.phone || '+92 300 0000000',
      address: newEmpData.address || 'Karachi, Pakistan'
    };

    setEmployees((prev) => [...prev, fullEmp]);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${currentRole} Ops`,
        action: 'CREATE',
        entity: 'Employee',
        details: `Registered ${fullEmp.name} (${fullEmp.id}) with initial temporary password.`
      },
      ...prev
    ]);
  };

  const handleRecordAttendance = (newRecord: AttendanceRecord) => {
    // If today's record already exists for this employee, update it; otherwise prepend it
    setAttendance((prev) => {
      const existingIdx = prev.findIndex((a) => a.emp_id === newRecord.emp_id && a.date === newRecord.date);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = newRecord;
        return copy;
      }
      return [newRecord, ...prev];
    });

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${newRecord.name} (${currentRole})`,
        action: 'CHECK_IN',
        entity: 'Attendance',
        details: `Marked daily check-in via ${newRecord.source}. Status: ${newRecord.status.toUpperCase()} at ${newRecord.check_in || '09:00'}.`
      },
      ...prev
    ]);
  };

  const handleCheckOut = (empId: string, checkOutTime: string, hours: number, newStatus: any) => {
    let updatedEmployeeName = 'Employee';
    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.emp_id === empId && rec.date === '2026-10-24') {
          updatedEmployeeName = rec.name;
          return {
            ...rec,
            check_out: checkOutTime,
            hours,
            status: newStatus
          };
        }
        return rec;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${updatedEmployeeName} (${currentRole})`,
        action: 'CHECK_OUT',
        entity: 'Attendance',
        details: `Marked daily check-out at ${checkOutTime}. Shift duration: ${hours.toFixed(1)} hrs. Final Status: ${newStatus.toUpperCase()}`
      },
      ...prev
    ]);
  };

  const handleApplyLeave = (req: Omit<LeaveRequest, 'id' | 'applied_on' | 'status'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `LV-${leaves.length + 101}`,
      applied_on: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setLeaves((prev) => [newLeave, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${req.name}`,
        action: 'CREATE',
        entity: 'Leave',
        details: `Applied for ${req.type} leave (${req.days} days) from ${req.start_date} to ${req.end_date}.`
      },
      ...prev
    ]);
  };

  const handleApproveRejectLeave = (id: string, status: 'Approved' | 'Rejected', comment?: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, hr_comment: comment } : l))
    );

    const targetLeave = leaves.find((l) => l.id === id);
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${currentRole} Operations`,
        action: status === 'Approved' ? 'APPROVE' : 'REJECT',
        entity: 'Leave',
        details: `${status} leave ${id} for ${targetLeave?.name || 'employee'}. Comment: ${comment || 'N/A'}`
      },
      ...prev
    ]);
  };

  const handleFinalizePayroll = () => {
    setIsPayrollLocked(true);
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'Admin',
        action: 'FINALIZE',
        entity: 'Payroll',
        details: 'Locked and finalized October 2026 payroll run. Deductions and tax slabs locked.'
      },
      ...prev
    ]);
  };

  const handleSaveSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'Admin',
        action: 'UPDATE',
        entity: 'CompanySetup',
        details: `Updated office start to ${newSettings.office_start}, grace to ${newSettings.grace_minutes}m, geofence radius to ${newSettings.radius_meters}m.`
      },
      ...prev
    ]);
  };

  const handleAddAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ANN-${announcements.length + 1}`
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        onOpenStreamlitModal={() => setIsStreamlitModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Streamlit-inspired Interactive Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentEmpId={currentEmpId}
          onEmpChange={(empId) => setCurrentEmpId(empId)}
          employees={employees}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          selectedDepts={selectedDepts}
          onToggleDept={handleToggleDept}
          allDepts={allDepts}
          statusFilter={statusFilter}
          onChangeStatusFilter={(st) => setStatusFilter(st)}
          onResetData={handleResetData}
        />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                attendance={attendance}
                leaves={leaves}
                announcements={announcements}
                auditLogs={auditLogs}
                selectedDepts={selectedDepts}
                onOpenCheckIn={() => setActiveTab('attendance')}
                onOpenSmartLeave={() => setActiveTab('leave')}
                onOpenAI={() => setActiveTab('ai')}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeeDirectoryView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                attendance={attendance}
                leaves={leaves}
                selectedDepts={selectedDepts}
                onAddEmployee={handleAddEmployee}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                attendance={attendance}
                companySettings={companySettings}
                onRecordAttendance={handleRecordAttendance}
                onCheckOut={handleCheckOut}
              />
            )}

            {activeTab === 'leave' && (
              <LeaveView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                leaves={leaves}
                onApplyLeave={handleApplyLeave}
                onApproveRejectLeave={handleApproveRejectLeave}
              />
            )}

            {activeTab === 'payroll' && (
              <PayrollView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                selectedDepts={selectedDepts}
                isLocked={isPayrollLocked}
                onFinalizePayroll={handleFinalizePayroll}
              />
            )}

            {activeTab === 'ai' && (
              <AIAssistantView
                currentRole={currentRole}
                currentEmpId={currentEmpId}
                employees={employees}
                attendance={attendance}
                leaves={leaves}
              />
            )}

            {activeTab === 'setup' && (
              <OrgSetupView
                settings={companySettings}
                onSaveSettings={handleSaveSettings}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogView
                currentRole={currentRole}
                auditLogs={auditLogs}
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
              />
            )}
          </div>
        </main>
      </div>

      {/* Streamlit Python Source & Export Modal */}
      <StreamlitExportModal
        isOpen={isStreamlitModalOpen}
        onClose={() => setIsStreamlitModalOpen(false)}
      />
    </div>
  );
}
