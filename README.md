# Saylani Hackathon 2026 - HCM Lite

**AI-assisted Human Capital Management for Admin, HR and Employees**  
*Venue:* Zaitoon Ashraf IT Park, Karachi | *Date:* 24 October 2026 | *Submission:* [lms.saylaniit.com](https://lms.saylaniit.com/)

---

## 🚀 Quick Start (Streamlit Python App)

This repository includes a complete, standalone Python Streamlit dashboard in `app.py`.

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Launch Streamlit Application
streamlit run app.py
```

---

## 🌟 Modules Implemented (25 Functionalities across 9 Modules)

| Module | Features & Rules |
|---|---|
| **M1 Auth & Access** | 3 Distinct Roles (**Admin**, **HR Ops**, **Employee**) with server-side RBAC scoping. |
| **M2 Organization Setup** | Office start `09:00`, grace window `15 min`, half day `< 5h`, weekend Sat–Sun, office location (Zaitoon Ashraf IT Park: `24.8607° N, 67.0011° E`) + radius (`150m`). |
| **M3 Employees** | Search, filters, Employee 360 profile, CSV export, and CSV import dry-run validator. |
| **M4 Attendance** | Web check-in/out + **Camera Geofence Attendance (Bonus)** using Haversine distance to Zaitoon Ashraf IT Park coordinates. Late after 09:15 AM, half-day under 5.0 hours. |
| **M5 Leave** | Quotas: Annual (14), Sick (8), Casual (10), Unpaid (unlimited). Working days only (skips weekends/holidays). Overlap & quota guard (422). HR approval inbox. |
| **M6 Payroll Lite** | Gross = 1.5 × Basic (HRA 40%, Medical 10%). Daily rate = Gross ÷ 22 days. Pakistani Tax Slabs (0 to 600k @ 0%, up to 35%). Admin finalization & printable itemized payslip. |
| **M7 Dashboards & Analytics** | Interactive attendance status donut, headcount & gross payroll by department, 30-day attendance trend, top late-comers, and AI Summary. |
| **M8 AI Assistant** | Grounded in database tools (`get_headcount`, `get_late_comers`, `get_attendance_summary`, `get_my_leave_balance`). Role guardrail refuses colleague salary to employees. Roman Urdu support (`"Kitnay log aaj chutti pe hain?"`). Smart Leave NLP parser (`"Need next Monday and Tuesday off for my sister's wedding"`). |
| **M9 Comms & Audit** | Immutable audit log of every action (actor, action, entity, timestamp) and broadcast announcements. |

---

## 🧪 5-Minute Judges' Demo Script

1. **First-run setup**: Check Org Setup with office hours (09:00), grace time (15 min), and 150m geofence.
2. **Employee 360 & Directory**: Inspect employee records and verify CSV import dry run.
3. **Camera & GPS Attendance**: Test check-in with face detection and Haversine distance simulation (Inside IT Park vs Far away).
4. **Smart Leave NLP**: Type *"Need next Monday and Tuesday off for my sister's wedding"*, verify automatic form pre-fill and HR approval.
5. **AI Assistant & RBAC Guardrail**:
   - Ask as HR: *"How many active employees are in Engineering?"* -> Returns 3 matching dashboard.
   - Ask as Employee: *"What is Tariq's salary?"* -> Politely refused under privacy policy!
   - Ask in Roman Urdu: *"Kitnay log aaj chutti pe hain?"* -> Responds with real leave statistics.
6. **Payroll & Lock**: Run payroll calculation with Pakistani tax slabs, view printable itemized payslip, and finalize.
