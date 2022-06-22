import Web3 from "web3";
import { useState } from "react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import { awaitReceipt, showAndHideWithTimeout } from "../../utils/utils";

const Balance = ({ itxProvider, signer, signerHandler }) => {
  //React Hooks
  const [currentBalance, setCurrentBalance] = useState(0.0);

  // Alert states
  const [balanceOutdated, isBalanceOutdated] = useState(false);
  const [newTransactionHash, setNewTransactionHash] = useState("");

  // Await states
  const [loadingBalance, isLoadingBalance] = useState(false);
  const [transactionStarting, isTransactionStarting] = useState(false);

  //MetaMask functions
  const getAccount = async () => {
    if (window.ethereum) {
      try {
        const accountRequest = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        window.web3 = new Web3(window.ethereum);
        signerHandler(accountRequest[0]);
        setCurrentBalance(await checkCurrentBalance(accountRequest[0]));
      } catch {
        console.error("Error while connecting to MetaMask");
      }
    }
  };

  //Infura functions
  const addITXGas = async () => {
    //Get the signer - the account that will act on behalf of the users
    //Not neccesary as we use Metmask send
    //  const signer = web3.eth.accounts.privateKeyToAccount(process.env.REACT_APP_SIGNER_PRIVATE_KEY)
    //  console.log(`Signer public address: ${signer.address}`);

    isTransactionStarting(true);

    try {
      // Send Ether to the ITX deposit contract
      // ITX will register the deposit after 10 confirmations
      // and credit the gas tank associated with your signer address
      let txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: signer,
            to: "0x015C7C7A7D65bbdb117C573007219107BD7486f9",
            value: window.web3.utils.toHex(
              window.web3.utils.toWei("0.1", "ether")
            ),
          },
        ],
      });

      try {
        await awaitReceipt(txHash);
        showAndHideWithTimeout(setNewTransactionHash, txHash, "");
      } catch {
        console.error(
          `Error getting transaction info for transaction ${txHash}`
        );
      }

      isTransactionStarting(false);
    } catch (e) {
      console.error(
        `Error sending new transaction to gas tank contract from ${signer.address}`
      );
    }
  };

  const checkCurrentBalance = async (signerAccount = signer) => {
    // Check your existing ITX balance using the relay_getBalance function of the contract
    try {
      return window.web3.utils.fromWei(
        (await itxProvider.relay.getBalance(signerAccount)).balance
      );
    } catch (e) {
      console.error(
        `Error ${e} fetching balance on gas pool for address ${signerAccount}`
      );
      return NaN;
    }
  };

  // Front callbacks
  const recheckBalance = async () => {
    let tries = 0;
    const oldBalance = currentBalance;
    let newBalance = currentBalance;

    isLoadingBalance(true);

    while (tries !== 5 && oldBalance === newBalance) {
      let newBalanceRetrieved = await checkBalanceWithTimeout();
      if(!Number.isNaN(newBalance)) newBalance = newBalanceRetrieved;
      tries++;
    }

    if (oldBalance === newBalance) {
      showAndHideWithTimeout(isBalanceOutdated);
    }

    setCurrentBalance(newBalance);
    isLoadingBalance(false);
  };

  const checkBalanceWithTimeout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          checkCurrentBalance().then((retrievedBalance) => {
            return retrievedBalance;
          })
        );
      }, 2000);
    });
  };

  return signer === "" ? (
    <div className="flex justify-center">
      <Button onClickHandler={getAccount}>Connect *</Button>
    </div>
  ) : (
    <div className="p-4">
      <p className="text-center bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent bg-clip-text ">
        The current balance of the gas tank is{" "}
        <span className="font-bold">{currentBalance}</span> Ether
      </p>
      <div className="flex justify-center items-center flex-col sm:flex-row">
        <Button
          disabledCondition={loadingBalance}
          disabledSpinner={true}
          onClickHandler={recheckBalance}
        >
          Check balance again
        </Button>
        <Button
          disabledCondition={transactionStarting}
          disabledSpinner={true}
          onClickHandler={addITXGas}
        >
          Send 0.1 Ether
        </Button>
      </div>
      <Alert condition={newTransactionHash !== ""}>
        <strong className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent bg-clip-text">
          Transaction confirmed!
        </strong>
        <p className="mt-4">
          New transaction can be reviewed at{" "}
          <a
            className="text-transparent font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text break-words"
            href={`https://${process.env.REACT_APP_ETHEREUM_NETWORK}.etherscan.io/tx/${newTransactionHash}`}
            target="_blank"
            rel="noreferrer"
          >{`https://${process.env.REACT_APP_ETHEREUM_NETWORK}.etherscan.io/tx/${newTransactionHash}`}</a>
          .
        </p>
      </Alert>
      <Alert condition={balanceOutdated}>
        <strong className="font-bold text-red-600">
          Balance may be outdated
        </strong>
        <p className="mt-4">
          If you've completed new transactions recently, it may take some time
          to reflect. Please, try again later.
        </p>
      </Alert>
    </div>
  );
};

export default Balance;
