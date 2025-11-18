/**
 * Сервис для работы с API водителей
 * 
 * Предоставляет функции для загрузки водителей из внешнего MockAPI
 */

/**
 * Интерфейс водителя из API
 */
interface ApiDriverResponse {
  name: string;
  phone: string;
  licenseNumber: string;
  comment?: string;
  id?: string; // Игнорируется при импорте
  [key: string]: any; // Любые другие поля игнорируются
}

/**
 * Интерфейс водителя для системы
 */
export interface DriverData {
  name: string;
  phone: string;
  licenseNumber: string;
  comment: string;
  availability: 'Доступен' | 'В рейсе' | 'На ТО' | 'Не работает';
}

/**
 * Результат загрузки водителей
 */
export interface LoadDriversResult {
  success: boolean;
  drivers: DriverData[];
  error?: string;
}

/**
 * URL(ы) API для загрузки водителей
 *
 * По умолчанию используем корректный ресурс "/drivers" и резервный устаревший путь "/drivers/name".
 * Можно переопределить точный URL через VITE_DRIVERS_API_URL.
 */
const DEFAULT_DRIVERS_BASE = 'https://68fa3ce0ef8b2e621e7f53cf.mockapi.io/api/v1';
const ENV_DRIVERS_URL = (import.meta as any)?.env?.VITE_DRIVERS_API_URL as string | undefined;
const DRIVERS_API_URLS: string[] = ENV_DRIVERS_URL
  ? [ENV_DRIVERS_URL]
  : [
      `${DEFAULT_DRIVERS_BASE}/drivers`,
      `${DEFAULT_DRIVERS_BASE}/drivers/name`, // fallback для обратной совместимости
    ];

/**
 * Загрузка водителей из внешнего API
 * 
 * @returns Promise с результатом загрузки
 */
export async function loadDriversFromApi(): Promise<LoadDriversResult> {
  let lastError = 'Не удалось связаться с API водителей';
  let saw404 = false;

  for (const url of DRIVERS_API_URLS) {
    try {
      const response = await fetch(url);

      if (response.status === 404) {
        saw404 = true;
        lastError = `Ошибка HTTP: 404 (${url})`;
        continue;
      }

      if (!response.ok) {
        return {
          success: false,
          drivers: [],
          error: `Ошибка HTTP: ${response.status}`,
        };
      }

      const data: ApiDriverResponse[] = await response.json();

      // Фильтруем и преобразуем данные
      const drivers: DriverData[] = (Array.isArray(data) ? data : [])
        .filter((apiDriver) => apiDriver?.name && apiDriver?.phone && apiDriver?.licenseNumber)
        .map((apiDriver) => ({
          name: apiDriver.name,
          phone: apiDriver.phone,
          licenseNumber: apiDriver.licenseNumber,
          comment: apiDriver.comment || '',
          availability: 'Не работает' as const,
        }));

      return { success: true, drivers };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Неизвестная ошибка';
    }
  }

  if (saw404) {
    // Считаем, что ресурса с водителями нет — продолжаем без ошибки
    return { success: true, drivers: [] };
  }
  return { success: false, drivers: [], error: lastError };
}

/**
 * Проверка валидности данных водителя
 */
export function isValidDriver(driver: Partial<DriverData>): driver is DriverData {
  return Boolean(
    driver.name && 
    driver.phone && 
    driver.licenseNumber
  );
}
