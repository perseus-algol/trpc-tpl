import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './router';
import { createContext } from './context';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import { generateOpenApiDocument } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:4000/api',
});

const app = express();

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
}));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/api', createOpenApiExpressMiddleware({
  router: appRouter,
  createContext, 
}));

app.listen(4000);