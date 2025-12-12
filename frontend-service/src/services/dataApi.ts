/**
 * API для загрузки всех данных системы из backend
 */

// ДЕМО-БАЗА ДАННЫХ
const DEMO_ORDERS = [
  {
    id: 'ORD-001',
    shipperName: 'ООО "МеталлСтрой"',
    origin: 'Москва, ул. Промышленная, 15',
    destination: 'Екатеринбург, ул. Заводская, 42',
    originLatitude: '55.7558',
    originLongitude: '37.6173',
    destinationLatitude: '56.8389',
    destinationLongitude: '60.6057',
    trailerType: 'Тент',
    volume: '33',
    weight: '1200',
    pickupDate: '2024-12-15',
    pickupTime: '09:00',
    deliveryDate: '2024-12-17',
    deliveryTime: '18:00',
    transportationCost: 45000,
    status: 'NEW',
    cargoType: 'Металлоконструкции',
    specialRequirements: 'Требуется крепление',
    length: '6.0',
    width: '2.4',
    height: '2.2',
    assignedDriverId: null
  },
  {
    id: 'ORD-002',
    shipperName: 'ООО "СтройТорг"',
    origin: 'Санкт-Петербург, Невский пр., 100',
    destination: 'Казань, ул. Баумана, 25',
    originLatitude: '59.9311',
    originLongitude: '30.3609',
    destinationLatitude: '55.7887',
    destinationLongitude: '49.1221',
    trailerType: 'Бортовой',
    volume: '25',
    weight: '800',
    pickupDate: '2024-12-16',
    pickupTime: '10:00',
    deliveryDate: '2024-12-18',
    deliveryTime: '16:00',
    transportationCost: 38000,
    status: 'ASSIGNED',
    cargoType: 'Стройматериалы',
    specialRequirements: 'Аккуратная погрузка',
    length: '5.0',
    width: '2.0',
    height: '2.0',
    assignedDriverId: 'DRV-002'
  },
  {
    id: 'ORD-003',
    shipperName: 'ООО "АгроПродукт"',
    origin: 'Новосибирск, ул. Красный проспект, 12',
    destination: 'Омск, ул. Ленина, 55',
    originLatitude: '55.0084',
    originLongitude: '82.9357',
    destinationLatitude: '54.9885',
    destinationLongitude: '73.3242',
    trailerType: 'Рефрижератор',
    volume: '40',
    weight: '1500',
    pickupDate: '2024-12-14',
    pickupTime: '08:00',
    deliveryDate: '2024-12-15',
    deliveryTime: '20:00',
    transportationCost: 52000,
    status: 'IN_TRANSIT',
    cargoType: 'Продукты питания',
    specialRequirements: 'Температурный режим -5°C',
    length: '7.0',
    width: '2.4',
    height: '2.5',
    assignedDriverId: 'DRV-001'
  },
  {
    id: 'ORD-004',
    shipperName: 'ООО "ТехноЛог"',
    origin: 'Москва, МКАД 47км',
    destination: 'Нижний Новгород, пр. Гагарина, 100',
    originLatitude: '55.8304',
    originLongitude: '37.6336',
    destinationLatitude: '56.2965',
    destinationLongitude: '43.9361',
    trailerType: 'Тент',
    volume: '20',
    weight: '600',
    pickupDate: '2024-12-20',
    pickupTime: '11:00',
    deliveryDate: '2024-12-21',
    deliveryTime: '15:00',
    transportationCost: 28000,
    status: 'NEW',
    cargoType: 'Электроника',
    specialRequirements: 'Хрупкий груз',
    length: '4.0',
    width: '2.0',
    height: '1.8',
    assignedDriverId: null
  }
];

const DEMO_DRIVERS = [
  {
    id: 'DRV-001',
    name: 'Иванов Сергей Петрович',
    phone: '+7 (912) 345-67-89',
    licenseNumber: '7701 234567',
    availability: 'В рейсе',
    comment: 'Опытный водитель, 15 лет стажа',
    assignedTruckId: 'TRK-001'
  },
  {
    id: 'DRV-002',
    name: 'Петров Алексей Иванович',
    phone: '+7 (905) 123-45-67',
    licenseNumber: '7702 345678',
    availability: 'В рейсе',
    comment: 'Специализация - дальние рейсы',
    assignedTruckId: 'TRK-002'
  },
  {
    id: 'DRV-003',
    name: 'Сидоров Дмитрий Викторович',
    phone: '+7 (916) 789-01-23',
    licenseNumber: '7703 456789',
    availability: 'Доступен',
    comment: 'Работает с рефрижераторами',
    assignedTruckId: 'TRK-003'
  },
  {
    id: 'DRV-004',
    name: 'Козлов Михаил Андреевич',
    phone: '+7 (925) 456-78-90',
    licenseNumber: '7704 567890',
    availability: 'Доступен',
    comment: 'Новый сотрудник, обучен',
    assignedTruckId: 'TRK-004'
  },
  {
    id: 'DRV-005',
    name: 'Морозов Владимир Сергеевич',
    phone: '+7 (903) 234-56-78',
    licenseNumber: '7705 678901',
    availability: 'На ТО',
    comment: 'Транспорт на техобслуживании',
    assignedTruckId: null
  }
];

