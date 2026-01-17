# SkillOrbit 🚀

**AI-Powered Career Intelligence Platform for Healthcare Technology**

> Leveraging **Mistral AI** and **BERT Models** for intelligent career matching and personalized learning roadmaps

SkillOrbit is a comprehensive, AI-driven career guidance and skill development platform that helps users discover personalized career paths, identify skill gaps, and navigate their professional journey through intelligent recommendations and structured learning roadmaps.

**🤖 Powered by:**
- **Mistral AI** (`open-mistral-7b`) - Career recommendations & roadmap generation
- **Bio_ClinicalBERT** - Healthcare-specific semantic embeddings (768-dim)
- **all-MiniLM-L6-v2** - General-purpose sentence similarity (384-dim)

---

## 📋 Table of Contents

- [Overview](#overview)
- [AI-Powered Intelligence](#ai-powered-intelligence)
- [Key Features](#key-features)
- [Architecture & Flow](#architecture--flow)
- [Tech Stack](#tech-stack)
- [AI Models & Libraries](#ai-models--libraries)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Security & Best Practices](#security--best-practices)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Core Features Breakdown](#core-features-breakdown)
- [Contributing](#contributing)

---

## 🎯 Overview

In today's rapidly evolving job market, identifying the right career path and understanding necessary skills is challenging. SkillOrbit addresses this by:

- **Analyzing user interests** through a sophisticated 7-question assessment
- **Leveraging AI models** (Mistral AI, Hugging Face Transformers) for intelligent matching
- **Providing personalized roadmaps** with curated learning resources
- **Tracking progress** through an interactive dashboard
- **Focusing on healthcare technology** careers with 27+ specialized career paths

The platform goes beyond simple keyword matching, understanding context and nuance to suggest the most relevant opportunities based on cognitive style, technical depth preferences, and career aspirations.

---

## 🧠 AI-Powered Intelligence

SkillOrbit leverages **two powerful AI models** for career guidance:

### **🤖 Mistral AI (open-mistral-7b)**
- **Primary recommendation engine** for career matching
- Analyzes user responses and generates personalized career suggestions
- Creates structured learning roadmaps with 5-7 modules
- Provides match scores (0-100) with detailed reasoning
- **Use:** Career recommendations & roadmap generation

### **🔬 BERT Models (Hugging Face Transformers)**
- **Bio_ClinicalBERT**: Healthcare-specific semantic understanding (768-dim embeddings)
- **all-MiniLM-L6-v2**: General-purpose sentence similarity (384-dim embeddings)
- Runs directly in JavaScript runtime (no Python backend needed)
- Enables semantic search beyond keyword matching
- **Use:** Vector embeddings & intelligent role matching

**Combined Power:** Mistral AI provides high-level intelligence while BERT models enable deep semantic understanding of healthcare careers and user profiles.

---

## ✨ Key Features

### 🧠 AI-Powered Career Recommendations
- **Mistral AI Integration**: Uses `open-mistral-7b` model for intelligent career matching
- **Semantic Analysis**: Understands user intent beyond keywords
- **Multi-factor Matching**: Considers interests, technical depth, work environment, and long-term goals
- **Top 5 Recommendations**: Provides match scores and detailed reasoning

### 📚 Personalized Learning Roadmaps
- **AI-Generated Modules**: Structured learning paths with 5-7 modules per career
- **Sub-module Breakdown**: Detailed topics, durations, and resources
- **Progress Tracking**: Real-time progress monitoring with visual indicators
- **Curated Video Resources**: Integrated learning materials from YouTube

### 🎯 Interactive Interest Detector
- **7-Question Assessment**: Scientifically designed to identify career fit
- **Multi-select & Single-select**: Flexible question types for nuanced responses
- **Real-time Progress**: Smooth animations and progress tracking
- **Category-based Analysis**: Core interests, cognitive style, technical depth, work context, purpose alignment, working style, and future orientation

### 📊 Comprehensive Dashboard
- **Multiple Roadmaps**: Track up to 3 career paths simultaneously
- **Progress Visualization**: Module-level progress with completion percentages
- **Roadmap Management**: Add, remove, and switch between career paths
- **Responsive Design**: Beautiful UI with Framer Motion animations

### 🔐 Secure Authentication
- **JWT-based Auth**: Secure token-based authentication using JOSE
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Cookie-based session handling

---

## 🏗️ Architecture & Flow

```
┌─────────────────┐
│   User Login    │
│  /Registration  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Interest Detector (7 Questions)     │
│  - Core interests                        │
│  - Problem-solving style                 │
│  - Technical depth preference            │
│  - Work environment                      │
│  - Impact motivation                     │
│  - Working style                         │
│  - Long-term career goals                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│    API: /api/recommend-careers          │
│  - Sends answers to Mistral AI          │
│  - Analyzes 27 healthcare career paths  │
│  - Returns top 5 matches with scores    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Results Page                     │
│  - Display career recommendations        │
│  - Show match scores & reasoning         │
│  - Career details (salary, skills, etc.) │
│  - "Add to Dashboard" option             │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│    API: /api/generate-roadmap           │
│  - Generates personalized roadmap        │
│  - Creates modules & sub-modules         │
│  - Loads curated video resources         │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      User Dashboard                      │
│  - View all active roadmaps              │
│  - Track progress across careers         │
│  - Access detailed roadmap pages         │
│  - Manage learning journey               │
└─────────────────────────────────────────┘
```

### Data Flow

1. **Frontend (Next.js + React)**: User interactions, forms, and UI
2. **API Routes**: Server-side logic, AI integration, database operations
3. **AI Services**: Mistral AI for career matching and roadmap generation
4. **Database (MongoDB)**: User profiles, career data, progress tracking
5. **Vector Database (Supabase)**: Semantic search capabilities

---

## 🛠️ Tech Stack

### **Core Framework**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.3 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **TailwindCSS** | 4.x | Utility-first CSS framework |

### **AI & Machine Learning**
| Technology | Purpose |
|-----------|---------|
| **Mistral AI API** | Career matching and roadmap generation |
| **Hugging Face Transformers** | Vector embeddings |
| **Models**: |
| - `open-mistral-7b` | Primary AI model for recommendations |
| - `Xenova/Bio_ClinicalBERT` | Healthcare-specific embeddings |
| - `Xenova/all-MiniLM-L6-v2` | General-purpose sentence similarity |

### **Database & Backend**
| Technology | Purpose |
|-----------|---------|
| **MongoDB** | Primary database (via Mongoose ODM) |
| **Mongoose** | 9.1.4 - MongoDB object modeling |
| **Supabase** | PostgreSQL with pgvector|

### **Authentication & Security**
| Technology | Purpose |
|-----------|---------|
| **JOSE** | 6.1.3 - JWT creation and verification |
| **bcryptjs** | 3.0.3 - Password hashing |
| **jsonwebtoken** | 9.0.3 - Token utilities |

### **UI & Animation**
| Technology | Purpose |
|-----------|---------|
| **Framer Motion** | 12.23.24 - Animations |
| **Radix UI** | Accessible UI components |
| **Lucide React** | 0.562.0 - Icon library |
| **class-variance-authority** | 0.7.1 - Component variants |
| **clsx** | 2.1.1 - Conditional classNames |
| **tailwind-merge** | 3.4.0 - Merge Tailwind classes |

---

## 🤖 AI Models & Libraries

SkillOrbit leverages cutting-edge AI models for intelligent career guidance and semantic understanding:

### **1. Mistral AI - Primary Intelligence Engine**

**Model:** `open-mistral-7b`  
**Provider:** Mistral AI  
**API Endpoint:** `https://api.mistral.ai/v1/chat/completions`

#### **Use Cases:**
- ✅ **Career Path Recommendations**: Analyzes user responses from 7-question assessment and matches against 27 healthcare careers
- ✅ **Learning Roadmap Generation**: Creates personalized 5-7 module learning paths with sub-modules, topics, and resources
- ✅ **Semantic Understanding**: Goes beyond keyword matching to understand user intent, cognitive style, and career aspirations
- ✅ **Match Scoring**: Provides 0-100 match scores with detailed reasoning for each career recommendation

#### **Technical Implementation:**
```typescript
// API Configuration
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = "open-mistral-7b";

// Request Parameters
{
  model: "open-mistral-7b",
  temperature: 0.7,
  max_tokens: 1500-2500,
  messages: [
    { role: "system", content: "Expert career advisor prompt" },
    { role: "user", content: "User interests and career data" }
  ]
}
```

#### **Key Features:**
- **Context-Aware Analysis**: Understands nuanced user preferences
- **Structured JSON Output**: Returns formatted career recommendations
- **Fallback Mechanisms**: Graceful degradation if API fails
- **Real-time Processing**: Fast response times for seamless UX

---

### **2. BERT Models - Semantic Search & Embeddings**

**Library:** `@huggingface/transformers`  
**Runtime:** JavaScript/Node.js (Edge-compatible)

#### **Models Used:**

##### **a) Bio_ClinicalBERT (Primary Healthcare Model)**
- **Full Name:** `Xenova/Bio_ClinicalBERT`
- **Embedding Dimensions:** 768
- **Specialization:** Healthcare and clinical domain
- **Training Data:** Medical literature, clinical notes, healthcare documentation

**Use Cases:**
- 🏥 Healthcare-specific role matching
- 🔬 Clinical terminology understanding
- 📊 Medical domain semantic search
- 🎯 Precise healthcare career recommendations

**Technical Specs:**
```typescript
const extractor = await pipeline(
  'feature-extraction', 
  'Xenova/Bio_ClinicalBERT',
  { dtype: 'q8' }  // Quantized for efficiency
);

// Generate embeddings
const output = await extractor(textToEmbed, {
  pooling: 'mean',
  normalize: true
});

// Returns: 768-dimensional vector
const embedding = Array.from(output.data);
```

##### **b) all-MiniLM-L6-v2 (General Purpose Model)**
- **Full Name:** `Xenova/all-MiniLM-L6-v2`
- **Embedding Dimensions:** 384
- **Specialization:** General sentence similarity
- **Advantages:** Faster, smaller, efficient

**Use Cases:**
- 🔍 General semantic search
- 📝 User profile vectorization
- ⚡ Quick similarity matching
- 🎯 Cross-domain career matching

**Technical Specs:**
```typescript
const extractor = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2',
  { dtype: 'q8' }
);

// Returns: 384-dimensional vector (more efficient)
```

#### **BERT Integration Architecture:**
```
User Profile/Job Description
         ↓
   Text Preprocessing
         ↓
   BERT Tokenization
         ↓
Feature Extraction Pipeline
         ↓
   Mean Pooling + Normalization
         ↓
   Vector Embedding (384/768-dim)
         ↓
   Supabase Vector Store (pgvector)
         ↓
   Cosine Similarity Search
         ↓
   Top-K Career Matches
```

#### **Key Advantages:**
- ✅ **On-Demand Vectorization**: Runs directly in JavaScript runtime
- ✅ **No External Services**: No Python backend required
- ✅ **Edge Compatible**: Works in serverless/edge environments
- ✅ **Semantic Understanding**: Context-aware matching beyond keywords
- ✅ **Healthcare Optimized**: Bio_ClinicalBERT trained on medical data
- ✅ **Efficient**: Quantized models (q8) for faster inference

#### **Example Use Case:**
```typescript
// User describes: "Building backend systems using Spring Boot"
// BERT understands context and maps to:
// → "Backend Engineer" roles
// → "Full-stack Developer" positions
// → "Software Architect" careers
// Even without exact keyword "Backend Engineer" in description
```

---

### **AI Model Comparison**

| Feature | Mistral AI | Bio_ClinicalBERT | all-MiniLM-L6-v2 |
|---------|-----------|------------------|------------------|
| **Primary Use** | Career recommendations | Healthcare embeddings | General embeddings |
| **Output Type** | Text/JSON | 768-dim vectors | 384-dim vectors |
| **Domain** | General + Healthcare | Healthcare-specific | General purpose |
| **Speed** | Fast (API) | Medium | Fast |
| **Accuracy** | High | Very High (medical) | High |
| **Cost** | API calls | Free (self-hosted) | Free (self-hosted) |
| **Infrastructure** | External API | JavaScript runtime | JavaScript runtime |

---

## 📁 Project Structure

```
skill-orbit/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   │   └── onboarding/           # User onboarding flow
│   ├── api/                      # API Routes (Backend)
│   │   ├── admin/
│   │   │   ├── seed/             # Database seeding (commented)
│   │   │   └── suggest-roles/    # Role suggestions with embeddings
│   │   ├── auth/
│   │   │   ├── login/            # User login
│   │   │   ├── logout/           # User logout
│   │   │   └── register/         # User registration
│   │   ├── dashboard/            # Dashboard data & management
│   │   ├── data/
│   │   │   └── jobsData.ts       # 27 healthcare career definitions
│   │   ├── generate-roadmap/     # AI roadmap generation
│   │   ├── recommend-careers/    # AI career recommendations
│   │   └── user/
│   │       └── onboarding/       # Save user onboarding data
│   ├── dashboard/                # User dashboard page
│   ├── interest-detector/        # 7-question assessment
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── results/                  # Career recommendations display
│   ├── roadmap/
│   │   └── [careerId]/           # Dynamic roadmap pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── dashboard/
│   │   └── RoadmapCard.tsx       # Roadmap display card
│   ├── roadmap/
│   │   └── VideoRecommendations.tsx  # Video resources
│   └── ui/                       # Radix UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── lib/                          # Shared utilities
│   ├── data/
│   │   ├── careers.json          # 27 career paths (3,399 lines)
│   │   └── videos.json           # Curated video resources
│   ├── helper/
│   │   ├── getId.ts              # User ID extraction
│   │   └── supabase.ts           # Supabase client
│   ├── types/
│   │   ├── careers.ts            # Career type definitions
│   │   └── roadmap.ts            # Roadmap type definitions
│   ├── utils/
│   │   └── progress.ts           # Progress calculation utilities
│   ├── db.ts                     # MongoDB connection
│   ├── jwt.ts                    # JWT utilities
│   └── utils.ts                  # General utilities
│
├── models/                       # Mongoose schemas
│   ├── CareerFieldModel.ts       # Career field schema (153 lines)
│   ├── User.ts                   # User authentication schema
│   └── UserDashboard.ts          # User progress & roadmaps
│
├── middleware.ts                 # Route protection middleware
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── package.json                  # Dependencies
└── .env                          # Environment variables
```

---

## 🗄️ Database Schema

### **User Model** (MongoDB)
```typescript
{
  username: String (unique, required, min: 3 chars)
  email: String (unique, required, validated)
  password: String (hashed with bcryptjs, min: 6 chars)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### **CareerField Model** (MongoDB)
```typescript
{
  category: String (Healthcare/Agriculture/Urban)
  subdomain: String (Data & Analytics, Clinical Systems, etc.)
  field_name: String (Career title)
  field_id: String (unique identifier)
  field_description: String
  skills_required: [String]
  skills_breakdown: {
    foundational: [String]
    intermediate: [String]
    advanced: [String]
  }
  keywords: [String]
  interests_matching: [String]
  prerequisites: [String]
  learning_path: [{
    level: Number
    duration: String
    focus: String
  }]
  tools_required: [String]
  certifications: [String]
  avg_salary_inr: Number
  salary_range_inr: String
  entry_level: String
  mid_level: String
  senior_level: String
  demand_growth_2026: String
  entry_level_duration: String
  career_progression: [String]
  next_roles: [String]
  similar_roles: [String]
  industry_focus: [String]
  remote_friendly: Boolean
  job_market_saturation: String (low/medium/high)
  growth_potential_rating: Number (0-10)
  difficulty_rating: Number (0-10)
  typical_companies: [String]
  createdBy: ObjectId (ref: User)
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### **UserDashboard Model** (MongoDB)
```typescript
{
  userId: ObjectId (ref: User, required)
  roadmaps: [{
    careerId: Number
    careerName: String
    addedAt: Date
    modules: [{
      id: String
      title: String
      description: String
      duration: String
      status: String (pending/in-progress/completed)
      progress: Number (0-100)
      subModules: [{
        id: String
        title: String
        topics: [String]
        duration: String
        resources: [String]
        completed: Boolean
      }]
    }]
    overallProgress: Number (0-100)
    estimatedDuration: String
    videos: Object (module-specific videos)
  }]
  maxRoadmaps: Number (default: 3)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### **Career Discovery**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommend-careers` | Get AI-powered career recommendations |
| POST | `/api/generate-roadmap` | Generate personalized learning roadmap |

### **Dashboard Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Fetch user dashboard data |
| POST | `/api/dashboard` | Add roadmap to dashboard |
| DELETE | `/api/dashboard` | Remove roadmap from dashboard |
| PATCH | `/api/dashboard` | Update roadmap progress |

### **User Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/onboarding` | Save onboarding data |

### **Admin**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/seed` | Seed database with embeddings |
| POST | `/api/admin/suggest-roles` | Vector-based role suggestions |

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Mistral AI API Key** ([Get API Key](https://console.mistral.ai/))
- Supabase account for vector search ([Sign up](https://supabase.com/))

---

### **📦 Installation Steps**

#### **1. Clone the Repository**
```bash
git clone https://github.com/CodexKnight-ai/SkillOrbit.git
cd skill-orbit
```

#### **2. Install Dependencies**
```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Mongoose (MongoDB ODM)
- Mistral AI SDK
- Hugging Face Transformers
- Authentication libraries (JOSE, bcryptjs)
- UI libraries (Framer Motion, Radix UI, Lucide React)

#### **3. Set Up Environment Variables**

Create a `.env` file in the **root directory** and add the following:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/skillorbit?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=your_secure_random_jwt_secret_key_minimum_32_characters

# ============================================
# AI SERVICES - MISTRAL AI
# ============================================
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=open-mistral-7b

# ============================================
# SUPABASE (Vector Search)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**📝 How to Get API Keys:**

| Service | How to Obtain |
|---------|---------------|
| **MongoDB URI** | 1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)<br>2. Create a cluster<br>3. Click "Connect" → "Connect your application"<br>4. Copy the connection string |
| **JWT Secret** | Generate a random string (32+ characters):<br>`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| **Mistral API Key** | 1. Sign up at [Mistral AI Console](https://console.mistral.ai/)<br>2. Navigate to API Keys<br>3. Create new API key |
| **Supabase** | 1. Create project at [Supabase](https://supabase.com/)<br>2. Go to Settings → API<br>3. Copy URL and keys |

#### **4. Run Development Server**
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

#### **5. Open Your Browser**
Navigate to **[http://localhost:3000](http://localhost:3000)**

You should see the SkillOrbit landing page! 🎉

---

### **🏗️ Build for Production**

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Production URL:** [http://localhost:3000](http://localhost:3000)

---

### **🧪 Test the Application**

#### **Option 1: Create New Account**
1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill in the registration form
3. Login with your credentials

#### **Option 2: Use Test Credentials** (If seeded)
```
Email: test@skillorbit.com
Password: test123456
```

**Note:** You'll need to create an account first as there's no default test user in the database.

---

### **📋 Quick Start Commands (Copy-Paste)**

```bash
# Clone and setup
git clone https://github.com/CodexKnight-ai/SkillOrbit.git
cd skill-orbit
npm install

# Create .env file (then add your keys)
touch .env

# Run development server
npm run dev
```

---

### **🔧 Troubleshooting**

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | • Check MONGODB_URI is correct<br>• Ensure IP whitelist includes your IP<br>• Verify database user credentials |
| **Mistral API Error** | • Verify MISTRAL_API_KEY is valid<br>• Check API quota/limits<br>• Ensure internet connection |
| **Port 3000 Already in Use** | Run on different port: `PORT=3001 npm run dev` |
| **Module Not Found** | Delete `node_modules` and run `npm install` again |
| **JWT Error** | Ensure JWT_SECRET is set in `.env` |

---

### **🗂️ Project Structure After Setup**

```
skill-orbit/
├── .env                    # ✅ Your environment variables (DO NOT COMMIT)
├── .gitignore              # ✅ Ensures .env is not tracked
├── node_modules/           # ✅ Installed dependencies
├── .next/                  # ✅ Next.js build output
├── app/                    # Application code
├── components/             # React components
├── lib/                    # Utilities
├── models/                 # Database schemas
└── package.json            # Dependencies
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `MISTRAL_API_KEY` | ✅ | Mistral AI API key |
| `MISTRAL_MODEL` | ✅ | Mistral model name (default: open-mistral-7b) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |

---

## 💡 Core Features Breakdown

### **1. Interest Detector Assessment**
- **7 scientifically designed questions** covering:
  - Core interests (data, software, clinical, security, design, business, devices)
  - Problem-solving style (patterns, systems, compliance, UX, coordination, validation)
  - Technical depth (very technical, moderately technical, low technical)
  - Work environment (tech companies, hospitals, consulting, biotech, government, remote)
  - Impact motivation (patient outcomes, system efficiency, privacy, clinician support, accessibility, innovation)
  - Working style (independent, cross-functional, leadership, structured, iterative)
  - Long-term goals (technical expert, domain specialist, leadership, innovation, products, compliance)

### **2. AI-Powered Matching**
- **Mistral AI Integration**: Sends user responses to Mistral AI with structured prompts
- **Contextual Analysis**: Analyzes against 27 healthcare career paths
- **Match Scoring**: Returns top 5 careers with match scores (0-100)
- **Reasoning**: Provides detailed explanations for each recommendation

### **3. Comprehensive Career Database**
27 healthcare technology careers including:
- Health Data Scientist & AI/ML Engineer
- Clinical Informatics Specialist
- Telemedicine Platform Engineer
- Healthcare Product Manager
- EHR Implementation Specialist
- Healthcare AI/ML Architect
- Digital Health Platform Engineer
- And 20 more specialized roles

Each career includes:
- Detailed description
- Required skills (foundational, intermediate, advanced)
- Salary ranges (INR)
- Learning paths
- Tools and certifications
- Career progression
- Industry focus
- Growth potential rating
- Difficulty rating

### **4. Dynamic Roadmap Generation**
- **AI-Generated Structure**: Mistral AI creates 5-7 modules per career
- **Sub-module Breakdown**: Each module contains 3-5 detailed sub-modules
- **Resource Integration**: Curated video resources from YouTube
- **Progress Tracking**: Module and sub-module level completion tracking
- **Estimated Duration**: Realistic time estimates for completion

### **5. Interactive Dashboard**
- **Multi-roadmap Support**: Track up to 3 careers simultaneously
- **Visual Progress**: Beautiful progress bars and completion indicators
- **Framer Motion Animations**: Smooth transitions and interactions
- **Responsive Design**: Works seamlessly on desktop and mobile

---

## 🌐 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables on Vercel**
Add all environment variables in the Vercel dashboard under Settings → Environment Variables.

### **MongoDB Atlas**
Ensure your MongoDB Atlas cluster allows connections from Vercel's IP addresses (or use 0.0.0.0/0 for development).

---

## 🔒 Security & Best Practices

### **✅ No Secrets in Repository**

**This repository is secure and does NOT contain any sensitive information:**

- ✅ `.env` file is in `.gitignore` (line 34: `.env*`)
- ✅ All API keys are loaded from environment variables
- ✅ No hardcoded credentials in source code
- ✅ JWT secrets are environment-based
- ✅ Database credentials are externalized
- ✅ `.gitignore` properly configured

**Verified Files:**
```bash
# .gitignore includes:
.env*                    # All environment files
node_modules/            # Dependencies
.next/                   # Build output
*.pem                    # Private keys
```

### **🔐 Environment Variable Security**

| Variable | Security Level | Notes |
|----------|---------------|-------|
| `MONGODB_URI` | 🔴 **Critical** | Never commit to repo |
| `JWT_SECRET` | 🔴 **Critical** | Use strong random string (32+ chars) |
| `MISTRAL_API_KEY` | 🔴 **Critical** | Keep private, monitor usage |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 **Critical** | Server-side only |
| `NEXT_PUBLIC_SUPABASE_URL` | 🟡 **Public** | Safe to expose (public URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🟡 **Public** | Safe to expose (anon key) |

### **🛡️ Security Checklist**

Before deploying to production:

- [ ] All environment variables set in hosting platform
- [ ] `.env` file NOT committed to Git
- [ ] MongoDB IP whitelist configured
- [ ] Mistral AI API key has usage limits
- [ ] JWT secret is strong and random (32+ characters)
- [ ] HTTPS enabled on production domain
- [ ] CORS configured properly
- [ ] Rate limiting implemented (if needed)

---

## ⚠️ Error Handling

The application includes comprehensive error handling:

### **Frontend Error Handling**

```typescript
// API Call Error Handling
try {
  const response = await fetch('/api/recommend-careers', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
  
  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }
  
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
  alert('Failed to get recommendations. Please try again.');
}
```

### **Backend Error Handling**

```typescript
// API Route Error Handling
export async function POST(request: NextRequest) {
  try {
    // Business logic
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Common Error Scenarios**

| Error | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid/missing JWT token | Login again |
| **500 Internal Server Error** | API/Database failure | Check logs, verify env vars |
| **Failed to fetch** | Network issue | Check internet connection |
| **MongoDB Connection Error** | Invalid URI or network | Verify MONGODB_URI and IP whitelist |
| **Mistral API Error** | Invalid key or quota exceeded | Check API key and usage limits |

### **Error Logging**

All errors are logged to the console:
```typescript
console.error('Error in recommend-careers API:', error);
```

For production, consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **DataDog** for monitoring

---

## 📊 API Response Formats

### **Success Response**
```json
{
  "recommendations": [
    {
      "career": { /* career object */ },
      "matchScore": 95,
      "reasoning": "Excellent match based on..."
    }
  ],
  "analysisTime": 1234
}
```

### **Error Response**
```json
{
  "error": "Error message description"
}
```

---

## 🧪 Testing

### **Manual Testing Checklist**

- [ ] User registration works
- [ ] User login works
- [ ] Interest detector completes all 7 questions
- [ ] Career recommendations are generated
- [ ] Roadmap generation works
- [ ] Dashboard displays roadmaps
- [ ] Progress tracking updates
- [ ] Logout works correctly

### **API Testing**

Use tools like **Postman** or **Thunder Client**:

```bash
# Test Career Recommendations
POST http://localhost:3000/api/recommend-careers
Content-Type: application/json

{
  "answers": {
    "0": ["🧠 Working with data, numbers, and insights"],
    "1": ["Finding patterns & making predictions from data"]
    // ... more answers
  }
}
```

---

## 🎨 Design Philosophy

- **Premium Aesthetics**: Dark theme with glassmorphism effects
- **Smooth Animations**: Framer Motion for delightful interactions
- **Accessibility**: Radix UI components for keyboard navigation and screen readers
- **Responsive**: Mobile-first design approach
- **Performance**: Optimized with Next.js 16 App Router

---

## 📊 Key Metrics

- **27 Healthcare Careers**: Comprehensive career database
- **7 Assessment Questions**: Scientifically designed for accuracy
- **3,399 Lines of Career Data**: Detailed career information
- **5-7 Modules per Roadmap**: Structured learning paths
- **3 Simultaneous Roadmaps**: Multi-career tracking

---

## 🔮 Future Enhancements

- [ ] Vector search with Supabase pgvector
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Integration with LinkedIn for profile import
- [ ] Course marketplace integration
- [ ] Mentor matching system
- [ ] Community forums
- [ ] Achievement badges and gamification

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

**CodexKnight Team**
- AI-powered career guidance platform
- Built for hackathon excellence

---

## 🙏 Acknowledgments

- **Mistral AI** for powerful language models
- **Hugging Face** for transformer models
- **Vercel** for hosting platform
- **MongoDB** for database solutions
- **Radix UI** for accessible components
- **Framer Motion** for animations

---

## 📞 Support

For support, email support@skillorbit.com or open an issue in the GitHub repository.

---

## 📝 Quick Reference Summary

### **✅ What's Included:**
- ✅ Complete AI-powered career guidance platform
- ✅ 27 healthcare technology career paths
- ✅ Mistral AI integration for recommendations
- ✅ BERT models for semantic understanding
- ✅ 7-question interest assessment
- ✅ Personalized learning roadmaps
- ✅ Progress tracking dashboard
- ✅ Secure JWT authentication
- ✅ Beautiful UI with Framer Motion
- ✅ Fully responsive design

### **🔒 Security Confirmed:**
- ✅ No secrets in repository
- ✅ `.env` properly gitignored
- ✅ All credentials externalized
- ✅ Environment variables documented
- ✅ `.env.example` provided

### **🚀 Quick Start:**
```bash
git clone https://github.com/CodexKnight-ai/SkillOrbit.git
cd skill-orbit
npm install
# Add your .env file
npm run dev
```

### **🤖 AI Models Used:**
- **Mistral AI** (open-mistral-7b) - Career recommendations
- **Bio_ClinicalBERT** (768-dim) - Healthcare embeddings
- **all-MiniLM-L6-v2** (384-dim) - General embeddings

### **📊 Key Metrics:**
- 27 career paths
- 7 assessment questions
- 5-7 modules per roadmap
- 3 simultaneous roadmaps
- 100% TypeScript coverage

---

**Built with ❤️ by CodexKnight Team**

*Empowering the next generation of healthcare technology professionals through AI-powered career intelligence.*
