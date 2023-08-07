import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express, { Request, Response } from 'express';
import { appRouter } from './router';
import { Context, createContext } from './context';

const app = express();

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(4000);