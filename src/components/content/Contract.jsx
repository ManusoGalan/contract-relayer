import { useState } from "react";
import InputWithVerification from "../ui/InputWithVerification";

// Set worker w/ Node own Worker protocol
const compileWithWorker = async (sourceCode) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../../solc.worker.js", import.meta.url));

    worker.postMessage(sourceCode);
    worker.onmessage = (e) => {
      resolve(JSON.parse(e.data));
    };
    worker.onerror = reject;
  });
};

const Contract = ({
  ipfsNode,
  contractAddressParentHandler,
  contractAbiHandler,
}) => {
  // Local states for inputs
  const [contractAddress, setContractAddress] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");

  const [contractValidatorIcon, setContractValidatorIcon] = useState("");
  const [ipfsCIDValidatorIcon, setIpfsCIDValidatorIcon] = useState("");

  //Validators
  const isValidContract = async (e) => {
    if (window.web3.utils.isAddress(e.target.value)) {
      const contractCode = await window.web3.eth.getCode(e.target.value);

      if (contractCode === "0x") {
        return false;
      } else {
        contractAddressParentHandler(e.target.value);
        return true;
      }
    } else {
      return false;
    }
  };

  const isValidIPFS = async (e) => {
    const stream = ipfsNode.cat(e.target.value);
    const decoder = new TextDecoder();
    let data = "";

    try {
      for await (const chunk of stream) {
        // chunks of data are returned as a Uint8Array, convert it back to a string
        data += decoder.decode(chunk, { stream: true });
      }

      const contractFiles = (await compileWithWorker(data)).contracts;

      // As we are not sure of the names of the compiled file or the contracts inside it
      // we cycle through and take the first one of each, as there shouldn't be more than one
      const contracts = contractFiles[Object.keys(contractFiles)[0]];
      const contract = contracts[Object.keys(contracts)[0]].abi;

      contractAbiHandler(contract);

      return true;
    } catch {
      contractAbiHandler([]);
      return false;
    }
  };

  return (
    <div className="p-4">
      <InputWithVerification
        labelText="Contract address *"
        value={contractAddress}
        valueHandler={setContractAddress}
        validationIcon={contractValidatorIcon}
        validationIconHandler={setContractValidatorIcon}
        validator={isValidContract}
        name="contract-address"
      ></InputWithVerification>
      <InputWithVerification
        labelText="IPFS CID *"
        value={ipfsCID}
        valueHandler={setIpfsCID}
        validationIcon={ipfsCIDValidatorIcon}
        validationIconHandler={setIpfsCIDValidatorIcon}
        validator={isValidIPFS}
        name="ipfs-cid"
        helpText="To retrieve the ABI code of the contract, the contract must be uploaded to the IPFS system. The CID is the identifier you must have recieved when uploading the file."
      ></InputWithVerification>
    </div>
  );
};

export default Contract;
