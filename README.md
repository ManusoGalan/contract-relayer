# ETH Contract Relayer

A prototype for using the relay component of Infura.

## Requirements

As this is a dApp two things are mandatory:

- An Infura project ID (visit [Infura](https://infura.io/) for more info)
- A cryptowallet (eg. [MetaMask](https://metamask.io/))
- An account with ETH loaded on it (for the web version this has to be rETH, which can be obtained from faucets such as [this](https://faucet.egorfine.com/))

If using the local version, all calls to the MetaMask provider can be changed to use the Infura provider using the private key from some account. Take note that, with this approach, the Infura provider is getting overloaded with more calls than necessary.

## Configuration (for local only)

The local version can be configured to use any ETH network (such as rinkeby or the mainnet). For that, change the `REACT_APP_ETHEREUM_NETWORK` value on the `.env` file.

## Installation (for local only)

First, clone this repository on your local computer. After that, use `npm install` to install the dependencies and `npm start` to launch the development server.

## Usage

It can either be cloned and launched as a local app or visit [demo-page](https://contract-relayer.herokuapp.com?infuraId=<YOUR_INFURA_PROJECT_ID>) to try it. Remember to change `YOUR_INFURA_PROJECT_ID` for your Infura project ID, as there is not a default one.

## FAQs

**Q: What is this?**

This app takes advantage of the Infura relay process (named also [ITX transactions](https://docs.infura.io/infura/features/itx-transactions)) for interacting with smart contracts without spending ETH on gas taxes.

**Q: How do I use it?**

You can either download it and run it locally or try the [demo-page](https://contract-relayer.herokuapp.com?infuraId=<YOUR_INFURA_PROJECT_ID>), changing `YOUR_INFURA_PROJECT_ID` on the URL for your Infura project ID.

For it to run, you must have some ETH (rETH on the demo page as it uses the Ropsten testnet) so you can charge your ITX balance for using the app.

**Q: If I need to charge the ITX balance, do I still ETH?**

Yes, you still need some ETH to charge the balance.

**Q: Then, what's the advantage instead of interacting with a contract directly with MetaMask, for example?**

On the demo page, you need ETH on your account, so the app doesn't relay on some random account to get a positive ITX balance.

The main advantage is that, for the final user having to interact with the contracts, if the relay is implemented, there would be no cost as they wouldn't have to pay gas fees, as they would be paid by the relay. This is called a meta-transaction.

**Q: But the final user still needs to connect to a cryptowallet to recharge their balance, so what's the point?**

The demo app is not thought to be used by the final users of a dApp, but more the developer to check if they have enough funds for the ITX transactions, that the contracts works correctly, ...

If you want to use it as a gas free app for everyone, you first need to clone the project. Then, on your local copy, the `window.web3` methods (which relay on a cryptowallet provider) can be changed, so they relay directly on the Infura provider, and `send` methods allow providing an account's private key.

In the later case it wouldn't be necessary for final users to connect to any cryptowallet, as everything would be done with `web3.js` methods using the Infura provider when necessary.