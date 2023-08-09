import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { number } from 'zod';

// created for each request
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

export type Context = inferAsyncReturnType<typeof createContext>;
