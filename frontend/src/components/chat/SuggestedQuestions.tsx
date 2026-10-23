import React from 'react';
import { HelpCircle, Calendar, GraduationCap, FileCheck, DollarSign, BookOpen } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const DEFAULT_QUESTIONS = [
  {
    icon: Calendar,
    title: 'Academic Calendar',
    prompt: 'When do the end-semester examinations and winter break begin for Fall 2026?',
  },
  {
    icon: GraduationCap,
    title: 'Attendance Regulations',
    prompt: 'What are the attendance requirements and medical condonation rules?',
  },
  {
    icon: FileCheck,
    title: 'Examination Guidelines',
    prompt: 'What is the passing criteria and revaluation procedure for examinations?',
  },
  {
    icon: DollarSign,
    title: 'Fee Payment Deadlines',
    prompt: 'What are the installment deadlines and late fee policies for tuition?',
  },
  {
    icon: BookOpen,
    title: 'Placement Policies',
    prompt: 'What are the placement eligibility criteria and CGPA cutoffs?',
  },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6 text-left">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-campus-text-secondary uppercase tracking-wider mb-3">
        <HelpCircle className="w-3.5 h-3.5 text-campus-primary" />
        <span>Suggested Campus Inquiries</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DEFAULT_QUESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(item.prompt)}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-campus-border text-left hover:border-campus-primary/40 hover:bg-campus-primary-subtle/50 transition-all shadow-subtle group"
            >
              <div className="p-1.5 rounded-lg bg-campus-primary-light text-campus-primary group-hover:bg-campus-primary group-hover:text-white transition-colors shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-campus-text group-hover:text-campus-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-campus-text-secondary truncate mt-0.5">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
