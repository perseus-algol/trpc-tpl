import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { OpenApiMeta } from 'trpc-openapi';

export const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create();
