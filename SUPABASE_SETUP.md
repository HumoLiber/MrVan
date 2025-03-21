# Налаштування Supabase для xBank

Цей документ містить інструкції для налаштування Supabase як бекенду для xBank.

## Створення проекту

1. Створіть обліковий запис на [Supabase](https://supabase.com)
2. Створіть новий проект
3. Запишіть URL та API ключ проекту для подальшого використання

## Створення таблиць

Виконайте наступні SQL-запити в SQL Editor Supabase:

### Таблиця контактів

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може додавати контакти)
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY "Authenticated users can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Таблиця підписок

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може підписатися)
CREATE POLICY "Anyone can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY "Authenticated users can read subscriptions" ON subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Налаштування API

1. Перейдіть до розділу "API" в панелі керування Supabase
2. Скопіюйте URL та anon key
3. Оновіть файл `supabase.js` з вашими реальними даними:

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
```

## Тестування

Після налаштування Supabase, ви можете протестувати інтеграцію, заповнивши форму на сайті. Дані повинні зберігатися в таблиці `contacts` в Supabase.

## Додаткові налаштування

### Автентифікація

Для додавання автентифікації користувачів:

1. Перейдіть до розділу "Authentication" в панелі керування Supabase
2. Налаштуйте провайдери автентифікації (Email, Google, GitHub тощо)
3. Оновіть код для підтримки автентифікації

### Зберігання файлів

Для зберігання файлів (наприклад, аватарів користувачів):

1. Перейдіть до розділу "Storage" в панелі керування Supabase
2. Створіть нові бакети для зберігання файлів
3. Налаштуйте політики доступу до файлів
