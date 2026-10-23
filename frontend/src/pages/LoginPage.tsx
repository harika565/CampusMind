import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../mocks/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const handleRoleRedirect = (role: string) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else navigate('/app/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Institutional email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await login({ email: email.trim(), password });
      handleRoleRedirect(user.role);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Invalid credentials. Please verify your email and password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleKey: 'student' | 'faculty' | 'admin') => {
    const demo = DEMO_USERS[roleKey];
    setEmail(demo.user.email);
    setPassword(demo.password);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-campus-primary flex items-center justify-center text-white shadow-subtle group-hover:bg-campus-primary-hover transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-campus-text tracking-tight">CampusMind</span>
          </Link>
          <h2 className="text-2xl font-bold text-campus-text tracking-tight">
            Institutional Sign In
          </h2>
          <p className="text-xs text-campus-text-secondary">
            Access intelligent campus guidelines, syllabi, calendars, and academic resources.
          </p>
        </div>

        {/* Expired Session Notice */}
        {isExpired && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Your session has expired. Please sign in again to continue.</span>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-campus-border rounded-2xl shadow-card p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. s.morgan@university.edu"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-campus-text transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
            >
              Sign In to CampusMind <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-4 border-t border-campus-border space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-campus-text-muted">
              <span className="font-semibold uppercase tracking-wider">Quick Fill Demo Account:</span>
              <span className="font-mono text-emerald-600 font-medium">Ready to test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="px-2 py-1.5 rounded-lg border border-campus-border text-[11px] font-medium text-campus-text hover:bg-campus-surface-subtle hover:border-campus-primary/30 transition-colors text-center"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('faculty')}
                className="px-2 py-1.5 rounded-lg border border-campus-border text-[11px] font-medium text-campus-text hover:bg-campus-surface-subtle hover:border-campus-primary/30 transition-colors text-center"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2 py-1.5 rounded-lg border border-campus-border text-[11px] font-medium text-campus-text hover:bg-campus-surface-subtle hover:border-campus-primary/30 transition-colors text-center"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Registration Link */}
        <p className="text-center text-xs text-campus-text-secondary">
          Don't have an institutional account yet?{' '}
          <Link to="/register" className="font-semibold text-campus-primary hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
