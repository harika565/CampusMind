import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../src/pages/LoginPage';
import { AuthProvider } from '../src/context/AuthContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('LoginPage Component', () => {
  it('renders institutional login title and form inputs', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Institutional Sign In/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Institutional Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to CampusMind/i })).toBeInTheDocument();
  });

  it('provides quick-fill demo buttons for student, faculty, and administrator', () => {
    renderWithProviders(<LoginPage />);
    const studentBtn = screen.getByRole('button', { name: /^Student$/i });
    const facultyBtn = screen.getByRole('button', { name: /^Faculty$/i });
    const adminBtn = screen.getByRole('button', { name: /^Administrator$/i });

    expect(studentBtn).toBeInTheDocument();
    expect(facultyBtn).toBeInTheDocument();
    expect(adminBtn).toBeInTheDocument();

    // Click Student quick-fill
    fireEvent.click(studentBtn);
    const emailInput = screen.getByLabelText(/Institutional Email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('student@university.edu');
  });

  it('toggles password visibility when eye button is clicked', () => {
    renderWithProviders(<LoginPage />);
    const passwordInput = screen.getByLabelText(/^Password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');

    const hideBtn = screen.getByLabelText(/Hide password/i);
    fireEvent.click(hideBtn);
    expect(passwordInput.type).toBe('password');
  });
});
