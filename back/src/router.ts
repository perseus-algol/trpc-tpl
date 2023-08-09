import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { OpenApiMeta } from 'trpc-openapi';
import { mockApi } from './mock-api';
import { IApi, Question, Questions, Submit } from './api-interface';

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create();

const api: IApi = mockApi;

export const appRouter = t.router({
  question: t.router({
    start: t.router({
      create: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/start/create' } })
        .input(Question.Start.input)
        .output(Question.Start.result)
        .mutation(api.question.start.create),
      submit: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/start/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.start.submit),
    }),
    predict: t.router({
      create: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/predict/create' } })
        .input(Question.Predict.input)
        .output(Question.Predict.result)
        .mutation(api.question.predict.create),
      submit: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/predict/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.predict.submit),
    }),
    claim: t.router({
      create: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/claim/create' } })
        .input(Question.Claim.input)
        .output(Question.Claim.result)
        .mutation(api.question.claim.create),
      submit: t.procedure
        .meta({ openapi: { method: 'POST', path: '/question/claim/submit' } })
        .input(Submit.input)
        .output(Submit.result)
        .mutation(api.question.claim.submit),
    }),
    get: t.procedure
      .meta({ openapi: { method: 'GET', path: '/question/{questionID}' } })
      .input(Question.Get.input)
      .output(Question.Get.result)
      .query(api.question.getById),
  }),
  questions: t.procedure
    .meta({ openapi: { method: 'GET', path: '/questions' } })
    .input(Questions.input)
    .output(Questions.result)
    .query(api.questions),
});

export type AppRouter = typeof appRouter;
