import { ItemInput } from "./types/itemTypes"

export default class OrderItem {
    public id: string | null;
    public idProduct: string;
    public idOrder: string;
    public amount: number;
    public unitValue: number; 
    public totalValue: number;
    public observation: string | null;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;

    constructor(orderItem: ItemInput) {
        this.id = orderItem.id ?? null
        this.idProduct = orderItem.idProduct
        this.idOrder = orderItem.idOrder;
        this.amount = orderItem.amount;
        this.unitValue = orderItem.unitValue ?? 0; 
        this.totalValue = this.calculateTotalValue();
        this.observation = orderItem.observation ?? null;
        this.createdAt = new Date();
        this.updatedAt = orderItem.updatedAt ?? null;
        this.deletedAt = orderItem.deletedAt ?? null;

        if (this.amount <= 0){
            throw new Error('Quantidade do item selecionado nao pode ser menor que 0')
        }
    }

    calculateTotalValue() {
        this.totalValue = this.unitValue * this.amount;
        return this.totalValue
    }
}