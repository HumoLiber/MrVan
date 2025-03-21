-- Створення таблиці лідів (потенційних клієнтів)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  bank_name TEXT,
  company TEXT,
  phone TEXT,
  portfolio TEXT,
  region TEXT,
  tech_stack TEXT,
  consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може додавати ліди)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Створення таблиці контактів
CREATE TABLE IF NOT EXISTS contacts (
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

-- Створення таблиці підписок
CREATE TABLE IF NOT EXISTS subscriptions (
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
