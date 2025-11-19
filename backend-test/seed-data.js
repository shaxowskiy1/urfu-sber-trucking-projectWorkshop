/**
 * Скрипт для заполнения базы данных тестовыми данными
 * Запуск: node seed-data.js
 */

const { initializeDatabase, OrderDB, DriverDB, TruckDB, TrailerDB, FleetAssignmentDB, getDatabase } = require('./database');

// Тестовые данные для заказов
const testOrders = [
  {
    id: '1',
    shipperName: 'ООО "Металл-Строй"',
    managerName: 'Сергей Петров',
    origin: 'ул. Тверская, 25, Москва',
    originLatitude: '55.7640', 
    originLongitude: '37.6050',
    destination: 'ул. Марата, 14, Санкт-Петербург',
    destinationLatitude: '59.9310', 
    destinationLongitude: '30.3610',
    trailerType: 'Бортовой',
    volume: '96 м³',
    weight: '20,000 кг',
    pickupDate: '2025-10-25',
    pickupTime: '09:00',
    deliveryDate: '2025-10-25',
    deliveryTime: '21:00',
    transportationCost: 45000,
    status: 'Ожидает',
    cargoType: 'Металлопрокат',
    specialRequirements: 'Требуется кран для погрузки',
    length: '12',
    width: '2.4',
    height: '3.2',
    assignedDriverId: null,
    externalOrderNumber: 'ATI-2024-001',
    vehicleCount: 1
  },
  {
    id: '2',
    shipperName: 'ЗАО "Продукты Север"',
    managerName: 'Анна Смирнова',
    origin: 'ул. Красный проспект, 101, Новосибирск',
    originLatitude: '55.0415', 
    originLongitude: '82.9346',
    destination: 'пер. Базовый, 3, Екатеринбург',
    destinationLatitude: '56.8389', 
    destinationLongitude: '60.6057',
    trailerType: 'Рефрижератор',
    volume: '82 м³',
    weight: '18,000 кг',
    pickupDate: '2025-10-18',
    pickupTime: '10:00',
    deliveryDate: '2025-10-24',
    deliveryTime: '18:00',
    transportationCost: 42000,
    status: 'Назначен',
    cargoType: 'Скоропортящиеся продукты',
    specialRequirements: 'Температурный режим: +2 до +4°C',
    length: '13.6',
    width: '2.5',
    height: '2.4',
    assignedDriverId: 'ВОД-001',
    externalOrderNumber: 'CARGO-2024-789',
    vehicleCount: 1
  },
  {
    id: '3',
    shipperName: 'ИП "Металлолом-Сбыт"',
    managerName: 'Михаил Козлов',
    origin: 'ул. Труда, 7, Челябинск',
    originLatitude: '55.1600', 
    originLongitude: '61.4000',
    destination: 'ул. Баумана, 10, Казань',
    destinationLatitude: '55.7900', 
    destinationLongitude: '49.1210',
    trailerType: 'Контейнеровоз',
    volume: '76 м³',
    weight: '22,000 кг',
    pickupDate: '2025-10-30',
    pickupTime: '06:00',
    deliveryDate: '2025-11-01',
    deliveryTime: '10:00',
    transportationCost: 38000,
    status: 'Ожидает',
    cargoType: 'Металлолом',
    specialRequirements: 'Необходима документация по ГОСТ',
    length: '12',
    width: '2.4',
    height: '2.65',
    assignedDriverId: null,
    externalOrderNumber: null,
    vehicleCount: 1
  },
  {
    id: '4',
    shipperName: 'ТранспортСервис',
    managerName: 'Иван Петров',
    origin: 'ул. Ленина, 10, Челябинск',
    destination: 'ул. Озёрная, 7, Миасское',
    originLatitude: '55.1600',
    originLongitude: '61.4030',
    destinationLatitude: '55.0450',
    destinationLongitude: '60.9700',
    trailerType: 'Тент',
    volume: '85 м³',
    weight: '9,000 кг',
    pickupDate: '2025-10-25',
    pickupTime: '06:00',
    deliveryDate: '2025-10-25',
    deliveryTime: '17:00',
    transportationCost: 48000,
    status: 'Ожидает',
    cargoType: 'Мебель',
    specialRequirements: '',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    assignedDriverId: null,
    externalOrderNumber: null,
    vehicleCount: 1
  },
  {
    id: '5',
    shipperName: 'ЛогистикПро',
    managerName: 'Ольга Смирнова',
    origin: 'ул. Кирова, 15, Челябинск',
    destination: 'ул. Советская, 18, Чебаркуль',
    originLatitude: '55.1640',
    originLongitude: '61.3950',
    destinationLatitude: '55.0560',
    destinationLongitude: '61.0600',
    trailerType: 'Рефрижератор',
    volume: '80 м³',
    weight: '10,000 кг',
    pickupDate: '2025-10-26',
    pickupTime: '18:00',
    deliveryDate: '2025-10-27',
    deliveryTime: '10:00',
    transportationCost: 50000,
    status: 'Ожидает',
    cargoType: 'Продукты питания',
    specialRequirements: 'Температурный режим: -22 до -18°C',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    assignedDriverId: null,
    externalOrderNumber: null,
    vehicleCount: 1
  },
  {
    id: '6',
    shipperName: 'ФастКарго',
    managerName: 'Алексей Кузнецов',
    origin: 'просп. Ленина, 50, Челябинск',
    destination: 'ул. Центральная, 5, Красногорский',
    originLatitude: '55.1610',
    originLongitude: '61.4100',
    destinationLatitude: '55.1460',
    destinationLongitude: '60.9960',
    trailerType: 'Платформа',
    volume: '90 м³',
    weight: '11,000 кг',
    pickupDate: '2025-10-30',
    pickupTime: '07:00',
    deliveryDate: '2025-10-30',
    deliveryTime: '21:00',
    transportationCost: 55000,
    status: 'Ожидает',
    cargoType: 'Строительный материал',
    specialRequirements: '',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    assignedDriverId: null,
    externalOrderNumber: null,
    vehicleCount: 1
  },
  {
    id: '7',
    shipperName: 'ЭкспрессТранс',
    managerName: 'Екатерина Волкова',
    origin: 'ул. Мира, 21, Челябинск',
    destination: 'ул. Свободы, 10, Челябинск',
    originLatitude: '55.1625',
    originLongitude: '61.4121',
    destinationLatitude: '55.1480',
    destinationLongitude: '61.4000',
    trailerType: 'Рефрижератор',
    volume: '80 м³',
    weight: '10,000 кг',
    pickupDate: '2025-10-26',
    pickupTime: '19:00',
    deliveryDate: '2025-10-26',
    deliveryTime: '22:00',
    transportationCost: 10000,
    status: 'Ожидает',
    cargoType: 'Продукты питания',
    specialRequirements: '',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    assignedDriverId: null,
    externalOrderNumber: null,
    vehicleCount: 1
  }
];

