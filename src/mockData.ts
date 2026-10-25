import { Employee, AttendanceRecord, LeaveRequest, CompanySettings, Announcement, AuditLogItem, PayrollRecord, LeaveType } from './types';

export const INITIAL_SETTINGS: CompanySettings = {
  name: 'Saylani Tech Hub',
  office_start: '09:00',
  grace_minutes: 15,
  half_day_hours: 5.0,
  weekend: ['Saturday', 'Sunday'],
  office_lat: 24.8607,
  office_lng: 67.0011,
  radius_meters: 150,
  venue_name: 'Zaitoon Ashraf IT Park, Karachi'
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Bilal Siddiqui',
    email: 'bilal@saylaniit.com',
    role: 'Admin',
    dept: 'Executive',
    designation: 'Director People & Operations',
    basic_salary: 260000,
    gender: 'Male',
    join_date: '2023-11-01',
    status: 'Active',
    phone: '+92 300 1234567',
    address: 'Gulshan-e-Iqbal, Block 4, Karachi'
  },
  {
    id: 'EMP-002',
    name: 'Ayesha Mansoor',
    email: 'ayesha@saylaniit.com',
    role: 'HR',
    dept: 'HR',
    designation: 'People Operations Lead',
    basic_salary: 145000,
    gender: 'Female',
    join_date: '2024-03-01',
    status: 'Active',
    phone: '+92 301 2345678',
    address: 'Federal B Area, Block 14, Karachi'
  },
  {
    id: 'EMP-003',
    name: 'Muhammad Hamza',
    email: 'hamza@saylaniit.com',
    role: 'Employee',
    dept: 'Engineering',
    designation: 'Senior Full-Stack Engineer',
    basic_salary: 175000,
    gender: 'Male',
    join_date: '2024-01-15',
    status: 'Active',
    phone: '+92 302 3456789',
    address: 'Nazimabad No. 3, Karachi'
  },
  {
    id: 'EMP-004',
    name: 'Zainab Fatima',
    email: 'zainab@saylaniit.com',
    role: 'Employee',
    dept: 'Engineering',
    designation: 'AI / LLM Systems Engineer',
    basic_salary: 160000,
    gender: 'Female',
    join_date: '2024-06-15',
    status: 'Active',
    phone: '+92 303 4567890',
    address: 'DHA Phase 6, Karachi'
  },
  {
    id: 'EMP-005',
    name: 'Tariq Mehmood',
    email: 'tariq@saylaniit.com',
    role: 'Employee',
    dept: 'Product',
    designation: 'Lead Product Manager',
    basic_salary: 170000,
    gender: 'Male',
    join_date: '2024-02-10',
    status: 'Active',
    phone: '+92 304 5678901',
    address: 'Bahadurabad, Karachi'
  },
  {
    id: 'EMP-006',
    name: 'Sana Rasheed',
    email: 'sana@saylaniit.com',
    role: 'Employee',
    dept: 'Marketing',
    designation: 'Growth & Social Lead',
    basic_salary: 100000,
    gender: 'Female',
    join_date: '2024-09-01',
    status: 'Active',
    phone: '+92 305 6789012',
    address: 'Clifton Block 2, Karachi'
  },
  {
    id: 'EMP-007',
    name: 'Usman Ghani',
    email: 'usman@saylaniit.com',
    role: 'Employee',
    dept: 'Finance',
    designation: 'Senior Financial Analyst',
    basic_salary: 125000,
    gender: 'Male',
    join_date: '2024-08-01',
    status: 'Active',
    phone: '+92 306 7890123',
    address: 'North Nazimabad, Block J, Karachi'
  },
  {
    id: 'EMP-008',
    name: 'Hassan Raza',
    email: 'hassan@saylaniit.com',
    role: 'Employee',
    dept: 'Operations',
    designation: 'Infrastructure Administrator',
    basic_salary: 95000,
    gender: 'Male',
    join_date: '2025-01-10',
    status: 'Active',
    phone: '+92 307 8901234',
    address: 'Gulshan-e-Maymar, Karachi'
  },
  {
    id: 'EMP-009',
    name: 'Maryam Khan',
    email: 'maryam@saylaniit.com',
    role: 'Employee',
    dept: 'Engineering',
    designation: 'Frontend UX Developer',
    basic_salary: 130000,
    gender: 'Female',
    join_date: '2025-02-01',
    status: 'Probation',
    phone: '+92 308 9012345',
    address: 'Malir Cantt, Karachi'
  },
  {
    id: 'EMP-010',
    name: 'Ali Murtaza',
    email: 'ali@saylaniit.com',
    role: 'Employee',
    dept: 'Marketing',
    designation: 'Creative UI Designer',
    basic_salary: 115000,
    gender: 'Male',
    join_date: '2024-10-15',
    status: 'Active',
    phone: '+92 309 0123456',
    address: 'PECHS Block 6, Karachi'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-101',
    emp_id: 'EMP-003',
    name: 'Muhammad Hamza',
    type: 'Casual',
    start_date: '2026-10-26',
    end_date: '2026-10-27',
    days: 2,
    reason: "Sister's wedding ceremony and family reception",
    status: 'Pending',
    applied_on: '2026-10-24'
  },
  {
    id: 'LV-102',
    emp_id: 'EMP-006',
    name: 'Sana Rasheed',
    type: 'Sick',
    start_date: '2026-10-20',
    end_date: '2026-10-21',
    days: 2,
    reason: 'Severe viral influenza and doctor recommended bed rest',
    status: 'Approved',
    applied_on: '2026-10-19',
    hr_comment: 'Approved. Please submit doctor prescription on return.'
  },
  {
    id: 'LV-103',
    emp_id: 'EMP-005',
    name: 'Tariq Mehmood',
    type: 'Annual',
    start_date: '2026-10-05',
    end_date: '2026-10-09',
    days: 5,
    reason: 'Annual family retreat to northern mountains',
    status: 'Approved',
    applied_on: '2026-09-28',
    hr_comment: 'Approved with backup coverage confirmed.'
  },
  {
    id: 'LV-104',
    emp_id: 'EMP-008',
    name: 'Hassan Raza',
    type: 'Casual',
    start_date: '2026-10-24',
    end_date: '2026-10-24',
    days: 1,
    reason: 'Urgent civil documentation renewal at NADRA Mega Centre',
    status: 'Approved',
    applied_on: '2026-10-23',
    hr_comment: 'Approved.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-1',
    title: '🏆 Saylani Hackathon 2026: HCM Lite is LIVE!',
    author: 'Admin & HR Ops',
    date: '2026-10-24',
    priority: 'High',
    content: 'Welcome teams to Zaitoon Ashraf IT Park! Today we judge core flows, analytics consistency, camera geofence attendance, and the AI assistant.'
  },
  {
    id: 'ANN-2',
    title: '📍 Camera Check-In Geofence Active (150m Radius)',
    author: 'Bilal Siddiqui (Admin)',
    date: '2026-10-22',
    priority: 'Normal',
    content: 'All camera check-ins are verified by Haversine GPS distance (<=150m from Zaitoon Ashraf IT Park coordinates) and AI face presence detection.'
  },
  {
    id: 'ANN-3',
    title: '💰 October Payroll Locking Cycle',
    author: 'Ayesha Mansoor (HR)',
    date: '2026-10-20',
    priority: 'Normal',
    content: 'HR payroll draft is submitted for Admin review. Finalized runs will lock all salary adjustments for October.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-24 09:00:15',
    actor: 'Bilal Siddiqui (Admin)',
    action: 'CREATE',
    entity: 'CompanySetup',
    details: 'Initialized company parameters: 09:00 start, 15m grace window, 150m office radius.'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-24 09:12:40',
    actor: 'Ayesha Mansoor (HR)',
    action: 'CREATE',
    entity: 'Employee',
    details: 'Registered Maryam Khan (EMP-009) with temporary password, status: Probation.'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-24 09:20:11',
    actor: 'Muhammad Hamza (Employee)',
    action: 'CHECK_IN',
    entity: 'Attendance',
    details: 'Camera + GPS check-in verified. Distance: 18.4m from Zaitoon Ashraf IT Park. Status: PRESENT'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-10-24 10:15:32',
    actor: 'Ayesha Mansoor (HR)',
    action: 'APPROVE',
    entity: 'Leave',
    details: 'Approved Sick leave application LV-102 for Sana Rasheed (2 days).'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-10-24 11:30:00',
    actor: 'Bilal Siddiqui (Admin)',
    action: 'FINALIZE',
    entity: 'Payroll',
    details: 'Locked and finalized September payroll run for 10 employees.'
  }
];

