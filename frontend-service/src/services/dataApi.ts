/**
 * API для загрузки всех данных системы из backend
 */

const DEFAULT_API_BASE = 'http://localhost:8080';
const VITE_ENV: any = (import.meta as any)?.env ?? {};
const API_BASE_URL = (VITE_ENV.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');

async function fetchJSON<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      console.error(`Ошибка загрузки ${endpoint}:`, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка сети при загрузке ${endpoint}:`, error);
    return null;
  }
}

export async function fetchAllOrders() {
  const data = await fetchJSON<{ orders: any[] }>('/api/orders');
  return data?.orders || [];
}

export async function fetchAllDrivers() {
  // Примечание: бэкенд пока не имеет endpoint для drivers
  // Возвращаем пустой массив до реализации
  return [];
}

export async function fetchAllTrucks() {
  // Примечание: бэкенд пока не имеет endpoint для trucks
  // Возвращаем пустой массив до реализации
  return [];
}

export async function fetchAllTrailers() {
  // Примечание: бэкенд пока не имеет endpoint для trailers
  // Возвращаем пустой массив до реализации
  return [];
}

export async function fetchAllFleetAssignments() {
  // Примечание: бэкенд пока не имеет endpoint для fleet-assignments
  // Возвращаем пустой массив до реализации
  return [];
}
