export class Product {
    idProduct: string
    name: string
    amount: number
    unitValue: number
    observation: string | null
    createdAt: Date
    updatedAt: Date | null
    deletedAt: Date | null
    category: string

    constructor(data: {
        idProduct: string
        name: string
        amount: number
        unitValue: number
        observation: string | null
        createdAt: Date
        updatedAt: Date | null
        deletedAt: Date | null
        category: string
        calculateTotalValue: () => number
    }) {
        this.idProduct = data.idProduct
        this.name = data.name
        this.amount = data.amount
        this.unitValue = data.unitValue
        this.observation = data.observation
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.deletedAt = data.deletedAt
        this.category = data.category
        this.calculateTotalValue = data.calculateTotalValue
    }

    calculateTotalValue: () => number
}
