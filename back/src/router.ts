import type { inferProcedureInput, inferProcedureParams } from '@trpc/server';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import { User } from './entities/types';
import schemas from './entities/schemas';
import { users } from './mock-data';
import { OpenApiMeta } from 'trpc-openapi';

type Opts<Input, Context> = {
  input: Input,
  ctx: Context,
}

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create();

const userList = t.procedure
  .meta({ openapi: { method: 'GET', path: '/users' } })
  .input(z.undefined())
  .output(z.array(schemas.user))
  .query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return users;
  });

const userById = t.procedure
  .meta({ openapi: { method: 'GET', path: '/users/{id}' } })
  .input(z.object({id: z.string()}))
  .output(z.optional(schemas.user))
  .query(async (opts) => {
    const { input } = opts;
    // Retrieve the user with the given ID
    const user: User | undefined = users.find(u => u.id === input.id);
    return user;
  });

const userCreate = t.procedure
  .meta({ openapi: { method: 'POST', path: '/users' } })
  .input(schemas.user)
  .output(schemas.user)
  .mutation(async (opts: Opts<User, Context>) => {
    const { input, ctx } = opts;
    // Create a new user in the database
    users.push(input);
    return input;
  });

export const appRouter = t.router({
  userList,
  userById,
  userCreate,
});

export type AppRouter = typeof appRouter;
