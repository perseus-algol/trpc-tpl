import type express from "express";
import { Data, PolicyId } from "lucid-cardano";

type Request<Body = unknown, PathParams = unknown, QueryParams = unknown> =
  express.Request<
    PathParams,
    unknown,
    Body,
    QueryParams
  >;

type Response<Body = unknown> = express.Response<Body>;

type QuestionInfo = {
  question: string
  description: string
  dueDate: number
  prizeToken: {
    policyID: PolicyId
    tokenName: string
    decimals: number
  }
  oracleToken: PolicyId
  b: number
  /// XXX: NOT needed for creating a question, but NEEDED in question queries responses
  outcomeToken?: PolicyId
};

type QuestionState = {
  mintedYes: bigint
  mintedNo: bigint
  currentRatio: bigint
  status: "open" | "complete"
  outcome: "Yes" | "No" | "Undefined"
  utxo: {
    txHash: string
    index: number
  }
  pot: bigint
};

type PredictParams = {
  questionID: PolicyId
  outcome: "Yes" | "No"
  amount: number
  walletAddress: string
};

type ClaimParams = {
  questionID: string
  walletAddress: string
  claimAmount: number
};

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
