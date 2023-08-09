const baseUrl = 'http://localhost:4000/api';

const printResult = async (res: Response) => res.json().then(res => console.log(res));

type HttpMethod = 'GET' | 'POST'

type HttpRequest = [url: string, method: HttpMethod, payload?: any]

const makeRequest = async ([url, method, payload]: HttpRequest) => {
  const headers: any = {};
  if (method === 'POST') {
    headers['Content-Type'] = 'application/json';
  }

  const body = payload ? JSON.stringify(payload) : undefined;

  return await fetch(`${baseUrl}/${url}`, {
    method,
    headers,
    body
  })
}

const tests: Array<HttpRequest> = [
  ['questions', 'GET'],
  ['question/12', 'GET'],
  ['question/start/create', 'POST', {
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
  }],
  ['question/start/submit', 'POST', { tx: '1' }],
  ['question/predict/create', 'POST', {
    questionID: '0x123uh12i3hui1hi',
    outcome: 'Yes',
    amount: 10,
    walletAddress: '0x123123'
  }],
  ['question/predict/submit', 'POST', { tx: '2' }],
  ['question/claim/create', 'POST', {
    questionID: '0x123uh12i3hui1hi',
    walletAddress: '0x123123',
    claimAmount: 10,
  }],
  ['question/claim/submit', 'POST', { tx: '3' }],
]

for (let test of tests) {
  await makeRequest(test).then(printResult);
}

export {}