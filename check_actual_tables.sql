-- Перевіряємо, які таблиці існують у схемі public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'; 