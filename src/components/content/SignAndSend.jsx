import { useEffect } from "react";
import { useState } from "react";
import InputWithoutVerification from "../ui/InputWithoutVerification";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { awaitReceiptInfura, showAndHideWithTimeout } from "../../utils/utils";
import Popover from "../ui/Popover";

const SignAndSend = ({
  itxProvider,
  signer,
  abiProperies,
  contractAddress,
  inputs,
  inputsHandler,
  result,
  resultHandler,
}) => {
  //const loadedContract = new window.web3.eth.Contract(abiProperies)

  // React state
  const [signedTx, setSignedTransaction] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [sentTransactionHash, setSentTransactionHash] = useState("");

  // Alert states
  const [badInputs, hasBadInputs] = useState(false);
  const [metaMaskFailed, hasMetaMaskFailed] = useState(false);
  const [errorWhileSending, hasErrorWhileSending] = useState(false);

  //Await states
  const [askingPermission, isAskingPermission] = useState(false);
  const [sendingTransaction, isSendingTransaction] = useState(false);

  useEffect(() => {
    if (selectedValue) {
      // When a function is selected, we will save the inputs neccesary as an array with type, name
      // and value, empty at the start
      inputsHandler(
        abiProperies
          .find((abi) => abi.name === selectedValue)
          .inputs.map((input) => {
            return {
              name: input.name,
              type: input.type,
              value: "",
            };
          })
      );

      setSignedTransaction(null);
      resultHandler("0x");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const options = abiProperies
    .map((abiProperty) => {
      if (abiProperty.type === "function") {
        let displayName = "";
        let inputs = [];
        let outputs = [];

        inputs = abiProperty.inputs.map((rawInput) => {
          return `${rawInput.name}: ${rawInput.type}`;
        });

        outputs = abiProperty.outputs.length
          ? abiProperty.outputs.map((rawOutput) => {
              return `${rawOutput.type}`;
            })
          : ["void"];

        displayName = `${abiProperty.name} (${inputs
          .reduce((prev, current) => `${prev} ${current}, `, "")
          .trim()
          .slice(0, -1)}): ${outputs
          .reduce((prev, current) => `${prev}${current}, `, "")
          .trim()
          .slice(0, -1)}`;

        return {
          value: abiProperty.name,
          displayName: displayName,
        };
      }

      return null;
    })
    .filter((option) => option != null);

  const inputChangeHandler = (e) => {
    //We don't really validate parameters, that will be done by the blockchain
    const inputsWithNewValues = inputs.map((input) => {
      if (input.name === e.target.attributes["name"].value)
        input.value = e.target.value;

      return input;
    });

    inputsHandler(inputsWithNewValues);
  };

  const encodeFunction = () => {
    const inputParameters = inputs.map((input) => {
      return {
        type: input.type,
        name: input.name,
      };
    });

    const inputValues = inputParameters.map((inputParameter) => {
      return inputs.find((input) => input.name === inputParameter.name).value;
    });

    return window.web3.eth.abi.encodeFunctionCall(
      {
        name: selectedValue,
        type: "function",
        inputs: inputParameters,
      },
      inputValues
    );
  };

  // Front callbacks
  const signTransaction = async () => {
    try {
      const tx = {
        to: contractAddress,
        data: encodeFunction(),
        gas: `${parseInt(Math.random() * 10000 + 50000)}`,
        schedule: "fast",
      };

      const encodedTransaction = window.web3.utils.keccak256(
        window.web3.eth.abi.encodeParameters(
          ["address", "bytes", "uint", "uint", "string"],
          [tx.to, tx.data, tx.gas, 3, tx.schedule] //3 is the chain ID for Ropsten
        )
      );

      try {
        isAskingPermission(true);

        // Need to connect with MetaMask to sign the transaction w/ selected account.
        // Is not neccesary if we know the private key
        const sign = await window.ethereum.request({
          method: "personal_sign",
          params: [signer, window.web3.utils.hexToBytes(encodedTransaction)],
        });

        setSignedTransaction([tx, sign]);
      } catch (e) {
        console.error(e);
        showAndHideWithTimeout(hasMetaMaskFailed);
      }

      isAskingPermission(false);
    } catch (e) {
      console.error(e);
      showAndHideWithTimeout(hasBadInputs);
    }
  };

  const sendTransaction = async () => {
    const [tx, sign] = signedTx;

    try {
      isSendingTransaction(true);

      const relayTx = await itxProvider.relay.sendTransaction(tx, sign);
      const confirmedTx = await awaitReceiptInfura(itxProvider, relayTx.relayTransactionHash)

      console.log(confirmedTx)

      showAndHideWithTimeout(
        setSentTransactionHash,
        confirmedTx.transactionHash,
        ""
      );

      resultHandler(
        await window.web3.eth.call({
          to: tx.to,
          data: tx.data,
        })
      );

      setSignedTransaction(null);
    } catch (e) {
      console.error(e);
      showAndHideWithTimeout(hasErrorWhileSending);
    }

    isSendingTransaction(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between flex-col md:flex-row md:pr-16">
        <div className="md:w-2/4">
          <Select
            labelText="Avaiable functions"
            noValueOption="No function selected"
            options={options}
            value={selectedValue}
            valueHandler={setSelectedValue}
          ></Select>
        </div>
        <hr className="block md:hidden"></hr>
        <div className="md:w-2/4 md:pl-8">
          {inputs.map((input, index) => {
            return (
              <InputWithoutVerification
                key={`contract-input-${index}`}
                labelText={`Input Field #${index + 1} (${input.name}: ${
                  input.type
                })`}
                value={input.value}
                name={input.name}
                valueHandler={inputChangeHandler}
              ></InputWithoutVerification>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        {selectedValue === null ? (
          <></>
        ) : signedTx === null ? (
          <Button
            disabledCondition={askingPermission}
            onClickHandler={signTransaction}
          >
            Sign Transaction
          </Button>
        ) : (
          <Button
            disabledCondition={sendingTransaction}
            onClickHandler={sendTransaction}
          >
            Send Transaction
          </Button>
        )}
      </div>
      {result === "0x" ? (
        <></>
      ) : (
        <div className="mt-4">
          <p className="flex items-center justify-start">
            <span className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent mr-2">
              Result{" "}
            </span>
            <Popover text="The result is shown as an hexadecimal string, it needs to be converted to get the final result."></Popover>
          </p>
          <div className="mt-2 p-2 rounded bg-slate-200 font-mono">
            <p className="break-all">{result}</p>
          </div>
        </div>
      )}
      <Alert condition={badInputs}>
        <strong className="font-bold text-red-600">Inputs are not valid</strong>
        <p className="mt-4">
          Please review that all inputs are correctly filled, with a proper
          value regarding its type.
        </p>
      </Alert>
      <Alert condition={metaMaskFailed}>
        <strong className="font-bold text-red-600">
          Metamask connection has failed.
        </strong>
        <p className="mt-4">
          Please allow the page to sign using MetaMask. No charge will be made.
        </p>
      </Alert>
      <Alert condition={errorWhileSending}>
        <strong className="font-bold text-red-600">
          Error sending transaction
        </strong>
        <p className="mt-4">
          There was an error while sending/retrieving the transaction. Please
          send a new one.
        </p>
      </Alert>
      <Alert condition={sentTransactionHash !== ""}>
        <strong className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent bg-clip-text">
          Sending confirmed!
        </strong>
        <p className="mt-4">
          New transaction can be reviewed at{" "}
          <a
            className="text-transparent font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text break-words"
            href={`https://${process.env.REACT_APP_ETHEREUM_NETWORK}.etherscan.io/tx/${sentTransactionHash}`}
            target="_blank"
            rel="noreferrer"
          >{`https://${process.env.REACT_APP_ETHEREUM_NETWORK}.etherscan.io/tx/${sentTransactionHash}`}</a>
          .
        </p>
      </Alert>
    </div>
  );
};

export default SignAndSend;
