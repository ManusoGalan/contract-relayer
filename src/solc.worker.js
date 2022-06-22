import * as wrapper from "solc/wrapper"
// eslint-disable-next-line no-restricted-globals
const ctx = self

// eslint-disable-next-line no-undef
importScripts(
  'https://solc-bin.ethereum.org/bin/soljson-v0.8.6+commit.11564f7e.js'
);

ctx.addEventListener('message', ({data}) => {
  const solc = wrapper(ctx);
  const compileResult = solc.compile(
    createCompileInput(data)
  )

  if (!JSON.parse(compileResult).contracts) throw new Error('IPFS Node does not have a contract')

  ctx.postMessage(compileResult)
})

const createCompileInput = (sourceCode) => {
  return JSON.stringify({
    language: 'Solidity',
        sources: {
            'source.sol': {
                content: sourceCode,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
  })
}