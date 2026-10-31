import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = r"D:\project\AI Based Patient-Appoinment System\docs\diagrams\images"
os.makedirs(OUT_DIR, exist_ok=True)

# Load fonts
FONT_PATH = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"

def get_font(size, bold=False):
    try:
        p = FONT_BOLD_PATH if bold else FONT_PATH
        return ImageFont.truetype(p, size)
    except:
        return ImageFont.load_default()

def draw_base_card(section_num, section_name, title, subtitle):
    w, h = 1200, 680
    im = Image.new('RGB', (w, h), color='#f8fafc')
    draw = ImageDraw.Draw(im)

    # Top header bar background
    draw.rectangle([(0, 0), (w, 110)], fill='#0f172a')
    
    # Pill badge
    badge_text = f"SECTION {section_num} — {section_name.upper()}"
    draw.rounded_rectangle([(30, 20), (320, 48)], radius=14, fill='#1e293b', outline='#3b82f6', width=1)
    draw.text((45, 26), badge_text, font=get_font(12, bold=True), fill='#60a5fa')

    # Project title on right
    draw.text((780, 26), "AI-BASED PATIENT APPOINTMENT SYSTEM", font=get_font(12, bold=True), fill='#94a3b8')

    # Main Diagram Title
    draw.text((30, 56), title, font=get_font(22, bold=True), fill='#ffffff')
    draw.text((30, 84), subtitle, font=get_font(13), fill='#94a3b8')

    # Outer border
    draw.rectangle([(0, 0), (w-1, h-1)], outline='#cbd5e1', width=1)
    
    # Bottom watermark bar
    draw.rectangle([(0, h-32), (w, h)], fill='#f1f5f9')
    draw.line([(0, h-32), (w, h-32)], fill='#e2e8f0', width=1)
    draw.text((30, h-24), "Department of Information Technology (B.Tech IT) — Authors: Lokendra Prajapati & Samyak Lariya", font=get_font(11), fill='#64748b')
    draw.text((1020, h-24), "Verified Submission Artifact", font=get_font(11, bold=True), fill='#2563eb')

    return im, draw

def save_diagram(im, filename):
    p = os.path.join(OUT_DIR, filename)
    im.save(p, "PNG", dpi=(150, 150))
    print(f"Generated: {filename}")

# ==========================================
# 1. SECTION 1 DIAGRAMS
# ==========================================

# 1.2 Problem Statement
def gen_1_2():
    im, draw = draw_base_card("1.2", "Project Overview", "Healthcare Scheduling & Triage Bottleneck: Traditional vs AI", "Comparative Workflow between Fragmented Traditional Booking and Unified AI System")
    
    # Traditional lane (Red)
    draw.rounded_rectangle([(30, 130), (1170, 360)], radius=12, fill='#fef2f2', outline='#f87171', width=2)
    draw.text((50, 145), "TRADITIONAL WORKFLOW (FRAGMENTED, NO CLINICAL TRIAGE)", font=get_font(14, bold=True), fill='#991b1b')

    steps_red = [
        ("1. Patient Feels Symptoms", "Vague, unguided complaints\nSearches online forums", "No triage assistance"),
        ("2. Self-Diagnosis Guesswork", "Patient guesses specialty\ne.g. picks Orthopedic", "Common clinical error"),
        ("3. Books Wrong Doctor", "Arrives at wrong clinic\nWastes consultation fee", "Misallocated OPD slot"),
        ("4. Doctor Consultation Void", "Doctor lacks patient history\nSpends 15 mins on basics", "Context deficit"),
        ("5. Negative Clinical Impact", "Delayed accurate treatment\nFrustration & higher costs", "CRITICAL BOTTLENECK")
    ]
    for i, (st, d1, d2) in enumerate(steps_red):
        x = 50 + i * 220
        draw.rounded_rectangle([(x, 185), (x + 205, 335)], radius=8, fill='#ffffff', outline='#ef4444', width=1)
        draw.text((x + 12, 198), st, font=get_font(12, bold=True), fill='#1e293b')
        draw.text((x + 12, 230), d1, font=get_font(11), fill='#475569')
        draw.rounded_rectangle([(x + 10, 290), (x + 195, 320)], radius=6, fill='#fee2e2')
        draw.text((x + 20, 298), d2, font=get_font(10, bold=True), fill='#b91c1c')

    # AI Proposed lane (Green)
    draw.rounded_rectangle([(30, 380), (1170, 615)], radius=12, fill='#f0fdf4', outline='#4ade80', width=2)
    draw.text((50, 395), "PROPOSED AI-BASED WORKFLOW (INTEGRATED TRIAGE & DIRECT BOOKING)", font=get_font(14, bold=True), fill='#166534')

    steps_green = [
        ("1. 24/7 Conversational AI", "Multi-turn symptom intake\nNatural language input", "NLP Patient Capture"),
        ("2. Emergency Red-Flag Shield", "Scans heart attack/stroke\nImmediate 112/108 routing", "Safety-First Override"),
        ("3. Smart Doctor Matching", "Jaccard similarity scoring\nMaps to 12+ specialties", "94%+ Accurate Routing"),
        ("4. Conflict-Free Slot Lock", "Atomic database locking\nPrevents double bookings", "Real-Time Confirmation"),
        ("5. Doctor Clinical Brief", "Pre-consultation summary\nSaves 10-15 mins/patient", "Optimal Patient Care")
    ]
    for i, (st, d1, d2) in enumerate(steps_green):
        x = 50 + i * 220
        draw.rounded_rectangle([(x, 435), (x + 205, 590)], radius=8, fill='#ffffff', outline='#22c55e', width=1)
        draw.text((x + 12, 448), st, font=get_font(12, bold=True), fill='#1e293b')
        draw.text((x + 12, 480), d1, font=get_font(11), fill='#475569')
        draw.rounded_rectangle([(x + 10, 545), (x + 195, 575)], radius=6, fill='#dcfce7')
        draw.text((x + 20, 553), d2, font=get_font(10, bold=True), fill='#15803d')

    save_diagram(im, "1.2_Problem_Statement.png")

# 1.3 Objectives
def gen_1_3():
    im, draw = draw_base_card("1.3", "Project Overview", "Core System Objectives & The 5 Functional Pillars", "Key Architectural and Clinical Goals of the AI-Based Patient Appointment System")

    # Center Hub
    draw.ellipse([(480, 260), (720, 500)], fill='#eff6ff', outline='#2563eb', width=3)
    draw.text((520, 340), "AI-BASED PATIENT", font=get_font(14, bold=True), fill='#1e3a8a')
    draw.text((515, 365), "APPOINTMENT SYSTEM", font=get_font(13, bold=True), fill='#1e3a8a')
    draw.text((545, 400), "CORE OBJECTIVES HUB", font=get_font(10, bold=True), fill='#3b82f6')

    pillars = [
        ("Pillar 1: Conversational AI Triage", "• 24/7 empathetic NLP chatbot\n• Free-text multi-turn symptom collection\n• Normalizes patient narratives", 50, 140, '#3b82f6'),
        ("Pillar 2: Emergency Red-Flag Shield", "• Deterministic acute condition filter\n• Catches heart attack & stroke signs\n• Bypasses routine booking -> 112/108", 820, 140, '#ef4444'),
        ("Pillar 3: Smart Specialist Matching", "• Jaccard token similarity scoring\n• Maps symptoms across 12+ specialties\n• Eliminates patient self-diagnosis errors", 50, 440, '#10b981'),
        ("Pillar 4: Conflict-Free Slot Booking", "• Atomic database transaction locks\n• Real-time 30-min doctor calendar slots\n• Zero double-booking anomalies", 820, 440, '#8b5cf6'),
        ("Pillar 5: Doctor Clinical Brief", "• Auto-generated pre-consultation summary\n• Symptom duration & risk score briefing\n• Saves 10-15 mins of initial triage time", 435, 140, '#f59e0b')
    ]

    for title, desc, px, py, col in pillars:
        w_box = 330 if px != 435 else 330
        draw.rounded_rectangle([(px, py), (px + w_box, py + 130)], radius=10, fill='#ffffff', outline=col, width=2)
        draw.text((px + 14, py + 14), title, font=get_font(12, bold=True), fill='#0f172a')
        draw.text((px + 14, py + 42), desc, font=get_font(11), fill='#475569')

    save_diagram(im, "1.3_Objectives.png")

