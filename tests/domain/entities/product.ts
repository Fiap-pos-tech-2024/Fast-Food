export class Product {
    constructor(
        public idProduct: string,
        public name: string,
        public amount: number,
        public unitValue: number,
        public category: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null = null,
        public observation: string | null = null,
        public calculateTotalValue: () => number = () => {
            return this.amount * this.unitValue
        }
    ) {}

    static createMock(
        idProduct = '1',
        name = 'Sample Product',
        amount = 10,
        unitValue = 5.0,
        category = 'lanche',
        createdAt = new Date(),
        updatedAt = new Date(),
        deletedAt: Date | null = null,
        observation = 'Sample observation'
    ): Product {
        return new Product(
            idProduct,
            name,
            amount,
            unitValue,
            category,
            createdAt,
            updatedAt,
            deletedAt,
            observation,
            () => amount * unitValue
        )
    }
}
