import { IApi, Opts, Question, Questions, Submit } from "./api-interface";
import { Context } from "./context";

const errrorResult = Promise.resolve({error: 'error'});

export const mockApi: IApi = {
  question: {
    start: {
      create (opts: Opts<Question.Start.Input, Context>): Promise<Question.Start.Result> {
        return Promise.resolve({error: 'question.start.create called'});
      },
      submit (opts: Opts<Submit.Input, Context>): Promise<Submit.Result> {
        return Promise.resolve({error: 'question.start.submit called'});
      },
    },
    predict: {
      create (opts: Opts<Question.Predict.Input, Context>): Promise<Question.Predict.Result> {
        return Promise.resolve({error: 'question.predict.create called'});
      },
      submit (opts: Opts<Submit.Input, Context>): Promise<Submit.Result> {
        return Promise.resolve({error: 'question.predict.submit called'});
      },
    },
    claim: {
      create (opts: Opts<Question.Claim.Input, Context>): Promise<Question.Claim.Result> {
        return Promise.resolve({error: 'question.claim.create called'});
      },
      submit (opts: Opts<Submit.Input, Context>): Promise<Submit.Result> {
        return Promise.resolve({error: 'question.claim.submit called'});
      },
    },
    getById (opts: Opts<Question.Get.Input, Context>): Promise<Question.Get.Result> {
      return Promise.resolve({error: 'question.getById called'});
    },
  },
  questions (opts: Opts<Questions.Input, Context>): Promise<Questions.Result> {
    return Promise.resolve({error: 'questions called'});
  },
}