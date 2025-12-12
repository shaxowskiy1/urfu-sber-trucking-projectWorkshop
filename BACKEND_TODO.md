# Backend API - Необходимые endpoints

## Текущий статус

Frontend теперь пытается отправлять данные на следующие endpoints:

### ✅ Реализовано в backend
- `POST /api/auth/login` - авторизация
- `POST /api/auth/register` - регистрация  
- `GET /api/orders` - получение заказов
- `POST /api/orders/create` - создание заказа
- `DELETE /api/orders/{id}` - удаление заказа

### ⚠️ НЕ реализовано (frontend имеет fallback)
- `POST /api/drivers` - создание водителя
- `POST /api/trucks` - создание транспорта
- `POST /api/trailers` - создание прицепа
- `POST /api/fleet-assignments` - создание связи водитель-транспорт-прицеп
- `GET /api/drivers` - получение списка водителей
- `GET /api/trucks` - получение списка транспорта
- `GET /api/trailers` - получение списка прицепов
- `GET /api/fleet-assignments` - получение списка связей

## Как работает frontend

Для каждого создания сущности (водитель, транспорт, прицеп, связь):

1. **Попытка отправить на backend** (`http://localhost:8080/api/...`)
2. Если backend недоступен или endpoint не существует → **fallback на локальное сохранение**
3. Показ уведомления пользователю:
   - "✅ [Сущность] успешно добавлен" - если backend ответил OK
   - "✅ [Сущность] добавлен (локально)" - если сохранено локально

## Структура данных для API

### Driver (водитель)
```json
{
  "name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "licenseNumber": "77 01 123456",
  "birthDate": "1985-05-15",
  "birthPlace": "г. Москва",
  "passportSeries": "45 01",
  "passportNumber": "123456",
  "passportIssuedBy": "УМВД России по г. Москве",
  "passportIssueDate": "2005-06-20",
  "registrationAddress": "г. Москва, ул. Ленина, д. 1, кв. 1",
  "availability": "Не работает",
  "comment": "Дополнительная информация"
}
```

### Truck (транспорт)
```json
{
  "make": "КАМАЗ",
  "model": "5490",
  "year": 2021,
  "licensePlate": "М123АВ77",
  "vinNumber": "XTC5490S0L0123456",
  "maintenanceStatus": "Исправен",
  "currentLocation": "Москва",
  "comment": "Дополнительная информация"
}
```

### Trailer (прицеп)
```json
{
  "licensePlate": "АМ123477",
  "trailerType": "Бортовой",
  "length": "13.6",
  "width": "2.45",
  "height": "2.7",
  "volume": "90.0 м³",
  "comment": "Дополнительная информация"
}
```

### FleetAssignment (связь)
```json
{
  "driverId": "ВОД-001",
  "truckId": "АВТ-001",
  "trailerId": "ПРЦ-001",
  "assignedDate": "2024-12-12"
}
```

## Что нужно добавить в backend

### 1. Entity классы
Создать в `simple-auth-trucking-service`:
- `Driver.java`
- `Truck.java`
- `Trailer.java`
- `FleetAssignment.java`

### 2. Repository интерфейсы
- `DriverRepository extends JpaRepository<Driver, Long>`
- `TruckRepository extends JpaRepository<Truck, Long>`
- `TrailerRepository extends JpaRepository<Trailer, Long>`
- `FleetAssignmentRepository extends JpaRepository<FleetAssignment, Long>`

### 3. Service классы
- `DriverService`
- `TruckService`
- `TrailerService`
- `FleetAssignmentService`

### 4. Controller endpoints

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:3003"})
public class FleetController {

    @PostMapping("/drivers")
    public ResponseEntity<?> createDriver(@RequestBody Driver driver) {
        // ...
    }

    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers() {
        // ...
    }

    @PostMapping("/trucks")
    public ResponseEntity<?> createTruck(@RequestBody Truck truck) {
        // ...
    }

    @GetMapping("/trucks")
    public ResponseEntity<?> getAllTrucks() {
        // ...
    }

    @PostMapping("/trailers")
    public ResponseEntity<?> createTrailer(@RequestBody Trailer trailer) {
        // ...
    }

    @GetMapping("/trailers")
    public ResponseEntity<?> getAllTrailers() {
        // ...
    }

    @PostMapping("/fleet-assignments")
    public ResponseEntity<?> createFleetAssignment(@RequestBody FleetAssignment assignment) {
        // ...
    }

    @GetMapping("/fleet-assignments")
    public ResponseEntity<?> getAllFleetAssignments() {
        // ...
    }

    @DeleteMapping("/fleet-assignments/{id}")
    public ResponseEntity<?> deleteFleetAssignment(@PathVariable Long id) {
        // ...
    }
}
```

### 5. Database migration (Flyway)

Создать файл миграции, например `V2__create_fleet_tables.sql`:

```sql
CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    birth_date DATE,
    birth_place VARCHAR(255),
    passport_series VARCHAR(10),
    passport_number VARCHAR(20),
    passport_issued_by VARCHAR(255),
    passport_issue_date DATE,
    registration_address TEXT,
    availability VARCHAR(50) DEFAULT 'Не работает',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trucks (
    id BIGSERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    vin_number VARCHAR(17),
    maintenance_status VARCHAR(50) DEFAULT 'Исправен',
    current_location VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trailers (
    id BIGSERIAL PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    trailer_type VARCHAR(100) NOT NULL,
    length VARCHAR(20),
    width VARCHAR(20),
    height VARCHAR(20),
    volume VARCHAR(50),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fleet_assignments (
    id BIGSERIAL PRIMARY KEY,
    driver_id BIGINT REFERENCES drivers(id) ON DELETE CASCADE,
    truck_id BIGINT REFERENCES trucks(id) ON DELETE CASCADE,
    trailer_id BIGINT REFERENCES trailers(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Проверка работы

После реализации backend:

1. Запустите backend сервисы
2. Откройте frontend на `http://localhost:3001`
3. Войдите как логист
4. Откройте "Управление автопарком"
5. Добавьте водителя/транспорт/прицеп
6. Проверьте в консоли браузера - не должно быть ошибок сети
7. Проверьте уведомление - должно быть "успешно добавлен" (без "локально")
8. Проверьте в базе данных - запись должна появиться

## До реализации backend

Frontend будет продолжать работать в **fallback режиме**:
- Все данные сохраняются только в памяти браузера
- При перезагрузке страницы данные теряются
- Уведомления показывают "(локально)"
- Функционал работает, но данные не персистентны
