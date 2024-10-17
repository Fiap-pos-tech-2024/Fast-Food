import { Router, Request, Response } from "express";
import { userUseCase } from '../../useCases/user';

export class UserController {
    private routes: Router;
    private userUseCase: userUseCase;

    constructor(userUseCase: userUseCase) {
        this.routes = Router();
        this.userUseCase = userUseCase;
    }

    public setupRoutes() {
        this.routes.post('/', this.createUser.bind(this));
        this.routes.put('/:id', this.updateUser.bind(this));
        this.routes.delete('/:id', this.deleteUser.bind(this));
        this.routes.get('/:id', this.getUser.bind(this));
        this.routes.get('/', this.listUsers.bind(this));
        return this.routes;
    }

    public async listUsers(req: Request, res: Response) {
        try {
            const users = await this.userUseCase.listUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).send('Error fetching users');
        }
    }


    public async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            console.log('dados', req.body)
            await this.userUseCase.createUser(userData);
            res.status(201).send('User created successfully');
        } catch (error: any) {
            
            const status_error: { [key: string]: number } = {
                "User already exists": 409
            };

            const status_code = status_error[error.message] || 500;
            const error_message = status_error[error.message] ? error.message : "Internal Server Error";
            res.status(status_code).json({ error: error_message });
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const updatedUserData = req.body;
            await this.userUseCase.updateUser(userId, updatedUserData);
            res.status(200).send(`User ${userId} updated successfully`);
        } catch (error) {
            res.status(500).send('Error updating user');
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            await this.userUseCase.deleteUser(userId);
            res.status(200).send(`User ${userId} deleted successfully`);
        } catch (error) {
            res.status(500).send('Error deleting user');
        }
    }

    public async getUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await this.userUseCase.getUser(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send('Error fetching user');
        }
    }
}
