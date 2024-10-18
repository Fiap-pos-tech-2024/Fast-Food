import OrderItem from './orderItem';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
}

export class Order {
  constructor(
    public idOrder: string | null,
    public idClient: string | null,
    public cpf: string | null,
    public name: string | null,
    public email: string | null,
    public idPayment: string | null,
    public status: OrderStatus,
    public value: number,
    public itens: OrderItem[],
    public createdAt: Date,
    public updatedAt: Date | null,
    public deletedAt: Date | null,
  ) {
    this.idOrder = idOrder;
    this.idClient = idClient;
    this.cpf = cpf;
    this.name = name;
    this.email = email;
    this.idPayment = idPayment;
    this.status = status;
    this.itens = itens ?? [];
    this.createdAt = createdAt ?? null;
    this.updatedAt = updatedAt ?? null;
    this.deletedAt = deletedAt ?? null;

    this.value = value ?? 0;
    this.calculateTotalValue();
  }

  calculateTotalValue() {
    this.value =
      this.itens?.reduce(
        (total: number, item: OrderItem) => total + item.calculateTotalValue(),
        0,
      ) ?? 0;
  }
}
