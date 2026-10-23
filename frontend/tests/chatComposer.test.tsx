import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatComposer } from '../src/components/chat/ChatComposer';

describe('ChatComposer Component', () => {
  it('renders textarea with placeholder and send button', () => {
    const handleSend = vi.fn();
    render(<ChatComposer onSendMessage={handleSend} isLoading={false} />);

    expect(screen.getByPlaceholderText(/Ask anything regarding/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send message/i)).toBeInTheDocument();
  });

  it('does not trigger onSendMessage if textarea is empty or only whitespace', () => {
    const handleSend = vi.fn();
    render(<ChatComposer onSendMessage={handleSend} isLoading={false} />);

    const sendBtn = screen.getByLabelText(/Send message/i);
    expect(sendBtn).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/Ask anything regarding/i);
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.click(sendBtn);

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('triggers onSendMessage and clears input when submitted', () => {
    const handleSend = vi.fn();
    render(<ChatComposer onSendMessage={handleSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Ask anything regarding/i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'What are the examination rules?' } });

    const sendBtn = screen.getByLabelText(/Send message/i);
    expect(sendBtn).not.toBeDisabled();
    fireEvent.click(sendBtn);

    expect(handleSend).toHaveBeenCalledWith('What are the examination rules?');
    expect(textarea.value).toBe('');
  });

  it('submits on Enter key press but not Shift+Enter', () => {
    const handleSend = vi.fn();
    render(<ChatComposer onSendMessage={handleSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/Ask anything regarding/i);
    fireEvent.change(textarea, { target: { value: 'Tell me about the fee schedule' } });

    // Shift + Enter should not submit
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(handleSend).not.toHaveBeenCalled();

    // Plain Enter should submit
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(handleSend).toHaveBeenCalledWith('Tell me about the fee schedule');
  });
});
