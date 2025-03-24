-- Видалення існуючих таблиць у правильному порядку (щоб уникнути порушень обмежень зовнішніх ключів)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS users;

-- Видалення пов'язаних політик
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Anyone can view partners" ON partners;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews; 