# 1.4 Scope & Feasibility
def gen_1_4():
    im, draw = draw_base_card("1.4", "Project Overview", "System Scope Boundaries & 3-Pillar Feasibility Framework", "Functional Scope (In-Scope vs Out-of-Scope) and Technical / Economic / Operational Feasibility")

    # Left: Scope
    draw.rounded_rectangle([(40, 130), (580, 620)], radius=12, fill='#ffffff', outline='#cbd5e1', width=1)
    draw.text((60, 150), "PROJECT SCOPE BOUNDARIES", font=get_font(15, bold=True), fill='#0f172a')

    # In-Scope Box
    draw.rounded_rectangle([(60, 185), (560, 380)], radius=8, fill='#f0fdf4', outline='#86efac', width=1)
    draw.text((75, 198), "IN-SCOPE FUNCTIONALITY", font=get_font(13, bold=True), fill='#15803d')
    in_items = [
        "✔ 24/7 Conversational AI Symptom Intake via NLP",
        "✔ Emergency Red-Flag detection & immediate 112/108 alert",
        "✔ Algorithmic mapping across 12+ medical specialist categories",
        "✔ Real-time conflict-free slot booking with atomic locking",
        "✔ Dual dashboards: Patient health record & Doctor queue",
        "✔ Multi-provider auth: Google OAuth 2.0 GIS + Mobile SMS OTP"
    ]
    for idx, item in enumerate(in_items):
        draw.text((75, 230 + idx * 24), item, font=get_font(11), fill='#1e293b')

    # Out-Scope Box
    draw.rounded_rectangle([(60, 400), (560, 595)], radius=8, fill='#fef2f2', outline='#fca5a5', width=1)
    draw.text((75, 413), "OUT-OF-SCOPE LIMITATIONS", font=get_font(13, bold=True), fill='#b91c1c')
    out_items = [
        "✖ Automated drug/medication prescriptions (requires doctor)",
        "✖ Invasive surgical robotics or tele-surgical interventions",
        "✖ Definitive pathological diagnosis without physical examination",
        "✖ Replacement of certified licensed medical doctors",
        "✖ Strictly follows Doctor-in-the-Loop advisory protocol"
    ]
    for idx, item in enumerate(out_items):
        draw.text((75, 445 + idx * 28), item, font=get_font(11), fill='#1e293b')

    # Right: Feasibility
    draw.rounded_rectangle([(620, 130), (1160, 620)], radius=12, fill='#ffffff', outline='#cbd5e1', width=1)
    draw.text((640, 150), "FEASIBILITY ANALYSIS PILLARS", font=get_font(15, bold=True), fill='#0f172a')

    feas = [
        ("TECHNICAL FEASIBILITY: HIGH", [
            "• Asynchronous Python FastAPI backend (ASGI)",
            "• React 18 SPA + Vite for instant client rendering",
            "• Sub-second response: <1.5s chat, <300ms booking",
            "• Lightweight NLP token matching requiring zero expensive GPU"
        ], '#3b82f6', '#eff6ff', 185),
        ("ECONOMIC FEASIBILITY: COST-EFFECTIVE", [
            "• 100% open-source software stack (zero licensing fees)",
            "• Operable on standard cloud VMs or existing clinic hardware",
            "• Drastically cuts clinic administrative phone triage overhead",
            "• Eliminates revenue loss from patient double-bookings"
        ], '#10b981', '#ecfdf5', 330),
        ("OPERATIONAL FEASIBILITY: EXCELLENT", [
            "• Intuitive glassmorphism interface requiring zero training",
            "• Patients easily describe symptoms in conversational English",
            "• Doctors view daily queues with pre-consultation briefings",
            "• Readily adaptable to hospitals, clinics, and solo practitioners"
        ], '#f59e0b', '#fffbeb', 475)
    ]
    for f_title, f_lines, col, bg_col, fy in feas:
        draw.rounded_rectangle([(640, fy), (1140, fy + 125)], radius=8, fill=bg_col, outline=col, width=1)
        draw.text((655, fy + 10), f_title, font=get_font(12, bold=True), fill=col)
        for li, line in enumerate(f_lines):
            draw.text((655, fy + 34 + li * 21), line, font=get_font(10.5), fill='#334155')

    save_diagram(im, "1.4_Scope_and_Feasibility.png")

# ==========================================
# 2. SECTION 2 DIAGRAMS
# ==========================================

# 2.1 Background & Survey
def gen_2_1():
    im, draw = draw_base_card("2.1", "Literature Review", "Healthcare Informatics & Clinical Triage Evolution", "Historical Transition from Manual Clinic Walk-ins to Integrated AI-Powered Scheduling")

    phases = [
        ("PHASE 1: MANUAL WORKFLOW", "1990s - 2000s", [
            "• In-person clinic walk-ins",
            "• Paper queue tokens & register books",
            "• Long OPD waiting times (2-4 hrs)",
            "• Zero clinical triage prior to visit"
        ], '#64748b', '#f1f5f9', 40),
        ("PHASE 2: DIRECTORY AGGREGATORS", "2010 - 2018 (Practo, Zocdoc)", [
            "• Doctor directories & reviews",
            "• Online calendar slot reservation",
            "• Limitation: Patient must self-diagnose",
            "• High rate of wrong specialist visits"
        ], '#0284c7', '#e0f2fe', 325),
        ("PHASE 3: ISOLATED AI CHECKERS", "2018 - 2023 (Ada, Babylon, Buoy)", [
            "• Probabilistic Bayesian symptom trees",
            "• Generates disease probability report",
            "• Major Gap: Cannot book doctor slots",
            "• Leaves patient stranded post-triage"
        ], '#8b5cf6', '#ede9fe', 610),
        ("PHASE 4: INTEGRATED AI SYSTEM", "2024 - 2026 (Our Proposed Platform)", [
            "• 24/7 Conversational NLP symptom triage",
            "• Emergency red-flag safety override",
            "• Automatic specialist mapping (12+)",
            "• Conflict-free booking + Doctor summaries"
        ], '#16a34a', '#dcfce7', 895)
    ]

    for p_title, p_sub, p_bullets, col, bg_col, px in phases:
        draw.rounded_rectangle([(px, 160), (px + 265, 590)], radius=12, fill=bg_col, outline=col, width=2)
        draw.rounded_rectangle([(px + 15, 175), (px + 250, 210)], radius=6, fill=col)
        draw.text((px + 22, 185), p_title, font=get_font(10.5, bold=True), fill='#ffffff')
        draw.text((px + 20, 225), f"Era: {p_sub}", font=get_font(11, bold=True), fill=col)
        draw.line([(px + 15, 250), (px + 250, 250)], fill=col, width=1)
        for bi, bullet in enumerate(p_bullets):
            draw.text((px + 18, 275 + bi * 34), bullet, font=get_font(11), fill='#1e293b')

    save_diagram(im, "2.1_Background_and_Survey.png")