const DEMO_TRUCKS = [
  {
    id: 'TRK-001',
    make: 'КАМАЗ',
    model: '5490',
    year: 2021,
    licensePlate: 'А123БВ77',
    vinNumber: 'XTC5490S0L0123456',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Новосибирск',
    comment: 'Рефрижератор, в отличном состоянии',
    capacity: 20000,
    fuelType: 'Дизель'
  },
  {
    id: 'TRK-002',
    make: 'МАЗ',
    model: '6312',
    year: 2020,
    licensePlate: 'В456ГД77',
    vinNumber: 'Y3M6312A0K0234567',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Казань',
    comment: 'Бортовой, грузоподъемность 15т',
    capacity: 15000,
    fuelType: 'Дизель'
  },
  {
    id: 'TRK-003',
    make: 'Volvo',
    model: 'FH16',
    year: 2022,
    licensePlate: 'Е789ЖЗ77',
    vinNumber: 'YV2AG20B8MA345678',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Москва',
    comment: 'Премиум-класс, дальнобойный',
    capacity: 18000,
    fuelType: 'Дизель'
  },
  {
    id: 'TRK-004',
    make: 'MAN',
    model: 'TGX',
    year: 2019,
    licensePlate: 'К012ЛМ77',
    vinNumber: 'WMA06XZZ4KM456789',
    maintenanceStatus: 'Исправен',
    currentLocation: 'Екатеринбург',
    comment: 'Тент, надежный',
    capacity: 16000,
    fuelType: 'Дизель'
  },
  {
    id: 'TRK-005',
    make: 'Scania',
    model: 'R500',
    year: 2018,
    licensePlate: 'М345НО77',
    vinNumber: 'YS2R4X20005567890',
    maintenanceStatus: 'Требует ТО',
    currentLocation: 'Москва',
    comment: 'Планово ТО через 2000км',
    capacity: 19000,
    fuelType: 'Дизель'
  }
];

const DEMO_TRAILERS = [
  {
    id: 'TRL-001',
    type: 'Рефрижератор',
    licensePlate: 'АВ123477',
    capacity: 20000,
    length: 13.6,
    status: 'Исправен',
    comment: 'Температурный режим от -20 до +20°C'
  },
  {
    id: 'TRL-002',
    type: 'Тент',
    licensePlate: 'ВГ456777',
    capacity: 18000,
    length: 13.6,
    status: 'Исправен',
    comment: 'Стандартный полуприцеп'
  },
  {
    id: 'TRL-003',
    type: 'Бортовой',
    licensePlate: 'ГД789077',
    capacity: 15000,
    length: 12.0,
    status: 'Исправен',
    comment: 'Подходит для металлоконструкций'
  },
  {
    id: 'TRL-004',
    type: 'Контейнеровоз',
    licensePlate: 'ЕЖ012377',
    capacity: 22000,
    length: 13.6,
    status: 'Исправен',
    comment: '40-футовые контейнеры'
  }
];

const DEMO_FLEET_ASSIGNMENTS = [
  {
    id: 'ASN-001',
    orderId: 'ORD-003',
    driverId: 'DRV-001',
    truckId: 'TRK-001',
    trailerId: 'TRL-001',
    assignedDate: '2024-12-13',
    status: 'active'
  },
  {
    id: 'ASN-002',
    orderId: 'ORD-002',
    driverId: 'DRV-002',
    truckId: 'TRK-002',
    trailerId: 'TRL-002',
    assignedDate: '2024-12-15',
    status: 'active'
  }
];

// ЗАКОММЕНТИРОВАНО: Код для работы с бэкендом
// const DEFAULT_API_BASE = 'http://localhost:8080';
// const VITE_ENV: any = (import.meta as any)?.env ?? {};
// const API_BASE_URL = (VITE_ENV.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');

// async function fetchJSON<T>(endpoint: string): Promise<T | null> {
//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`);
//     if (!response.ok) {
//       console.error(`Ошибка загрузки ${endpoint}:`, response.statusText);
//       return null;
//     }
//     return await response.json();
//   } catch (error) {
//     console.error(`Ошибка сети при загрузке ${endpoint}:`, error);
//     return null;
//   }
// }

export async function fetchAllOrders() {
  // Используем демо-базу данных
  return DEMO_ORDERS;
  
  // ЗАКОММЕНТИРОВАНО: Запрос к бэкенду
  // const data = await fetchJSON<{ orders: any[] }>('/api/orders');
  // return data?.orders || [];
}

export async function fetchAllDrivers() {
  // Используем демо-базу данных
  return DEMO_DRIVERS;
  
  // ЗАКОММЕНТИРОВАНО: Запрос к бэкенду
  // const data = await fetchJSON<{ drivers: any[] }>('/api/drivers');
  // return data?.drivers || [];
}

export async function fetchAllTrucks() {
  // Используем демо-базу данных
  return DEMO_TRUCKS;
  
  // ЗАКОММЕНТИРОВАНО: Запрос к бэкенду
  // const data = await fetchJSON<{ trucks: any[] }>('/api/trucks');
  // return data?.trucks || [];
}

export async function fetchAllTrailers() {
  // Используем демо-базу данных
  return DEMO_TRAILERS;
  
  // ЗАКОММЕНТИРОВАНО: Запрос к бэкенду
  // const data = await fetchJSON<{ trailers: any[] }>('/api/trailers');
  // return data?.trailers || [];
}

export async function fetchAllFleetAssignments() {
  // Используем демо-базу данных
  return DEMO_FLEET_ASSIGNMENTS;
  
  // ЗАКОММЕНТИРОВАНО: Запрос к бэкенду
  // const data = await fetchJSON<{ assignments: any[] }>('/api/fleet-assignments');
  // return data?.assignments || [];
}
