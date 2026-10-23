import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white border border-campus-border rounded-2xl p-8 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-campus-text">Access Restricted</h2>
        <p className="text-xs text-campus-text-secondary leading-relaxed">
          Your institutional account does not possess the administrative privileges required to view this area.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Go Back
          </Button>
          <Button size="sm" onClick={() => navigate('/app/dashboard')}>
            <Home className="w-3.5 h-3.5 mr-1" /> Student / Faculty Home
          </Button>
        </div>
      </div>
    </div>
  );
};