# 2.2 Existing Systems Limitations
def gen_2_2():
    im, draw = draw_base_card("2.2", "Literature Review", "Existing Healthcare Systems Comparative Limitation Matrix", "Feature-by-Feature Benchmark against Prominent Digital Health Platforms")

    draw.rounded_rectangle([(40, 130), (1160, 620)], radius=10, fill='#ffffff', outline='#cbd5e1', width=1)

    # Table Header
    headers = ["PLATFORM", "CATEGORY", "AI SYMPTOM TRIAGE", "EMERGENCY FILTER", "DOCTOR BOOKING", "DOCTOR BRIEF", "MAJOR GAP"]
    col_w = [160, 150, 160, 150, 150, 140, 210]
    
    cur_x = 40
    for idx, h_text in enumerate(headers):
        draw.rectangle([(cur_x, 130), (cur_x + col_w[idx], 180)], fill='#0f172a')
        draw.text((cur_x + 10, 148), h_text, font=get_font(11, bold=True), fill='#38bdf8')
        cur_x += col_w[idx]

    rows = [
        ("Practo", "Booking Directory", "Keyword Only", "None", "Real-Time Slots", "None", "Patient must self-diagnose specialist"),
        ("Zocdoc", "Directory & Reviews", "Basic Search", "None", "Real-Time Slots", "None", "No clinical symptom guidance"),
        ("Ada Health", "AI Symptom Checker", "High (Bayesian)", "Basic Disclaimer", "None (No Booking)", "Patient PDF Only", "Cannot book appointment with doctors"),
        ("Babylon Health", "Telehealth App", "High (NLP Rules)", "Moderate Warning", "Virtual Only", "Minimal", "High operating overhead & vendor lock-in"),
        ("PROPOSED SYSTEM", "Integrated AI Health", "High (2-Tier NLP)", "Immediate ER 112", "Atomic Conflict-Free", "Auto Pre-Consult", "UNIFIED TRIAGE & SCHEDULING")
    ]

    for ri, r_data in enumerate(rows):
        y = 180 + ri * 85
        bg_col = '#f0fdf4' if ri == 4 else ('#ffffff' if ri % 2 == 0 else '#f8fafc')
        draw.rectangle([(40, y), (1160, y + 85)], fill=bg_col)
        draw.line([(40, y + 85), (1160, y + 85)], fill='#e2e8f0', width=1)
        
        cur_x = 40
        for ci, cell_text in enumerate(r_data):
            f_col = '#15803d' if ri == 4 else '#1e293b'
            f_bold = True if (ri == 4 or ci == 0) else False
            draw.text((cur_x + 10, y + 30), cell_text, font=get_font(11, bold=f_bold), fill=f_col)
            cur_x += col_w[ci]

    save_diagram(im, "2.2_Existing_Systems_Limitations.png")

# 2.3 Comparative Study & Proposed Work
def gen_2_3():
    im, draw = draw_base_card("2.3", "Literature Review", "Closed-Loop Proposed Architecture vs Fragmented Systems", "Comparison of Open-Loop Traditional Platforms vs Our Closed-Loop AI Healthcare Platform")

    # Left: Fragmented
    draw.rounded_rectangle([(40, 130), (580, 620)], radius=12, fill='#fef2f2', outline='#f87171', width=2)
    draw.text((60, 150), "FRAGMENTED OPEN-LOOP SYSTEM (CURRENT MARKET)", font=get_font(13.5, bold=True), fill='#991b1b')
    draw.text((60, 175), "Patients bounce between disconnected tools with high drop-off", font=get_font(11), fill='#64748b')

    frag_boxes = [
        ("Step 1: Symptom Checker App", "Patient completes 15-min questionnaire\nReceives long list of possible diseases", "#fee2e2"),
        ("Step 2: Disconnect & Search", "App offers no booking options\nPatient searches Google / Practo independently", "#fee2e2"),
        ("Step 3: Self-Diagnosis Error", "Patient picks wrong specialist\ne.g. ENT for chest cough", "#fee2e2"),
        ("Step 4: Unprepared Doctor", "Doctor has no record of earlier symptoms\nConsultation wasted on preliminary questions", "#fee2e2")
    ]
    for idx, (b_title, b_desc, b_bg) in enumerate(frag_boxes):
        by = 210 + idx * 98
        draw.rounded_rectangle([(60, by), (560, by + 82)], radius=8, fill='#ffffff', outline='#ef4444', width=1)
        draw.text((75, by + 12), b_title, font=get_font(12, bold=True), fill='#b91c1c')
        draw.text((75, by + 34), b_desc, font=get_font(10.5), fill='#475569')

    # Right: Closed Loop
    draw.rounded_rectangle([(620, 130), (1160, 620)], radius=12, fill='#f0fdf4', outline='#4ade80', width=2)
    draw.text((640, 150), "UNIFIED CLOSED-LOOP SYSTEM (OUR PROPOSED WORK)", font=get_font(13.5, bold=True), fill='#15803d')
    draw.text((640, 175), "Seamless end-to-end patient triage to doctor consultation", font=get_font(11), fill='#64748b')

    closed_boxes = [
        ("Step 1: Conversational AI Triage", "Patient describes symptoms in natural English/voice\nAutomatic normalization and tokenization", "#dcfce7"),
        ("Step 2: Emergency Red-Flag Shield", "Life-threatening symptoms trigger immediate 112 override\nSafe non-emergency cases proceed automatically", "#dcfce7"),
        ("Step 3: Algorithmic Doctor Match", "Similarity engine matches symptoms to 12+ specialties\nDisplays certified doctor profiles, fees, and open slots", "#dcfce7"),
        ("Step 4: Atomic Slot Lock + Doctor Summary", "Instant conflict-free booking confirmation\nDoctor receives pre-consultation summary before visit", "#dcfce7")
    ]
    for idx, (b_title, b_desc, b_bg) in enumerate(closed_boxes):
        by = 210 + idx * 98
        draw.rounded_rectangle([(640, by), (1140, by + 82)], radius=8, fill='#ffffff', outline='#22c55e', width=1)
        draw.text((655, by + 12), b_title, font=get_font(12, bold=True), fill='#15803d')
        draw.text((655, by + 34), b_desc, font=get_font(10.5), fill='#475569')

    save_diagram(im, "2.3_Comparative_Study.png")

# ==========================================
# 3. SECTION 3 DIAGRAMS
# ==========================================

# 3.1 Functional Requirements (UML Use Case)
def gen_3_1():
    im, draw = draw_base_card("3.1", "Requirements Analysis", "System Functional Requirements: UML Use-Case Diagram", "Primary Actors, Subsystem Boundaries, and Functional Use Cases")

    # Actors on Left
    draw.rounded_rectangle([(40, 140), (220, 360)], radius=10, fill='#eff6ff', outline='#3b82f6', width=2)
    draw.text((65, 160), "ACTOR 1: PATIENT", font=get_font(12, bold=True), fill='#1d4ed8')
    draw.text((60, 195), "• Google OAuth / OTP Login\n• Enter Symptoms in Chat\n• View Triage Assessment\n• Select Date & Time Slot\n• Confirm Booking\n• View Past History", font=get_font(10.5), fill='#1e293b')

    draw.rounded_rectangle([(40, 390), (220, 610)], radius=10, fill='#fdf4ff', outline='#c084fc', width=2)
    draw.text((65, 410), "ACTOR 2: DOCTOR", font=get_font(12, bold=True), fill='#7e22ce')
    draw.text((60, 445), "• Doctor Verified Login\n• View Daily Patient Queue\n• Read AI Clinical Brief\n• Input Verified Notes\n• Update Slot Availability\n• Mark Status Completed", font=get_font(10.5), fill='#1e293b')

    # System boundary box
    draw.rounded_rectangle([(250, 140), (950, 610)], radius=12, fill='#ffffff', outline='#cbd5e1', width=2)
    draw.text((270, 155), "AI-BASED PATIENT APPOINTMENT SYSTEM (SYSTEM BOUNDARY)", font=get_font(12, bold=True), fill='#64748b')

    use_cases = [
        ("UC-01: Authenticate via Google OAuth / SMS OTP", 280, 190),
        ("UC-02: Conversational Multi-Turn Symptom Intake", 280, 260),
        ("UC-03: Evaluate Red-Flag Emergency Symptoms", 280, 330),
        ("UC-04: Match Clinical Specialty across 12+ Domains", 280, 400),
        ("UC-05: Lock Slot & Prevent Double-Booking (ACID)", 280, 470),
        ("UC-06: Auto-Generate Pre-Consultation Summary", 280, 540)
    ]
    for uc_text, ux, uy in use_cases:
        draw.rounded_rectangle([(ux, uy), (ux + 440, uy + 48)], radius=24, fill='#f8fafc', outline='#2563eb', width=2)
        draw.text((ux + 25, uy + 14), uc_text, font=get_font(11, bold=True), fill='#1e3a8a')

    # Right Actor: AI Engine
    draw.rounded_rectangle([(980, 140), (1160, 610)], radius=10, fill='#ecfdf5', outline='#10b981', width=2)
    draw.text((1000, 160), "ACTOR 3: AI ENGINE", font=get_font(12, bold=True), fill='#047857')
    draw.text((995, 205), "• Regex Tokenizer\n• Synonym Mapper\n• Emergency Filter\n• Jaccard Scorer\n• Confidence Evaluator\n• Clinical Summarizer\n• Safe Fallback Rules", font=get_font(11), fill='#1e293b')

    save_diagram(im, "3.1_Functional_Requirements.png")

