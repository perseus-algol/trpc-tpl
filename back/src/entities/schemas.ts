import { z } from 'zod';

const user = z.object({ id: z.string(), name: z.string() });

export default {
  user
}