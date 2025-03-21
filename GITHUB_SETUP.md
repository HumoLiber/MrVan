# Налаштування GitHub для xBank Landing Page

Цей документ містить інструкції для створення та підключення GitHub репозиторію для проекту xBank Landing Page.

## Створення нового репозиторію

1. Перейдіть на [GitHub](https://github.com)
2. Натисніть "+" у верхньому правому куті та виберіть "New repository"
3. Введіть назву репозиторію, наприклад, "xbank-landing" або "xbank-org"
4. Додайте опис (необов'язково): "Landing page for xBank - modern online banking platform"
5. Виберіть "Public" або "Private" залежно від ваших потреб
6. Не ставте галочку "Initialize this repository with a README" (оскільки ми вже маємо README)
7. Натисніть "Create repository"

## Підключення локального репозиторію до GitHub

Після створення репозиторію, виконайте наступні команди в терміналі:

```bash
# Замініть yourusername на ваше ім'я користувача GitHub
# Замініть xbank-landing на назву вашого репозиторію
git remote add origin https://github.com/yourusername/xbank-landing.git
git push -u origin main
```

Або використайте скрипт `github_setup.sh`:

1. Відкрийте файл `github_setup.sh` та замініть значення змінних:
   - `GITHUB_USERNAME` - ваше ім'я користувача GitHub
   - `REPO_NAME` - назва вашого репозиторію

2. Запустіть скрипт:
   ```bash
   ./github_setup.sh
   ```

## Перевірка підключення

Після виконання команд, перевірте, чи успішно підключено репозиторій:

```bash
git remote -v
```

Ви повинні побачити щось на зразок:
```
origin  https://github.com/yourusername/xbank-landing.git (fetch)
origin  https://github.com/yourusername/xbank-landing.git (push)
```

## Робота з репозиторієм

### Отримання змін з GitHub

```bash
git pull origin main
```

### Відправлення змін на GitHub

```bash
git add .
git commit -m "Опис змін"
git push origin main
```

### Створення нової гілки

```bash
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## Налаштування GitHub Pages (опціонально)

Якщо ви хочете розгорнути сайт за допомогою GitHub Pages:

1. Перейдіть до налаштувань репозиторію на GitHub
2. Прокрутіть до розділу "GitHub Pages"
3. У випадаючому списку "Source" виберіть "main" або "master"
4. Натисніть "Save"

Ваш сайт буде доступний за адресою: `https://yourusername.github.io/xbank-landing`

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
