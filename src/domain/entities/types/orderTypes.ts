import { ItemInputType } from "./itemTypes";

export const OrderStatus = Object.freeze({
    DRAFT: "Rascunho",
    WAITING_CHECKOUT: "Aguardando pagamento",
    FAILED: "Falha em gerar pedido",
    WAITING_PREPARATION: "Aguardando preparo",
    IN_PREPARATION: "Em preparo",
    READY: "Pronto",
    DELIVERED: "Entregue",
})

export type OrderStatusType =
    (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderInput {
    id: string | null;
    idClient: string;
    cpf: string | null;
    name: string | null;
    email: string | null;
    idPayment: string | null;
    status: OrderStatusType;
    value: number;
    itens: ItemInputType[]; 
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    deliveredAt: Date | null;
}