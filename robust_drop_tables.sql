-- Перевіряємо, які таблиці існують і в яких схемах
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name IN ('users', 'partners', 'services', 'bookings', 'reviews');

-- Спробуємо видалити таблиці з усіх можливих схем
DO $$
DECLARE
  schemas TEXT[] := ARRAY['public', 'auth', 'storage'];
  schema_name TEXT;
  tables TEXT[] := ARRAY['reviews', 'bookings', 'services', 'partners', 'users'];
  table_name TEXT;
BEGIN
  FOREACH schema_name IN ARRAY schemas
  LOOP
    FOREACH table_name IN ARRAY tables
    LOOP
      EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', schema_name, table_name);
    END LOOP;
  END LOOP;
END
$$;

-- Перевіряємо після видалення
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name IN ('users', 'partners', 'services', 'bookings', 'reviews'); 