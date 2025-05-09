-- SQL для створення таблиці primaveravan_leads

-- Видаляємо таблицю, якщо вона вже існує
DROP TABLE IF EXISTS primaveravan_leads;

-- Створюємо таблицю для збереження контактів з фестивалю PrimaveraVan
CREATE TABLE primaveravan_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    instagram VARCHAR(255),
    privacy_accepted BOOLEAN NOT NULL DEFAULT false,
    source VARCHAR(50) DEFAULT 'primaveravan',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо індекси для прискорення пошуку
CREATE INDEX idx_primaveravan_leads_email ON primaveravan_leads(email);
CREATE INDEX idx_primaveravan_leads_created_at ON primaveravan_leads(created_at);

-- Додаємо обмеження на унікальність email
ALTER TABLE primaveravan_leads ADD CONSTRAINT unique_email UNIQUE (email);

-- Додаємо коментарі до таблиці та полів
COMMENT ON TABLE primaveravan_leads IS 'Таблиця для збереження контактів, зібраних під час фестивалю PrimaveraVan';
COMMENT ON COLUMN primaveravan_leads.id IS 'Унікальний ідентифікатор запису';
COMMENT ON COLUMN primaveravan_leads.name IS 'Ім''я контакту';
COMMENT ON COLUMN primaveravan_leads.email IS 'Email контакту';
COMMENT ON COLUMN primaveravan_leads.instagram IS 'Нікнейм в Instagram (опціонально)';
COMMENT ON COLUMN primaveravan_leads.privacy_accepted IS 'Згода на обробку персональних даних';
COMMENT ON COLUMN primaveravan_leads.source IS 'Джерело контакту (за замовчуванням primaveravan)';
COMMENT ON COLUMN primaveravan_leads.created_at IS 'Дата та час створення запису';
COMMENT ON COLUMN primaveravan_leads.updated_at IS 'Дата та час оновлення запису';

-- Створюємо тригер для автоматичного оновлення поля updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_primaveravan_leads_modtime
BEFORE UPDATE ON primaveravan_leads
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column(); 