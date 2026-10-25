export type UserRole = 'Admin' | 'HR' | 'Employee';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dept: string;
  designation: string;
  basic_salary: number;
  gender: 'Male' | 'Female' | 'Other';
  join_date: string;
  status: 'Active' | 'Probation' | 'Exited';
  phone: string;
  avatar?: string;
  address?: string;
}

export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'on_leave' | 'absent' | 'missing_checkout';

export interface AttendanceRecord {
  id: string;
  emp_id: string;
  name: string;
  dept: string;
  date: string;
  status: AttendanceStatus;
  check_in?: string;
  check_out?: string;
  hours: number;
  source: 'Web' | 'Camera + GPS';
  distance_meters?: number;
  face_matched?: boolean;
  confidence?: number;
  liveness_score?: number;
  snapshot_url?: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  emp_id: string;
  name: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  applied_on: string;
  hr_comment?: string;
}

export interface PayrollRecord {
  emp_id: string;
  name: string;
  dept: string;
  designation: string;
  basic: number;
  hra: number;
  medical: number;
  monthly_gross: number;
  working_days: number;
  loss_of_pay_days: number;
  loss_of_pay: number;
  monthly_tax: number;
  net_salary: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'REJECT' | 'FINALIZE' | 'CHECK_IN' | 'CHECK_OUT' | 'LOGIN';
  entity: 'CompanySetup' | 'Employee' | 'Attendance' | 'Leave' | 'Payroll' | 'Auth';
  details: string;
  before_after?: Record<string, unknown>;
}

export interface CompanySettings {
  name: string;
  office_start: string;
  grace_minutes: number;
  half_day_hours: number;
  weekend: string[];
  office_lat: number;
  office_lng: number;
  radius_meters: number;
  venue_name: string;
}

export interface Announcement {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  priority: 'Normal' | 'High';
}
