import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PatientPortal from './components/PatientPortal';
import DoctorDashboard from './components/DoctorDashboard';
import ParchaReaderView from './components/ParchaReaderView';
import AuthModal from './components/AuthModal';
import AppointmentModal from './components/AppointmentModal';
import ChatbotDrawer from './components/ChatbotDrawer';
import { listenToAppointments } from './supabase';

const MOCK_DOCTORS = [
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
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'patient' | 'doctor' | 'ai_parcha'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  // Auto-restore session from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState([
    {
      id: "apt-901",
      token: "01",
      patient_name: "Lokendra Dev",
      doctor_name: "Dr. Deepankar Lahariya",
      specialization: "General Physician",
      date: new Date().toISOString().split('T')[0],
      slot: "11:30 AM",
      status: "Waiting",
      clinic: "City Care Hospital, Gwalior",
      symptoms: "High viral fever, severe sore throat, body ache and persistent dry cough since 2 days",
      ai_summary: "Acute febrile illness with pharyngeal erythema. Moderate risk. Suggested: CBC & Dengue NS1 serology. Prescribe antipyretics and warm saline gargles."
    },
    {
      id: "apt-902",
      token: "02",
      patient_name: "Lokendra Dev",
      doctor_name: "Dr. Deepankar Lahariya",
      specialization: "General Physician",
      date: new Date().toISOString().split('T')[0],
      slot: "12:00 PM",
      status: "Waiting",
      clinic: "City Care Hospital, Gwalior",
      symptoms: "Routine thyroid review, mild generalized lethargy and morning sluggishness",
      ai_summary: "Subclinical hypothyroid follow-up. Prior TSH 5.2 mIU/L on Thyroxine 50mcg. Advise repeat serum TSH in 8 weeks; maintain dose if asymptomatic."
    },
    {
      id: "apt-903",
      token: "03",
      patient_name: "Lokendra Dev",
      doctor_name: "Dr. Deepankar Lahariya",
      specialization: "General Physician",
      date: new Date().toISOString().split('T')[0],
      slot: "12:30 PM",
      status: "Waiting",
      clinic: "City Care Hospital, Gwalior",
      symptoms: "Sudden retrosternal chest heaviness, diaphoresis and breathlessness during brisk morning walk",
      ai_summary: "🚨 CRITICAL TRIAGE ALERT: Possible Acute Coronary Syndrome (ACS) or Unstable Angina. Immediate 12-lead ECG, Troponin-I, Sorbitrate SOS advised."
    }
  ]);

  // Fetch backend doctors if live
  useEffect(() => {
    fetch('http://localhost:8000/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDoctors(data);
      })
      .catch(() => console.log("Backend offline, using mock doctors database."));
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('medicare_current_user', JSON.stringify(user));
    } catch {}
    setIsAuthModalOpen(false);
    if (user.role === 'doctor') {
      setActiveTab('doctor');
    } else {
      setActiveTab('patient');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('medicare_current_user');
      localStorage.removeItem('medicare_access_token');
    } catch {}
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Real-time Cloud Firestore synchronization
  useEffect(() => {
    const unsubscribe = listenToAppointments((cloudApts) => {
      if (cloudApts && cloudApts.length > 0) {
        setAppointments(prev => {
          const cloudIds = new Set(cloudApts.map(a => a.id));
          const localOnly = prev.filter(a => !cloudIds.has(a.id) && String(a.id).startsWith("apt-90"));
          return [...cloudApts, ...localOnly];
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Role-based route guard: Never allow patient to access doctor dashboard
  useEffect(() => {
    if (currentUser?.role === 'patient' && activeTab === 'doctor') {
      setActiveTab('patient');
    } else if (currentUser?.role === 'doctor' && activeTab === 'patient') {
      setActiveTab('doctor');
    }
  }, [currentUser, activeTab]);

  const handleBookingSuccess = (newAppointment) => {
    const enrichedApt = {
      ...newAppointment,
      status: newAppointment.status || "Pending",
      ai_summary: newAppointment.ai_summary || "Preliminary triage complete. Doctor review pending."
    };
    setAppointments(prev => [enrichedApt, ...prev.filter(a => a.id !== enrichedApt.id)]);
    setSelectedDoctorForBooking(null);
    setActiveTab('patient');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Global Navbar matching all screenshots */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* 2. Main Page Render with Motion Transitions */}
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                doctors={doctors}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSelectDoctorForBooking={(doc) => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setSelectedDoctorForBooking(doc);
                }}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenParchaReader={() => setActiveTab('ai_parcha')}
                appointments={appointments}
                onLoginSuccess={handleLoginSuccess}
              />
            </motion.div>
          )}

          {activeTab === 'patient' && (
            <motion.div
              key="patient"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PatientPortal
                appointments={appointments}
                currentUser={currentUser}
                onSelectDoctorForBooking={(doc) => setSelectedDoctorForBooking(doc)}
                doctors={doctors}
              />
            </motion.div>
          )}

          {activeTab === 'doctor' && currentUser?.role === 'doctor' && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorDashboard
                appointments={appointments}
                currentUser={currentUser}
                setAppointments={setAppointments}
                doctors={doctors}
              />
            </motion.div>
          )}

          {activeTab === 'ai_parcha' && (
            <motion.div
              key="ai_parcha"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ParchaReaderView
                onBackToHome={() => setActiveTab('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Floating AI Chat Launcher Button (if drawer not active) */}
      {!isChatOpen && (
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 12px 32px rgba(37,99,235,0.45)' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '26px',
            right: '26px',
            borderRadius: '30px',
            padding: '13px 20px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Bot size={20} />
          <span>Ask AI Health Assistant</span>
        </motion.button>
      )}

      {/* 4. AI Chatbot Drawer */}
      {isChatOpen && (
        <ChatbotDrawer
          onClose={() => setIsChatOpen(false)}
          onRecommendSpecialist={() => {
            setIsChatOpen(false);
            setActiveTab('home');
          }}
        />
      )}

      {/* 5. Appointment Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          appointments={appointments}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 6. Auth Modal Overlay */}
      {isAuthModalOpen && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* 7. Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '20px 36px',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#64748b',
        background: '#ffffff'
      }}>
        © 2026 MediCare - Smart AI Healthcare & Patient Appointment System • Gwalior Special Edition.
      </footer>
    </div>
  );
}
