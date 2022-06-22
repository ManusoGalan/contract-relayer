# ETH Contract Realyer

A prototype for using the relay component of Infura.

It can either be cloned and launched as a local app or visit [demo-page]() to try it. Remember to change `YOUR_INFURA_PROJECT_ID` for your Infura project ID as there is not a default one.

## Requirements

As this is a dApp two things are mandatory:

- An Infura project ID (visit [Infura](https://infura.io/) for more info)
- A cryptowallet (eg. [MetaMask](https://metamask.io/))
- An account with ETH loaded on it (for the web version this has to be rETH, which can be obtained from faucets such as [this](https://faucet.egorfine.com/))

If using the local version, all calls to the the MetaMask provider can be changed to use the Infura provider using the private key from some account. Take note that, with this approach, the Infura provider is getting overloaded with more calls than necessary.

## Configuration (only for local)

The local version can be configured to use any ETH network (such as rinkeby or the mainnet). For that change the `REACT_APP_ETHEREUM_NETWORK` value on the `.env` file.

## Installation (only for local)

First, clone this repository on your local computer. After that, use `npm install` to install the dependencies and `npm start` to launch de development server.