// Generate attendance records for October 2026 (days 1 to 24)
export function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statusCycle: ('present' | 'present' | 'present' | 'late' | 'half_day' | 'on_leave')[] = [
    'present', 'present', 'present', 'late', 'half_day', 'on_leave'
  ];

  INITIAL_EMPLOYEES.forEach((emp) => {
    for (let day = 1; day <= 24; day++) {
      const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
      const dayOfWeek = new Date(2026, 9, day).getDay(); // 0 is Sunday, 6 is Saturday
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const hash = (emp.id.charCodeAt(6) + day * 7) % statusCycle.length;
      const status = day === 24 ? (emp.id === 'EMP-005' ? 'late' : emp.id === 'EMP-008' ? 'on_leave' : 'present') : statusCycle[hash];

      let checkIn: string | undefined = '08:52';
      let checkOut: string | undefined = '17:35';
      let hours = 8.5;

      if (status === 'late') {
        checkIn = '09:28';
        checkOut = '17:40';
        hours = 8.0;
      } else if (status === 'half_day') {
        checkIn = '10:15';
        checkOut = '14:30';
        hours = 4.25;
      } else if (status === 'on_leave') {
        checkIn = undefined;
        checkOut = undefined;
        hours = 0;
      }

      records.push({
        id: `ATT-${emp.id}-${day}`,
        emp_id: emp.id,
        name: emp.name,
        dept: emp.dept,
        date: dateStr,
        status,
        check_in: checkIn,
        check_out: checkOut,
        hours,
        source: day % 2 === 0 ? 'Camera + GPS' : 'Web',
        distance_meters: day % 2 === 0 ? Math.floor(15 + (day * 3) % 80) : undefined,
        face_matched: day % 2 === 0 ? true : undefined
      });
    }
  });

  return records;
}

