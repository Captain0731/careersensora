# Hireonix

Hireonix is a Next.js career intelligence platform that combines job discovery, recruiter workflows, AI interview practice, resume analysis, career mapping, FAQ chat assistance, and domain comparison tools in one frontend application.

The project is built with the Next.js App Router, React, TypeScript, and SCSS. It is currently frontend-only, with mock data and client-side state powering the main workflows.

## What the site does

Hireonix is designed around two primary experiences:

- Job seekers can explore jobs, review a job detail page, submit an application, upload a resume, run AI resume validation, and continue into AI interview practice.
- Recruiters can log in with a protected admin flow and manage job postings inside a recruiter dashboard.

The site also includes a set of AI career tools:

- AI interview practice with text, voice, and video modes
- Resume analysis and scoring
- Career mapper
- Career matching
- FAQ chat assistant
- Parallel domain comparison

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- SCSS / Sass
- Tailwind CSS 4
- ESLint 9

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

### Other scripts

```bash
npm run build
npm start
npm run lint
```

## Project Structure

```text
app/
  components/
  pages/
  services/
  layout.tsx
  page.tsx
  globals.css
public/
```

### Key routing pattern

- `app/page.tsx` renders the home page.
- `app/services/*/page.tsx` files act as route wrappers for AI feature pages.
- `app/job-*` routes handle the job seeker flow.
- `app/recruiter-job-dashboard/page.tsx` protects recruiter access.

## Routes

### Core pages

- `/` - Home page
- `/get-access` - Recruiter login
- `/sign-up` - Sign up page

### Job seeker flow

- `/job-apply` - Job listings page
- `/job-detail` - Detailed job view
- `/job-application` - Application form

### Recruiter flow

- `/recruiter-job-dashboard` - Protected recruiter dashboard

### AI and career services

- `/services/ai-interview` - AI interview practice
- `/services/career-mapper` - Career path mapping
- `/services/career-matching` - Career match analysis
- `/services/career-matching/detail` - Detailed match view
- `/services/resume-analysis` - Resume analysis and feedback
- `/services/faq-chatting` - AI FAQ chat assistant
- `/services/parallel-domain-comparison` - Parallel domain comparison

## Main Features

### Home

The home page introduces Hireonix as a career intelligence platform and serves as the landing entry point for the rest of the app.

### Job listings

The job listings page provides a filtered set of job cards with category, location, experience, and work-type controls. Each job card links into a dedicated job detail page.

### Job detail page

The job detail page shows:

- Job title
- Company
- Location
- Salary
- Skills / tags
- Full description sections
- Required experience
- Apply Now action

### Job application flow

The application form supports:

- Auto-filled personal information
- Editable fields for name, email, and phone
- Education details
- Experience details
- Skill tags with add/remove support
- A post-submit AI resume validation popup

### AI resume validation popup

After submit, the app opens an AI validation modal that:

- Accepts resume upload
- Runs resume analysis on demand
- Shows keyword match results
- Calculates multiple scores
- Shows an overall resume score
- Decides whether the candidate can continue
- Routes eligible candidates to AI interview
- Routes others to resume improvement

### AI interview practice

The AI Interview page supports three interview modes:

- Text mode
- Voice mode
- Video mode

It also includes:

- Domain selection
- Difficulty selection
- Question bank by category
- Answer submission and scoring
- Final results summary after the interview completes
- Mode-specific metrics such as fluency, accuracy, confidence, tone, nervousness, stress level, and facial reaction analysis

### Career tools

#### Career Mapper

Helps users explore career paths based on skills and interests.

#### Career Matching

Compares user profiles with relevant career options and job matches.

#### Resume Analysis

Provides resume feedback, scoring, and improvement guidance.

#### FAQ Chat

An AI-style FAQ assistant that answers common career questions.

#### Parallel Domain Comparison

Lets users compare two or more career domains side by side.

### Recruiter dashboard

The recruiter dashboard includes:

- Job posting creation
- Job editing
- Open / Paused / Closed job states
- Job type options
- Time limit field
- Summary cards and posted job listings
- A minimal dashboard navbar with logo and logout

## Authentication Flow

Hireonix uses a simple client-side auth approach for the recruiter flow.

- Login credentials are hardcoded for demo purposes.
- Successful login stores a localStorage flag.
- The recruiter dashboard checks that flag before rendering.
- If the flag is missing, the user is redirected to the login page.

### Demo credentials

- Email: `admin@careerai.com`
- Password: `Admin@123`

## Data Flow Notes

This app does not use a backend API yet.

Instead, it uses:

- React component state
- Local storage for auth and profile persistence
- Hardcoded mock data for jobs, questions, and career content
- Client-side validation and matching logic

## Styling Notes

- Global reset styles are in `app/globals.css`
- Each major feature has its own SCSS file
- The UI uses card-based layouts, gradients, soft shadows, rounded surfaces, and responsive grids
- The app uses Geist fonts through `next/font/google`

## Important Components

- `app/components/Navbar/navbar.tsx` - global navigation
- `app/components/Log in/login.tsx` - recruiter login
- `app/components/Sign UP/signup.tsx` - sign up form
- `app/components/Job Dashbord/jobdashbord.tsx` - recruiter job dashboard
- `app/pages/Jobcards/jobcard.tsx` - job listings page
- `app/pages/Job Detail/jobdetail.tsx` - job detail page
- `app/pages/Job Form/jobfrom.tsx` - job application form
- `app/pages/Job Resume Analysis/resumechecker.tsx` - resume validation popup
- `app/pages/Ai Interview/aiinterview.tsx` - AI interview practice page

## Implementation Summary

Hireonix is currently a polished frontend prototype with working multi-step user flows:

1. Browse jobs
2. Open job detail
3. Apply for the job
4. Upload and validate resume
5. Continue to AI interview or resume improvement
6. Recruiters can log in and manage jobs in a protected dashboard

## Known Limitations

- No backend database
- No real authentication service
- No file upload storage service
- No API routes yet
- Many workflows rely on local state or localStorage

## Future Improvements

- Connect recruiter auth to a real backend
- Persist jobs and applications in a database
- Upload resumes to storage and parse them server-side
- Save interview history and scores per user
- Add analytics and notification flows
- Replace demo auth with role-based access control

## License

No license has been added yet.