// Тестовые данные для водителей
const testDrivers = [
  {
    id: 'ВОД-001',
    name: 'Иван Петров',
    phone: '+7 (495) 123-45-67',
    licenseNumber: 'ВУ-77-123456',
    availability: 'Доступен',
    comment: ''
  },
  {
    id: 'ВОД-002',
    name: 'Алексей Сидоров',
    phone: '+7 (812) 987-65-43',
    licenseNumber: 'ВУ-78-789012',
    availability: 'В рейсе',
    comment: ''
  },
  {
    id: 'ВОД-003',
    name: 'Иван Иванов',
    phone: '+7 (900) 111-22-22',
    licenseNumber: 'ВУ-79-123246',
    availability: 'Доступен',
    comment: ''
  },
  {
    id: 'ВОД-004',
    name: 'Петр Петров',
    phone: '+7 (900) 333-44-44',
    licenseNumber: 'ВУ-80-643212',
    availability: 'Не работает',
    comment: ''
  },
  {
    id: 'ВОД-005',
    name: 'Алексей Смирнов',
    phone: '+7 (900) 555-66-66',
    licenseNumber: 'ВУ-81-958672',
    availability: 'Доступен',
    comment: ''
  },
  {
    id: 'ВОД-006',
    name: 'Сергей Кузнецов',
    phone: '+7 (900) 777-88-88',
    licenseNumber: 'ВУ-82-954322',
    availability: 'Не работает',
    comment: ''
  },
  {
    id: 'ВОД-007',
    name: 'Михаил Орлов',
    phone: '+7 (900) 999-00-00',
    licenseNumber: 'ВУ-83-713222',
    availability: 'Доступен',
    comment: ''
  }
];

