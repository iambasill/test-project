import {Express, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import {version} from '../../package.json';
import logger from '../logger/logger';
import { config } from '../config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Defence IVM API Documentation',
        version: version,
        description: 'API documentation for the Defence IVM system.',
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../controller/*.ts')],

};

const swaggerSpec = swaggerJSDoc(options);

function setupSwaggerDocs(app: Express, port: number) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info(`Swagger docs available at /api-docs endpoint at port https://${config.API_BASE_URL}:${port}/api-docs`);

    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
export default setupSwaggerDocs;