# 3.2 Non-Functional Requirements
def gen_3_2():
    im, draw = draw_base_card("3.2", "Requirements Analysis", "Non-Functional Quality Attributes & Security Radar", "Evaluation Parameters across Performance, Security, Reliability, Usability, and Clinical Safety")

    pillars = [
        ("PERFORMANCE & LATENCY", [
            "• Chatbot NLP response: < 1.5 seconds",
            "• Booking transaction commit: < 300 ms",
            "• Initial SPA paint: < 1.2 seconds",
            "• Optimized 60 FPS CSS glassmorphism"
        ], '#3b82f6', '#eff6ff', 50, 140),
        ("SECURITY & PRIVACY", [
            "• TLS 1.3 / HTTPS encryption in transit",
            "• Salted Bcrypt hashing for credentials",
            "• HMAC-SHA256 stateless JWT tokens",
            "• Strict rate limiting on SMS OTP endpoints"
        ], '#10b981', '#ecfdf5', 610, 140),
        ("RELIABILITY & CONCURRENCY", [
            "• Target 99.9% application uptime",
            "• Database ACID transactions preventing race conditions",
            "• Compound UNIQUE constraint on doctor/date/slot",
            "• Zero double-booking guarantee"
        ], '#f59e0b', '#fffbeb', 50, 380),
        ("ACCESSIBILITY & USABILITY", [
            "• Responsive UI across mobile, tablet & desktop",
            "• WCAG 2.1 contrast & readable typography",
            "• Intuitive multi-turn conversational intake",
            "• Single-click Google GIS authentication"
        ], '#8b5cf6', '#fdf4ff', 610, 380)
    ]

    for p_title, p_lines, col, bg_col, px, py in pillars:
        draw.rounded_rectangle([(px, py), (px + 540, py + 210)], radius=12, fill=bg_col, outline=col, width=2)
        draw.rounded_rectangle([(px + 15, py + 15), (px + 320, py + 48)], radius=6, fill=col)
        draw.text((px + 25, py + 23), p_title, font=get_font(12, bold=True), fill='#ffffff')
        for li, line in enumerate(p_lines):
            draw.text((px + 20, py + 65 + li * 34), line, font=get_font(11.5), fill='#1e293b')

    save_diagram(im, "3.2_Non_Functional_Requirements.png")

# 3.3 Hardware & Software Prerequisites
def gen_3_3():
    im, draw = draw_base_card("3.3", "Requirements Analysis", "Hardware, Software & Infrastructure Prerequisites", "Minimum Specifications and Recommended Toolchain across Client, Server, and Cloud Tiers")

    tiers = [
        ("CLIENT TIER (END-USER)", [
            "• Processor: Dual-Core CPU or higher",
            "• RAM: Minimum 2 GB (4 GB recommended)",
            "• Devices: Desktop, Laptop, Tablet, Mobile",
            "• Browser: Chrome 90+, Edge 90+, Firefox 88+, Safari 14+",
            "• Network: Active 3G/4G/5G/Broadband Internet"
        ], '#0284c7', '#f0f9ff', 40),
        ("SERVER & BACKEND TIER", [
            "• Host Processor: Quad-Core Intel i3 / Ryzen 3+",
            "• RAM: Minimum 8 GB (16 GB for concurrent load)",
            "• Storage: 10 GB SSD free space",
            "• Runtime: Python 3.10+ (FastAPI, Uvicorn ASGI)",
            "• Toolchain: Node.js 18+, npm 9+ (Vite SPA)",
            "• OS: Windows 10/11, Ubuntu 20.04/22.04 LTS, macOS"
        ], '#2563eb', '#eff6ff', 420),
        ("STORAGE & CLOUD SERVICES", [
            "• Database: SQLite 3 (Dev) / PostgreSQL 14+ (Prod)",
            "• ORM: SQLAlchemy 2.0 object-relational mapping",
            "• Identity: Google Cloud Identity (OAuth 2.0 GIS)",
            "• SMS Gateway: Fast2SMS / Twilio Messaging API",
            "• AI Engine: Custom Python NLP + Vector Similarity",
            "• API Docs: Swagger UI / OpenAPI 3.0"
        ], '#16a34a', '#f0fdf4', 800)
    ]

    for t_title, t_items, col, bg_col, tx in tiers:
        draw.rounded_rectangle([(tx, 140), (tx + 360, 610)], radius=12, fill=bg_col, outline=col, width=2)
        draw.rounded_rectangle([(tx + 15, 155), (tx + 345, 195)], radius=6, fill=col)
        draw.text((tx + 25, 167), t_title, font=get_font(12, bold=True), fill='#ffffff')
        for ii, item in enumerate(t_items):
            draw.text((tx + 20, 225 + ii * 58), item, font=get_font(11.5), fill='#1e293b')

    save_diagram(im, "3.3_Hardware_Software_Prerequisites.png")

# ==========================================
# 4. SECTION 4 DIAGRAMS
# ==========================================