/**
 * Gross = 1.5 * basic (HRA 40%, Medical 10%)
 * Per day = gross / working days
 * Deduct absent + unpaid + 0.5 * half days
 * Pakistani Tax Slabs:
 *   0 to 600k: 0%
 *   600k to 1.2M: 5% of excess over 600k
 *   1.2M to 2.4M: 30k + 15% of excess over 1.2M
 *   2.4M to 3.6M: 210k + 25% of excess over 2.4M
 *   > 3.6M: 510k + 35% of excess over 3.6M
 */
export function calculateSalaryBreakdown(
  basic: number,
  workingDays: number = 22,
  absentDays: number = 0,
  unpaidDays: number = 0,
  halfDays: number = 0
): {
  basic: number;
  hra: number;
  medical: number;
  monthly_gross: number;
  per_day_rate: number;
  loss_of_pay: number;
  earned_gross: number;
  monthly_tax: number;
  net_salary: number;
} {
  const hra = basic * 0.40;
  const medical = basic * 0.10;
  const monthly_gross = basic + hra + medical; // 1.5 * basic

  const per_day_rate = monthly_gross / Math.max(workingDays, 1);
  const lopDays = absentDays + unpaidDays + 0.5 * halfDays;
  const loss_of_pay = lopDays * per_day_rate;
  const earned_gross = Math.max(0, monthly_gross - loss_of_pay);

  const annual_gross = monthly_gross * 12;
  let annual_tax = 0;

  if (annual_gross <= 600000) {
    annual_tax = 0;
  } else if (annual_gross <= 1200000) {
    annual_tax = (annual_gross - 600000) * 0.05;
  } else if (annual_gross <= 2400000) {
    annual_tax = 30000 + (annual_gross - 1200000) * 0.15;
  } else if (annual_gross <= 3600000) {
    annual_tax = 210000 + (annual_gross - 2400000) * 0.25;
  } else {
    annual_tax = 510000 + (annual_gross - 3600000) * 0.35;
  }

  const monthly_tax = annual_tax / 12;
  const net_salary = Math.max(0, earned_gross - monthly_tax);

  return {
    basic,
    hra,
    medical,
    monthly_gross,
    per_day_rate,
    loss_of_pay,
    earned_gross,
    monthly_tax,
    net_salary
  };
}

/**
 * Calculates Haversine distance in meters between two GPS coordinates
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Natural language parser for Smart Leave form pre-filling (M8)
 */
export function parseSmartLeaveNLP(text: string): {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
} {
  const lower = text.toLowerCase();
  let type: LeaveType = 'Casual';
  let reason = 'Personal leave';

  if (lower.includes('wedding') || lower.includes('shaadi')) {
    type = 'Casual';
    reason = "Sister's wedding ceremony";
  } else if (lower.includes('sick') || lower.includes('fever') || lower.includes('doctor') || lower.includes('tabiyat') || lower.includes('hospital')) {
    type = 'Sick';
    reason = 'Medical health illness';
  } else if (lower.includes('vacation') || lower.includes('annual') || lower.includes('travel') || lower.includes('trip')) {
    type = 'Annual';
    reason = 'Annual vacation with family';
  } else if (lower.includes('emergency') || lower.includes('urgent')) {
    type = 'Casual';
    reason = 'Urgent personal family matter';
  }

  // Calculate dates: Default next Monday and Tuesday if prompt says "next monday"
  const today = new Date(2026, 9, 24); // Sat 24 Oct 2026 (Hackathon date)
  let start = new Date(today);
  let end = new Date(today);

  if (lower.includes('next monday') || lower.includes('monday and tuesday')) {
    start.setDate(today.getDate() + 2); // Monday 26 Oct
    end.setDate(today.getDate() + 3); // Tuesday 27 Oct
  } else if (lower.includes('tomorrow') || lower.includes('kal')) {
    start.setDate(today.getDate() + 1);
    end.setDate(today.getDate() + 1);
  } else {
    start.setDate(today.getDate() + 2);
    end.setDate(today.getDate() + 4);
  }

  const startIso = start.toISOString().split('T')[0];
  const endIso = end.toISOString().split('T')[0];
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return {
    type,
    startDate: startIso,
    endDate: endIso,
    reason,
    days
  };
}
