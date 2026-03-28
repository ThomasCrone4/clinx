# Clinx UI Mockup — Full Build Specification

## Overview
Build a production-quality UI mockup for **Clinx** — an AI-driven children's wellbeing prediction system for UK schools. This is a front-end only mockup with realistic sample data. No real backend/API needed — all data comes from static JSON/generated data.

**Purpose:** Nancy (co-founder) is pitching this to a headteacher next week. Must look professional, real, and polished.

**CRITICAL: GDPR Compliance**
- This involves children's data (even sample data must follow best practice)
- NO real children's names anywhere
- Use pseudonymized IDs: `C0001` through `C0500`
- Staff can have realistic fake names (e.g., "Mr. A. Smith")
- All data is fabricated sample data

---

## Tech Stack

- **React 19** (with Vite)
- **Tailwind CSS** (light blue professional theme: `sky-50`, `sky-100`, `sky-500`, `sky-600`)
- **React Router v7** (client-side routing)
- **Recharts** (charts/graphs for attendance, behaviour, academic data)
- **Lucide React** (icons)
- **No backend** — all data from static JSON files or generated in-app
- **Desktop-only** (no mobile responsive needed)

---

## Color Scheme & Design

- **Primary:** Light blue (`sky-500` / `sky-600`) — trustworthy, calm, professional
- **Background:** `slate-50` or `gray-50` — clean white/light gray
- **Cards:** White with subtle shadow
- **Risk colors:**
  - High risk: `red-500` (badge/dot only, not overwhelming)
  - Medium risk: `amber-500`
  - Low risk: `emerald-500`
- **Typography:** Clean sans-serif (Inter or system font stack)
- **HCI best practice:** Progressive disclosure, clear hierarchy, minimal cognitive load
- **No dark mode needed**

---

## Sample School Data

