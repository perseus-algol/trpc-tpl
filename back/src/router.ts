import type { inferProcedureInput, inferProcedureParams } from '@trpc/server';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import { User } from './entities/types';
import schemas from './entities/schemas';
import { users } from './mock-data';

type Opts<Input, Context> = {
  input: Input,
  ctx: Context,
}

const t = initTRPC.context<Context>().create();

const userList = t.procedure
  .query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return users;
  });

const userById = t.procedure
  .input(z.string())
  .query(async (opts) => {
    const { input } = opts;
    // Retrieve the user with the given ID
    const user: User | undefined = users.find(u => u.id === input);
    return user;
  });

const userCreate = t.procedure
  .input(schemas.user)
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
