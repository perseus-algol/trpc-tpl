 import { publicProcedure, router } from './trpc';
import { z } from 'zod';

type User = { id: string; name: string; };

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

const userList = publicProcedure
  .query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return users;
  });

const userById = publicProcedure
  .input(z.string())
  .query(async (opts) => {
    const { input } = opts;
    // Retrieve the user with the given ID
    const user: User | undefined = users.find(u => u.id === input);
    return user;
  });

const userCreate = publicProcedure
  .input(z.object({ name: z.string(), id: z.string() }))
  .mutation(async (opts) => {
    const { input } = opts;
    // Create a new user in the database
    users.push(input);
    return input;
  });

export const appRouter = router({
  userList,
  userById,
  userCreate,
});

export type AppRouter = typeof appRouter;
