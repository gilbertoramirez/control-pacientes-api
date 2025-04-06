/**
 * Objetos de valor y tipos centrales compartidos entre los diferentes dominios
 */

/**
 * Representa un ID único
 */
export type UniqueId = string;

/**
 * Resultado de una operación de dominio
 */
export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error?: string;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;
  }

  public isSuccess(): boolean {
    return this._isSuccess;
  }

  public isFailure(): boolean {
    return !this._isSuccess;
  }

  public getError(): string {
    if (this.isSuccess()) {
      throw new Error('Cannot get error from a success result');
    }
    return this._error!;
  }

  public getValue(): T {
    if (this.isFailure()) {
      throw new Error(`Cannot get value from a failure result. Error: ${this._error}`);
    }
    return this._value!;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }
}

/**
 * Representa un rango de fechas
 */
export class DateRange {
  constructor(
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {
    if (startDate > endDate) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de finalización');
    }
  }

  public getStartDate(): Date {
    return new Date(this.startDate);
  }

  public getEndDate(): Date {
    return new Date(this.endDate);
  }

  public getDurationInDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public includes(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  public overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  }
}

/**
 * Represents a money value with currency
 */
export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string = 'MXN'
  ) {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public format(): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('No se pueden sumar montos con diferentes monedas');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('No se pueden restar montos con diferentes monedas');
    }
    if (this.amount < other.amount) {
      throw new Error('El resultado no puede ser negativo');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('El factor no puede ser negativo');
    }
    return new Money(this.amount * factor, this.currency);
  }
}

/**
 * Tipos de documentos de identificación
 */
export enum IdentificationType {
  PASSPORT = 'PASSPORT',
  ID_CARD = 'ID_CARD',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  SSN = 'SSN',
  TAX_ID = 'TAX_ID'
}

/**
 * Representa una dirección
 */
export class Address {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly postalCode: string,
    private readonly country: string,
    private readonly additionalInfo?: string
  ) {}

  public getStreet(): string {
    return this.street;
  }

  public getCity(): string {
    return this.city;
  }

  public getState(): string {
    return this.state;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public getCountry(): string {
    return this.country;
  }

  public getAdditionalInfo(): string | undefined {
    return this.additionalInfo;
  }

  public getFullAddress(): string {
    let fullAddress = `${this.street}, ${this.city}, ${this.state}, ${this.postalCode}, ${this.country}`;
    if (this.additionalInfo) {
      fullAddress = `${fullAddress} (${this.additionalInfo})`;
    }
    return fullAddress;
  }
} 