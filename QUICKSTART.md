# Быстрый запуск проекта

## Минимальные шаги для запуска

### 1. Запуск базы данных (1 команда)
```bash
docker-compose up -d
```

### 2. Запуск backend (2 терминала)

**Терминал 1 - Simple Auth Service (порт 8080):**
```bash
cd simple-auth-trucking-service
mvn spring-boot:run
```

**Терминал 2 - Match Service (порт 8081):**
```bash
cd match-service
mvn spring-boot:run
```

### 3. Запуск frontend (1 терминал)
```bash
cd frontend-service
npm install    # только первый раз
npm run dev
```

### 4. Откройте браузер
```
http://localhost:3001
```

## Порты

- **Frontend:** 3001 (автоматически откроется браузер)
- **Backend API:** 8080
- **Match Service:** 8081
- **PostgreSQL:** 5432

## Остановка

```bash
# 1. Остановить frontend и backend - Ctrl+C в каждом терминале
# 2. Остановить базу данных:
docker-compose down
```

## Проверка статуса

```bash
# БД запущена?
docker ps | grep postgres

# Backend доступен?
curl http://localhost:8080/api/test

# Match service доступен?  
curl http://localhost:8081/api/calculate
```

---

📖 **Подробная документация:** см. [SETUP_GUIDE.md](SETUP_GUIDE.md)
