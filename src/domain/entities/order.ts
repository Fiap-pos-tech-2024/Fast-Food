export class Pedido {
    constructor(
        public idPedido: number,
        public status: string,
        public idUsuario: number | null,
        public cpf: number | null,
        public name: string | null,
        public email: string | null,
        public data: string,
        public valorTotal: number,
        public produtos: any,
        public pagamento: string,
    ) { }
}