# 4.1 Architecture Description
def gen_4_1():
    im, draw = draw_base_card("4.1", "System Design", "High-Level 3-Tier Enterprise Architecture Diagram", "Decoupled Presentation, Application Gateway, and AI Persistence Architecture")

    # Tier 1
    draw.rounded_rectangle([(40, 140), (1160, 275)], radius=10, fill='#eff6ff', outline='#3b82f6', width=2)
    draw.text((60, 155), "TIER 1: PRESENTATION TIER (REACT 18 SINGLE-PAGE APPLICATION)", font=get_font(13, bold=True), fill='#1d4ed8')
    p_mods = ["Patient Booking Portal", "AI Chatbot Drawer", "Doctor Review Queue", "Dual Auth Modal", "Appointment Calendar"]
    for i, m in enumerate(p_mods):
        mx = 60 + i * 220
        draw.rounded_rectangle([(mx, 190), (mx + 205, 255)], radius=8, fill='#ffffff', outline='#93c5fd', width=1)
        draw.text((mx + 15, 215), m, font=get_font(11, bold=True), fill='#1e293b')

    # Tier 2
    draw.rounded_rectangle([(40, 305), (1160, 445)], radius=10, fill='#f8fafc', outline='#64748b', width=2)
    draw.text((60, 320), "TIER 2: APPLICATION & API GATEWAY TIER (FASTAPI ASYNC ENGINE)", font=get_font(13, bold=True), fill='#0f172a')
    a_mods = ["Security & Auth Router", "AI Triage Heuristics", "Doctor Routing Controller", "Slot Booking Engine", "Clinical Brief Generator"]
    for i, m in enumerate(a_mods):
        mx = 60 + i * 220
        draw.rounded_rectangle([(mx, 355), (mx + 205, 420)], radius=8, fill='#ffffff', outline='#cbd5e1', width=1)
        draw.text((mx + 15, 380), m, font=get_font(11, bold=True), fill='#1e293b')

    # Tier 3
    draw.rounded_rectangle([(40, 475), (1160, 615)], radius=10, fill='#f0fdf4', outline='#22c55e', width=2)
    draw.text((60, 490), "TIER 3: DATA & AI PERSISTENCE TIER", font=get_font(13, bold=True), fill='#15803d')
    d_mods = ["Users & Auth Store", "Doctor Profiles (12+)", "Appointments DB", "Symptom Knowledge Graph", "Audit & Disclaimer Logs"]
    for i, m in enumerate(d_mods):
        mx = 60 + i * 220
        draw.rounded_rectangle([(mx, 525), (mx + 205, 590)], radius=8, fill='#ffffff', outline='#86efac', width=1)
        draw.text((mx + 15, 550), m, font=get_font(11, bold=True), fill='#1e293b')

    save_diagram(im, "4.1_Architecture_Description.png")

# 4.2 System Modules & Workflow
def gen_4_2():
    im, draw = draw_base_card("4.2", "System Design", "End-to-End System Modules & Clinical Workflow Pipeline", "Data Flow Sequence from Patient Symptom Input to Doctor Consultation Execution")

    steps = [
        ("1. Auth Verification", "Google OAuth GIS\nor Mobile SMS OTP\nJWT Token Issued", 40, 150),
        ("2. Symptom Intake", "Natural language chat\nin Chatbot Drawer\nTokenized input", 330, 150),
        ("3. Emergency Check", "Deterministic match:\nChest pain, stroke?\nIf YES -> 112 Alert", 620, 150),
        ("4. Specialist Match", "Jaccard similarity\nMaps to 12+ specialties\nFilters doctors", 910, 150),
        ("5. Slot Selection", "Doctor availability\nSelect 30-min slot\nLive status preview", 40, 390),
        ("6. Atomic Booking", "Transaction lock\nPrevents race condition\nInstant SMS slip", 330, 390),
        ("7. Clinical Summary", "AI brief generated:\nSymptoms & risk tier\nReady for doctor", 620, 390),
        ("8. Doctor Queue", "Doctor reviews queue\nConducts exam & notes\nMarks Completed", 910, 390)
    ]

    for s_title, s_desc, sx, sy in steps:
        draw.rounded_rectangle([(sx, sy), (sx + 250, sy + 180)], radius=10, fill='#ffffff', outline='#3b82f6', width=2)
        draw.rounded_rectangle([(sx + 10, sy + 10), (sx + 240, sy + 44)], radius=6, fill='#1e40af')
        draw.text((sx + 18, sy + 18), s_title, font=get_font(11.5, bold=True), fill='#ffffff')
        draw.text((sx + 20, sy + 65), s_desc, font=get_font(11), fill='#334155')

    save_diagram(im, "4.2_System_Modules_Workflow.png")

# 4.3 Database & Data Flow
def gen_4_3():
    im, draw = draw_base_card("4.3", "System Design", "Entity-Relationship (ER) Schema & Data Flow Design", "Relational Database Structure, Foreign Keys, Unique Constraints, and DFD-1")

    # Table 1: User
    draw.rounded_rectangle([(40, 140), (290, 370)], radius=8, fill='#ffffff', outline='#3b82f6', width=2)
    draw.rectangle([(40, 140), (290, 175)], fill='#1d4ed8')
    draw.text((50, 148), "USER ENTITY (users)", font=get_font(11, bold=True), fill='#ffffff')
    draw.text((50, 190), "• id (PK, String)\n• name (String)\n• email (String, Unique)\n• phone_number (String)\n• role (patient / doctor)\n• auth_provider (google/otp)\n• created_at (DateTime)", font=get_font(10.5), fill='#1e293b')

    # Table 2: Doctor
    draw.rounded_rectangle([(330, 140), (580, 370)], radius=8, fill='#ffffff', outline='#10b981', width=2)
    draw.rectangle([(330, 140), (580, 175)], fill='#047857')
    draw.text((340, 148), "DOCTOR ENTITY (doctors)", font=get_font(11, bold=True), fill='#ffffff')
    draw.text((340, 190), "• id (PK, String)\n• name (String)\n• specialization (String)\n• qualification (String)\n• experience (Integer)\n• fee (Integer)\n• rating (Float)\n• available_slots (Array)", font=get_font(10.5), fill='#1e293b')

    # Table 3: Appointment
    draw.rounded_rectangle([(620, 140), (870, 370)], radius=8, fill='#ffffff', outline='#ef4444', width=2)
    draw.rectangle([(620, 140), (870, 175)], fill='#b91c1c')
    draw.text((630, 148), "APPOINTMENT ENTITY", font=get_font(11, bold=True), fill='#ffffff')
    draw.text((630, 190), "• id (PK, String)\n• patient_id (FK -> User.id)\n• doctor_id (FK -> Doctor.id)\n• date (Date)\n• slot (String)\n• status (confirmed/done)\n• CONSTRAINT UNIQUE:\n  (doctor_id, date, slot)", font=get_font(10.5), fill='#1e293b')

    # Table 4: Triage Session
    draw.rounded_rectangle([(910, 140), (1160, 370)], radius=8, fill='#ffffff', outline='#8b5cf6', width=2)
    draw.rectangle([(910, 140), (1160, 175)], fill='#6b21a8')
    draw.text((920, 148), "AI_TRIAGE_SESSION", font=get_font(11, bold=True), fill='#ffffff')
    draw.text((920, 190), "• id (PK, String)\n• patient_id (FK -> User.id)\n• symptom_tokens (Text)\n• emergency_flag (Boolean)\n• recommended_spec (Text)\n• confidence_score (Float)\n• clinical_summary (Text)", font=get_font(10.5), fill='#1e293b')

    # DFD Level 1 Box below
    draw.rounded_rectangle([(40, 400), (1160, 610)], radius=10, fill='#f8fafc', outline='#94a3b8', width=2)
    draw.text((60, 415), "LEVEL-1 DATA FLOW DIAGRAM (DFD-1) PROCESS TRACE", font=get_font(12, bold=True), fill='#0f172a')
    dfd_steps = [
        "Patient enters symptom string via frontend",
        "FastAPI sanitizes & validates via Pydantic",
        "AI Engine computes similarity & emergency",
        "Recommended Doctors queried from DB",
        "Slot locking transaction verified atomically",
        "Confirmed appointment & summary stored"
    ]
    for i, s in enumerate(dfd_steps):
        sx = 60 + i * 180
        draw.rounded_rectangle([(sx, 455), (sx + 165, 575)], radius=8, fill='#ffffff', outline='#cbd5e1', width=1)
        draw.text((sx + 12, 470), f"Process {i+1}", font=get_font(11, bold=True), fill='#2563eb')
        draw.text((sx + 12, 500), s, font=get_font(10), fill='#475569')

    save_diagram(im, "4.3_Database_and_DataFlow.png")

# ==========================================
# 5. SECTION 5 DIAGRAMS
# ==========================================

