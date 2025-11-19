/**
 * Скрипт для очистки и повторного заполнения БД
 * Запуск: node reseed-orders.js
 */

const { initializeDatabase, getDatabase } = require('./database');

const testOrders = [
  { id: '1', shipperName: 'ООО "Металл-Строй"', managerName: 'Сергей Петров', origin: 'ул. Тверская, 25, Москва', originLatitude: '55.7640', originLongitude: '37.6050', destination: 'ул. Марата, 14, Санкт-Петербург', destinationLatitude: '59.9310', destinationLongitude: '30.3610', trailerType: 'Бортовой', volume: '96 м³', weight: '20,000 кг', pickupDate: '2025-10-25', pickupTime: '09:00', deliveryDate: '2025-10-25', deliveryTime: '21:00', transportationCost: 45000, status: 'Ожидает', cargoType: 'Металлопрокат', specialRequirements: 'Требуется кран для погрузки', length: '12', width: '2.4', height: '3.2', assignedDriverId: null, externalOrderNumber: 'ATI-2024-001', vehicleCount: 1 },
  { id: '2', shipperName: 'ЗАО "Продукты Север"', managerName: 'Анна Смирнова', origin: 'ул. Красный проспект, 101, Новосибирск', originLatitude: '55.0415', originLongitude: '82.9346', destination: 'пер. Базовый, 3, Екатеринбург', destinationLatitude: '56.8389', destinationLongitude: '60.6057', trailerType: 'Рефрижератор', volume: '82 м³', weight: '18,000 кг', pickupDate: '2025-10-18', pickupTime: '10:00', deliveryDate: '2025-10-24', deliveryTime: '18:00', transportationCost: 42000, status: 'Назначен', cargoType: 'Скоропортящиеся продукты', specialRequirements: 'Температурный режим: +2 до +4°C', length: '13.6', width: '2.5', height: '2.4', assignedDriverId: 'ВОД-001', externalOrderNumber: 'CARGO-2024-789', vehicleCount: 1 },
  { id: '3', shipperName: 'ИП "Металлолом-Сбыт"', managerName: 'Михаил Козлов', origin: 'ул. Труда, 7, Челябинск', originLatitude: '55.1600', originLongitude: '61.4000', destination: 'ул. Баумана, 10, Казань', destinationLatitude: '55.7900', destinationLongitude: '49.1210', trailerType: 'Контейнеровоз', volume: '76 м³', weight: '22,000 кг', pickupDate: '2025-10-30', pickupTime: '06:00', deliveryDate: '2025-11-01', deliveryTime: '10:00', transportationCost: 38000, status: 'Ожидает', cargoType: 'Металлолом', specialRequirements: 'Необходима документация по ГОСТ', length: '12', width: '2.4', height: '2.65', assignedDriverId: null, externalOrderNumber: null, vehicleCount: 1 },
  { id: '4', shipperName: 'ТранспортСервис', managerName: 'Иван Петров', origin: 'ул. Ленина, 10, Челябинск', destination: 'ул. Озёрная, 7, Миасское', originLatitude: '55.1600', originLongitude: '61.4030', destinationLatitude: '55.0450', destinationLongitude: '60.9700', trailerType: 'Тент', volume: '85 м³', weight: '9,000 кг', pickupDate: '2025-10-25', pickupTime: '06:00', deliveryDate: '2025-10-25', deliveryTime: '17:00', transportationCost: 48000, status: 'Ожидает', cargoType: 'Мебель', specialRequirements: '', length: '13.6', width: '2.45', height: '2.7', assignedDriverId: null, externalOrderNumber: null, vehicleCount: 1 },
  { id: '5', shipperName: 'ЛогистикПро', managerName: 'Ольга Смирнова', origin: 'ул. Кирова, 15, Челябинск', destination: 'ул. Советская, 18, Чебаркуль', originLatitude: '55.1640', originLongitude: '61.3950', destinationLatitude: '55.0560', destinationLongitude: '61.0600', trailerType: 'Рефрижератор', volume: '80 м³', weight: '10,000 кг', pickupDate: '2025-10-26', pickupTime: '18:00', deliveryDate: '2025-10-27', deliveryTime: '10:00', transportationCost: 50000, status: 'Ожидает', cargoType: 'Продукты питания', specialRequirements: 'Температурный режим: -22 до -18°C', length: '13.6', width: '2.45', height: '2.7', assignedDriverId: null, externalOrderNumber: null, vehicleCount: 1 },
  { id: '6', shipperName: 'ФастКарго', managerName: 'Алексей Кузнецов', origin: 'просп. Ленина, 50, Челябинск', destination: 'ул. Центральная, 5, Красногорский', originLatitude: '55.1610', originLongitude: '61.4100', destinationLatitude: '55.1460', destinationLongitude: '60.9960', trailerType: 'Платформа', volume: '90 м³', weight: '11,000 кг', pickupDate: '2025-10-30', pickupTime: '07:00', deliveryDate: '2025-10-30', deliveryTime: '21:00', transportationCost: 55000, status: 'Ожидает', cargoType: 'Строительный материал', specialRequirements: '', length: '13.6', width: '2.45', height: '2.7', assignedDriverId: null, externalOrderNumber: null, vehicleCount: 1 },
  { id: '7', shipperName: 'ЭкспрессТранс', managerName: 'Екатерина Волкова', origin: 'ул. Мира, 21, Челябинск', destination: 'ул. Свободы, 10, Челябинск', originLatitude: '55.1625', originLongitude: '61.4121', destinationLatitude: '55.1480', destinationLongitude: '61.4000', trailerType: 'Рефрижератор', volume: '80 м³', weight: '10,000 кг', pickupDate: '2025-10-26', pickupTime: '19:00', deliveryDate: '2025-10-26', deliveryTime: '22:00', transportationCost: 10000, status: 'Ожидает', cargoType: 'Продукты питания', specialRequirements: '', length: '13.6', width: '2.45', height: '2.7', assignedDriverId: null, externalOrderNumber: null, vehicleCount: 1 }
];

async function reseedOrders() {
  console.log('\n=== Перезаполнение заказов ===\n');
  
  try {
    await initializeDatabase();
    const db = getDatabase();

    // Очистка существующих заказов
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM orders', [], (err) => err ? reject(err) : resolve());
    });
    console.log('✓ Старые заказы удалены');

    // Вставка заказов
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
    console.log(`✓ Вставлено ${testOrders.length} заказов\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Ошибка:', error);
    process.exit(1);
  }
}

reseedOrders();
