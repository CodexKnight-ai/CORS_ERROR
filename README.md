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
- [Core Features Breakdown](#core-features-breakdown)
- [Deployment](#deployment)
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
5. **Vector Database (Supabase)**: Semantic search capabilities (optional/future)

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
| **Supabase** | PostgreSQL with pgvector (optional) |

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
│   │   └── supabase.ts           # Supabase client (optional)
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

### **Admin (Optional)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/seed` | Seed database with embeddings |
| POST | `/api/admin/suggest-roles` | Vector-based role suggestions |

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20.x or higher
- MongoDB instance (local or Atlas)
- Mistral AI API key
- (Optional) Supabase account for vector search

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/your-username/skill-orbit.git
cd skill-orbit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillorbit

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here

# AI Services
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=open-mistral-7b

# Optional: Supabase (for vector search)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### **Build for Production**
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `MISTRAL_API_KEY` | ✅ | Mistral AI API key |
| `MISTRAL_MODEL` | ⚠️ | Mistral model name (default: open-mistral-7b) |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | Supabase project URL (optional) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | Supabase anonymous key (optional) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | Supabase service role key (optional) |

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

**Built with ❤️ by CodexKnight Team**
