import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [department, setDepartment] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        role,
        department: department.trim() || undefined,
        identifier: identifier.trim() || undefined,
        password,
      });

      if (user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Registration failed. Please contact your campus administrator.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6 text-left">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-campus-primary flex items-center justify-center text-white shadow-subtle group-hover:bg-campus-primary-hover transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-campus-text tracking-tight">CampusMind</span>
          </Link>
          <h2 className="text-2xl font-bold text-campus-text tracking-tight">
            Create Institutional Account
          </h2>
          <p className="text-xs text-campus-text-secondary">
            Join the university intelligent assistant network for verified campus records.
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-campus-border rounded-2xl shadow-card p-6 sm:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />

            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. a.morgan@university.edu"
              required
            />

            {/* Role Selection (Student or Faculty only) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-campus-text">Institutional Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    role === 'student'
                      ? 'bg-campus-primary-light border-campus-primary text-campus-primary font-semibold'
                      : 'border-campus-border text-campus-text hover:bg-campus-surface-subtle'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    role === 'faculty'
                      ? 'bg-campus-primary-light border-campus-primary text-campus-primary font-semibold'
                      : 'border-campus-border text-campus-text hover:bg-campus-surface-subtle'
                  }`}
                >
                  Faculty Member
                </button>
              </div>
              <p className="text-[10px] text-campus-text-muted">
                * Administrator accounts are provisioned exclusively by IT governance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Input
                label="Department / School"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
              />
              <Input
                label={role === 'student' ? 'Student ID' : 'Faculty ID'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'student' ? 'STU-2026-XXXX' : 'FAC-XXXX'}
              />
            </div>

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-campus-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
            />

            <Button
              type="submit"
              className="w-full mt-3"
              size="md"
              isLoading={isLoading}
            >
              Complete Registration <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-campus-text-secondary">
          Already registered on CampusMind?{' '}
          <Link to="/login" className="font-semibold text-campus-primary hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