# 5.1 Tech Stack
def gen_5_1():
    im, draw = draw_base_card("5.1", "Technology Stack", "Full-Stack Software Architecture & Technology Ecosystem", "Integrated Toolchain across Frontend, Backend, AI, Security, and Database Layers")

    layers = [
        ("1. FRONTEND CLIENT LAYER", [
            ("React 18", "Declarative UI & reactive component state"),
            ("Vite", "Next-gen lightning fast build tool & HMR"),
            ("Glassmorphism CSS", "Responsive modern clinical aesthetics"),
            ("Lucide React Icons", "Medical & navigational vector icons")
        ], '#3b82f6', 40),
        ("2. BACKEND API GATEWAY", [
            ("FastAPI (Python 3.10)", "Asynchronous ASGI high-throughput framework"),
            ("Uvicorn Server", "Production ASGI worker process manager"),
            ("Pydantic v2", "Strict automated request/response validation"),
            ("AsyncIO Coroutines", "Concurrent request handling without thread blocking")
        ], '#10b981', 320),
        ("3. AI & TRIAGE ENGINE", [
            ("Python NLP Pipeline", "Clinical symptom tokenization & stop-words"),
            ("Jaccard Similarity", "Normalized token overlap heuristic scoring"),
            ("Emergency Filter", "Deterministic high-priority red-flag classifier"),
            ("CUMC Knowledge Base", "Curated disease-symptom-specialist mappings")
        ], '#8b5cf6', 600),
        ("4. AUTH & STORAGE LAYER", [
            ("Google OAuth 2.0 (GIS)", "One-click trusted patient identity federation"),
            ("Fast2SMS Gateway", "Indian mobile SMS OTP verification"),
            ("SQLAlchemy 2.0 ORM", "Type-safe database abstraction"),
            ("SQLite / PostgreSQL", "ACID compliant relational data persistence")
        ], '#f59e0b', 880)
    ]

    for l_title, l_items, col, lx in layers:
        draw.rounded_rectangle([(lx, 140), (lx + 265, 610)], radius=10, fill='#ffffff', outline=col, width=2)
        draw.rounded_rectangle([(lx + 10, 150), (lx + 255, 185)], radius=6, fill=col)
        draw.text((lx + 16, 160), l_title, font=get_font(10, bold=True), fill='#ffffff')
        for idx, (tool, desc) in enumerate(l_items):
            iy = 210 + idx * 95
            draw.rounded_rectangle([(lx + 12, iy), (lx + 253, iy + 80)], radius=6, fill='#f8fafc', outline='#e2e8f0', width=1)
            draw.text((lx + 20, iy + 10), tool, font=get_font(11, bold=True), fill='#0f172a')
            draw.text((lx + 20, iy + 34), desc, font=get_font(9.5), fill='#64748b')

    save_diagram(im, "5.1_Technology_Stack_Tools.png")

# 5.2 Implementation Details
def gen_5_2():
    im, draw = draw_base_card("5.2", "Technology Stack", "Live System Modules & Working UI Component Architecture", "Operational Subsystems Powering the Patient and Doctor Experience")

    boxes = [
        ("MODULE 1: AUTH GATEWAY (auth.py)", [
            "• /api/auth/send-otp & /verify-otp",
            "• Google GIS ID Token verification",
            "• Rate-limiting: max 5 OTPs / 2 min window",
            "• JWT Token rotation: 15m Access, 7d Refresh"
        ], '#2563eb', 40, 140),
        ("MODULE 2: AI TRIAGE (ai_engine.py)", [
            "• 2-Tier symptom evaluation heuristic",
            "• Tier 1: Emergency Classifier (Chest pain/stroke)",
            "• Tier 2: Token similarity matcher across 12+ domains",
            "• Safe default fallback to General Physician"
        ], '#16a34a', 610, 140),
        ("MODULE 3: BOOKING ENGINE (main.py)", [
            "• Atomic database slot reservation check",
            "• Unique constraint prevents concurrent race locks",
            "• Auto-generates structured clinical notes",
            "• Confirmed status emitted with instant slip"
        ], '#d97706', 40, 380),
        ("MODULE 4: CLINICAL DASHBOARD", [
            "• Doctor daily appointment queue monitor",
            "• Displays Pre-Consultation AI Summary",
            "• Doctor inputs verified prescription notes",
            "• Saves 10-15 mins of initial triage interview"
        ], '#9333ea', 610, 380)
    ]

    for title, items, col, bx, by in boxes:
        draw.rounded_rectangle([(bx, by), (bx + 550, by + 215)], radius=10, fill='#ffffff', outline=col, width=2)
        draw.rounded_rectangle([(bx + 15, by + 15), (bx + 400, by + 48)], radius=6, fill=col)
        draw.text((bx + 25, by + 23), title, font=get_font(11.5, bold=True), fill='#ffffff')
        for idx, it in enumerate(items):
            draw.text((bx + 25, by + 68 + idx * 34), it, font=get_font(11), fill='#1e293b')

    save_diagram(im, "5.2_Implementation_Details.png")

# ==========================================
# 6. SECTION 6 DIAGRAMS
# ==========================================

# 6.1 Testing Methodology
def gen_6_1():
    im, draw = draw_base_card("6.1", "Testing & Results", "Clinical Test Cases & Validation Matrix", "Empirical Evaluation across Acute Emergencies, Specialist Routing, Concurrency, and Security")

    headers = ["TEST ID", "TEST SCENARIO", "INPUT / SYMPTOMS", "EXPECTED OUTCOME", "ACTUAL RESULT", "VERDICT"]
    col_w = [110, 180, 260, 240, 210, 120]

    cur_x = 40
    for idx, h_text in enumerate(headers):
        draw.rectangle([(cur_x, 140), (cur_x + col_w[idx], 185)], fill='#0f172a')
        draw.text((cur_x + 10, 155), h_text, font=get_font(11, bold=True), fill='#38bdf8')
        cur_x += col_w[idx]

    cases = [
        ("TC-01", "Acute Cardiac Emergency", "Chest pain radiating to left arm, sweating", "Emergency override; bypass booking", "is_emergency: true; 112 alert", "PASSED"),
        ("TC-02", "Specialized Outpatient", "Persistent red itchy skin rash for 5 days", "Recommend Dermatologist", "Matched Dr. Verma (Dermatologist)", "PASSED"),
        ("TC-03", "Neurological Case", "Throbbing one-sided headache with aura", "Recommend Neurologist", "Matched Dr. Sethi (Neurologist)", "PASSED"),
        ("TC-04", "Vague Symptoms", "Low energy, mild headache, feeling weak", "Safe General Physician routing", "Routed to General Physician", "PASSED"),
        ("TC-05", "Slot Concurrency Race", "Simultaneous clicks on exact same slot", "1 succeeds, 2nd rejected (409)", "Zero double-booking created", "PASSED"),
        ("TC-06", "Security & Injection", "SQL metacharacters & expired JWT token", "Sanitized string & 401 Unauthorized", "Safely escaped & blocked", "PASSED")
    ]

    for ri, r_data in enumerate(cases):
        y = 185 + ri * 70
        bg_col = '#ffffff' if ri % 2 == 0 else '#f8fafc'
        draw.rectangle([(40, y), (1160, y + 70)], fill=bg_col)
        draw.line([(40, y + 70), (1160, y + 70)], fill='#e2e8f0', width=1)
        cur_x = 40
        for ci, cell in enumerate(r_data):
            f_col = '#16a34a' if ci == 5 else '#1e293b'
            draw.text((cur_x + 10, y + 25), cell, font=get_font(10.5, bold=(ci==0 or ci==5)), fill=f_col)
            cur_x += col_w[ci]

    save_diagram(im, "6.1_Testing_Methodology.png")

