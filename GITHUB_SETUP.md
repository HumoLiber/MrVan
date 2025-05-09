# Налаштування GitHub для Primaveravan Landing Page

Цей документ містить інструкції для створення та підключення GitHub репозиторію для проекту Primaveravan Landing Page.

## Кроки для створення репозиторію на GitHub

1. Увійдіть у свій обліковий запис на GitHub або створіть новий на [github.com](https://github.com).
2. Натисніть кнопку "+" у верхньому правому куті та виберіть "New repository".
3. Введіть ім'я репозиторію (наприклад, `primaveravan.mistervan.es`).
4. Додайте опис (необов'язково): "Landing page for Primaveravan - premium camper van rental service"
5. Виберіть тип репозиторію (приватний або публічний).
6. Відзначте опцію "Initialize this repository with a README" (за бажанням).
7. Натисніть "Create repository".

## Підключення локального проекту до GitHub репозиторію

### Якщо ви створюєте новий проект:

```bash
# Створіть нову директорію для проекту
mkdir primaveravan.mistervan.es
cd primaveravan.mistervan.es

# Ініціалізуйте Git репозиторій
git init

# Створіть основні файли проекту
touch index.html
touch style.css
touch script.js

# Зробіть перший коміт
git add .
git commit -m "Initial commit"

# Підключіть віддалений репозиторій (замініть URL на ваш)
git remote add origin https://github.com/yourusername/primaveravan.mistervan.es.git

# Відправте зміни на GitHub
git push -u origin main
```

### Якщо у вас вже є локальний проект:

```bash
# Перейдіть до директорії проекту
cd path/to/primaveravan.mistervan.es

# Ініціалізуйте Git репозиторій, якщо він ще не ініціалізований
git init

# Додайте всі файли
git add .

# Зробіть перший коміт
git commit -m "Initial commit"

# Підключіть віддалений репозиторій (замініть URL на ваш)
git remote add origin https://github.com/yourusername/primaveravan.mistervan.es.git

# Відправте зміни на GitHub
git push -u origin main
```

## Робота з репозиторієм

Після підключення репозиторію, ви можете працювати з ним, використовуючи стандартні команди Git:

```bash
# Перевірка статусу
git status

# Додавання змін
git add .

# Виконання коміту
git commit -m "Опис змін"

# Відправлення змін на GitHub
git push

# Отримання останніх змін з GitHub
git pull
```

## Автоматичний деплой з GitHub

Ви можете налаштувати автоматичний деплой вашого проекту, використовуючи GitHub Actions або інтеграцію з платформами, такими як Vercel, Netlify або GitHub Pages.

### Приклад налаштування GitHub Pages:

1. Перейдіть до налаштувань репозиторію на GitHub.
2. Прокрутіть до розділу "GitHub Pages".
3. Виберіть гілку (зазвичай "main") для деплою.
4. Виберіть кореневу теку для деплою.
5. Натисніть "Save".

Після налаштування, ваш сайт буде доступний за URL `https://yourusername.github.io/primaveravan.mistervan.es/` або за власним доменом, якщо ви його налаштували.

## Інтеграція з Vercel

Для автоматичного розгортання на Vercel при кожному пуші в GitHub:

1. Підключіть свій GitHub обліковий запис до Vercel
2. Імпортуйте репозиторій в Vercel
3. Налаштуйте параметри розгортання (див. VERCEL_SETUP.md)

## Захист гілки main

Для захисту основної гілки від прямих пушів:

1. Перейдіть до налаштувань репозиторію на GitHub
2. Виберіть "Branches" в бічному меню
3. Натисніть "Add rule" біля "Branch protection rules"
4. У полі "Branch name pattern" введіть "main"
5. Виберіть потрібні правила захисту (наприклад, "Require pull request reviews before merging")
6. Натисніть "Create"
