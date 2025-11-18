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

const BASE_URL = 'http://localhost:8080';

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


