export class Client {
    constructor(
        public idClient: string,
        public cpf: string,
        public name: string,
        public email: string,
        public status: boolean
    ) {}

    static createMock(
        idClient = '1',
        cpf = '000.000.000-00',
        name = 'John Doe',
        email = 'john@example.com',
        status = true
    ): Client {
        return new Client(idClient, cpf, name, email, status)
    }
}
