#!/bin/bash

# Скрипт для підключення до GitHub репозиторію
# Замініть GITHUB_USERNAME на ваше ім'я користувача GitHub
# Замініть REPO_NAME на назву вашого репозиторію

GITHUB_USERNAME="yourusername"
REPO_NAME="xbank-landing"

echo "Підключення до GitHub репозиторію: $GITHUB_USERNAME/$REPO_NAME"

# Додаємо віддалений репозиторій
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Перевіряємо, чи успішно додано
git remote -v

# Відправляємо код на GitHub
echo "Відправляємо код на GitHub..."
git push -u origin main

echo "Готово! Перевірте ваш репозиторій на GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
