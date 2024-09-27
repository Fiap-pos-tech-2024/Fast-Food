export type pedido = {
    idPedido: number,
    status: string,
    idUsuario: number | null,
    cpf: number | null,
    nome: string | null,
    email: string | null,
    data: string,
    valorTotal: number,
    produtos: produto,
    pagamento: string,
}

export type Usuario = {
    idUsuario: number,
    cpf: number,
    nome: string,
    email: string,
    status: boolean,
}


export type data = {
    idUsuario: number | null,
    cpf: number | null,
    nome: string | null,
    email: string | null,
    pedidos: pedido[] | null,
}


export type produto = {
    idProduto: number,
    nome: string,
    preco: number,
    quantidade: number
}[]