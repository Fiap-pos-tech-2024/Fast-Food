import { UserRepository } from '../domain/interface/userRepository'
import { User } from '../domain/entities/user'

export class userUseCase {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    public async listUsers(): Promise<User[]> {
        const users = await this.userRepository.list()
        return users
    }

    public async createUser(userData: User): Promise<void> {
        const user = await this.userRepository.findByEmail(userData.email)
        if (user) {
            throw new Error('User already exists')
        }
        await this.userRepository.save(userData)
    }

    public async updateUser(
        userId: string,
        updatedUserData: User
    ): Promise<void> {
        await this.userRepository.update(userId, updatedUserData)
    }

    public async deleteUser(userId: string): Promise<void> {
        await this.userRepository.delete(userId)
    }

    public async getUser(userId: string): Promise<User | null> {
        const user = await this.userRepository.findById(userId)
        return user
    }
}
