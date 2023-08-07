import type { inferProcedureInput, inferProcedureParams } from '@trpc/server';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';

const userSchema = z.object({ id: z.string(), name: z.string() });

type User = z.infer<typeof userSchema>;

type Opts<Input, Context> = {
  input: Input,
  ctx: Context,
}

const users: User[] = [
  { id: "1", name: "User 1" },
  { id: "2", name: "User 2" },
  { id: "3", name: "User 3" },
  { id: "4", name: "User 4" },
  { id: "5", name: "User 5" },
  { id: "6", name: "User 6" },
  { id: "7", name: "User 7" },
  { id: "8", name: "User 8" },
  { id: "9", name: "User 9" },
  { id: "10", name: "User 10" },
];

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
  .input(userSchema)
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
