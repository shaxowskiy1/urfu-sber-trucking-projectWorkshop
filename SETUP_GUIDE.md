# Руководство по запуску проекта

Этот проект состоит из трех компонентов:
1. **PostgreSQL база данных** (порт 5432)
2. **Backend сервисы** (порты 8080, 8081)
3. **Frontend** (порт 5173)

## Предварительные требования

- Docker и Docker Compose
- Java 17+
- Maven
- Node.js 18+
- npm или yarn

## Шаг 1: Запуск базы данных

```bash
# Запустить PostgreSQL через Docker Compose
docker-compose up -d
```

Это запустит PostgreSQL на порту 5432 с параметрами:
- Database: `postgres`
- User: `postgres`
- Password: `postgres`

## Шаг 2: Запуск backend сервисов

### Вариант A: Запуск через Maven (рекомендуется для разработки)

#### Simple Auth Trucking Service (порт 8080)

```bash
cd simple-auth-trucking-service
mvn spring-boot:run
```

Этот сервис предоставляет:
- `/api/auth/login` - авторизация
- `/api/auth/register` - регистрация
- `/api/orders` - работа с заказами
- `/api/orders/create` - создание заказов

#### Match Service (порт 8081)

```bash
cd match-service
mvn spring-boot:run
```

Этот сервис предоставляет:
- `/api/calculate` - расчет подходящих водителей
- `/api/calculate/assign` - назначение водителя на заказ

### Вариант B: Сборка и запуск JAR файлов

```bash
# Сборка Simple Auth Trucking Service
cd simple-auth-trucking-service
mvn clean package
java -jar target/simple-auth-trucking-service-0.0.1-SNAPSHOT.jar

# В новом терминале - сборка Match Service
cd match-service
mvn clean package
java -jar target/match-service-0.0.1-SNAPSHOT.jar
```

## Шаг 3: Запуск Frontend

```bash
cd frontend-service
npm install
npm run dev
```

Frontend запустится на `http://localhost:3001` (браузер откроется автоматически)

## Проверка работоспособности

### 1. Проверка базы данных

```bash
docker ps
```

Должен быть запущен контейнер `postgres_db`

### 2. Проверка backend сервисов

```bash
# Simple Auth Trucking Service
curl http://localhost:8080/api/test

# Match Service  
curl http://localhost:8081/actuator/health
```

### 3. Проверка frontend

Откройте браузер: `http://localhost:3001`

## Тестовые учетные записи

После регистрации через UI или используйте тестовые аккаунты (если они есть в базе):

**Грузоотправитель:**
- ИНН: `7701234567`
- Пароль: `shipper123`

**Логист:**
- ИНН: `7709876543`
- Пароль: `logist123`

## Структура API

### Backend на порту 8080 (simple-auth-trucking-service)

- `POST /api/auth/login` - вход в систему
- `POST /api/auth/register` - регистрация
- `POST /api/orders/create` - создание заказа
- `GET /api/orders` - получение всех заказов
- `DELETE /api/orders/{id}` - удаление заказа
- `GET /api/users` - получение всех пользователей

### Backend на порту 8081 (match-service)

- `POST /api/calculate` - расчет подходящих водителей
- `POST /api/calculate/assign` - назначение водителя

## Остановка сервисов

```bash
# Остановить Docker контейнеры
docker-compose down

# Остановить backend - Ctrl+C в соответствующих терминалах

# Остановить frontend - Ctrl+C
```

## Troubleshooting

### Ошибка подключения к базе данных

Убедитесь, что PostgreSQL запущен:
```bash
docker ps | grep postgres
```

Проверьте логи:
```bash
docker logs postgres_db
```

### Backend не запускается

Проверьте, что порты 8080 и 8081 свободны:
```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Linux/Mac
lsof -i :8080
lsof -i :8081
```

### Frontend показывает ошибки соединения

1. Убедитесь, что backend сервисы запущены
2. Проверьте консоль браузера на наличие CORS ошибок
3. Проверьте, что в `frontend-service/.env.development` нет переменной `VITE_USE_MOCKS=true`

### Миграции базы данных не применяются

Проверьте файлы миграции в:
```
simple-auth-trucking-service/src/main/resources/db/migration/
```

Flyway автоматически применит миграции при запуске приложения.

## Разработка

### Режим автоматической перезагрузки

**Backend:**
```bash
mvn spring-boot:run
```

**Frontend:**
```bash
npm run dev
```

### Логи

**Backend логи** выводятся в консоль где запущен сервис

**Frontend логи** доступны в консоли браузера (F12)

## Дополнительная информация

- Backend использует Spring Boot 3.x
- Frontend использует React 18 + TypeScript + Vite
- База данных: PostgreSQL 15
- ORM: Spring Data JPA (Hibernate)
