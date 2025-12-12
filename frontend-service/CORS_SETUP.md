# CORS настройка (справочная информация)

## Текущая конфигурация

Frontend уже настроен на работу с портом **3001** (см. `vite.config.ts`).

Backend сервис также настроен на CORS с портами 3001 и 3003.

**CORS должен работать "из коробки" без дополнительных настроек!**

## Если возникают CORS ошибки

### Проверка 1: Правильный порт

Убедитесь, что фронтенд запущен на порту 3001:
```bash
npm run dev
```

Браузер должен автоматически открыться на `http://localhost:3001`

### Проверка 2: Backend запущен

```bash
# Проверьте доступность API
curl http://localhost:8080/api/test
```

### Проверка 3: Если изменили порт на 5173

Если вы вручную изменили порт в `vite.config.ts` на 5173, нужно обновить CORS в backend.

Измените файл:
```
simple-auth-trucking-service/src/main/java/ru/urfu/testauth/config/CorsConfig.java
```

Замените строку:
```java
registry.addMapping("/**").allowedOrigins("http://localhost:3001", "http://localhost:3003");
```

На:
```java
registry.addMapping("/**")
    .allowedOrigins("http://localhost:3001", "http://localhost:3003", "http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true);
```

Также обновите аннотацию в `ApiController.java`:
```java
@CrossOrigin(origins = {
    "http://localhost:3003",
    "http://localhost:3001",
    "http://localhost:5173"  // Добавить эту строку
}, maxAge = 3600)
```

После изменений перезапустите backend:
```bash
# Остановите (Ctrl+C) и запустите заново
cd simple-auth-trucking-service
mvn spring-boot:run
```

## Решение 2: Изменить порт фронтенда (альтернатива)

Измените файл `frontend-service/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001  // Изменить на 3001
  }
})
```

Тогда фронтенд будет доступен на `http://localhost:3001`

## Проверка

После применения любого решения:

1. Откройте браузер на `http://localhost:5173` (или 3001)
2. Откройте Developer Tools (F12) → Network
3. Попробуйте авторизоваться
4. Убедитесь, что нет CORS ошибок

### Типичная CORS ошибка выглядит так:
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

Если видите такую ошибку - примените Решение 1.
