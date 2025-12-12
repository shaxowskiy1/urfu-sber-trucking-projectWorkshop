# Изменения для интеграции с бэкендом

## Что было изменено

### 1. `frontend-service/src/services/dataApi.ts`
**Изменения:**
- Удалены все демо-данные (DEMO_ORDERS, DEMO_DRIVERS, DEMO_TRUCKS, DEMO_TRAILERS, DEMO_FLEET_ASSIGNMENTS)
- Восстановлены функции fetchJSON и API вызовы
- `fetchAllOrders()` теперь делает запрос к `/api/orders`
- `fetchAllDrivers()`, `fetchAllTrucks()`, `fetchAllTrailers()`, `fetchAllFleetAssignments()` возвращают пустые массивы (т.к. в backend пока нет соответствующих endpoints)

**Статус:** ✅ Полная интеграция с бэкендом

### 2. `frontend-service/src/components/AuthForm.tsx`
**Изменения:**
- Удалены тестовые учетные записи (testAccounts)
- Восстановлены реальные API вызовы к `/api/auth/login` и `/api/auth/register`
- Обработка ответов от бэкенда
- Правильная обработка ошибок

**Статус:** ✅ Полная интеграция с бэкендом

### 3. `frontend-service/src/services/assignmentApi.ts`
**Изменения:**
- Исправлен BASE_URL с `http://localhost:8080` на `http://localhost:8081` (match-service)

**Статус:** ✅ Корректный URL для match-service

### 4. Другие API файлы (без изменений)
- `orderApi.ts` - уже использовал правильные endpoints
- `calculateApi.ts` - уже использовал правильный URL (8081)

## Что НЕ было изменено

### Backend сервисы
Не изменялись файлы в:
- `auth-trucking-service/`
- `simple-auth-trucking-service/`
- `match-service/`

### Vite конфигурация
`vite.config.ts` уже был настроен на порт 3001, изменений не требовалось.

## Текущая архитектура

```
┌─────────────────────┐
│   Frontend (3001)   │
│   React + Vite      │
└──────────┬──────────┘
           │
           ├─────────────────────────────┐
           │                             │
           ▼                             ▼
┌──────────────────────┐    ┌────────────────────┐
│  Auth Service (8080) │    │ Match Service      │
│  - /api/auth/login   │    │ (8081)             │
│  - /api/auth/register│    │ - /api/calculate   │
│  - /api/orders       │    │ - /api/calculate/  │
│  - /api/orders/create│    │   assign           │
└──────────┬───────────┘    └─────────┬──────────┘
           │                          │
           └──────────┬───────────────┘
                      ▼
           ┌────────────────────┐
           │  PostgreSQL (5432) │
           └────────────────────┘
```

## Что работает через API

✅ **Авторизация и регистрация**
- POST `/api/auth/login`
- POST `/api/auth/register`

✅ **Заказы**
- GET `/api/orders` - получение всех заказов
- POST `/api/orders/create` - создание заказа
- DELETE `/api/orders/{id}` - удаление заказа

✅ **Расчет водителей**
- POST `/api/calculate` - расчет подходящих водителей
- POST `/api/calculate/assign` - назначение водителя

## Что НЕ работает (endpoints отсутствуют в backend)

⚠️ **Управление автопарком**
- Водители, грузовики, прицепы, назначения возвращают пустые массивы
- В backend нужно добавить соответствующие endpoints:
  - `/api/drivers`
  - `/api/trucks`
  - `/api/trailers`
  - `/api/fleet-assignments`

## Режим работы

### Текущий режим: PRODUCTION (с бэкендом)
- Frontend обращается к real API на портах 8080 и 8081
- Данные берутся из PostgreSQL
- Требуется запуск всех сервисов

### Демо-режим (был раньше)
- Frontend работал автономно с захардкоженными данными
- Не требовался backend
- Сейчас отключен

## Следующие шаги для полной функциональности

1. **Добавить в backend endpoints для автопарка:**
   ```java
   GET  /api/drivers
   POST /api/drivers
   GET  /api/trucks
   POST /api/trucks
   GET  /api/trailers
   POST /api/trailers
   GET  /api/fleet-assignments
   POST /api/fleet-assignments
   ```

2. **Создать соответствующие Entity, Repository, Service, Controller** в backend

3. **Протестировать полную интеграцию** всех функций системы

## Документация

- 📖 **Быстрый старт:** [QUICKSTART.md](../QUICKSTART.md)
- 📚 **Полная документация:** [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- 🔧 **CORS настройка:** [CORS_SETUP.md](CORS_SETUP.md)
