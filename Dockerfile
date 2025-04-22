# Етап 1: Встановлення залежностей та збірка
# Використовуємо офіційний образ Node.js версії 18 (як вказано у вашому package.json)
FROM node:18-alpine AS deps

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли залежностей
# Використовуємо wildcard (??), щоб відповідати package.json та package-lock.json (або yarn.lock)
COPY package*.json ./

# Встановлюємо залежності тільки для production (якщо потрібно)
# Якщо у вас є devDependencies, необхідні для build, використовуйте `npm ci` або `npm install`
# Для Next.js зазвичай потрібні всі залежності для збірки
RUN npm ci

# Етап 2: Збірка Next.js додатку
FROM node:18-alpine AS builder

WORKDIR /app
# Копіюємо залежності з попереднього етапу
COPY --from=deps /app/node_modules ./node_modules
# Копіюємо решту коду проєкту
COPY . .

# Виконуємо команду збірки Next.js
RUN npm run build

# Етап 3: Запуск Production серверу
# Використовуємо мінімальний образ Node.js
FROM node:18-alpine AS runner
WORKDIR /app

# Встановлюємо змінну середовища для production
ENV NODE_ENV=production
# За замовчуванням Next.js запускається на порту 3000
ENV PORT=3000

# Створюємо користувача та групу 'nextjs'
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Автоматично визначаємо потрібні файли для запуску Next.js
# Копіюємо папку .next зі збілдкою
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
# Копіюємо node_modules
COPY --from=builder /app/node_modules ./node_modules
# Копіюємо package.json
COPY --from=builder /app/package.json ./package.json

# Копіюємо папку public та next.config.js, якщо вони існують
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
# Перевіряємо наявність next.config.js перед копіюванням (опціонально, але безпечніше)
# Якщо файл точно є, можна просто COPY --from=builder /app/next.config.js ./
# У вашому випадку він є:
COPY --from=builder /app/next.config.js ./

# Перемикаємось на непривілейованого користувача
USER nextjs

# Відкриваємо порт, на якому буде працювати додаток
EXPOSE 3000

# Команда для запуску Next.js додатку
CMD ["npm", "start"] 