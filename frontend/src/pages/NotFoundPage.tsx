import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white border border-campus-border rounded-2xl p-8 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-campus-primary-subtle text-campus-primary flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-campus-text">404 — Page Not Found</h2>
        <p className="text-xs text-campus-text-secondary leading-relaxed">
          The requested institutional path does not exist or has been relocated within the CampusMind directory.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return
          </Button>
          <Link to="/" className="btn-primary text-xs py-2">
            <Home className="w-3.5 h-3.5 mr-1" /> Campus Home
          </Link>
        </div>
      </div>
    </div>
  );
};