// Тестовые данные для тягачей
const testTrucks = [
  {
    id: 'АВТ-001',
    make: 'КАМАЗ',
    model: '5490',
    year: 2022,
    licensePlate: 'М123АВ77',
    vinNumber: 'XTC5490NEO123456',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Москва, Россия',
    comment: ''
  },
  {
    id: 'АВТ-002',
    make: 'МАЗ',
    model: '6312',
    year: 2021,
    licensePlate: 'В456СД78',
    vinNumber: 'Y3MAZ6312CJ789012',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Санкт-Петербург, Россия',
    comment: ''
  },
  {
    id: 'АВТ-003',
    make: 'Volvo',
    model: 'FH16',
    year: 2020,
    licensePlate: 'C123AB 74',
    vinNumber: 'VIN00001',
    maintenanceStatus: 'Исправен',
    currentLocation: 'ул. Ленина, 10, Челябинск',
    comment: ''
  },
  {
    id: 'АВТ-004',
    make: 'Scania',
    model: 'R580',
    year: 2019,
    licensePlate: 'C456CD 74',
    vinNumber: 'VIN00002',
    maintenanceStatus: 'Исправен',
    currentLocation: 'ул. Кирова, 15, Челябинск',
    comment: ''
  },
  {
    id: 'АВТ-005',
    make: 'MAN',
    model: 'TGX',
    year: 2018,
    licensePlate: 'C789EF 74',
    vinNumber: 'VIN00003',
    maintenanceStatus: 'Исправен',
    currentLocation: 'просп. Ленина, 50, Челябинск',
    comment: ''
  },
  {
    id: 'АВТ-006',
    make: 'Mercedes',
    model: 'Actros',
    year: 2021,
    licensePlate: 'C101GH 74',
    vinNumber: 'VIN00004',
    maintenanceStatus: 'Исправен',
    currentLocation: 'ул. Труда, 5, Челябинск',
    comment: ''
  },
  {
    id: 'АВТ-007',
    make: 'DAF',
    model: 'XF',
    year: 2017,
    licensePlate: 'C202IJ 74',
    vinNumber: 'VIN00005',
    maintenanceStatus: 'Исправен',
    currentLocation: 'ул. Свободы, 20, Челябинск',
    comment: ''
  }
];

// Тестовые данные для прицепов
const testTrailers = [
  {
    id: 'ПРЦ-001',
    licensePlate: 'АМ123477',
    trailerType: 'Бортовой',
    length: '13.6',
    width: '2.45',
    height: '2.9',
    volume: '96.7 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-002',
    licensePlate: 'СК456778',
    trailerType: 'Контейнеровоз',
    length: '12.2',
    width: '2.45',
    height: '2.7',
    volume: '80.7 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-003',
    licensePlate: 'AB1111',
    trailerType: 'Тент',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    volume: '85 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-004',
    licensePlate: 'ВС2222',
    trailerType: 'Рефрижератор',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    volume: '80 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-005',
    licensePlate: 'СД3333',
    trailerType: 'Тент',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    volume: '85 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-006',
    licensePlate: 'ДЕ4444',
    trailerType: 'Платформа',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    volume: '90 м³',
    comment: ''
  },
  {
    id: 'ПРЦ-007',
    licensePlate: 'ЕФ5555',
    trailerType: 'Рефрижератор',
    length: '13.6',
    width: '2.45',
    height: '2.7',
    volume: '80 м³',
    comment: ''
  }
];

// Тестовые данные для связок автопарка
const testFleetAssignments = [
  {
    id: 'СВЗ-001',
    driverId: 'ВОД-001',
    truckId: 'АВТ-001',
    trailerId: 'ПРЦ-001',
    assignedDate: '2024-01-15'
  },
  {
    id: 'СВЗ-002',
    driverId: 'ВОД-002',
    truckId: 'АВТ-002',
    trailerId: 'ПРЦ-002',
    assignedDate: '2024-02-10'
  },
  {
    id: 'СВЗ-003',
    driverId: 'ВОД-003',
    truckId: 'АВТ-003',
    trailerId: 'ПРЦ-003',
    assignedDate: '2024-05-27'
  },
  {
    id: 'СВЗ-004',
    driverId: 'ВОД-004',
    truckId: 'АВТ-004',
    trailerId: 'ПРЦ-004',
    assignedDate: '2024-07-12'
  },
  {
    id: 'СВЗ-005',
    driverId: 'ВОД-005',
    truckId: 'АВТ-005',
    trailerId: 'ПРЦ-005',
    assignedDate: '2024-09-03'
  },
  {
    id: 'СВЗ-006',
    driverId: 'ВОД-006',
    truckId: 'АВТ-006',
    trailerId: 'ПРЦ-006',
    assignedDate: '2024-10-24'
  },
  {
    id: 'СВЗ-007',
    driverId: 'ВОД-007',
    truckId: 'АВТ-007',
    trailerId: 'ПРЦ-007',
    assignedDate: '2024-12-05'
  }
];

/**
 * Функция для вставки данных напрямую через SQL (минуя генерацию ID)
 */
