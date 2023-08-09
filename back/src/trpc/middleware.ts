import { t } from "./trpc";
import logger from "../logger";

function serializeError(error: any) {
  const errorInfo: any = {};
  Object.getOwnPropertyNames(error).forEach(key => {
    errorInfo[key] = error[key];
  });
  errorInfo.stack = error.stack;
  return JSON.stringify(errorInfo);
}

export const loggerMw = t.middleware(async (opts) => {
  const { path, type, next } = opts;
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (result.ok) {
    logger.info('OK: %o', { path, type, durationMs })
  } else {
    logger.error('%o', { 
      ...result,
      error: serializeError(result.error) // Without explicit serialization message and stack will not be showed.
    });
  }

  return result;
});
