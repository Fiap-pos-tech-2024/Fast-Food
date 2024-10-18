export interface ItemInput {
    id: string | null;
    idProduct: string;
    idOrder: string;
    amount: number;
    unitValue: number; 
    totalValue: number;
    observation: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export type ItemInputType = Array<ItemInput>;