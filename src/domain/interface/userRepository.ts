import { User } from '../entities/user';

export interface UserRepository {
    save(user: User): Promise<void>;
    update(userId: string, updatedUserData: User): Promise<void>;
    delete(userId: string): Promise<void>;
    findById(userId: string): Promise<User | null>;
    list(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;   
}
