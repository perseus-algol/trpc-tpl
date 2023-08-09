import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../back/src/router'

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
    }),
  ],
});

const tests = [
  client.questions.query({}),

  client.question.get.query({questionID: '12'}),

  client.question.start.create.mutate({
    question: 'Will it rain tomorrow?',
    description: 'Will it rain',
    dueDate: 123123,
    prizeToken: {
      policyID: '0x123uh12i3hui1hi',
      tokenName: 'Suppa Token',
      decimals: 1,
    },
    oracleToken: '0xpqowdjpkqokdw',
    b: 1000,
    walletAddress: '0x123123'
  }),

  client.question.start.submit.mutate({ tx: '1' }),

  client.question.predict.create.mutate({
    questionID: '0x123uh12i3hui1hi',
    outcome: 'Yes',
    amount: 10,
    walletAddress: '0x123123'
  }),

  client.question.predict.submit.mutate({ tx: '2' }),

  client.question.claim.create.mutate({
    questionID: '0x123uh12i3hui1hi',
    walletAddress: '0x123123',
    claimAmount: 10,
  }),

  client.question.claim.submit.mutate({ tx: '3' }),
];

for (let test of tests) {
  try {
    const result = await test;
    console.log(result);
  } catch(err) {
    console.log(err);
  }
}