import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockIndicator } from '../components/layout/MockIndicator';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'faculty') return '/faculty/dashboard';
    return '/app/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-campus-bg text-campus-text">
      {/* Public Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-campus-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-campus-primary flex items-center justify-center text-white shadow-subtle group-hover:bg-campus-primary-hover transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-campus-text tracking-tight">CampusMind</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-campus-primary-subtle text-campus-primary font-semibold border border-campus-primary/20">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-campus-text-secondary">
            <Link to="/#features" className="hover:text-campus-text transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="hover:text-campus-text transition-colors">
              How It Works
            </Link>
            <Link to="/#categories" className="hover:text-campus-text transition-colors">
              Knowledge Scope
            </Link>
            <Link to="/#security" className="hover:text-campus-text transition-colors">
              Security & Privacy
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <MockIndicator />
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="btn-primary text-xs py-2"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-xs py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <MockIndicator />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-campus-border bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-campus-text-secondary">
              <Link
                to="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 hover:text-campus-text"
              >
                Features
              </Link>
              <Link
                to="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 hover:text-campus-text"
              >
                How It Works
              </Link>
              <Link
                to="/#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 hover:text-campus-text"
              >
                Knowledge Scope
              </Link>
              <Link
                to="/#security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 hover:text-campus-text"
              >
                Security & Privacy
              </Link>
            </nav>
            <div className="pt-2 border-t border-campus-border flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full text-xs"
                >
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary w-full text-xs text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full text-xs text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-campus-border mt-auto text-xs text-campus-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-campus-primary flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-campus-text">CampusMind</span>
              </div>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                AI-Powered Intelligent Campus Assistant delivering verifiable, document-grounded answers for students, faculty, and administrators.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-campus-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero hallucination constraint on campus policies</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <p className="font-semibold text-campus-text uppercase tracking-wider text-[11px]">
                Knowledge Scope
              </p>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/app/chat?q=Academic Regulations" className="hover:text-campus-text">Academic Regulations</Link></li>
                <li><Link to="/app/chat?q=Semester Calendar" className="hover:text-campus-text">Semester Calendars</Link></li>
                <li><Link to="/app/chat?q=Exam Notifications" className="hover:text-campus-text">Exam Notifications</Link></li>
                <li><Link to="/app/chat?q=Tuition Fee Schedule" className="hover:text-campus-text">Tuition Fee Schedules</Link></li>
                <li><Link to="/app/chat?q=Placement Guidelines" className="hover:text-campus-text">Placement Handbook</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <p className="font-semibold text-campus-text uppercase tracking-wider text-[11px]">
                Platform
              </p>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/login" className="hover:text-campus-text">Student Portal</Link></li>
                <li><Link to="/login" className="hover:text-campus-text">Faculty Portal</Link></li>
                <li><Link to="/login" className="hover:text-campus-text">Admin Control Center</Link></li>
                <li><Link to="/register" className="hover:text-campus-text">Institutional Registration</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2">
              <p className="font-semibold text-campus-text uppercase tracking-wider text-[11px]">
                Integrity & Governance
              </p>
              <p className="text-xs text-campus-text-secondary leading-relaxed">
                CampusMind employs Retrieval-Augmented Generation (RAG) strictly referencing authorized institutional PDF and DOCX repositories.
              </p>
              <p className="text-[11px] text-campus-text-muted">
                Official University System · Version 1.0.0
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-campus-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} CampusMind Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-campus-text cursor-pointer">Institutional Privacy</span>
              <span className="hover:text-campus-text cursor-pointer">Access Control</span>
              <span className="hover:text-campus-text cursor-pointer">System Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
