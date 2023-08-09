import type express from "express";
import { Data, PolicyId } from "lucid-cardano";
import z from 'zod';

type Request<Body = unknown, PathParams = unknown, QueryParams = unknown> =
  express.Request<
    PathParams,
    unknown,
    Body,
    QueryParams
  >;

type Response<Body = unknown> = express.Response<Body>;

const questionInfoSchema = z.object({
  question: z.string(),
  description: z.string(),
  dueDate: z.number(),
  prizeToken: z.object({
    policyID: z.string().transform<PolicyId>(v => v),
    tokenName: z.string(),
    decimals: z.number(),
  }),
  oracleToken: z.string().transform<PolicyId>(v => v),
  b: z.number(),
  /// XXX: NOT needed for creating a question, but NEEDED in question queries responses
  outcomeToken: z.string().transform<PolicyId>(v => v).optional(),
})

const questionInfoRequiredSchema = z.object({
  ...questionInfoSchema.shape,
  outcomeToken: questionInfoSchema.shape.outcomeToken.unwrap(),
})

type QuestionInfo = z.infer<typeof questionInfoSchema>;

const questionState = (t: z.ZodType) => z.object({
  mintedYes: t,
  mintedNo: t,
  currentRatio: t,
  status: z.enum(["open", "complete"]),
  outcome: z.enum(["Yes", "No", "Undefined"]),
  utxo: z.object({
    txHash: z.string(),
    index: z.number()
  }),
  pot: t,
});

const questionStateSchema = questionState(z.bigint());

type QuestionState = z.infer<typeof questionStateSchema>;

const predictParamsSchema = z.object({
  questionID: z.string().transform<PolicyId>(v => v),
  outcome: z.enum(["Yes", "No"]),
  amount: z.number(),
  walletAddress: z.string()
})

type PredictParams = z.infer<typeof predictParamsSchema>;

const claimParamsSchema = z.object({
  questionID: z.string().transform<PolicyId>(v => v),
  walletAddress: z.string(),
  claimAmount: z.number(),
});

type ClaimParams = z.infer<typeof claimParamsSchema>;

const QuestionDatum = Data.Object({
  tokenYESAmount: Data.Integer({ minimum: 0 }),
  tokenNOAmount: Data.Integer({ minimum: 0 }),
  questionOutcome: Data.Enum([
    Data.Literal("Yes"),
    Data.Literal("No"),
    Data.Literal("Undefined"),
  ]),
  // constant values:
  b: Data.Integer({ exclusiveMinimum: 0 }),
  dueDate: Data.Integer({ minimum: Date.now() }),
  prizeToken: Data.Object({
    policyID: Data.Bytes({ maxLength: 28 }),
    tokenName: Data.Bytes({ minLength: 0, maxLength: 32 }),
    decimals: Data.Integer({ minimum: 0 }),
  }),
  oracleToken: Data.Bytes({ minLength: 28, maxLength: 28 }),
  outcomeToken: Data.Bytes({ minLength: 28, maxLength: 28 }),
});

type QuestionDatumT = Data.Static<typeof QuestionDatum>;

const QuestionRedeemerSchema = Data.Enum([
  Data.Object({
    PredictYes: Data.Object({
      amount: Data.Integer(),
    }),
  }),
  Data.Object({
    PredictNo: Data.Object({
      amount: Data.Integer(),
    }),
  }),
  Data.Object({
    Claim: Data.Object({
      amount: Data.Integer(),
    }),
  }),
]);

type QuestionRedeemerT = Data.Static<typeof QuestionRedeemerSchema>;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace QuestionRedeemer {
  export const PredictYes = (amount: number) => Data.to<QuestionRedeemerT>(
    { PredictYes: { amount: BigInt(amount) } },
    QuestionRedeemerSchema as unknown as QuestionRedeemerT,
  );

  export const PredictNo = (amount: number) => Data.to<QuestionRedeemerT>(
    { PredictNo: { amount: BigInt(amount) } },
    QuestionRedeemerSchema as unknown as QuestionRedeemerT,
  );

  export const Claim = (amount: number) => Data.to<QuestionRedeemerT>(
    { Claim: { amount: BigInt(amount) } },
    QuestionRedeemerSchema as unknown as QuestionRedeemerT,
  );
}

export {
  questionInfoSchema,
  questionInfoRequiredSchema,
  questionState,
  questionStateSchema,
  predictParamsSchema,
  claimParamsSchema,
  Request,
  Response,
  QuestionInfo,
  QuestionState,
  ClaimParams,
  PredictParams,
  QuestionDatum,
  QuestionDatumT,
  QuestionRedeemer,
};
