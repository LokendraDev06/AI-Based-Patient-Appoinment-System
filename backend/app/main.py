import os
import sys
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Ensure parent directory is in sys.path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Load environment configuration
ENV_PATH = os.path.join(BACKEND_DIR, ".env")
load_dotenv(ENV_PATH)

from app.routers.auth import router as auth_router

try:
    from app.services.ai_engine import assess_symptoms
except ImportError:
    try:
        from services.ai_engine import assess_symptoms
    except ImportError:
        def assess_symptoms(text: str):
            return {
                "assessment": f"Preliminary analysis for symptoms: {text}",
                "recommended_specialist": "General Physician",
                "is_emergency": "chest" in text.lower() or "breath" in text.lower()
            }

app = FastAPI(
    title="MediCare - Enterprise Dual-Auth Healthcare API",
    description="Dual Authentication System with Google OAuth 2.0, Mobile SMS OTP, JWT and AI Healthcare Triage",
    version="2.0.0"
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Router
app.include_router(auth_router)

# In-Memory DOCTORS DB (Verified Gwalior Healthcare Practitioners)
DOCTORS_DB = [
    {
        "id": "doc-gw-103",
        "name": "Dr. Aditya Jain",
        "specialization": "Cardiologist",
        "qualification": "MD, DM (Cardiology)\n15+ Years Experience",
        "clinic": "Aditya Jain Heart Clinic",
        "rating": 4.8,
        "reviews": 412,
        "fee": 500,
        "location": "Hospital Road, opp. old Parwar Hospital,\nLashkar, Gwalior",
        "schedule": "Mon - Sat: 9:00 AM – 8:00 PM\nSun: 11:00 AM – 2:00 PM",
        "phone": "+91 82260 21010",
        "available_slots": [
            "09:30 AM",
            "11:30 AM",
            "04:00 PM",
            "06:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-104",
        "name": "Dr. Gaurav Kavi Bhargava",
        "specialization": "Cardiologist",
        "qualification": "MD, DNB (Cardiology)\n12+ Years Experience",
        "clinic": "Gaurav Heart Care Centre",
        "rating": 4.7,
        "reviews": 356,
        "fee": 600,
        "location": "Hospital Road, near Madhav Dispensary,\nLashkar, Gwalior",
        "schedule": "Daily: 8:30 AM – 10:00 PM",
        "phone": "+91 91799 83355",
        "available_slots": [
            "09:00 AM",
            "12:00 PM",
            "05:00 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-105-p",
        "name": "Dr. Priya Sharma",
        "specialization": "Dermatologist",
        "qualification": "MD (Dermatology)\n8+ Years Experience",
        "clinic": "Skin & Hair Care Clinic",
        "rating": 4.6,
        "reviews": 298,
        "fee": 700,
        "location": "Thatipur, Gwalior, M.P.",
        "schedule": "Mon - Sat: 10:00 AM – 7:00 PM\nSun: 10:00 AM – 1:00 PM",
        "phone": "+91 84510 73004",
        "available_slots": [
            "10:00 AM",
            "01:30 PM",
            "04:30 PM",
            "06:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-111",
        "name": "Dr. Rohan Mehta",
        "specialization": "Orthopedist",
        "qualification": "MS (Orthopedics)\n10+ Years Experience",
        "clinic": "Mehta Bone & Joint Clinic",
        "rating": 4.5,
        "reviews": 261,
        "fee": 500,
        "location": "City Centre, Gwalior, M.P.",
        "schedule": "Mon - Sat: 10:30 AM – 7:30 PM",
        "phone": "+91 98765 11223",
        "available_slots": [
            "10:30 AM",
            "01:15 PM",
            "05:00 PM",
            "07:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-101",
        "name": "Dr. Deepankar Lahariya",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Internal Medicine)\n12+ Years Experience",
        "clinic": "Lahariya Health Clinic",
        "rating": 4.85,
        "reviews": 242,
        "fee": 400,
        "location": "A-21, Basant Vihar Colony, Lashkar, Gwalior",
        "schedule": "Mon–Sat, 9:00 AM–8:00 PM; Sun 9:00 AM–2:00 PM",
        "phone": "+91 77730 08203",
        "available_slots": [
            "09:30 AM",
            "11:30 AM",
            "04:30 PM",
            "07:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-parmar",
        "name": "Dr. Anvesh Parmar",
        "specialization": "Nephrologist",
        "qualification": "MBBS, MD, DM (Nephrology)\nRenal Specialist",
        "clinic": "Dr Parmar Clinic",
        "rating": 4.85,
        "reviews": 174,
        "fee": 700,
        "location": "Gwalior Residency, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 6:00 PM",
        "phone": "+91 75124 88990",
        "available_slots": [
            "10:30 AM",
            "01:00 PM",
            "03:30 PM",
            "05:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-salil",
        "name": "Dr. Akshat Salil",
        "specialization": "Homoeopath",
        "qualification": "BHMS, MD (Homeopathy)\nHolistic Healing Specialist",
        "clinic": "Dr. Jagdish Salil Memorial Homeo Healing Chamber",
        "rating": 4.75,
        "reviews": 112,
        "fee": 500,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 11:00 AM–1:00 PM",
        "phone": "+91 75125 44332",
        "available_slots": [
            "11:00 AM",
            "11:30 AM",
            "12:00 PM",
            "12:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-satpute",
        "name": "Dr. Jitendra Satpute",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Internal Medicine)\nDiabetology Consultant",
        "clinic": "Dr. Aditya Jain Heart Clinic",
        "rating": 4.8,
        "reviews": 198,
        "fee": 300,
        "location": "Gwalior City, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 2:00 PM & 6:00 – 8:00 PM",
        "phone": "+91 82260 21015",
        "available_slots": [
            "10:30 AM",
            "12:30 PM",
            "06:15 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-alind",
        "name": "Dr. Alind Kumar Jain",
        "specialization": "Ayurveda",
        "qualification": "BAMS, MD (Ayurveda)\nSenior Ayurvedic Consultant",
        "clinic": "Jiva Ayurveda",
        "rating": 4.7,
        "reviews": 145,
        "fee": 299,
        "location": "Tulsi Vihar Colony, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 7:00 PM",
        "phone": "+91 75126 77889",
        "available_slots": [
            "10:00 AM",
            "01:30 PM",
            "04:00 PM",
            "06:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-rakhi",
        "name": "Dr. Rakhi Sharma",
        "specialization": "Homoeopath",
        "qualification": "BHMS (Homeopathy)\nChronic Disease Consultant",
        "clinic": "Dr Batra's Positive Health Clinic",
        "rating": 4.65,
        "reviews": 88,
        "fee": 499,
        "location": "Lalitpur Colony, Gwalior",
        "schedule": "Mon - Sat: 11:00 AM – 8:00 PM",
        "phone": "+91 75127 11223",
        "available_slots": [
            "11:30 AM",
            "02:00 PM",
            "04:30 PM",
            "07:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-saurabh",
        "name": "Dr. Saurabh Kalra",
        "specialization": "Homoeopath",
        "qualification": "BHMS, MD (Homeo)\nSenior Homeopathy Consultant",
        "clinic": "Dr Batra's Positive Health Clinic",
        "rating": 4.7,
        "reviews": 94,
        "fee": 499,
        "location": "Lalitpur Colony, Gwalior",
        "schedule": "Mon - Sat: 11:00 AM – 8:00 PM",
        "phone": "+91 75127 11224",
        "available_slots": [
            "11:00 AM",
            "01:15 PM",
            "05:00 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-garg",
        "name": "Dr. Vijay Garg",
        "specialization": "General Physician",
        "qualification": "MBBS, General Medicine\nFamily Healthcare Specialist",
        "clinic": "Swastik Medi Clinic",
        "rating": 4.6,
        "reviews": 160,
        "fee": 150,
        "location": "Tansen Nagar, Gwalior",
        "schedule": "Mon - Sat: 9:30 AM – 1:30 PM & 5:30 – 8:30 PM",
        "phone": "+91 75128 33441",
        "available_slots": [
            "10:00 AM",
            "12:00 PM",
            "06:00 PM",
            "07:45 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-naresh",
        "name": "Dr. Naresh Sharma",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (General Medicine)\nEmergency & Cardiac Physician",
        "clinic": "KMH & GH – Kusum Memorial Heart & General Hospital",
        "rating": 4.8,
        "reviews": 215,
        "fee": 300,
        "location": "Vinay Nagar, Gwalior",
        "schedule": "Daily: 9:00 AM – 2:00 PM & 5:00 – 9:00 PM",
        "phone": "+91 75129 55662",
        "available_slots": [
            "09:30 AM",
            "11:45 AM",
            "05:30 PM",
            "08:15 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-archana",
        "name": "Dr. Archana Gupta",
        "specialization": "Pediatrician",
        "qualification": "MBBS, DCH, MD (Pediatrics & Internal Medicine)",
        "clinic": "Sanjeevan Chikitsalya",
        "rating": 4.85,
        "reviews": 310,
        "fee": 500,
        "location": "Madhav Nagar, Gwalior",
        "schedule": "Mon - Sat: 9:00 AM – 1:00 PM & 5:00 – 8:00 PM",
        "phone": "+91 75124 56789",
        "available_slots": [
            "09:30 AM",
            "11:15 AM",
            "05:15 PM",
            "07:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-parag",
        "name": "Dr. Parag Srivastava",
        "specialization": "Pediatrician",
        "qualification": "MBBS, DCH\nChild Healthcare Specialist",
        "clinic": "Dr. Parag Srivastava Clinic",
        "rating": 4.7,
        "reviews": 185,
        "fee": 200,
        "location": "Thatipur, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 1:30 PM & 6:00 – 8:30 PM",
        "phone": "+91 75123 77884",
        "available_slots": [
            "10:15 AM",
            "12:30 PM",
            "06:30 PM",
            "08:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-iesha",
        "name": "Dr. Iesha Mahajan",
        "specialization": "Gynecologist",
        "qualification": "MBBS, MS (Obstetrics & Gynecology)\nWomen Wellness Specialist",
        "clinic": "Maatri Clinic",
        "rating": 4.9,
        "reviews": 275,
        "fee": 500,
        "location": "Vinay Nagar, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 2:00 PM & 5:00 – 8:00 PM",
        "phone": "+91 75126 99001",
        "available_slots": [
            "10:00 AM",
            "12:15 PM",
            "05:30 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-manish",
        "name": "Dr. Manish Sharma",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (General Medicine)\nInternal Medicine Consultant",
        "clinic": "Dr. Manish Sharma Clinic",
        "rating": 4.8,
        "reviews": 220,
        "fee": 200,
        "location": "Thatipur, Gwalior",
        "schedule": "Mon–Sat: 2:00 PM–4:00 PM & 7:00–8:30 PM",
        "phone": "+91 93417 27332",
        "available_slots": [
            "02:00 PM",
            "03:15 PM",
            "07:00 PM",
            "08:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-ashutosh-dentist",
        "name": "Dr. Ashutosh Sharma",
        "specialization": "Dentist",
        "qualification": "BDS, MDS\nDental Surgeon & Implantologist",
        "clinic": "Khurasiya Dental Care Centre",
        "rating": 4.75,
        "reviews": 140,
        "fee": 300,
        "location": "Thatipur, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 2:00 PM & 5:00 – 9:00 PM",
        "phone": "+91 75122 33445",
        "available_slots": [
            "10:30 AM",
            "01:00 PM",
            "05:30 PM",
            "07:45 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-sonali-dentist",
        "name": "Dr. Sonali Kalra",
        "specialization": "Dentist",
        "qualification": "BDS, Cosmetic Dentistry Specialist",
        "clinic": "Dr Kalras' Dental and Smile Care",
        "rating": 4.8,
        "reviews": 165,
        "fee": 400,
        "location": "Saraswati Nagar, Gwalior",
        "schedule": "Mon - Sat: 10:30 AM – 2:30 PM & 5:30 – 8:30 PM",
        "phone": "+91 75124 11332",
        "available_slots": [
            "11:00 AM",
            "01:30 PM",
            "06:00 PM",
            "08:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-manav-eye",
        "name": "Dr. Manav Setiya",
        "specialization": "Ophthalmologist",
        "qualification": "MBBS, MS (Ophthalmology)\nEye Surgeon & Lasik Specialist",
        "clinic": "Jeevan Jyoti Netralaya",
        "rating": 4.9,
        "reviews": 340,
        "fee": 300,
        "location": "Gwalior City, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 6:00 PM",
        "phone": "+91 75128 44556",
        "available_slots": [
            "10:15 AM",
            "12:45 PM",
            "03:30 PM",
            "05:15 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-nitin-dentist",
        "name": "Dr. Nitin Sharma",
        "specialization": "Dentist",
        "qualification": "BDS, MDS (Orthodontics & Dentofacial Orthopedics)",
        "clinic": "Harmony Dental Clinic",
        "rating": 4.75,
        "reviews": 110,
        "fee": 400,
        "location": "Gwalior City, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 2:00 PM & 5:00 – 8:30 PM",
        "phone": "+91 75125 99887",
        "available_slots": [
            "10:30 AM",
            "01:00 PM",
            "05:30 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-bhuwanesh",
        "name": "Dr. Bhuwanesh Sharma",
        "specialization": "Dentist",
        "qualification": "BDS, General & Aesthetic Dentistry",
        "clinic": "Om Dental & ENT Clinic",
        "rating": 4.65,
        "reviews": 85,
        "fee": 200,
        "location": "Govindpuri, Gwalior",
        "schedule": "Mon - Sat: 10:00 AM – 2:00 PM & 5:00 – 8:30 PM",
        "phone": "+91 75123 66554",
        "available_slots": [
            "10:00 AM",
            "12:30 PM",
            "05:00 PM",
            "07:15 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-pratap",
        "name": "Dr. Pratap Singh Chauhan",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Medicine)\nDiabetology & Metabolic Care",
        "clinic": "Chauhan Healthcare Clinic",
        "rating": 4.7,
        "reviews": 130,
        "fee": 300,
        "location": "Morar, Gwalior",
        "schedule": "Mon - Sat: 9:00 AM – 1:00 PM & 5:00 – 8:30 PM",
        "phone": "+91 75129 11223",
        "available_slots": [
            "09:30 AM",
            "11:45 AM",
            "05:30 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-santosh",
        "name": "Dr. Santosh Singhal",
        "specialization": "General Physician",
        "qualification": "MBBS, Senior General Physician",
        "clinic": "Sparsh Health Care",
        "rating": 4.75,
        "reviews": 145,
        "fee": 300,
        "location": "Morar, Gwalior",
        "schedule": "Mon - Sat: 9:30 AM – 1:30 PM & 6:00 – 9:00 PM",
        "phone": "+91 75126 44332",
        "available_slots": [
            "10:00 AM",
            "12:15 PM",
            "06:30 PM",
            "08:15 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-hschauhan",
        "name": "Dr. H. S. Chauhan",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Medicine)\nCardiometabolic & Maternity Consultant",
        "clinic": "Dr. Chauhan Medical and Heart Care & Maternity Clinic",
        "rating": 4.8,
        "reviews": 190,
        "fee": 300,
        "location": "Lashkar City, Gwalior",
        "schedule": "Mon - Sat: 9:00 AM – 2:00 PM & 5:30 – 8:30 PM",
        "phone": "+91 75124 99001",
        "available_slots": [
            "09:30 AM",
            "12:00 PM",
            "06:00 PM",
            "08:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-ramveer",
        "name": "Dr. Ramveer Singh Rajput",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Internal Medicine)\nApollo Spectra Consultant",
        "clinic": "Apollo Spectra Hospitals",
        "rating": 4.9,
        "reviews": 310,
        "fee": 700,
        "location": "Gwalior City, Gwalior",
        "schedule": "Mon–Sat, 10:00 AM–6:00 PM",
        "phone": "+91 75124 11223",
        "available_slots": [
            "10:00 AM",
            "12:30 PM",
            "03:00 PM",
            "05:15 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-manoj-pulmo",
        "name": "Dr. Manoj Kumar Srivastava",
        "specialization": "Pulmonologist",
        "qualification": "MBBS, MD, DTCD (Pulmonary Medicine)\nChest & Respiratory Specialist",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.9,
        "reviews": 290,
        "fee": 700,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 10:00 AM–6:00 PM",
        "phone": "+91 75124 88771",
        "available_slots": [
            "10:30 AM",
            "01:00 PM",
            "03:30 PM",
            "05:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-khozema",
        "name": "Dr. Khozema Saify",
        "specialization": "Dermatologist",
        "qualification": "MBBS, MD (Dermatology, Venereology & Leprosy)",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.85,
        "reviews": 240,
        "fee": 700,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 5:00 PM–8:00 PM",
        "phone": "+91 75124 88772",
        "available_slots": [
            "05:00 PM",
            "06:00 PM",
            "07:00 PM",
            "07:45 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-deepanshu-ent",
        "name": "Dr. Deepanshu Singhal",
        "specialization": "ENT",
        "qualification": "MBBS, MS (ENT / Otorhinolaryngology)\nEar Nose Throat Surgeon",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.8,
        "reviews": 180,
        "fee": 500,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 5:00 PM–6:00 PM",
        "phone": "+91 75124 88773",
        "available_slots": [
            "05:00 PM",
            "05:20 PM",
            "05:40 PM",
            "06:00 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-rachna",
        "name": "Dr. Rachna Dogra",
        "specialization": "Gynecologist",
        "qualification": "MBBS, MS (Obstetrics & Gynecology)\nSenior Consultant Gynae",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.9,
        "reviews": 320,
        "fee": 700,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 10:00 AM–3:00 PM",
        "phone": "+91 75124 88774",
        "available_slots": [
            "10:30 AM",
            "12:00 PM",
            "01:30 PM",
            "02:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-sudhir-dixit",
        "name": "Dr. Sudhir Dixit",
        "specialization": "Pediatrician",
        "qualification": "MBBS, MD (Pediatrics)\nChild & Adolescent Specialist",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.75,
        "reviews": 195,
        "fee": 300,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat: 11:00 AM–2:00 PM (On Call 24x7)",
        "phone": "+91 75124 88775",
        "available_slots": [
            "11:00 AM",
            "12:00 PM",
            "01:00 PM",
            "01:45 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-ujjawal",
        "name": "Dr. Ujjawal Sharma",
        "specialization": "Pulmonologist",
        "qualification": "MBBS, MD (Chest & Respiratory Medicine)",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.8,
        "reviews": 175,
        "fee": 600,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sun, 10:00 AM–4:00 PM",
        "phone": "+91 75124 88776",
        "available_slots": [
            "10:30 AM",
            "01:00 PM",
            "02:30 PM",
            "03:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-pravesh-uro",
        "name": "Dr. Pravesh Gupta",
        "specialization": "Urologist",
        "qualification": "MS (Surgery), MCh (Urology)\nSenior Urologist",
        "clinic": "RJN Apollo Spectra Hospital",
        "rating": 4.85,
        "reviews": 230,
        "fee": 300,
        "location": "Lashkar, Gwalior",
        "schedule": "Mon–Sat, 10:00 AM–2:00 PM",
        "phone": "+91 75124 88777",
        "available_slots": [
            "10:15 AM",
            "11:30 AM",
            "12:45 PM",
            "01:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-kamal",
        "name": "Dr. Kamal Bhadoria",
        "specialization": "Dermatologist",
        "qualification": "MBBS, MD (Dermatology)\nSkin & Laser Aesthetics",
        "clinic": "Fortmax Skin Clinic / JPM Dermatech",
        "rating": 4.8,
        "reviews": 260,
        "fee": 500,
        "location": "Chetakpuri, Gwalior",
        "schedule": "Mon–Sat, 3:00 PM–8:00 PM; Sun 11:00 AM–4:00 PM",
        "phone": "+91 75124 99112",
        "available_slots": [
            "03:30 PM",
            "05:00 PM",
            "06:30 PM",
            "07:30 PM"
        ],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
    }
]

APPOINTMENTS_DB = [
    {
        "id": "apt-901",
        "patient_id": "pat-001",
        "patient_name": "Rohan Das",
        "patient_age": 28,
        "doctor_id": "doc-gw-101",
        "doctor_name": "Dr. Deepankar Lahariya",
        "specialization": "General Physician",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "slot": "11:30 AM",
        "status": "Confirmed",
        "symptoms": "Seasonal viral fever, body ache and fatigue",
        "ai_summary": "Patient reports fever & fatigue. Preliminary Assessment: Viral Fever. Recommended General Physician."
    }
]

class SymptomRequest(BaseModel):
    user_input: str

class BookingRequest(BaseModel):
    patient_name: str
    patient_age: int
    patient_phone: str
    doctor_id: str
    date: str
    slot: str
    symptoms: str
    ai_summary: Optional[str] = ""

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "MediCare Dual-Authentication & Appointment API",
        "version": "2.0.0",
        "features": ["Google OAuth 2.0 (GIS)", "Mobile SMS OTP", "JWT Access/Refresh Tokens", "Rate Limiting"]
    }

@app.post("/api/chat/assess")
def assess_patient_symptoms(req: SymptomRequest):
    if not req.user_input or not req.user_input.strip():
        raise HTTPException(status_code=400, detail="Symptom text cannot be empty")
    return assess_symptoms(req.user_input)

@app.get("/api/doctors")
def get_doctors(specialization: Optional[str] = None):
    if specialization:
        filtered = [d for d in DOCTORS_DB if specialization.lower() in d["specialization"].lower()]
        if filtered:
            return filtered
    return DOCTORS_DB

@app.post("/api/appointments/book")
def book_appointment(req: BookingRequest):
    doctor = next((d for d in DOCTORS_DB if d["id"] == req.doctor_id), None)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if req.slot not in doctor["available_slots"]:
        raise HTTPException(status_code=400, detail="Selected slot is unavailable")

    new_apt = {
        "id": f"apt-{len(APPOINTMENTS_DB) + 1001}",
        "patient_id": "pat-001",
        "patient_name": req.patient_name,
        "patient_age": req.patient_age,
        "doctor_id": doctor["id"],
        "doctor_name": doctor["name"],
        "specialization": doctor["specialization"],
        "date": req.date,
        "slot": req.slot,
        "status": "Confirmed",
        "symptoms": req.symptoms,
        "ai_summary": req.ai_summary or f"Patient reported: {req.symptoms}"
    }
    
    APPOINTMENTS_DB.append(new_apt)
    return {"success": True, "message": "Appointment booked successfully!", "appointment": new_apt}

@app.get("/api/appointments/patient/{patient_id}")
def get_patient_appointments(patient_id: str):
    return [a for a in APPOINTMENTS_DB if a["patient_id"] == patient_id]

class ParchaScanRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.post("/api/ai/scan-parcha")
def scan_parcha_endpoint(req: ParchaScanRequest):
    import urllib.request
    import json
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    b64_data = req.image_base64
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = """You are an expert Clinical Pharmacist and Medical Doctor. Examine this doctor's prescription (parcha) image thoroughly. Read all handwriting, doctor details, date, diagnosis, and each prescribed medicine.

Return a JSON object in this exact schema:
{
  "doctor": "Doctor Name, Qualification, Clinic/Hospital, City",
  "date": "Prescription Date if visible or Today",
  "diagnosis_title": "Name of the disease/health problem in English (e.g. Viral Fever & Pharyngitis / Hypertension)",
  "diagnosis_explanation": "Explain what health problem the patient has, why this happens, and how serious it is, written in simple, respectful, easy-to-understand English for the patient.",
  "severity": "Mild / Moderate / Severe",
  "medicines": [
    {
      "name": "Full Medicine Brand/Generic Name and Strength (e.g. Tab. Dolo 650mg, Tab. Azithromycin 500mg)",
      "dosage": "Dose frequency (e.g. 1 tablet twice daily)",
      "timing": "When & how to take (e.g. After breakfast and dinner)",
      "purpose": "Why this medicine is prescribed (e.g. To reduce fever and muscle aches)",
      "days": "Duration (e.g. 5 days)"
    }
  ],
  "precautions": ["3 to 4 important dietary and lifestyle precautions in English"],
  "red_flags": "Emergency warning in English if symptoms worsen",
  "specialist": "Recommended doctor specialization (e.g. General Physician, Cardiologist, Dermatologist, Pediatrician, Orthopedist, etc.)",
  "extracted_raw_text": "The exact lines of text and handwriting you could read from the prescription"
}
Respond ONLY with valid JSON."""

    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": req.mime_type or "image/jpeg", "data": b64_data}},
                {"text": prompt}
            ]
        }],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.1,
            "maxOutputTokens": 1200,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }
    try:
        http_req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(http_req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_json_str = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed_result = json.loads(raw_json_str)
            return {"success": True, "data": parsed_result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/ai/gemini-chat")
def gemini_chat_endpoint(req: AIChatRequest):
    import urllib.request
    import json
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    system_instruction = """You are MediCare's helpful AI clinical health assistant for Gwalior, India.
IMPORTANT:
1. Directly answer what the patient asks in clear, easy-to-read, polite conversational English.
2. DO NOT repeat lengthy greetings or introductory lines. Directly give the answer.
3. If asked about medicines or dosages, list them clearly with bullet points."""
    
    contents = []
    contents.append({
        "role": "user",
        "parts": [{"text": f"{system_instruction}\n\nPatient Query: {req.message}"}]
    })
    
    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 2048,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }
    try:
        http_req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(http_req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return {"success": True, "reply": reply_text}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
