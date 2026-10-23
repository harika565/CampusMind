import { describe, it, expect, beforeEach } from 'vitest';
import { 
  isMockModeActive, 
  setMockModeActive, 
  MOCK_MODE_KEY, 
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY 
} from '../src/services/apiClient';

describe('API Client & Mock Mode Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('determines mock mode based on localStorage override', () => {
    setMockModeActive(true);
    expect(localStorage.getItem(MOCK_MODE_KEY)).toBe('true');
    expect(isMockModeActive()).toBe(true);

    setMockModeActive(false);
    expect(localStorage.getItem(MOCK_MODE_KEY)).toBe('false');
    expect(isMockModeActive()).toBe(false);
  });

  it('dispatches campusmind_mock_mode_changed window event upon toggle', () => {
    let triggered = false;
    const listener = () => { triggered = true; };
    window.addEventListener('campusmind_mock_mode_changed', listener);

    setMockModeActive(true);
    expect(triggered).toBe(true);

    window.removeEventListener('campusmind_mock_mode_changed', listener);
  });
});
