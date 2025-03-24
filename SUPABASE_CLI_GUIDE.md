# Налаштування та використання Supabase CLI у WindSurf

Цей документ містить інструкції щодо налаштування та використання Supabase CLI для проекту MrVan Partners.

## Встановлення Supabase CLI

1. Відкрийте термінал у WindSurf (можна використовувати вбудований термінал)
2. Встановіть Supabase CLI за допомогою npm:

```bash
npm install -g supabase
```

Або за допомогою Homebrew (для macOS):

```bash
brew install supabase/tap/supabase
```

3. Перевірте встановлення:

```bash
supabase --version
```

## Ініціалізація Supabase для проекту

1. Перейдіть до кореневої директорії проекту:

```bash
cd /Users/humoliber/Development/Mr.Van/partners.mistervan.es
```

2. Ініціалізуйте Supabase:

```bash
supabase init
```

Це створить директорію `supabase` з конфігураційними файлами.

## Налаштування локального розробницького середовища

1. Запустіть локальний Supabase (потрібен Docker):

```bash
supabase start
```

Після запуску ви отримаєте локальні URL та ключі для підключення.

2. Зупинка локального Supabase:

```bash
supabase stop
```

## Міграції бази даних

### Створення міграції

1. Створіть нову міграцію:

```bash
supabase migration new назва_міграції
```

2. Відредагуйте створений SQL файл у директорії `supabase/migrations/`.

### Застосування міграцій

```bash
supabase db push
```

## Генерація типів для TypeScript (якщо використовується)

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

## Робота з віддаленим проектом Supabase

### Зв'язування з віддаленим проектом

1. Увійдіть у свій обліковий запис Supabase:

```bash
supabase login
```

2. Зв'яжіть локальний проект з віддаленим:

```bash
supabase link --project-ref ektalbtnirqlttfkxdhe
```

Замініть `ektalbtnirqlttfkxdhe` на ідентифікатор вашого проекту.

### Розгортання міграцій на віддаленому проекті

```bash
supabase db push --db-url https://ektalbtnirqlttfkxdhe.supabase.co
```

## Корисні команди для щоденної роботи

### Перегляд статусу локального Supabase

```bash
supabase status
```

### Оновлення схеми локальної бази даних

```bash
supabase db reset
```

### Генерація документації API

```bash
supabase gen docs
```

## Інтеграція з WindSurf

1. Використовуйте вбудований термінал WindSurf для запуску команд Supabase CLI
2. Створіть задачі (tasks) у WindSurf для частих операцій з Supabase
3. Використовуйте сніпети коду для типових операцій з Supabase API

## Рекомендовані розширення для роботи з Supabase

1. SQL форматери та лінтери
2. Розширення для PostgreSQL
3. Розширення для TypeScript (якщо використовується)

## Додаткові ресурси

- [Офіційна документація Supabase CLI](https://supabase.com/docs/reference/cli)
- [Supabase TypeScript клієнт](https://supabase.com/docs/reference/javascript/typescript-support)
- [Приклади міграцій](https://supabase.com/docs/guides/database/migrations)
