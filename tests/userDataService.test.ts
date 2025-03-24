import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitUserData, uploadDocument, logUserAction } from '../lib/userDataService';
import supabase from '../lib/supabase';

// Мокаємо Supabase клієнт
vi.mock('../lib/supabase', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => ({
      data: { id: 'test-user-id' },
      error: null
    }))
  }
}));

describe('Тестування сервісу обробки даних користувача', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('повинен успішно зберігати дані інвестора', async () => {
    // Підготовка тестових даних
    const userData = {
      name: 'Тест Інвестор',
      email: 'investor@test.com',
      role: 'investor' as const,
      investmentAmount: '100000',
      regionsOfInterest: ['Київ', 'Одеса']
    };

    // Мокуємо успішні відповіді від Supabase
    const mockInsert = vi.fn().mockImplementation(() => ({
      data: { id: 'test-user-id' },
      error: null
    }));

    supabase.from = vi.fn().mockImplementation(() => ({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => ({
        data: { id: 'test-user-id' },
        error: null
      }))
    }));

    // Виконання тесту
    const result = await submitUserData(userData);

    // Перевірка результатів
    expect(result.success).toBe(true);
    expect(result.data.id).toBe('test-user-id');
    expect(supabase.from).toHaveBeenCalledWith('users');
    expect(mockInsert).toHaveBeenCalled();
  });

  it('повинен обробляти помилки при збереженні даних', async () => {
    // Підготовка тестових даних з помилкою
    const userData = {
      email: 'error@test.com',
      role: 'company_owner' as const,
    };

    // Мокуємо відповідь з помилкою
    supabase.from = vi.fn().mockImplementation(() => ({
      insert: vi.fn().mockImplementation(() => ({
        data: null,
        error: { message: 'Тестова помилка БД' }
      })),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => ({
        data: null,
        error: { message: 'Тестова помилка БД' }
      }))
    }));

    // Виконання тесту
    const result = await submitUserData(userData);

    // Перевірка результатів
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.message).toContain('дані користувача');
  });

  it('повинен успішно завантажувати документ', async () => {
    // Мокуємо File API
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    // Мокуємо успішне збереження документа
    supabase.from = vi.fn().mockImplementation(() => ({
      insert: vi.fn().mockImplementation(() => ({
        data: { id: 'test-doc-id' },
        error: null
      }))
    }));

    // Виконання тесту
    const result = await uploadDocument('test-user-id', 'id', mockFile);

    // Перевірка результатів
    expect(result.success).toBe(true);
    expect(result.data.fileName).toBe('test.pdf');
    expect(supabase.from).toHaveBeenCalledWith('documents');
  });

  it('повинен успішно логувати дії користувача', async () => {
    // Мокуємо успішне логування
    supabase.from = vi.fn().mockImplementation(() => ({
      insert: vi.fn().mockImplementation(() => ({
        data: { id: 'test-log-id' },
        error: null
      }))
    }));

    // Виконання тесту
    const result = await logUserAction('test-user-id', 'test_action', { testData: true });

    // Перевірка результатів
    expect(result.success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('user_logs');
  });
}); 