import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Router } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TechChallenge: Fast Food API',
            version: '1.0.0',
            description: 'TechChallenge: API para gerenciar pedidos de um fast food',
        },
    },
    apis: ['./src/drivers/web/*.ts'], // O caminho para os arquivos de rota
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocs));

export default swaggerRouter;
