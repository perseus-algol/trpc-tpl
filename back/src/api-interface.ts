import { PolicyId, Transaction, TxHash } from "lucid-cardano";
import { claimParamsSchema, predictParamsSchema, questionInfoRequiredSchema, questionInfoSchema, questionState } from "./types";
import { Context } from "./trpc/context";
import z from 'zod';

const idFn = <T>(id: T) => id;

const errorResultSchema = z.object({
  error: z.string(),
})
type ErrorResult = z.infer<typeof errorResultSchema>;

const txOrErrorSchema = z.union([
  z.object({
    tx: z.string().transform<Transaction>(idFn)
  }),
  errorResultSchema
])

const questionStateStrings = questionState(z.string());

export namespace Submit {
  export const input = z.object({
    tx: z.string().transform<Transaction>(idFn)
  })
  export const result = z.union([
    z.object({ txId: z.string().transform<TxHash>(idFn) }),
    errorResultSchema
  ])
  export type Input = z.infer<typeof input>;
  export type Result = z.infer<typeof result>;
}

export namespace Question {

  export namespace Start {
    export const input = z.object({
      ...questionInfoSchema.shape,
      walletAddress: z.string(),
    });
    export const result = z.union([
      z.object({
        tx: z.string(),
        questionID: z.string(),
      }),
      errorResultSchema
    ])
    export type Input = z.infer<typeof input>;
    export type Result = z.infer<typeof result>;
  }

  export namespace Predict {
    export const input = predictParamsSchema;
    export const result = txOrErrorSchema;
    export type Input = z.infer<typeof input>;
    export type Result = z.infer<typeof result>;
  }

  export namespace Claim {
    export const input = claimParamsSchema;
    export const result = txOrErrorSchema;
    export type Input = z.infer<typeof input>;
    export type Result = z.infer<typeof result>;
  }

  export namespace Get {
    export const input = z.object({
      questionID: z.string().transform<PolicyId>(idFn),
    })
    export const result = z.union([
      z.intersection(questionInfoRequiredSchema, questionStateStrings),
      errorResultSchema,
    ])
    export type Input = z.infer<typeof input>;
    export type Result = z.infer<typeof result>;
  }

}

export namespace Questions {
  export const input = z.object({
    page: z.number(),
    page_size: z.number(),
    status: z.enum(["open", "complete"]),
    sort: z.enum(["dueDate", "dueDate.asc", "dueDate.desc"]),
  }).partial();
  export const result = z.union([
    z.array(z.intersection(z.intersection(questionInfoRequiredSchema, questionStateStrings), z.object({
      questionID: z.string().transform<PolicyId>(idFn),
    }))),
    errorResultSchema,
  ])
  export type Input = z.infer<typeof input>;
  export type Result = z.infer<typeof result>;
}

export type Opts<TInput, TContext> = {
  input: TInput,
  ctx: TContext,
}

export interface IApi {
  question: {
    start: {
      create: (opts: Opts<Question.Start.Input, Context>) => Promise<Question.Start.Result>
      submit: (opts: Opts<Submit.Input, Context>) => Promise<Submit.Result>,
    },
    predict: {
      create: (opts: Opts<Question.Predict.Input, Context>) => Promise<Question.Predict.Result>
      submit: (opts: Opts<Submit.Input, Context>) => Promise<Submit.Result>,
    },
    claim: {
      create: (opts: Opts<Question.Claim.Input, Context>) => Promise<Question.Claim.Result>
      submit: (opts: Opts<Submit.Input, Context>) => Promise<Submit.Result>,
    },
    getById: (opts: Opts<Question.Get.Input, Context>) => Promise<Question.Get.Result>,
  },
  questions: (opts: Opts<Questions.Input, Context>) => Promise<Questions.Result>,
}