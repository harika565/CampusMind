import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  FileCheck2, 
  Quote, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Calendar, 
  FileText, 
  GraduationCap, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Database,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleStartExploring = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/app/dashboard');
    } else {
      navigate('/login');
    }
  };

  const CATEGORIES = [
    { title: 'Academic Regulations', icon: BookOpen, desc: 'Grading scales, course registration, attendance norms & condonation rules' },
    { title: 'Academic Calendars', icon: Calendar, desc: 'Instruction schedules, mid-term evaluations, semester breaks & holidays' },
    { title: 'Exam Notifications', icon: FileText, desc: 'Admit cards, hall allotments, revaluation rules & passing criteria' },
    { title: 'Curriculum & Syllabi', icon: GraduationCap, desc: 'Course modules, prerequisites, credit allocations & reference texts' },
    { title: 'Fee Structures', icon: DollarSign, desc: 'Tuition breakdown, installment deadlines, waiver policies & penalty terms' },
    { title: 'Placement Guidelines', icon: Briefcase, desc: 'Recruitment eligibility, CGPA thresholds, internship NOCs & drive conduct' },
    { title: 'Campus Policies', icon: Building2, desc: 'Hostel accommodation, disciplinary code, laboratory protocols & safety' },
    { title: 'Institutional Governance', icon: Database, desc: 'Academic council resolutions, department directives & official circulars' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-primary-subtle border border-campus-primary/20 text-campus-primary text-xs font-semibold mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-campus-primary" />
          <span>Retrieval-Augmented Campus Intelligence (RAG)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-campus-text tracking-tight max-w-4xl mx-auto leading-tight">
          Your Campus Knowledge, <br />
          <span className="text-campus-primary">One Intelligent Assistant.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-campus-text-secondary max-w-2xl mx-auto leading-relaxed">
          CampusMind helps students, faculty, and administrators find reliable institutional information through an AI-powered assistant grounded in official campus documents.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={handleStartExploring}>
            Start Exploring <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <a href="#how-it-works" className="btn-secondary px-5 py-2.5 text-base">
            How It Works
          </a>
        </div>

        {/* Visual Architecture Representation */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-campus-border shadow-card p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-left">
              {/* Box 1: Sources */}
              <div className="bg-campus-surface-subtle p-4 rounded-xl border border-campus-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-campus-text-muted">
                    Official Repositories
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-campus-border shadow-subtle">
                    <FileText className="w-4 h-4 text-campus-primary shrink-0" />
                    <span className="truncate font-medium">Academic_Regulations_2026.pdf</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-campus-border shadow-subtle">
                    <FileText className="w-4 h-4 text-campus-primary shrink-0" />
                    <span className="truncate font-medium">Fall_Exam_Notifications.pdf</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-campus-border shadow-subtle">
                    <FileText className="w-4 h-4 text-campus-primary shrink-0" />
                    <span className="truncate font-medium">Tuition_Fee_Schedule_26.pdf</span>
                  </div>
                </div>
              </div>

              {/* Box 2: RAG Pipeline */}
              <div className="bg-campus-primary-subtle p-5 rounded-xl border border-campus-primary/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-campus-primary text-white flex items-center justify-center mx-auto shadow-subtle">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-campus-text">Semantic RAG Engine</h4>
                  <p className="text-xs text-campus-text-secondary mt-1">
                    Vector Chunking · Hybrid Search · Context Extraction
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-[11px] font-mono text-campus-primary border border-campus-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Citation Grounded</span>
                </div>
              </div>

              {/* Box 3: Verified Answer */}
              <div className="bg-campus-surface-subtle p-4 rounded-xl border border-campus-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-campus-text-muted">
                    Verified Response
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    Verified
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-campus-border shadow-subtle text-xs space-y-2">
                  <p className="font-semibold text-campus-text">Q: What is the attendance requirement?</p>
                  <p className="text-[11px] text-campus-text-secondary leading-relaxed">
                    A minimum of <strong>75%</strong> is required per course. Condonation to 65% is permissible on medical grounds.
                  </p>
                  <div className="pt-2 border-t border-campus-border flex items-center gap-1.5 text-[10px] text-campus-primary font-medium">
                    <BookOpen className="w-3 h-3" />
                    <span>Source: Academic Regulations, p.14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-campus-primary mb-2">
            Engineered For Higher Education
          </p>
          <h2 className="text-3xl font-bold text-campus-text tracking-tight">
            Institutional Clarity Without the Administrative Friction
          </h2>
          <p className="text-sm text-campus-text-secondary mt-3">
            CampusMind bridges fragmented departmental portals into an authenticated, verifiable knowledge network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-campus-primary-light text-campus-primary flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Intelligent Campus Search</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Natural language comprehension across complex institutional terminology, course codes, and regulatory clauses.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Verified Document-Based Answers</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Every answer is generated strictly from the university's indexed primary documents. No open-web hallucination.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Source Citations & Excerpts</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Inspect the exact document title, page number, section heading, and verbatim passage backing every claim.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Role-Based Information Access</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Granular access controls ensure students, faculty, and administrative staff only retrieve documents within their scope.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Centralized Institutional Knowledge</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Consolidate PDFs, handbooks, examination bulletins, and course outlines across departments into a unified interface.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-surface p-6 space-y-3 hover:border-campus-primary/30 transition-all">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-campus-text">Continuously Updated Documents</h3>
            <p className="text-xs text-campus-text-secondary leading-relaxed">
              Administrative personnel upload new policy circulars and timetables with immediate background vector re-indexing.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-campus-surface-subtle border border-campus-border rounded-2xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-campus-primary mb-2">
              Three-Step Pipeline
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-campus-text tracking-tight">
              How CampusMind Resolves Queries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-campus-primary text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-base font-semibold text-campus-text">Ask a Question</h3>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                Enter your question naturally in plain English — whether inquiring about grade revaluations, tuition installments, or attendance condonation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-campus-primary text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-base font-semibold text-campus-text">Retrieves Institutional Context</h3>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                CampusMind conducts hybrid vector and keyword retrieval across the university's authoritative indexed document repository.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-campus-primary text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-base font-semibold text-campus-text">Grounded Answer with Citations</h3>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                Receive a synthesis grounded solely in the retrieved passages, complete with document names, page coordinates, and clickable source previews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Campus Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-campus-primary mb-2">
            Institutional Scope
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-campus-text tracking-tight">
            Supported Campus Information Categories
          </h2>
          <p className="text-xs text-campus-text-secondary mt-2">
            Authoritative documentation ingested and maintained across university divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-campus-border rounded-xl p-4 space-y-2 hover:border-campus-primary/30 transition-all shadow-subtle"
              >
                <div className="p-2 w-fit rounded-lg bg-campus-primary-subtle text-campus-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-campus-text">{cat.title}</h4>
                <p className="text-[11px] text-campus-text-secondary leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Access Control Overview */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-campus-border rounded-2xl p-8 sm:p-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Enterprise Governance & Privacy</span>
              </div>
              <h2 className="text-2xl font-bold text-campus-text">
                Strict Institutional Isolation & Role-Based Authorization
              </h2>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                CampusMind enforces strict boundary isolation. Sensitive administrative records, faculty reviews, and confidential guidelines remain restricted to authenticated users possessing corresponding verified permissions.
              </p>
              <div className="space-y-2 text-xs text-campus-text">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bearer JWT authorization checked on every query and upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No student record exposure without explicit authorization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audited document ingestion with automated vector chunk tracking</span>
                </div>
              </div>
            </div>

            <div className="bg-campus-surface-subtle border border-campus-border rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-campus-text uppercase tracking-wider">
                Audited System Metrics
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-campus-border">
                  <p className="text-campus-text-muted text-[11px]">Primary Source Type</p>
                  <p className="text-sm font-semibold text-campus-text mt-0.5">Authoritative PDF/DOCX</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-campus-border">
                  <p className="text-campus-text-muted text-[11px]">Access Scopes</p>
                  <p className="text-sm font-semibold text-campus-text mt-0.5">Student · Faculty · Admin</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-campus-border">
                  <p className="text-campus-text-muted text-[11px]">Retrieval Model</p>
                  <p className="text-sm font-semibold text-campus-text mt-0.5">Dense Vector Search</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-campus-border">
                  <p className="text-campus-text-muted text-[11px]">Grounding Ratio</p>
                  <p className="text-sm font-semibold text-campus-text mt-0.5">100% Citations Included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-campus-primary text-white rounded-2xl p-8 sm:p-12 space-y-4 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to explore your campus knowledge base?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Sign in with your institutional credentials or test the interactive platform using our preloaded demo profiles.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-campus-primary hover:bg-campus-surface-subtle"
              onClick={handleStartExploring}
            >
              Sign In to CampusMind <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => navigate('/register')}
            >
              Register Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
