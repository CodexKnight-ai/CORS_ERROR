# Skill Orbit

Skill Orbit is an advanced, AI-powered career guidance and skill gap analysis platform designed to help users navigate their professional journey. By leveraging cutting-edge Natural Language Processing (NLP) models and a hybrid database architecture, Skill Orbit provides personalized role recommendations, identifies skill gaps, and offers detailed career path insights.

## Project Overview

In the rapidly evolving job market, identifying the right career path and understanding the necessary skills can be challenging. Skill Orbit addresses this by analyzing valid user profiles (skills, education, projects, achievements) and semantically matching them against a comprehensive database of career roles using vector embeddings. The platform goes beyond simple keyword matching, understanding the context and nuance of a user's experience to suggest the most relevant opportunities.

## Key Features

-   **AI-Powered Role Recommendations:** Utilizes Hugging Face Transformers (BERT) to generate vector embeddings for user profiles and job descriptions, enabling high-precision semantic search and matching.
-   **Intelligent Skill Gap Analysis:** Identifies missing skills for desired roles and provides actionable learning paths.
-   **Comprehensive Career Data:** Deep database of career fields, including salary insights, demand growth, learning resources, and project timelines.
-   **Hybrid Database Architecture:** Combines the flexibility of MongoDB for complex document storage with the vector capabilities of Supabase for semantic similarity search.
-   **Healthcare Tech Focus:** specialized tracking for Health Data Science, Clinical Informatics, and Bio-medical engineering roles (as per current dataset).

## Architecture & Flow

The application follows a modern Next.js App Router architecture:

1.  **Frontend:** Built with **Next.js**, **React**, and **TailwindCSS** for a responsive and premium user interface.
2.  **Authentication:** Secure user authentication handled via custom implementation (with bcryptjs/JOSE) or potential NextAuth integration.
3.  **Data Layer:**
    -   **MongoDB (Mongoose):** Stores user profiles (`User`), detailed career field metadata (`CareerField`), and structured learning paths.
    -   **Supabase (pgvector):** specific PostgreSQL tables are used to store vector embeddings of job roles.
4.  **AI Engine:**
    -   User inputs (skills, projects, etc.) are sent to the API.
    -   **Hugging Face Transformers (`@huggingface/transformers`)** run directly in the edge/serverless function to tokenize and vectorize the input text using models like `Xenova/all-MiniLM-L6-v2` or `Bio_ClinicalBERT`.
    -   These vectors are queried against the Supabase vector store using a Remote Procedure Call (RPC) `match_jobs` to find the nearest semantic neighbors.
5.  **Response:** The system returns ranked role suggestions with similarity scores to the user.

## Tech Stack

### Core Frameworks
-   **Next.js 16 (App Router):** The React framework for the web.
-   **React 19:** Library for building user interfaces.
-   **TypeScript:** Typed superset of JavaScript for code safety.
-   **TailwindCSS v4:** Utility-first CSS framework for rapid styling.

### AI & Machine Learning
-   **Hugging Face Transformers.js**: Running state-of-the-art models directly in Node.js/Edge.
-   **Models Used:**
    -   `Xenova/Bio_ClinicalBERT`: For domain-specific embedding generation in healthcare contexts.
    -   `Xenova/all-MiniLM-L6-v2`: For efficient, general-purpose sentence similarity and career role matching.

### Database & Backend
-   **MongoDB & Mongoose:** Primary NoSQL database for flexible data modeling of users and career tracks.
-   **Supabase:** PostgreSQL database utilized specifically for its `pgvector` extension to handle vector similarity searches.
-   **Redis (Optional):** Integration ready for caching and external API syncing (e.g., Codeforces data).

## Project Structure

```
skill-orbit/
├── app/
│   ├── api/               # Next.js API Routes (Backend)
│   │   ├── admin/         # Admin routes (SEED data, Role suggestions)
│   │   ├── auth/          # Authentication routes
│   │   └── generate-embeddings/ # AI Embedding generation logic
│   ├── skill-gap/         # Skill gap analysis features
│   ├── dashboard/         # User dashboard pages
│   └── page.tsx           # Landing page
├── models/                # Mongoose Database Schemas (User, CareerField)
├── lib/                   # Shared utilities (Supabase client, DB connection)
├── public/                # Static assets (Images, Icons)
└── package.json           # specific project dependencies
```

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/skill-orbit.git
    cd skill-orbit
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    # Database
    MONGODB_URI=your_mongodb_connection_string
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

    # Auth
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the application.

## Impressive Details regarding Implementation

-   **On-Demand Vectorization:** Unlike many apps that rely on external python services for AI, Skill Orbit runs the Transformer models **within the Javascript runtime**. This reduces latency and simplifies the infrastructure stack.
-   **Semantic Search:** We don't just match keywords (e.g., "Java"). If a user describes "building backend systems using Spring Boot," our embedding engine understands the context and maps it to "Backend Engineer" roles even without exact keyword overlap.
