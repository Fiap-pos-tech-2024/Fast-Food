import {
  OrderInput,
  OrderStatus,
  OrderStatusType,
} from '../entities/types/orderTypes';
import OrderItem from './orderItem';

export default class Order {
  public idOrder: string | null;
  public idClient: string | null;
  public cpf: string | null;
  public name: string | null;
  public email: string | null;
  public idPayment: string | null;
  public status: OrderStatusType;
  public value: number;
  public itens: OrderItem[];
  public createdAt: Date;
  public updatedAt: Date | null;
  public deletedAt: Date | null;
  public deliveredAt: Date | null;

  constructor(orderInput: OrderInput, itens: OrderItem[] | null = []) {
    this.idOrder = orderInput.id;
    this.idClient = orderInput.idClient;
    this.cpf = orderInput.cpf;
    this.name = orderInput.name;
    this.email = orderInput.email;
    this.idPayment = orderInput.idPayment;
    this.status = orderInput.status ?? this.createDraft();
    this.itens = itens ?? [];
    this.createdAt = orderInput.createdAt ?? null;
    this.updatedAt = orderInput.updatedAt ?? null;
    this.deletedAt = orderInput.deletedAt ?? null;
    this.deliveredAt = orderInput.deliveredAt ?? null;

    this.value = orderInput.value ?? 0;
    this.calculateTotalValue();
  }

  createDraft() {
    this.status = OrderStatus.DRAFT;
  }

  calculateTotalValue() {
    this.value =
      this.itens?.reduce(
        (total: number, item: OrderItem) => total + item.calculateTotalValue(),
        0,
      ) ?? 0;
  }
}
