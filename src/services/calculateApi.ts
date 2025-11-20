/**
 * Клиент для вызова calculate API
 */

export interface CalculatedDriverItem {
  id: number;
  originLatitude: string;
  originLongitude: string;
  deliveryDate: string; // ISO datetime
}

export interface CalculateResult {
  success: boolean;
  data: CalculatedDriverItem[];
  error?: string;
}

const BASE_URL = 'http://localhost:3001';

const FALLBACK_DATA: CalculatedDriverItem[] = [
  {
    id: 4,
    originLatitude: '55.7558',
    originLongitude: '37.6173',
    deliveryDate: '2024-01-20T16:00:00'
  },
  {
    id: 5,
    originLatitude: '55.7558',
    originLongitude: '37.6173',
    deliveryDate: '2024-01-20T18:00:00'
  }
];

export async function fetchCalculatedDrivers(): Promise<CalculateResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/calculate`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      // Возвращаем заглушку при недоступности бэка
      return {
        success: true,
        data: FALLBACK_DATA,
        error: `HTTP ${response.status}`
      };
    }

    const data = (await response.json()) as CalculatedDriverItem[];

    return {
      success: true,
      data
    };
  } catch (error) {
    // Возвращаем заглушку при ошибке сети / CORS / etc
    return {
      success: true,
      data: FALLBACK_DATA,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}

export interface OrderPickupData {
  pickupDate: string; // Дата в формате YYYY-MM-DD
  pickupTime?: string; // Время в формате HH:MM (опционально)
  originLatitude: string;
  originLongitude: string;
}

export interface SendOrderDataResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Отправляет данные заказа для алгоритма подбора водителя
 * Склеивает дату и время отправления в ISO формат
 */
export async function sendOrderPickupData(orderData: OrderPickupData): Promise<SendOrderDataResult> {
  try {
    // Склеиваем дату и время в формат ISO datetime
    let localDateTime: string;
    if (orderData.pickupTime) {
      // Если время указано, склеиваем дату и время
      localDateTime = `${orderData.pickupDate}T${orderData.pickupTime}:00`;
    } else {
      // Если время не указано, используем 00:00:00
      localDateTime = `${orderData.pickupDate}T00:00:00`;
    }

    const response = await fetch(`${BASE_URL}/api/order-pickup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        localDateTime,
        latitude: parseFloat(orderData.originLatitude),
        longitude: parseFloat(orderData.originLongitude)
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}