### School
- **Name:** Dedworth Middle School
- **Location:** Windsor, UK
- **Type:** Middle school (Years 5-8, but for this mockup use Years 7-11 secondary structure as that's what the product targets)
- Actually, use realistic middle school years: **Years 5-8** (ages 9-13)
- 4 year groups, ~125 pupils per year = **500 pupils total**

### Year Groups & Form Groups
- Year 5: 5A, 5B, 5C, 5D (4 forms × ~31 pupils)
- Year 6: 6A, 6B, 6C, 6D
- Year 7: 7A, 7B, 7C, 7D
- Year 8: 8A, 8B, 8C, 8D

### Subjects (Middle School Appropriate)
- English, Maths, Science, History, Geography, PE, Art, Computing, Music, French
- 10 subjects

### Classes
- Each form group has classes for each subject
- ~160 class groups total (16 forms × 10 subjects)
- Class size: 25-32 pupils

### Teachers (30)
- Generate realistic UK teacher names (Mr./Mrs./Ms./Dr. + surname)
- Each teacher teaches 1-2 subjects
- Each teacher has 5-8 classes
- One teacher assigned as form tutor per form group (16 form tutors)

### Staff Accounts
- **1 Site Admin:** "Clinx Admin" (site-level, manages all schools)
- **2 School Admins:** Headteacher + DSL (Designated Safeguarding Lead)
- **30 Teachers:** As above

### Risk Distribution (500 pupils)
- 🔴 **High Risk:** 12 pupils (2.4%) — significant pattern shifts
- 🟡 **Medium Risk:** 28 pupils (5.6%) — emerging concerns
- 🟢 **Low Risk:** 460 pupils (92%) — no concerns

### Sample Data Per Pupil
Generate realistic data for each pupil:
- **Pupil ID:** C0001 - C0500
- **Year group & form**
- **Attendance %** (last term): Range 60-100%, mean 93%
- **Attendance trend:** Stable / Declining / Improving
- **Behaviour incidents** (last 4 weeks): 0-8
- **Homework submission %:** Range 30-100%, mean 85%
- **FSM status:** Yes/No (15% = Yes, realistic UK average)
- **SEND status:** None / SEN Support / EHCP (15% SEN Support, 3% EHCP)
- **Wellbeing survey score** (last check-in): 1-10 scale
- **Risk score:** Calculated from above (0-100%)
- **Risk level:** High (>75%) / Medium (50-75%) / Low (<50%)
- **AI explanation:** Auto-generated text explaining why flagged

### High-Risk Pupil Examples (12 pupils)
Each should have a different pattern — realistic variety:
1. Attendance nosedive (was 96%, now 68%) + homework decline
2. Behaviour spike (0 incidents → 6 in 4 weeks) + stable attendance
3. FSM + attendance decline + low wellbeing score
4. SEND pupil + sudden behaviour change + homework drop
5. Wellbeing survey flagged (score dropped from 8 to 3)
6. Multiple small signals (attendance -8%, homework -15%, 2 behaviour incidents)
7. Attendance pattern change (fine overall but absent every Monday)
8. Previously high-performing, sudden academic decline
9. Social isolation signals (PE non-participation, dropped extracurriculars)
10. Post-holiday attendance crash (didn't return on time)
11. Persistent low-level disruption escalating
12. Parental contact issues + attendance concerns

---

## User Roles & Authentication

### Login System (Mock)
- Simple login page with email/password fields
- Pre-populated demo accounts (shown on login page for easy testing):
  - **Site Admin:** admin@clinx.uk / demo
  - **School Admin:** head@dedworth.school / demo
  - **DSL:** dsl@dedworth.school / demo
  - **Teacher:** t.smith@dedworth.school / demo
- Store auth state in React context (no real auth)
- Logout button in header

### Role: Non-Logged-In User
**Sees:** Landing page only
- Hero section: "Early intervention starts with better data"
- Subheading: "Clinx connects fragmented school systems to identify children who need support — before crisis point"
- Three feature cards (Cross-System Intelligence, AI Pattern Detection, Staff Alerts)
- "Request a Demo" CTA button (non-functional, just shows toast "Demo request received!")
- "Login" button in top-right header
- Footer with basic links

### Role: Site Admin (Clinx Staff)
**Sees:**
- **Schools list:** Table of all schools using Clinx (just Dedworth Middle School for mockup)
- **Click school → School overview** (same as School Admin dashboard)
- **System stats:** Total schools, total pupils, alerts generated this week
- Can manage schools (add/remove — buttons exist but just show toast)

### Role: School Admin (Headteacher / DSL)
**Dashboard:**
- **Top bar:** Clinx logo, "Dedworth Middle School", notification bell (with badge count), user avatar + name dropdown
- **Left sidebar navigation:**
  - 📊 Dashboard (overview)
  - 👥 All Pupils
  - 🚨 Alerts
  - 👨‍🏫 Staff
  - ⚙️ Settings
- **Dashboard page:**
  - Risk summary cards (3 cards: High/Medium/Low with counts)
  - Recent alerts list (last 10, highest risk first)
  - Attendance trend chart (whole school, last 6 months)
  - Quick stats: Total pupils, % attendance this week, active alerts

**All Pupils page:**
- Table with columns: Pupil ID, Year, Form, Risk Level (colored badge), Risk Score %, Attendance %, Last Updated
- Sortable columns (click header to sort)
- Filters: Year group dropdown, Risk level dropdown, Search box (search by ID)
- Pagination (50 per page)
- Click row → navigates to Pupil Detail page

**Alerts page:**
- List of all alerts (newest first OR highest risk first — toggle)
- Each alert card: Pupil ID, risk level badge, reason summary, timestamp, assigned teachers
- Actions per alert: "View Pupil" button, "Acknowledge" button (turns grey), "Dismiss" button (removes from list)
- Filter: Unread / Acknowledged / All

**Staff page:**
- Table: Name, Role, Email, Classes, Status (Active/Invited)
- "Add Staff" button → modal with form (name, email, role dropdown, assign classes multi-select)
- Edit/Remove buttons per row

**Settings page:**
- School details (name, address — read-only display)
- Alert preferences (checkboxes: Email notifications, Dashboard notifications)
- Data sources connected (show Arbor MIS ✅, Class Charts ✅, Google Classroom ✅ — fake status indicators)

### Role: Teacher
**Dashboard:**
- **Top bar:** Same as admin but teacher name
- **Left sidebar:**
  - 📅 My Classes
  - 🚨 My Alerts
  - ❓ Help
- **My Classes page (CALENDAR VIEW):**
  - Weekly calendar grid (Monday-Friday, 09:00-16:00)
  - Each class shown as a block in the timetable
  - Block shows: Class name (e.g., "7A Maths"), room, pupil count
  - If class has at-risk pupils: Small colored badge on block (🔴 1, 🟡 2)
  - Click class block → navigates to Class Detail page
  - Week navigation (← Previous Week | Current Week | Next Week →)

**Class Detail page:**
- Header: Class name, subject, teacher, period, room
- Pupil table: ID, Risk Level badge, Risk Score %, Attendance %, Homework %, Last Updated
- Sortable columns
- Click row → Pupil Detail page
- "Back to My Classes" button

**My Alerts page:**
- Same as admin alerts but filtered to only show pupils in this teacher's classes
- Same acknowledge/dismiss functionality

---

## Pupil Detail Page (Full Page, Not Modal)

**Layout:**
- Back button ("← Back to [previous page]")
- **Header section:**
  - Pupil ID (large): e.g., "C0042"
  - Year & Form: "Year 7 — Form 7A"
  - Risk badge: 🔴 High Risk (87%)
  - SEND badge (if applicable): "SEN Support" or "EHCP"
  - FSM badge (if applicable): "FSM"
  - Last updated timestamp: "Data last synced: 28 Mar 2026, 08:00"

- **AI Explanation card (prominent, top of page):**
  - Header: "⚠️ Why this pupil was flagged"
  - Bullet points explaining each contributing factor:
    - "Attendance dropped from 95% to 68% over 6 weeks (↓27%)"
    - "5 behaviour incidents logged in last 4 weeks (previous average: 0.5/month)"
    - "Homework submission rate fell from 82% to 38%"
    - "Free School Meals status (socioeconomic risk factor)"
  - Each bullet shows data source: "(Source: Arbor MIS)" / "(Source: Class Charts)"
  - Risk score breakdown: "Attendance: 35/100, Behaviour: 25/100, Academic: 20/100, Other: 7/100 = 87/100"

- **Tab navigation:**
  - Overview | Attendance | Behaviour | Academic | Wellbeing | Notes

- **Overview tab:**
  - 4 stat cards: Current Attendance %, Behaviour Incidents (4w), Homework %, Wellbeing Score
  - Each card shows trend arrow (↑ improving, ↓ declining, → stable)
  - Mini sparkline in each card (last 6 data points)
  - Quick info: Form tutor name, classes enrolled, SEND/FSM status

- **Attendance tab:**
  - Line chart: Daily/weekly attendance over last 6 months (Recharts)
  - Comparison line: School average (dashed line)
  - Table below: Last 20 attendance records (date, status: Present/Absent/Late, session AM/PM)
  - Absence pattern analysis: "Most absences on Mondays (4 of 7 absences)"

- **Behaviour tab:**
  - Timeline of incidents (vertical timeline, newest first)
  - Each incident: Date, type (disruption/defiance/aggression/other), severity (minor/moderate/major), description, staff who logged it
  - Bar chart: Monthly incident count (last 6 months)

- **Academic tab:**
  - Table: Subject, Homework %, Trend, Last submission date
  - Bar chart: Homework submission % by subject
  - Comparison to form average

- **Wellbeing tab:**
  - Line chart: Wellbeing survey scores over time (1-10 scale)
  - Last survey response summary
  - Comparison to year group average
  - Note: "Self-reported data — for context only, not diagnostic"

- **Notes tab:**
  - Chronological list of staff notes (newest first)
  - Each note: Timestamp, author (staff name), note text
  - "Add Note" button → text area + submit
  - Notes are stored in local state (persist during session)

- **Suggested Actions sidebar (right side or bottom):**
  - Header: "Consider the following actions"
  - Disclaimer: "These are suggestions only. Staff should use professional judgement."
  - Generic suggestions based on risk factors:
    - "Schedule a one-to-one check-in with the pupil"
    - "Contact parent/guardian to discuss concerns"
    - "Review attendance pattern with attendance officer"
    - "Discuss with SENCO if additional support may be needed"
    - "Consider referral to pastoral team"
  - NOT specific clinical recommendations (never "refer to CAMHS" or diagnose)

---

## Alert System

### Alert Generation (Sample Data)
- Generate 15-20 sample alerts
- Each alert has:
  - Pupil ID
  - Risk level (High/Medium)
  - Timestamp (spread over last 7 days)
  - Reason: "Risk score increased to 87% — attendance decline + behaviour incidents"
  - Status: Unread / Acknowledged / Dismissed
  - Assigned to: List of teacher names who teach this pupil

### Alert Routing Logic
- When pupil flagged → alert goes to ALL teachers who teach that pupil + school admin
- Teacher sees only alerts for their pupils (filtered in their view)
- School admin sees ALL alerts
- Alert badge count in header updates when new alerts (simulated)

### Alert Actions
- **View Pupil:** Navigate to pupil detail page
- **Acknowledge:** Mark as "seen, investigating" — stays in list but greyed out
- **Dismiss:** Remove from active list (can see in "All" filter)

---

## Navigation & Routing

```
/                           → Landing page (public)
/login                      → Login page
/admin                      → Site admin dashboard
/admin/schools              → Schools list
/dashboard                  → School admin dashboard
/dashboard/pupils           → All pupils table
/dashboard/pupils/:id       → Pupil detail page
/dashboard/alerts           → Alerts list
/dashboard/staff            → Staff management
/dashboard/settings         → School settings
/teacher                    → Teacher dashboard (calendar)
/teacher/class/:id          → Class detail page
/teacher/pupils/:id         → Pupil detail page (same component, teacher context)
/teacher/alerts             → Teacher alerts
```

---

## Data Generation

Create a data generation script/module that produces:

1. **500 pupils** with all fields (attendance, behaviour, homework, wellbeing, FSM, SEND, risk score)
2. **30 teachers** with name, subjects, assigned classes
3. **16 form groups** (4 per year, Years 5-8)
4. **~160 classes** (form × subject combinations, but not all — each form has 8-10 subjects)
5. **Realistic timetable** for each teacher (Mon-Fri, periods 1-6)
6. **15-20 alerts** with varied timestamps and statuses
7. **Staff notes** (3-5 per high-risk pupil, 0-1 per medium-risk)
8. **Attendance history** (daily records for last 6 months per pupil)
9. **Behaviour incidents** (timestamped events for relevant pupils)
10. **Wellbeing survey responses** (monthly scores for all pupils)

Risk score calculation (transparent algorithm):
- Attendance weight: 35%
- Behaviour weight: 25%
- Academic weight: 20%
- Wellbeing weight: 15%
- Context flags weight: 5% (FSM, SEND boost risk slightly)

Higher score = higher risk. Threshold: >75% = High, 50-75% = Medium, <50% = Low.

---

## Important Notes

1. **This is a MOCKUP** — all data is fake. But it must LOOK real and professional.
2. **GDPR:** No real children's names. Use IDs (C0001-C0500). Staff can have fake names.
3. **Scalable architecture:** Component structure should work when real API is connected later. Use a data service layer that could be swapped for real API calls.
4. **Performance:** 500 pupils should render smoothly. Use pagination/virtualization if needed.
5. **Deploy to Vercel** when complete — need a shareable URL.
6. **Push to GitHub:** Repository is `ThomasCrone4/clinx` (already exists, already authenticated via `gh` CLI).
7. **Commit format:** `feat: description` with `Co-authored-by: Steve <shakasteve2000@gmail.com>`

---

## File Structure (Suggested)

```
clinx/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── RiskSummaryCards.jsx
│   │   │   ├── RecentAlerts.jsx
│   │   │   ├── AttendanceChart.jsx
│   │   │   └── QuickStats.jsx
│   │   ├── pupils/
│   │   │   ├── PupilTable.jsx
│   │   │   ├── PupilDetail.jsx
│   │   │   ├── PupilOverview.jsx
│   │   │   ├── AttendanceTab.jsx
│   │   │   ├── BehaviourTab.jsx
│   │   │   ├── AcademicTab.jsx
│   │   │   ├── WellbeingTab.jsx
│   │   │   └── NotesTab.jsx
│   │   ├── alerts/
│   │   │   ├── AlertList.jsx
│   │   │   └── AlertCard.jsx
│   │   ├── teacher/
│   │   │   ├── CalendarView.jsx
│   │   │   └── ClassDetail.jsx
│   │   ├── staff/
│   │   │   └── StaffManagement.jsx
│   │   ├── admin/
│   │   │   └── SiteAdminDashboard.jsx
│   │   ├── landing/
│   │   │   └── LandingPage.jsx
│   │   └── auth/
│   │       └── LoginPage.jsx
│   ├── data/
│   │   ├── generateData.js       (data generation)
│   │   ├── pupils.js
│   │   ├── teachers.js
│   │   ├── classes.js
│   │   ├── alerts.js
│   │   └── timetable.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── dataService.js        (abstraction layer for future API)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```