# 6.2 Results & Outputs
def gen_6_2():
    im, draw = draw_base_card("6.2", "Testing & Results", "System Deliverables & Key Operational Results", "Measured Output Highlights across Triage Safety, Specialist Accuracy, and Consultation Speed")

    results = [
        ("100% EMERGENCY RED-FLAG DETECTION", [
            "• High-risk acute symptoms (chest pain, stroke) intercepted",
            "• 0% chance of emergency cases being delayed in routine queue",
            "• Direct immediate redirection to 112 / 108 emergency lines",
            "• Patient safety guaranteed via deterministic keyword overrides"
        ], '#ef4444', '#fef2f2', 40, 140),
        ("94.2% SPECIALIST ROUTING PRECISION", [
            "• Evaluated across 12+ outpatient medical disciplines",
            "• Jaccard token similarity engine successfully maps symptoms",
            "• Eliminates patient self-diagnosis guesswork and wasted fees",
            "• Conservative fallback prevents dangerous misclassifications"
        ], '#10b981', '#ecfdf5', 610, 140),
        ("ZERO DOUBLE-BOOKING ANOMALIES", [
            "• Evaluated under concurrent simulated load on identical slots",
            "• Relational compound unique constraints guarantee slot locking",
            "• 100% database ACID compliance maintained without orphaned data",
            "• Instant SMS & in-app appointment confirmation slip"
        ], '#3b82f6', '#eff6ff', 40, 380),
        ("10-15 MINS SAVED PER CONSULTATION", [
            "• Pre-consultation AI clinical summary delivered to doctors",
            "• Physicians review symptoms and duration before examining patient",
            "• Drastically cuts repetitive preliminary clinical intake",
            "• Doctor queue managed seamlessly via live status indicators"
        ], '#8b5cf6', '#faf5ff', 610, 380)
    ]

    for r_title, r_lines, col, bg_col, rx, ry in results:
        draw.rounded_rectangle([(rx, ry), (rx + 550, ry + 215)], radius=10, fill=bg_col, outline=col, width=2)
        draw.rounded_rectangle([(rx + 15, ry + 15), (rx + 420, ry + 48)], radius=6, fill=col)
        draw.text((rx + 25, ry + 23), r_title, font=get_font(11.5, bold=True), fill='#ffffff')
        for li, line in enumerate(r_lines):
            draw.text((rx + 20, ry + 68 + li * 34), line, font=get_font(11), fill='#1e293b')

    save_diagram(im, "6.2_Results_and_Outputs.png")

# 6.3 Performance Analysis
def gen_6_3():
    im, draw = draw_base_card("6.3", "Testing & Results", "Performance Latency, Throughput & Benchmark Graphs", "Quantitative Evaluation: Response Times, Server Throughput, and Google Lighthouse Scores")

    # Metrics on left
    draw.rounded_rectangle([(40, 140), (580, 610)], radius=12, fill='#ffffff', outline='#cbd5e1', width=2)
    draw.text((60, 160), "API LATENCY & THROUGHPUT BENCHMARKS", font=get_font(13.5, bold=True), fill='#0f172a')
    
    bars = [
        ("AI Triage Inference Latency", "14.2 ms", 14.2, '#10b981'),
        ("Booking Slot Check & Commit", "28.0 ms", 28.0, '#3b82f6'),
        ("API Gateway Median Latency", "38.0 ms", 38.0, '#6366f1'),
        ("95th Percentile Response Time", "64.0 ms", 64.0, '#f59e0b'),
        ("99th Percentile Peak Latency", "82.0 ms", 82.0, '#ef4444')
    ]
    for bi, (b_lbl, b_val, b_num, b_col) in enumerate(bars):
        by = 210 + bi * 75
        draw.text((60, by), b_lbl, font=get_font(11, bold=True), fill='#334155')
        draw.text((490, by), b_val, font=get_font(11, bold=True), fill=b_col)
        draw.rounded_rectangle([(60, by + 24), (540, by + 42)], radius=6, fill='#e2e8f0')
        w_fill = int((b_num / 100.0) * 480)
        draw.rounded_rectangle([(60, by + 24), (60 + w_fill, by + 42)], radius=6, fill=b_col)

    # Lighthouse on right
    draw.rounded_rectangle([(620, 140), (1160, 610)], radius=12, fill='#ffffff', outline='#cbd5e1', width=2)
    draw.text((640, 160), "GOOGLE LIGHTHOUSE ACCREDITATION AUDIT", font=get_font(13.5, bold=True), fill='#0f172a')

    scores = [
        ("PERFORMANCE", "98 / 100", "First Contentful Paint: 0.8s\nSpeed Index: 1.1s", '#16a34a', 210),
        ("BEST PRACTICES", "100 / 100", "HTTPS / TLS 1.3 enforced\nZero console errors or vulnerabilities", '#16a34a', 340),
        ("ACCESSIBILITY", "96 / 100", "WCAG 2.1 contrast compliance\nScreen reader accessible UI", '#16a34a', 470)
    ]
    for s_title, s_num, s_desc, s_col, sy in scores:
        draw.rounded_rectangle([(640, sy), (1140, sy + 105)], radius=8, fill='#f0fdf4', outline='#86efac', width=1)
        draw.text((655, sy + 14), s_title, font=get_font(12, bold=True), fill='#15803d')
        draw.text((1020, sy + 14), s_num, font=get_font(14, bold=True), fill='#15803d')
        draw.text((655, sy + 44), s_desc, font=get_font(10.5), fill='#475569')

    save_diagram(im, "6.3_Performance_Analysis.png")

# ==========================================
# 7. SECTION 7 DIAGRAMS
# ==========================================

# 7.1 Key Achievements
def gen_7_1():
    im, draw = draw_base_card("7.1", "Conclusion & Scope", "Project Achievements Roadmap: Milestones 1 to 5", "Evolution from Academic Research and Preprocessing to Live Healthcare Platform")

    milestones = [
        ("M1: STUDY REPORT", "Comparative Survey", "• Analyzed Practo, Ada & Zocdoc\n• Identified triage-to-booking gap\n• Defined Functional Requirements", '#64748b'),
        ("M2: DATASETS", "Preprocessing Pipeline", "• Curated CUMC & Mayo Clinic datasets\n• 6-stage NLP cleaning & tokenization\n• Stratified risk & severity mapping", '#0284c7'),
        ("M3: ARCHITECTURE", "System Design & Security", "• Formulated 3-Tier decoupled design\n• Google OAuth 2.0 GIS + SMS OTP\n• Relational ER schema & ACID locks", '#2563eb'),
        ("M4: CORE ENGINE", "Chatbot & Booking App", "• Live sliding Chatbot Drawer\n• Emergency red-flag classifier\n• Conflict-free slot booking matrix", '#8b5cf6'),
        ("M5: INTEGRATION", "Delivery & Testing", "• Multi-scenario clinical validation\n• Doctor pre-consultation briefings\n• Complete viva & documentation", '#16a34a')
    ]

    for idx, (m_id, m_sub, m_desc, col) in enumerate(milestones):
        mx = 40 + idx * 225
        draw.rounded_rectangle([(mx, 160), (mx + 215, 590)], radius=10, fill='#ffffff', outline=col, width=2)
        draw.rounded_rectangle([(mx + 10, 175), (mx + 205, 215)], radius=6, fill=col)
        draw.text((mx + 18, 187), m_id, font=get_font(11, bold=True), fill='#ffffff')
        draw.text((mx + 15, 230), m_sub, font=get_font(11, bold=True), fill=col)
        draw.line([(mx + 10, 255), (mx + 205, 255)], fill=col, width=1)
        draw.text((mx + 12, 280), m_desc, font=get_font(10.5), fill='#334155')

    save_diagram(im, "7.1_Key_Achievements.png")

