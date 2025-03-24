-- Insert test partners
INSERT INTO partners (name, description, website_url, contact_email, contact_phone, status) VALUES
('Автосервіс "МайстерПро"', 'Професійний автосервіс з досвідченими механіками', 'https://masterpro.ua', 'contact@masterpro.ua', '+380501234567', 'active'),
('СТО "Експерт"', 'Спеціалізований технічний центр з ремонту європейських авто', 'https://expert-auto.ua', 'info@expert-auto.ua', '+380671234567', 'active'),
('Шиномонтаж "ШвидкоКолесо"', 'Швидкий та якісний шиномонтаж', 'https://quickwheel.ua', 'service@quickwheel.ua', '+380631234567', 'active');

-- Insert test services
INSERT INTO services (partner_id, name, description, price_range, is_available) 
SELECT 
    id,
    'Діагностика ходової',
    'Повна діагностика ходової частини автомобіля',
    '500-1000 грн',
    true
FROM partners WHERE name = 'Автосервіс "МайстерПро"';

INSERT INTO services (partner_id, name, description, price_range, is_available) 
SELECT 
    id,
    'Заміна масла',
    'Заміна масла та фільтрів',
    '1000-2000 грн',
    true
FROM partners WHERE name = 'Автосервіс "МайстерПро"';

INSERT INTO services (partner_id, name, description, price_range, is_available) 
SELECT 
    id,
    E'Комп\'ютерна діагностика',
    'Повна діагностика електронних систем автомобіля',
    '800-1500 грн',
    true
FROM partners WHERE name = 'СТО "Експерт"';

INSERT INTO services (partner_id, name, description, price_range, is_available) 
SELECT 
    id,
    'Шиномонтаж',
    'Заміна та балансування коліс',
    '400-800 грн',
    true
FROM partners WHERE name = 'Шиномонтаж "ШвидкоКолесо"'; 