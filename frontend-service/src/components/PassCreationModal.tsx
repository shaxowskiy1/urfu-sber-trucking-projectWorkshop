/**
 * Модальное окно создания пропуска
 * 
 * Позволяет:
 * 1. Ввести номер заказа
 * 2. Найти заказ в системе
 * 3. Отобразить данные заказа с чекбоксами
 * 4. Создать или отправить документ пропуска
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { FileText, Mail, Search } from 'lucide-react';

interface Order {
  id: string;
  shipperName: string;
  origin: string;
  destination: string;
  pickupDate: string;
  cargoType: string;
  weight: string;
  assignedDriverId: string | null;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  birthDate?: string;
  birthPlace?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: string;
  registrationAddress?: string;
}

interface Truck {
  id: string;
  licensePlate: string;
}

interface Trailer {
  id: string;
  licensePlate: string;
}

interface PassCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  drivers: Driver[];
  trucks: Truck[];
  trailers: Trailer[];
}

export function PassCreationModal({
  isOpen,
  onClose,
  orders,
  drivers,
  trucks,
  trailers
}: PassCreationModalProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [selectedFields, setSelectedFields] = useState({
    shipperName: false,
    receiver: false,
    origin: false,
    pickupDate: false,
    carrier: false,
    carrierInn: false,
    truckNumber: true,
    trailerNumber: true,
    driverName: true,
    birthDate: false,
    birthPlace: false,
    passport: false,
    passportIssued: false,
    registrationAddress: false,
    licenseNumber: true,
    phone: true
  });

  const handleSearch = () => {
    setError('');
    const order = orders.find(o => o.id === orderNumber || o.id === `ORD-${orderNumber}`);
    
    if (!order) {
      setError('Заказ не найден');
      setFoundOrder(null);
      return;
    }
    
    setFoundOrder(order);
  };

  const handleFieldToggle = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCreateDocument = () => {
    if (!foundOrder) return;
    alert('Функция создания документа будет реализована на бэкенде');
    handleClose();
  };

  const handleSendEmail = () => {
    if (!foundOrder) return;
    alert('Функция отправки документа на почту будет реализована на бэкенде');
    handleClose();
  };

  const handleClose = () => {
    setOrderNumber('');
    setFoundOrder(null);
    setError('');
    setSelectedFields({
      shipperName: false,
      receiver: false,
      origin: false,
      pickupDate: false,
      carrier: false,
      carrierInn: false,
      truckNumber: true,
      trailerNumber: true,
      driverName: true,
      birthDate: false,
      birthPlace: false,
      passport: false,
      passportIssued: false,
      registrationAddress: false,
      licenseNumber: true,
      phone: true
    });
    onClose();
  };

  // Получаем данные водителя
  const driver = foundOrder && foundOrder.assignedDriverId 
    ? drivers.find(d => d.id === foundOrder.assignedDriverId) 
    : null;

  const truck = driver ? trucks[0] : null; // Упрощение - берем первый грузовик
  const trailer = driver ? trailers[0] : null; // Упрощение - берем первый прицеп

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создание пропуска</DialogTitle>
          <DialogDescription>
            Введите номер заказа для создания пропуска
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Поиск заказа */}
          {!foundOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Номер заказа</Label>
                <div className="flex gap-2">
                  <Input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Например: 1 или ORD-001"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Поиск заказа
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Данные заказа с чекбоксами */}
          {foundOrder && (
            <div className="space-y-6">
              <Alert>
                <AlertDescription>
                  Заказ найден: {foundOrder.id}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Данные для пропуска</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Грузоотправитель */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="shipperName"
                      checked={selectedFields.shipperName}
                      onCheckedChange={() => handleFieldToggle('shipperName')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="shipperName" className="cursor-pointer font-medium">
                        Грузоотправитель:
                      </Label>
                      <div className="text-sm text-muted-foreground">{foundOrder.shipperName}</div>
                    </div>
                  </div>

                  {/* Грузополучатель */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="receiver"
                      checked={selectedFields.receiver}
                      onCheckedChange={() => handleFieldToggle('receiver')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="receiver" className="cursor-pointer font-medium">
                        Грузополучатель:
                      </Label>
                      <div className="text-sm text-muted-foreground">Получатель по адресу {foundOrder.destination}</div>
                    </div>
                  </div>

                  {/* Место погрузки */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="origin"
                      checked={selectedFields.origin}
                      onCheckedChange={() => handleFieldToggle('origin')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="origin" className="cursor-pointer font-medium">
                        Место погрузки:
                      </Label>
                      <div className="text-sm text-muted-foreground">{foundOrder.origin}</div>
                    </div>
                  </div>

                  {/* Дата отгрузки */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="pickupDate"
                      checked={selectedFields.pickupDate}
                      onCheckedChange={() => handleFieldToggle('pickupDate')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="pickupDate" className="cursor-pointer font-medium">
                        Дата отгрузки:
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(foundOrder.pickupDate).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  {/* Наименование перевозчика */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="carrier"
                      checked={selectedFields.carrier}
                      onCheckedChange={() => handleFieldToggle('carrier')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="carrier" className="cursor-pointer font-medium">
                        Наименование перевозчика:
                      </Label>
                      <div className="text-sm text-muted-foreground">ООО "ЛогистикПро"</div>
                    </div>
                  </div>

                  {/* ИНН перевозчика */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id="carrierInn"
                      checked={selectedFields.carrierInn}
                      onCheckedChange={() => handleFieldToggle('carrierInn')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="carrierInn" className="cursor-pointer font-medium">
                        ИНН перевозчика:
                      </Label>
                      <div className="text-sm text-muted-foreground">7709876543</div>
                    </div>
                  </div>

                  {/* Номер авто */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 bg-blue-50">
                    <Checkbox
                      id="truckNumber"
                      checked={selectedFields.truckNumber}
                      onCheckedChange={() => handleFieldToggle('truckNumber')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="truckNumber" className="cursor-pointer font-medium">
                        Номер авто:
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        {truck?.licensePlate || 'Не назначен'}
                      </div>
                    </div>
                  </div>

                  {/* Номер прицепа */}
                  <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 bg-blue-50">
                    <Checkbox
                      id="trailerNumber"
                      checked={selectedFields.trailerNumber}
                      onCheckedChange={() => handleFieldToggle('trailerNumber')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="trailerNumber" className="cursor-pointer font-medium">
                        Номер прицепа:
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        {trailer?.licensePlate || 'Не назначен'}
                      </div>
                    </div>
                  </div>

                  {driver && (
                    <>
                      {/* ФИО водителя */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 bg-blue-50">
                        <Checkbox
                          id="driverName"
                          checked={selectedFields.driverName}
                          onCheckedChange={() => handleFieldToggle('driverName')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="driverName" className="cursor-pointer font-medium">
                            ФИО водителя:
                          </Label>
                          <div className="text-sm text-muted-foreground">{driver.name}</div>
                        </div>
                      </div>

                      {/* Дата рождения */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                        <Checkbox
                          id="birthDate"
                          checked={selectedFields.birthDate}
                          onCheckedChange={() => handleFieldToggle('birthDate')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="birthDate" className="cursor-pointer font-medium">
                            Дата рождения:
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {driver.birthDate || 'Не указана'}
                          </div>
                        </div>
                      </div>

                      {/* Место рождения */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                        <Checkbox
                          id="birthPlace"
                          checked={selectedFields.birthPlace}
                          onCheckedChange={() => handleFieldToggle('birthPlace')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="birthPlace" className="cursor-pointer font-medium">
                            Место рождения:
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {driver.birthPlace || 'Не указано'}
                          </div>
                        </div>
                      </div>

                      {/* Паспорт */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                        <Checkbox
                          id="passport"
                          checked={selectedFields.passport}
                          onCheckedChange={() => handleFieldToggle('passport')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="passport" className="cursor-pointer font-medium">
                            Паспорт:
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {driver.passportSeries && driver.passportNumber
                              ? `${driver.passportSeries} ${driver.passportNumber}`
                              : 'Не указан'}
                          </div>
                        </div>
                      </div>

                      {/* Паспорт выдан */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                        <Checkbox
                          id="passportIssued"
                          checked={selectedFields.passportIssued}
                          onCheckedChange={() => handleFieldToggle('passportIssued')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="passportIssued" className="cursor-pointer font-medium">
                            Паспорт выдан:
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {driver.passportIssuedBy
                              ? `${driver.passportIssuedBy}, ${driver.passportIssueDate || ''}`
                              : 'Не указано'}
                          </div>
                        </div>
                      </div>

                      {/* Адрес регистрации */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50">
                        <Checkbox
                          id="registrationAddress"
                          checked={selectedFields.registrationAddress}
                          onCheckedChange={() => handleFieldToggle('registrationAddress')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="registrationAddress" className="cursor-pointer font-medium">
                            Адрес регистрации:
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {driver.registrationAddress || 'Не указан'}
                          </div>
                        </div>
                      </div>

                      {/* Водительское удостоверение */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 bg-blue-50">
                        <Checkbox
                          id="licenseNumber"
                          checked={selectedFields.licenseNumber}
                          onCheckedChange={() => handleFieldToggle('licenseNumber')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="licenseNumber" className="cursor-pointer font-medium">
                            Водительское удостоверение:
                          </Label>
                          <div className="text-sm text-muted-foreground">{driver.licenseNumber}</div>
                        </div>
                      </div>

                      {/* Контактный телефон */}
                      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 bg-blue-50">
                        <Checkbox
                          id="phone"
                          checked={selectedFields.phone}
                          onCheckedChange={() => handleFieldToggle('phone')}
                        />
                        <div className="flex-1">
                          <Label htmlFor="phone" className="cursor-pointer font-medium">
                            Конт. тел. водителя:
                          </Label>
                          <div className="text-sm text-muted-foreground">{driver.phone}</div>
                        </div>
                      </div>
                    </>
                  )}

                  {!driver && (
                    <Alert>
                      <AlertDescription>
                        К этому заказу не назначен водитель. Данные водителя не будут включены в пропуск.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleClose}>
                  Отмена
                </Button>
                <Button onClick={handleCreateDocument} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Создать документ
                </Button>
                <Button onClick={handleSendEmail} variant="secondary" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Отправить на почту
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
