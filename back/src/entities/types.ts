import { z } from 'zod';
import schemas from './schemas';

export type User = z.infer<typeof schemas.user>;