async function seedData() {
  console.log('\n=== Начало заполнения БД тестовыми данными ===\n');

  try {
    await initializeDatabase();
    const db = getDatabase();

    // Проверка наличия данных
    const checkData = (tableName) => {
      return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM ${tableName}`, [], (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      });
    };

    // Вставка водителей
    const driverCount = await checkData('drivers');
    if (driverCount === 0) {
      console.log('Вставка водителей...');
      const driverStmt = db.prepare(`INSERT INTO drivers (id, name, phone, license_number, availability, comment) VALUES (?, ?, ?, ?, ?, ?)`);
      for (const driver of testDrivers) {
        driverStmt.run(driver.id, driver.name, driver.phone, driver.licenseNumber, driver.availability, driver.comment);
      }
      await new Promise((resolve, reject) => {
        driverStmt.finalize((err) => err ? reject(err) : resolve());
      });
      console.log(`✓ Вставлено ${testDrivers.length} водителей`);
    } else {
      console.log(`Водители уже существуют в БД (${driverCount} записей)`);
    }

    // Вставка тягачей
    const truckCount = await checkData('trucks');
    if (truckCount === 0) {
      console.log('Вставка тягачей...');
      const truckStmt = db.prepare(`INSERT INTO trucks (id, make, model, year, license_plate, vin_number, maintenance_status, current_location, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      for (const truck of testTrucks) {
        truckStmt.run(truck.id, truck.make, truck.model, truck.year, truck.licensePlate, truck.vinNumber, truck.maintenanceStatus, truck.currentLocation, truck.comment);
      }
      await new Promise((resolve, reject) => {
        truckStmt.finalize((err) => err ? reject(err) : resolve());
      });
      console.log(`✓ Вставлено ${testTrucks.length} тягачей`);
    } else {
      console.log(`Тягачи уже существуют в БД (${truckCount} записей)`);
    }

    // Вставка прицепов
    const trailerCount = await checkData('trailers');
    if (trailerCount === 0) {
      console.log('Вставка прицепов...');
      const trailerStmt = db.prepare(`INSERT INTO trailers (id, license_plate, trailer_type, length, width, height, volume, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      for (const trailer of testTrailers) {
        trailerStmt.run(trailer.id, trailer.licensePlate, trailer.trailerType, trailer.length, trailer.width, trailer.height, trailer.volume, trailer.comment);
      }
      await new Promise((resolve, reject) => {
        trailerStmt.finalize((err) => err ? reject(err) : resolve());
      });
      console.log(`✓ Вставлено ${testTrailers.length} прицепов`);
    } else {
      console.log(`Прицепы уже существуют в БД (${trailerCount} записей)`);
    }

    // Вставка связок
    const assignmentCount = await checkData('fleet_assignments');
    if (assignmentCount === 0) {
      console.log('Вставка связок автопарка...');
      const assignmentStmt = db.prepare(`INSERT INTO fleet_assignments (id, driver_id, truck_id, trailer_id, assigned_date) VALUES (?, ?, ?, ?, ?)`);
      for (const assignment of testFleetAssignments) {
        assignmentStmt.run(assignment.id, assignment.driverId, assignment.truckId, assignment.trailerId, assignment.assignedDate);
      }
      await new Promise((resolve, reject) => {
        assignmentStmt.finalize((err) => err ? reject(err) : resolve());
      });
      console.log(`✓ Вставлено ${testFleetAssignments.length} связок`);
    } else {
      console.log(`Связки уже существуют в БД (${assignmentCount} записей)`);
    }

    // Вставка заказов
    const orderCount = await checkData('orders');
    if (orderCount === 0) {
      console.log('Вставка заказов...');
      const orderStmt = db.prepare(`INSERT INTO orders (
        id, shipper_name, manager_name, origin, destination,
        origin_latitude, origin_longitude, destination_latitude, destination_longitude,
        trailer_type, volume, weight, pickup_date, pickup_time,
        delivery_date, delivery_time, transportation_cost, status,
        cargo_type, special_requirements, length, width, height,
        assigned_driver_id, external_order_number, vehicle_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      for (const order of testOrders) {
        orderStmt.run(
          order.id, order.shipperName, order.managerName, order.origin, order.destination,
          order.originLatitude, order.originLongitude, order.destinationLatitude, order.destinationLongitude,
          order.trailerType, order.volume, order.weight, order.pickupDate, order.pickupTime,
          order.deliveryDate, order.deliveryTime, order.transportationCost, order.status,
          order.cargoType, order.specialRequirements, order.length, order.width, order.height,
          order.assignedDriverId, order.externalOrderNumber, order.vehicleCount
        );
      }
      await new Promise((resolve, reject) => {
        orderStmt.finalize((err) => err ? reject(err) : resolve());
      });
      console.log(`✓ Вставлено ${testOrders.length} заказов`);
    } else {
      console.log(`Заказы уже существуют в БД (${orderCount} записей)`);
    }

    console.log('\n=== Заполнение БД завершено успешно ===\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Ошибка при заполнении БД:', error);
    process.exit(1);
  }
}

// Запуск seeding
seedData();
