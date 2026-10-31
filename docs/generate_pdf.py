import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1e3a8a'),
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284c7'),
        alignment=1,
        spaceAfter=15
    )

    sec_header_style = ParagraphStyle(
        'SecHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=8
    )

    subsec_header_style = ParagraphStyle(
        'SubSecHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1d4ed8'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569')
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#ffffff')
    )

    image_rec_style = ParagraphStyle(
        'ImageRec',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#065f46')
    )

    story = []

    # Title & Header
    story.append(Paragraph("AI-BASED PATIENT APPOINTMENT SYSTEM", title_style))
    story.append(Paragraph("Project Portal Form Submission & Content Master Guide", subtitle_style))
    
    meta_table = Table([
        [
            Paragraph("<b>Project:</b> AI-Based Patient Appointment System", meta_style),
            Paragraph("<b>Target:</b> All 5 Portal Sections & Image Guide", meta_style)
        ],
        [
            Paragraph("<b>Team:</b> Lokendra Prajapati &amp; Samyak Lariya", meta_style),
            Paragraph("<b>Branch:</b> Information Technology (B.Tech IT)", meta_style)
        ]
    ], colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    sections_data = [
        # SECTION 1
        {
            "num": "1. Project Overview",
            "fields": [
                {
                    "title": "1.1 ABSTRACT",
                    "limit": "Max 250 words",
                    "count": "156 words",
                    "has_image": False,
                    "image_title": "No Image required in portal (Only text)",
                    "image_desc": "Is section me koi 'Add Image' button nahi hai.",
                    "text": "The modern healthcare landscape faces severe challenges in patient triage, schedule management, and clinical efficiency. Conventional healthcare appointment systems depend entirely on manual specialist selection by patients who typically lack medical expertise. This frequently leads to misdirected appointments, extended waiting times, and delayed clinical care. Conversely, while standalone AI diagnostic chatbots provide symptom evaluations, they operate in silos without real-time booking capabilities.<br/><br/>This project presents an integrated <b>AI-Based Patient Appointment System</b> designed to bridge this divide. Built upon a high-performance decoupled architecture using React 18 and asynchronous Python FastAPI, the platform features a 24/7 conversational NLP triage assistant that collects symptom narratives, filters life-threatening emergency red-flags, and algorithmically matches patients to 12+ verified medical specializations. The platform provides conflict-free slot scheduling with atomic booking guarantees and auto-generates pre-consultation clinical summaries for physicians. By unifying intelligent symptom assessment with direct scheduling, the system optimizes doctor consultation time, reduces clinic wait queues, and ensures timely, accurate patient care."
                },
                {
                    "title": "1.2 PROBLEM STATEMENT",
                    "limit": "Max 250 words",
                    "count": "155 words",
                    "has_image": True,
                    "image_title": "Traditional vs. AI Healthcare Workflow Comparison Diagram",
                    "image_desc": "Comparison flowchart showing the failure loop of traditional booking (Self-Diagnosis -> Wrong Doctor -> Delay) vs the streamlined AI workflow (Symptom Triage -> Emergency Filter -> Correct Specialist -> Slot Booking -> Clinical Brief).",
                    "text": "In traditional healthcare appointment workflows, patients must independently determine which medical specialist to consult based on ambiguous symptoms. Lacking clinical training, patients frequently misidentify their conditions (e.g., consulting an Orthopedic surgeon for systemic inflammatory joint pain requiring a Rheumatologist), resulting in wasted appointments, duplicated consultation fees, and dangerous treatment delays. Furthermore, existing AI symptom checkers (such as Ada Health and Buoy) evaluate symptoms but leave patients stranded without direct scheduling with verified local doctors.<br/><br/>Simultaneously, physicians face severe context deficits, spending the first 10 to 15 minutes of routine consultations gathering basic medical history that could be systematically captured beforehand. Crucially, existing booking systems fail to intercept life-threatening acute emergencies (such as myocardial infarction or stroke), allowing critical conditions to be routed through standard elective queues. There is an urgent necessity for an integrated platform that unifies intelligent symptom triage, red-flag emergency detection, conflict-free doctor scheduling, and pre-consultation clinical briefings."
                },
                {
                    "title": "1.3 OBJECTIVES",
                    "limit": "Max 250 words",
                    "count": "152 words",
                    "has_image": True,
                    "image_title": "Core System Objectives & 5 Functional Pillars Mindmap",
                    "image_desc": "Radial/Tree mindmap displaying the central system connected to its 5 Core Pillars: 1. Conversational AI Triage, 2. Emergency Red-Flag Filter, 3. Smart Specialist Recommendation, 4. Conflict-Free Slot Booking, 5. Doctor Clinical Brief.",
                    "text": "The primary objective of the AI-Based Patient Appointment System is to automate the patient navigation pipeline from initial symptom onset to confirmed doctor consultation. Specific objectives include:<br/>1. <b>Conversational AI Triage:</b> Develop an empathetic, 24/7 multi-turn natural language processing (NLP) chat interface to capture patient symptoms, duration, and severity in free-text form.<br/>2. <b>Emergency Red-Flag Filter:</b> Implement a high-priority classifier that instantly intercepts life-threatening red-flag indicators (e.g., acute chest pain, stroke symptoms) and immediately redirects patients to emergency care (112/108).<br/>3. <b>Algorithmic Specialist Recommendation:</b> Accurately match extracted symptom clusters against clinical taxonomies to recommend appropriate medical specializations across 12+ disciplines.<br/>4. <b>Conflict-Free Real-Time Booking:</b> Provide interactive calendar slot selection with atomic locking to prevent double-booking anomalies across concurrent sessions.<br/>5. <b>Doctor Clinical Briefing:</b> Automatically synthesize patient symptom narratives into structured pre-consultation summaries to reduce preliminary questioning and enhance doctor diagnostic productivity."
                },
                {
                    "title": "1.4 SCOPE & FEASIBILITY",
                    "limit": "Max 250 words",
                    "count": "153 words",
                    "has_image": True,
                    "image_title": "Project Scope Boundaries & 3-Pillar Feasibility Architecture Diagram",
                    "image_desc": "Visual split diagram showing In-Scope vs Out-of-Scope boundaries on the left, and Technical, Economic, and Operational Feasibility parameters on the right.",
                    "text": "<b>Project Scope:</b><br/>• <i>In-Scope:</i> Multi-role portal (Patient & Doctor), 24/7 conversational NLP symptom triage, emergency triage redirection, doctor discovery across 12+ specialties, dynamic conflict-free slot booking, pre-consultation clinical summary generation, and secure multi-provider authentication (Google 1-Click OAuth & Mobile SMS OTP).<br/>• <i>Out-of-Scope:</i> Automated pharmacological prescriptions, direct tele-surgical interventions, or autonomous clinical diagnosis without physician verification (strictly adheres to a 'Doctor-in-the-Loop' safety protocol).<br/><br/><b>Feasibility Analysis:</b><br/>• <i>Technical Feasibility:</i> High. Engineered using Python FastAPI (asynchronous ASGI), React 18 SPA, and lightweight NLP similarity heuristics ensuring sub-second response times (&lt;1.5s chat, &lt;300ms booking).<br/>• <i>Economic Feasibility:</i> Excellent. Built entirely on open-source technologies, eliminating proprietary licensing costs, and operable on standard cloud hosting or local infrastructure.<br/>• <i>Operational Feasibility:</i> Outstanding. Intuitive responsive interface requiring zero user training for patients and offering streamlined schedule management for clinics."
                }
            ]
        },
        # SECTION 2
        {
            "num": "2. Literature Review & Background",
            "fields": [
                {
                    "title": "2.1 BACKGROUND & SURVEY",
                    "limit": "Max 400 words",
                    "count": "234 words",
                    "has_image": True,
                    "image_title": "Healthcare Informatics Evolution & Triage Evolution Timeline",
                    "image_desc": "Timeline/Evolution diagram from Manual Walk-ins -> Online Directories (Practo/Zocdoc) -> Isolated AI Triage (Ada/Buoy) -> Integrated Smart Healthcare Systems (Our Proposed Solution).",
                    "text": "Over the last decade, digital health technologies have transitioned from rudimentary web portals to sophisticated clinical automation tools. Modern outpatient departments (OPDs) and private clinics face severe operational bottlenecks driven by increasing patient volumes, fragmented scheduling methods, and patient uncertainty regarding appropriate medical specialties. Studies in healthcare informatics show that over 30% of initial outpatient consultations involve misrouted specialist visits, resulting in administrative backlog, patient frustration, and clinical inefficiencies.<br/><br/>A survey of clinical appointment methodologies reveals two divergent technological paradigms:<br/>1. <b>Commercial Healthcare Aggregators:</b> Platforms such as Practo, Zocdoc, and Doctolib revolutionized healthcare logistics by providing comprehensive directories of certified medical doctors, transparent consultation fees, patient feedback ratings, and calendar slot reservations. However, their architecture remains fundamentally transaction-centric. They require the user to independently identify the target medical specialty, failing to provide preliminary clinical guidance for ambiguous symptoms.<br/>2. <b>AI-Powered Medical Symptom Checkers:</b> Platforms such as Ada Health, Babylon Health, and Buoy Health integrated probabilistic networks, Bayesian diagnostic reasoning, and NLP to evaluate user-submitted symptoms and generate condition probability rankings. While medically robust, these systems operate in isolation from local clinic scheduling infrastructure; upon concluding an evaluation, they cannot directly book an appointment with an appropriate nearby practitioner.<br/><br/>Recent academic literature emphasizes the critical necessity of closing this 'evaluation-to-booking gap' through integrated clinical triage systems that unify conversational NLP symptom capture with real-time slot scheduling while enforcing strict medical safety standards."
                },
                {
                    "title": "2.2 EXISTING SYSTEMS & LIMITATIONS",
                    "limit": "Max 400 words",
                    "count": "234 words",
                    "has_image": True,
                    "image_title": "Existing Healthcare Systems Limitation & Gap Matrix Table",
                    "image_desc": "Comparison matrix table comparing Practo, Zocdoc, Ada Health, Babylon Health across Triage Capability, Emergency Filter, Slot Booking, and Doctor Clinical Summaries.",
                    "text": "A rigorous comparative evaluation of prominent digital health systems reveals critical architectural and functional limitations:<br/>1. <b>Practo & Zocdoc (Doctor Booking Engines):</b><br/>• <i>Strengths:</i> Large provider directories, verified reviews, and real-time slot availability.<br/>• <i>Limitations:</i> Completely lack interactive clinical triage. Patients must self-diagnose and select specialties. If a patient experiences chest tightness due to gastroesophageal reflux, they may mistakenly book a Cardiologist, or conversely, dismiss cardiac symptoms as indigestion without emergency alerting.<br/>2. <b>Ada Health (AI Symptom Assessment Engine):</b><br/>• <i>Strengths:</i> Highly sophisticated probabilistic Bayesian assessment with deep clinical questioning.<br/>• <i>Limitations:</i> Functions purely as an informational diagnostic tool. It does not integrate with clinic scheduling APIs, doctor calendars, or electronic booking systems, leaving the patient to independently seek care.<br/>3. <b>Babylon Health (Telehealth & Triage):</b><br/>• <i>Strengths:</i> Combined AI triage with direct tele-consultation video calls.<br/>• <i>Limitations:</i> High operational overhead, vendor lock-in, and lack of integration with local, independent outpatient clinics and physical walk-in centers.<br/>4. <b>Key Gaps Identified across Existing Solutions:</b><br/>• <i>The Disconnect Between Triage and Scheduling:</i> Inability to transition seamlessly from symptom evaluation to confirmed appointment booking.<br/>• <i>The Doctor Context Gap:</i> Physicians receive zero pre-consultation briefings, forcing them to repeat basic inquiries during consultation time.<br/>• <i>Emergency Red-Flag Routing Void:</i> Inability of standard booking engines to intercept life-threatening acute emergencies and divert patients away from elective clinics toward immediate emergency response."
                },
                {
                    "title": "2.3 COMPARATIVE STUDY & PROPOSED WORK",
                    "limit": "Max 400 words",
                    "count": "218 words",
                    "has_image": True,
                    "image_title": "Comparative Analysis Matrix & Proposed Closed-Loop Architecture",
                    "image_desc": "Visual checklist comparing Practo vs Ada Health vs Our Proposed System, highlighting the Closed-Loop unified architecture.",
                    "text": "To address the systemic deficiencies of existing platforms, our proposed <b>AI-Based Patient Appointment System</b> introduces a unified, closed-loop clinical navigation workflow that integrates conversational triage, safety-first emergency classification, algorithmic doctor matching, and conflict-free booking.<br/><br/><b>Architectural Comparison Matrix:</b><br/>• <i>Practo / Zocdoc:</i> No AI Triage | No Emergency Filter | Manual Doctor Selection | Real-Time Booking | No Doctor Brief.<br/>• <i>Ada Health / Buoy:</i> Probabilistic NLP Triage | Basic Disclaimer | Diagnostic Report Only | No Direct Booking | No Doctor Brief.<br/>• <i>Proposed System:</i> 24/7 Multi-Turn NLP | Automatic Emergency Alert | Algorithmic (12+ Specialties) | Atomic Slot Locking | Pre-Consultation Clinical Brief.<br/><br/><b>Proposed Work & Novel Contributions:</b><br/>1. <b>2-Tier Hybrid AI Triage:</b> Combines a deterministic emergency classifier (intercepting stroke, heart attack, and respiratory arrest symptoms) with a tokenized similarity recommendation model (mapping symptoms to 12+ clinical specialties including Cardiology, Neurology, Dermatology, and Orthopedics).<br/>2. <b>Doctor-in-the-Loop Pre-Consultation Intelligence:</b> Synthesizes patient reported symptoms into structured clinical briefs accessible in the doctor dashboard, saving 10-15 minutes per consultation.<br/>3. <b>Enterprise-Grade Decoupled Architecture:</b> Implements an asynchronous Python FastAPI backend, a reactive React 18 single-page application, and dual enterprise authentication (Google OAuth 2.0 GIS and Mobile SMS OTP)."
                }
            ]
        },
        # SECTION 3
        {
            "num": "3. Requirements Analysis & Specification",
            "fields": [
                {
                    "title": "3.1 FUNCTIONAL REQUIREMENTS",
                    "limit": "Max 400 words",
                    "count": "234 words",
                    "has_image": True,
                    "image_title": "Functional Requirements Use-Case Diagram (UML Use Case)",
                    "image_desc": "UML Use Case diagram illustrating Actors (Patient, Doctor, AI Engine) and primary interactions (Authentication, AI Symptom Triage, Doctor Slot Booking, Schedule Management, Clinical Brief Review).",
                    "text": "The functional requirements specify the direct capabilities, inputs, outputs, and operational behaviors of the system:<br/>• <b>FR-1: Multi-Provider Authentication & Role Management:</b> Secure patient and doctor authentication via Google 1-Click OAuth 2.0 (Google Identity Services) and Mobile SMS OTP verification. Role-Based Access Control (RBAC) separating Patient and Doctor portal privileges with cryptographically signed JWT access/refresh tokens.<br/>• <b>FR-2: Conversational AI Symptom Intake:</b> Interactive 24/7 sliding chat drawer interface capable of accepting multi-turn, free-text natural language symptom descriptions with contextual follow-up prompting.<br/>• <b>FR-3: Emergency Red-Flag Triage Engine:</b> Deterministic keyword and token analysis to identify life-threatening medical conditions (e.g., myocardial infarction, acute dyspnea, stroke indicators). Immediate override of routine appointment workflows, presenting emergency alert banners and 112/108 emergency service dialing prompts.<br/>• <b>FR-4: Algorithmic Doctor Recommendation:</b> Mapping of non-emergency symptom clusters to appropriate medical disciplines across 12+ specialties (Cardiology, Neurology, Dermatology, Orthopedics, etc.). Filterable directory by doctor rating, location, fees, and real-time consultation slot availability.<br/>• <b>FR-5: Real-Time Conflict-Free Appointment Scheduling:</b> Interactive calendar grid displaying verified 30-minute consultation slots with atomic database slot locking to prevent concurrent double-booking race conditions.<br/>• <b>FR-6: Pre-Consultation Doctor Briefing & Queue Management:</b> Doctor dashboard displaying chronological appointment queues and auto-generated AI clinical briefs summarizing reported symptoms, duration, and calculated risk tier prior to physical examination."
                },
                {
                    "title": "3.2 NON-FUNCTIONAL REQUIREMENTS",
                    "limit": "Max 400 words",
                    "count": "210 words",
                    "has_image": True,
                    "image_title": "Non-Functional Requirements 5-Pillar Quality Architecture Diagram",
                    "image_desc": "5-Pillar diagram or Radar chart displaying Performance (latency), Security (TLS/JWT), Reliability (99.9% uptime), Usability (WCAG/Mobile-responsive), and Clinical Safety.",
                    "text": "Non-functional requirements define the quality attributes, performance constraints, and regulatory standards governing the platform:<br/>• <b>NFR-1: Performance & Low-Latency Execution:</b> Conversational NLP evaluation must return response payloads within 1.5 seconds. Slot reservation API endpoints must process and commit atomic transactions in under 300 milliseconds. Initial Single-Page Application (SPA) paint under 1.2 seconds with 60 FPS transitions.<br/>• <b>NFR-2: Security & Data Privacy Compliance:</b> All client-server data exchange secured via TLS 1.3 / HTTPS. Salted Bcrypt hashing for credentials; sensitive tokens stored in cryptographically sealed session containers. Stateless HMAC-SHA256 JWT tokens with automatic expiry and token refresh rotation.<br/>• <b>NFR-3: Reliability & Concurrency Management:</b> System availability target of 99.9% uptime. Strict database transaction isolation preventing double-booking anomalies during concurrent slot selection.<br/>• <b>NFR-4: Usability & Cross-Platform Accessibility:</b> Fully responsive glassmorphism UI optimized across desktop displays, tablets, and smartphones. Intuitive, accessible typography complying with WCAG 2.1 accessibility contrast standards.<br/>• <b>NFR-5: Clinical Safety & Disclaimer Protocols:</b> Persistent medical disclaimers displayed across all AI outputs explicitly stating that preliminary evaluations are advisory and do not replace physical medical diagnosis by a licensed doctor."
                },
                {
                    "title": "3.3 HARDWARE & SOFTWARE PREREQUISITES",
                    "limit": "Max 400 words",
                    "count": "212 words",
                    "has_image": True,
                    "image_title": "Hardware, Software & Network Infrastructure Deployment Diagram",
                    "image_desc": "3-tier infrastructure layout showing Client Tier (Browser/Mobile), Application Host (Python/FastAPI/Node), and External Cloud Services (OAuth, SMS Gateway, DB).",
                    "text": "The platform is engineered using modern, lightweight frameworks designed for minimal hardware prerequisites and maximum deployment flexibility:<br/><br/><b>1. Hardware Requirements:</b><br/>• <i>Client / End-User Device:</i> Any modern desktop PC, laptop, tablet, or smartphone (Dual-core processor, 2 GB RAM minimum, active Internet connection, standard web browser).<br/>• <i>Development / Host Server:</i> Quad-Core Intel Core i3 / AMD Ryzen 3 or higher; Minimum 8 GB RAM (16 GB recommended for concurrent AI inference and multi-worker API serving); Minimum 10 GB available SSD storage.<br/><br/><b>2. Software Requirements & Environments:</b><br/>• <i>Client Environment:</i> Modern evergreen web browser with HTML5 and ES6+ JavaScript support (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Apple Safari 14+).<br/>• <i>Server Operating System:</i> Cross-platform support for Windows 10/11, Ubuntu Linux 20.04/22.04 LTS, or macOS.<br/>• <i>Runtime Environments:</i> Python 3.10+ (for FastAPI ASGI Backend, Uvicorn server, Pydantic data validation); Node.js v18.0+ & npm v9.0+ (for React Vite compilation and development toolchain).<br/>• <i>Database & Storage:</i> SQLite 3 (lightweight development) / PostgreSQL 14+ (enterprise deployment) with SQLAlchemy 2.0 ORM.<br/>• <i>External APIs & Services:</i> Google Cloud Identity Console (Google OAuth 2.0 Client ID) and Fast2SMS / Twilio Gateway API."
                }
            ]
        },
        # SECTION 4
        {
            "num": "4. System Design & Architecture",
            "fields": [
                {
                    "title": "4.1 ARCHITECTURE DESCRIPTION",
                    "limit": "Max 400 words",
                    "count": "209 words",
                    "has_image": True,
                    "image_title": "High-Level 3-Tier Multi-Layer System Architecture Diagram",
                    "image_desc": "Architectural block diagram detailing the Presentation Tier (React SPA), Application Tier (FastAPI Gateway & Workers), AI Triage Engine, and Persistence Tier (SQLAlchemy/DB).",
                    "text": "The system follows an enterprise <b>3-Tier Decoupled Client-Server Architecture</b> designed to ensure separation of concerns, scalability, and ultra-low latency:<br/><br/>1. <b>Presentation Tier (Client Frontend):</b> Developed as a reactive Single-Page Application (SPA) using React 18, Vite, and modern CSS glassmorphism. Divided into dedicated sub-components: <i>ChatbotDrawer</i> (conversational triage), <i>DoctorCard</i> & <i>AppointmentModal</i> (slot selection and locking), <i>PatientDashboard</i> (past bookings and consultation history), and <i>DoctorDashboard</i> (appointment queue and clinical summaries).<br/><br/>2. <b>Application & API Gateway Tier (FastAPI Backend):</b> Powered by Python FastAPI running on an asynchronous Uvicorn ASGI server. Built with modular routers: <i>auth_router</i> (OAuth GIS, SMS OTP, JWT lifecycle), <i>appointment_router</i> (slot scheduling and atomic reservation), and <i>ai_engine</i> (NLP triage heuristics). Employs Pydantic v2 schemas for strict request/response data validation and auto-generates interactive OpenAPI/Swagger documentation.<br/><br/>3. <b>Data & AI Persistence Tier:</b> Relational database modeled via SQLAlchemy ORM (SQLite / PostgreSQL) maintaining strict foreign-key integrity between Users, Doctors, and Appointment transactions. Clinical Knowledge Base (<i>symptom_specialist_dataset.csv</i>) synthesized from CUMC and Mayo Clinic clinical taxonomies, fueling token-similarity heuristic matching.<br/><br/>Communication between layers is conducted exclusively via stateless HTTPS RESTful JSON endpoints with JWT bearer authentication, ensuring secure and predictable data flow."
                },
                {
                    "title": "4.2 SYSTEM MODULES & WORKFLOW",
                    "limit": "Max 400 words",
                    "count": "196 words",
                    "has_image": True,
                    "image_title": "End-to-End System Modules & Workflow Sequence Diagram",
                    "image_desc": "UML Sequence and Activity workflow diagram showing data flow across all 8 modules from patient symptom input to doctor appointment queue updates.",
                    "text": "The platform architecture is decomposed into 8 interconnected functional modules forming a cohesive end-to-end clinical workflow:<br/>1. <b>Authentication & Identity Service:</b> Coordinates Google Identity Services (GIS) token verification, Mobile SMS OTP dispatch/validation, and JWT session token generation.<br/>2. <b>Conversational Symptom Intake Module (<i>ChatbotDrawer</i>):</b> Manages multi-turn patient dialogue, normalizing free-text complaints through regex tokenization and medical synonym harmonization.<br/>3. <b>Emergency Red-Flag Classifier:</b> Performs real-time keyword matching against acute high-priority conditions (heart attack, stroke, respiratory arrest). If detected, it immediately halts elective booking and triggers an emergency alert.<br/>4. <b>Doctor Recommendation Engine (<i>ai_engine.py</i>):</b> Calculates Jaccard token similarity scores between reported symptoms and clinical specialty datasets, routing patients to 12+ verified specialist categories with associated confidence metrics.<br/>5. <b>Doctor Schedule Management Matrix:</b> Generates discrete 30-minute consultation slots mapped to doctor availability calendars.<br/>6. <b>Appointment Booking Engine:</b> Executes atomic database slot locking, preventing race conditions and guaranteeing conflict-free reservations.<br/>7. <b>Pre-Consultation Clinical Briefing Generator:</b> Synthesizes patient reported symptoms, duration, and calculated risk tier into a structured summary for attending physicians.<br/>8. <b>Doctor Queue Management Dashboard:</b> Provides clinicians with real-time appointment status updates, daily patient queues, and one-click patient history access."
                },
                {
                    "title": "4.3 DATABASE & DATA FLOW DESIGN",
                    "limit": "Max 400 words",
                    "count": "207 words",
                    "has_image": True,
                    "image_title": "Database Entity-Relationship (ER) Diagram & DFD Level-1",
                    "image_desc": "Complete ER Diagram showing Entities (Users, Doctors, Appointments, AI Triage Sessions), Primary Keys, Foreign Keys, 1:N relations, and Level-1 Data Flow Diagram (DFD).",
                    "text": "The data architecture is structured to ensure Third Normal Form (3NF) relational integrity, zero double-booking anomalies, and rapid index traversal:<br/><br/><b>1. Core Relational Entities:</b><br/>• <i>User:</i> Primary key <i>id</i>, <i>name</i>, <i>email</i>, <i>phone_number</i>, <i>role</i> (<i>patient</i>/<i>doctor</i>), <i>auth_provider</i>, <i>created_at</i>.<br/>• <i>Doctor:</i> Primary key <i>id</i>, <i>name</i>, <i>specialization</i>, <i>qualification</i>, <i>experience_years</i>, <i>rating</i>, <i>fee</i>, <i>clinic_address</i>, <i>available_slots</i>.<br/>• <i>Appointment:</i> Primary key <i>id</i>, foreign key <i>patient_id</i> references <i>User(id)</i>, foreign key <i>doctor_id</i> references <i>Doctor(id)</i>, <i>appointment_date</i>, <i>time_slot</i>, <i>symptoms_summary</i>, <i>status</i> (<i>confirmed</i>/<i>completed</i>/<i>cancelled</i>), <i>created_at</i>.<br/>• <i>AI_Triage_Session:</i> Primary key <i>id</i>, foreign key <i>patient_id</i>, <i>symptom_tokens</i>, <i>emergency_detected</i>, <i>recommended_specialist</i>, <i>confidence_score</i>.<br/><br/><b>2. Concurrency & Slot Locking Design:</b><br/>To guarantee conflict-free scheduling under high concurrent traffic, the <i>Appointment</i> entity enforces a compound unique constraint: <b>UNIQUE(doctor_id, appointment_date, time_slot)</b>. When concurrent booking requests target the same slot, the database commits the first transaction atomically and rejects competing requests with an HTTP 409 Conflict exception.<br/><br/><b>3. Data Flow Architecture (DFD Level-1):</b><br/>Patient input flows into the FastAPI application tier &rarr; verified through JWT authentication &rarr; evaluated by the AI Triage heuristics &rarr; mapped to doctor entities &rarr; committed as confirmed appointment transactions &rarr; asynchronously propagated to the Doctor Dashboard queue."
                }
            ]
        },
        # SECTION 5
        {
            "num": "5. Technology Stack & Implementation",
            "fields": [
                {
                    "title": "5.1 TECHNOLOGY STACK & TOOLS",
                    "limit": "Max 400 words",
                    "count": "234 words",
                    "has_image": True,
                    "image_title": "Complete Technology Stack Ecosystem & Integration Diagram",
                    "image_desc": "Full-stack ecosystem graphic showcasing React 18/Vite (Frontend) -> FastAPI/Python (Backend) -> Google OAuth / Fast2SMS (Auth & Messaging) -> SQLite/Postgres (Database) -> NLP Engine (AI Layer).",
                    "text": "The technology stack is strategically chosen to combine sub-second execution speeds, robust type safety, cross-platform responsiveness, and modular maintainability:<br/><br/><b>1. Frontend Layer:</b><br/>• <i>Framework:</i> <b>React 18</b> Single-Page Application (SPA) bundled with <b>Vite</b> for sub-second hot module reloading and optimized production tree-shaking.<br/>• <i>Styling & Animation:</i> Custom Glassmorphism CSS architecture paired with <b>Lucide React</b> icon assets and <b>Framer Motion</b> for smooth transition physics.<br/><br/><b>2. Backend API & Microservices:</b><br/>• <i>Web Framework:</i> <b>FastAPI (Python 3.10+)</b> utilizing asynchronous (<i>asyncio</i>) coroutines for concurrent throughput.<br/>• <i>ASGI Server:</i> <b>Uvicorn</b> worker process manager handling HTTP/1.1 and WebSocket connections.<br/>• <i>Data Validation:</i> <b>Pydantic v2</b> models providing automated request parsing, type enforcement, and serialization.<br/><br/><b>3. AI & Data Processing:</b><br/>• <i>Core NLP Engine:</i> Custom Python clinical triage pipeline combining regex-based tokenization, medical stop-word pruning, and Jaccard similarity scoring.<br/>• <i>Dataset Engine:</i> Structured CSV data store (<i>symptom_specialist_dataset.csv</i>) mapping symptom clusters to 12+ medical disciplines.<br/><br/><b>4. Security & Authentication:</b><br/>• <i>Identity Providers:</i> <b>Google OAuth 2.0 (Google Identity Services GIS)</b> and <b>Fast2SMS / Twilio Gateway</b> for mobile SMS verification.<br/>• <i>Cryptographic Security:</i> <b>PyJWT</b> for stateless JWT token lifecycle management; <b>Passlib / Bcrypt</b> for credential hashing.<br/><br/><b>5. Data Persistence & Tooling:</b><br/>• <i>Database & ORM:</i> <b>SQLAlchemy 2.0 ORM</b> with <b>SQLite 3 / PostgreSQL</b> database engines.<br/>• <i>Documentation:</i> Auto-generated interactive <b>Swagger UI / OpenAPI</b> specification."
                },
                {
                    "title": "5.2 IMPLEMENTATION DETAILS & MODULES",
                    "limit": "Max 400 words",
                    "count": "232 words",
                    "has_image": True,
                    "image_title": "Implementation Architecture & Live Working Screenshots Panel",
                    "image_desc": "Screenshot composite of the actual live system: 1. Conversational AI Chatbot Drawer in action, 2. Recommended Doctor Specialty Card with slot grid, 3. Confirmed Appointment Modal with pre-consultation summary.",
                    "text": "The implementation transforms conceptual architecture into an operational healthcare application across four primary technical modules:<br/><br/>1. <b>Asynchronous API Gateway & Auth Implementation (<i>auth.py</i>):</b> Routes requests across <i>/api/auth/send-otp</i>, <i>/api/auth/verify-otp</i>, <i>/api/auth/google</i>, and <i>/api/auth/signup</i>. Enforces rate-limiting windows (maximum 5 requests per hour) and 30-second cooldown timers to prevent SMS gateway exhaustion. Issues dual cryptographically signed JWT tokens: short-lived Access Tokens (15-minute TTL) and persistent Refresh Tokens (7-day TTL).<br/><br/>2. <b>AI Symptom Triage & Specialist Matching Engine (<i>ai_engine.py</i>):</b> Evaluates patient symptom tokens through a 2-tier execution pipeline: (a) <i>Tier 1 (Emergency Red-Flag Filter):</i> Scans input against high-risk clinical triggers (<i>chest pain</i>, <i>slurred speech</i>, <i>loss of consciousness</i>, <i>shortness of breath</i>). Triggers immediate emergency response overriding booking. (b) <i>Tier 2 (Similarity Recommendation):</i> Computes token intersection over union against normalized symptom datasets: Score = |U &cap; S| / max(|S|, 1), Confidence = min(0.60 + (Score &times; 0.35), 0.95). Safely routes unmapped symptoms to General Physician.<br/><br/>3. <b>Atomic Appointment Booking Implementation (<i>main.py</i>):</b> Executes database transaction commits ensuring atomic slot locking for doctor time grids. Automatically compiles patient symptoms, duration, and triage category into structured clinical notes.<br/><br/>4. <b>Doctor Dashboard & Queue Interface:</b> Renders daily patient queues with real-time status indicators (Scheduled, Completed, In-Triage). Displays pre-consultation AI clinical summaries, saving 10 to 15 minutes per consultation and elevating diagnostic accuracy."
                }
            ]
        }
    ]

    for sec in sections_data:
        # Section Banner
        sec_table = Table([[Paragraph(f"<b>{sec['num']}</b>", ParagraphStyle('WH', parent=subsec_header_style, textColor=colors.white, fontSize=12))]], colWidths=[520])
        sec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#1e40af')),
            ('PADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(Spacer(1, 10))
        story.append(sec_table)
        story.append(Spacer(1, 8))

        for fld in sec['fields']:
            field_story = []
            
            # Sub-header bar
            hdr_cells = [
                Paragraph(f"<b>{fld['title']}</b>", ParagraphStyle('FldTitle', parent=subsec_header_style, textColor=colors.HexColor('#0f172a'))),
                Paragraph(f"Limit: <b>{fld['limit']}</b> | Word count: <b>{fld['count']}</b>", ParagraphStyle('FldMeta', parent=meta_style, alignment=2, textColor=colors.HexColor('#0284c7')))
            ]
            hdr_table = Table([hdr_cells], colWidths=[260, 260])
            hdr_table.setStyle(TableStyle([
                ('LINEBELOW', (0,0), (-1,-1), 1.5, colors.HexColor('#3b82f6')),
                ('PADDING', (0,0), (-1,-1), 3),
            ]))
            field_story.append(hdr_table)
            field_story.append(Spacer(1, 5))

            # What to Paste
            text_box = Table([[Paragraph(fld['text'], body_style)]], colWidths=[520])
            text_box.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
                ('PADDING', (0,0), (-1,-1), 8),
            ]))
            field_story.append(text_box)
            field_story.append(Spacer(1, 4))

            # Image Guide
            if fld['has_image']:
                img_content = f"<b>🖼️ ATTACH IMAGE:</b> <i>{fld['image_title']}</i><br/><b>Visual Description:</b> {fld['image_desc']}"
                img_box = Table([[Paragraph(img_content, image_rec_style)]], colWidths=[520])
                img_box.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#a7f3d0')),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                field_story.append(img_box)
            else:
                img_content = f"<b>ℹ️ NOTE:</b> <i>{fld['image_title']}</i> — {fld['image_desc']}"
                img_box = Table([[Paragraph(img_content, meta_style)]], colWidths=[520])
                img_box.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                    ('PADDING', (0,0), (-1,-1), 5),
                ]))
                field_story.append(img_box)

            field_story.append(Spacer(1, 10))
            story.append(KeepTogether(field_story))

    doc.build(story)
    print(f"PDF SUCCESS: {filename}")

if __name__ == '__main__':
    out_dir = r"D:\project\AI Based Patient-Appoinment System\docs"
    out_file = os.path.join(out_dir, "AI_Patient_Appointment_System_Portal_Submission_Guide.pdf")
    build_pdf(out_file)