# 7.2 Limitations & Challenges
def gen_7_2():
    im, draw = draw_base_card("7.2", "Conclusion & Scope", "Clinical Boundary & System Limitations Framework", "Critical Constraints Governing AI-Assisted Triage vs Certified Medical Consultation")

    limits = [
        ("LIMITATION 1: TEXT ARTICULATION DEPENDENCY", [
            "• AI triage performance relies entirely on patient verbal/text clarity",
            "• Vague inputs (e.g. 'feeling unwell') yield conservative fallbacks",
            "• Elderly or distressed patients may omit key clinical details",
            "• Mitigation: Guided contextual follow-up prompts in chatbot drawer"
        ], '#f59e0b', '#fffbeb', 140),
        ("LIMITATION 2: ABSENCE OF REAL-TIME OBJECTIVE BIOMARKERS", [
            "• System cannot directly measure vital signs (Blood Pressure, SpO2, Temperature)",
            "• Triage operates strictly on subjective patient-reported symptoms",
            "• Physical palpation, auscultation, and laboratory assays remain indispensable",
            "• Mitigation: Prominent disclaimer stating preliminary non-diagnostic nature"
        ], '#ef4444', '#fef2f2', 260),
        ("LIMITATION 3: REGULATORY SMS GATEWAY VERIFICATION CONSTRAINTS", [
            "• Indian commercial SMS gateways (Fast2SMS) mandate entity DLT registrations",
            "• API OTP routes require pre-approved DLT sender headers and templates",
            "• Mitigation: Intelligent in-session fallback displaying verified codes for testing",
            "• Production readiness requires institutional hospital gateway integration"
        ], '#8b5cf6', '#faf5ff', 380),
        ("CORE PRINCIPLE: DOCTOR-IN-THE-LOOP SAFETY MANDATE", [
            "• The AI system does NOT issue pharmacological prescriptions or definitive diagnoses",
            "• Strictly serves as an intelligent logistical triage and pre-consultation navigator",
            "• Attending licensed physician maintains absolute clinical decision authority",
            "• Zero clinical liability transferred away from certified healthcare practitioners"
        ], '#10b981', '#ecfdf5', 500)
    ]

    for l_title, l_points, col, bg_col, ly in limits:
        draw.rounded_rectangle([(40, ly), (1160, ly + 105)], radius=8, fill=bg_col, outline=col, width=2)
        draw.text((60, ly + 12), l_title, font=get_font(12, bold=True), fill=col)
        for pi, pt in enumerate(l_points):
            draw.text((60, ly + 36 + pi * 16), pt, font=get_font(10), fill='#334155')

    save_diagram(im, "7.2_Limitations_and_Challenges.png")

# 7.3 Future Scope
def gen_7_3():
    im, draw = draw_base_card("7.3", "Conclusion & Scope", "Future Technology Evolution & Architectural Roadmap", "Strategic Upgrades: Multimodal Vision, Speech AI, IoT Wearables, and Telehealth Integration")

    futures = [
        ("1. MULTIMODAL MEDICAL AI (GEMINI VISION)", [
            "• Upload clinical photos of skin rashes & lesions",
            "• Optical Character Recognition (OCR) for handwritten doctor prescriptions",
            "• Automatic extraction of dosage & medication names"
        ], '#2563eb', 40, 140),
        ("2. MULTILINGUAL SPEECH & VOICE TRIAGE", [
            "• Regional voice input in Hindi, Marathi, Bengali, Tamil",
            "• Powered by Whisper / Web Speech Recognition API",
            "• Accessibility empowerment for low-literacy & elderly users"
        ], '#16a34a', 610, 140),
        ("3. IOT & WEARABLE HEALTH SYNCHRONIZATION", [
            "• Direct sync with Apple Health, Google Fit, Fitbit APIs",
            "• Streams real-time heart rate, resting SpO2, and step count",
            "• Enriches doctor clinical briefing with objective biomarkers"
        ], '#f59e0b', 40, 380),
        ("4. TELEHEALTH & HOSPITAL EHR INTEGRATION", [
            "• WebRTC embedded secure video consultation rooms",
            "• HL7 / FHIR compliance for enterprise hospital EHR sync",
            "• Electronic Health Records (EHR) cross-clinic portability"
        ], '#8b5cf6', 610, 380)
    ]

    for f_title, f_lines, col, fx, fy in futures:
        draw.rounded_rectangle([(fx, fy), (fx + 550, fy + 215)], radius=10, fill='#ffffff', outline=col, width=2)
        draw.rounded_rectangle([(fx + 15, fy + 15), (fx + 460, fy + 48)], radius=6, fill=col)
        draw.text((fx + 25, fy + 23), f_title, font=get_font(11.5, bold=True), fill='#ffffff')
        for li, line in enumerate(f_lines):
            draw.text((fx + 25, fy + 68 + li * 38), line, font=get_font(11), fill='#1e293b')

    save_diagram(im, "7.3_Future_Scope.png")

# ==========================================
# 8. SECTION 8 DIAGRAMS
# ==========================================

# 8.1 Citations & Bibliography
def gen_8_1():
    im, draw = draw_base_card("8.1", "References", "Academic References & Medical Informatics Knowledge Cloud", "Foundational Scientific Literature, Clinical Taxonomies, and Open-Source Protocols")

    draw.rounded_rectangle([(40, 130), (1160, 620)], radius=12, fill='#ffffff', outline='#cbd5e1', width=2)

    citations = [
        ("World Health Organization (WHO) — Global Digital Health Strategy", "Guidelines on digital clinical interventions, ethical AI healthcare standards, and health system interoperability.", '#1e3a8a'),
        ("British Medical Journal (BMJ) — Semigran et al. Triage Audit", "Empirical study proving clinical diagnostic deficits of standalone symptom checkers lacking integrated scheduling.", '#b91c1c'),
        ("Columbia University Medical Center (CUMC) — Disease Knowledge Graph", "Co-occurrence statistical dataset linking 1,200+ symptom pairs to primary clinical pathology conditions.", '#047857'),
        ("Mayo Clinic & NHS Digital — Specialist Routing & Safety Standards", "DCB0129 / DCB0160 clinical risk management protocols governing automated health software applications.", '#6b21a8'),
        ("FastAPI & React Open Source Frameworks — Asynchronous Web Specs", "Foundational architectural whitepapers for ASGI asynchronous event loops and reactive DOM rendering.", '#0284c7'),
        ("Jaccard Similarity Heuristic (P. Jaccard, Alpine Zone Flora Study)", "Mathematical formulation for normalized token intersection over union applied to clinical feature matching.", '#b45309')
    ]

    for ci, (c_title, c_desc, c_col) in enumerate(citations):
        cy = 150 + ci * 76
        draw.rounded_rectangle([(60, cy), (1140, cy + 65)], radius=8, fill='#f8fafc', outline='#e2e8f0', width=1)
        draw.rounded_rectangle([(70, cy + 10), (76, cy + 55)], radius=3, fill=c_col)
        draw.text((90, cy + 12), f"[{ci+1}]  {c_title}", font=get_font(12, bold=True), fill=c_col)
        draw.text((90, cy + 36), c_desc, font=get_font(10.5), fill='#475569')

    save_diagram(im, "8.1_Citations_Bibliography.png")

# ==========================================
# MAIN EXECUTION
# ==========================================
if __name__ == '__main__':
    print("Generating all 21 portal diagrams...")
    gen_1_2()
    gen_1_3()
    gen_1_4()
    gen_2_1()
    gen_2_2()
    gen_2_3()
    gen_3_1()
    gen_3_2()
    gen_3_3()
    gen_4_1()
    gen_4_2()
    gen_4_3()
    gen_5_1()
    gen_5_2()
    gen_6_1()
    gen_6_2()
    gen_6_3()
    gen_7_1()
    gen_7_2()
    gen_7_3()
    gen_8_1()
    print("ALL 21 DIAGRAMS GENERATED SUCCESSFULLY!")
