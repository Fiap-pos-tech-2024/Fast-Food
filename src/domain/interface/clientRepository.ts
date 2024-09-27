export interface clientRepository {
    createClient(email: string, name: string, cpf: string): void;
    updateClient(): void;
    deleteClient(): void;
    getClient(): void;
}