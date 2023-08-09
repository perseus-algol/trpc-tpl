
import { mockApi } from '../mock-api';
import { IApi, Question, Questions, Submit } from '../api-interface';

import { t } from './trpc';
import { loggerMw } from './middleware';

const createAppRouter = (api: IApi) => t.router({
  question: t.router({
    start: t.router({
      create: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/start/create' } })
        .input(Question.Start.input)
        .output(Question.Start.result)
        .mutation(api.question.start.create),
      submit: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/start/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.start.submit),
    }),
    predict: t.router({
      create: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/predict/create' } })
        .input(Question.Predict.input)
        .output(Question.Predict.result)
        .mutation(api.question.predict.create),
      submit: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/predict/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.predict.submit),
    }),
    claim: t.router({
      create: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/claim/create' } })
        .input(Question.Claim.input)
        .output(Question.Claim.result)
        .mutation(api.question.claim.create),
      submit: t.procedure
        .use(loggerMw)
        .meta({ openapi: { method: 'POST', path: '/question/claim/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.claim.submit),
    }),
    get: t.procedure
      .use(loggerMw)
      .meta({ openapi: { method: 'GET', path: '/question/{questionID}' } })
      .input(Question.Get.input)
      .output(Question.Get.result)
      .query(api.question.getById),
  }),
  questions: t.procedure
    .use(loggerMw)
    .meta({ openapi: { method: 'GET', path: '/questions' } })
    .input(Questions.input)
    .output(Questions.result)
    .query(api.questions),
});

export const appRouter = createAppRouter(mockApi);

export type AppRouter = typeof appRouter;
