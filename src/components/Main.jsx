import { useSearchParams } from "react-router-dom";

import Web3 from "web3";
import { create } from "ipfs-http-client";

import Accordion from "./ui/Accordion";

import Balance from "./content/Balance";
import Contract from "./content/Contract";
import SignAndSend from "./content/SignAndSend";

import { useState } from "react";
import { useEffect } from "react";

const Main = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const [infuraConnected, isInfuraConnected] = useState(false);

  const [signer, setSigner] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [contractAbi, changeContractAbi] = useState([]);
  
  //Neccesary to reaculate accordion
  const [contractInputs, changeContractInputs] = useState([]);
  const [result, setResult] = useState("0x")

  useEffect(() => {
    web3.eth
      .getBlockNumber()
      .then(isInfuraConnected(true))
      .catch((e) => isInfuraConnected(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ipfs = create({
    protocol: "https",
    host: "ipfs.infura.io",
    apiPath: "api/v0",
    port: 5001,
  });

  const infuraId = searchParams.get("infuraId");

  //Configure the provider
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${process.env.REACT_APP_ETHEREUM_NETWORK}.infura.io/v3/${infuraId}`
    )
  );

  //Add the necessary methods for the relay provider
  web3.extend({
    property: "relay",
    methods: [
      {
        name: "getBalance",
        call: "relay_getBalance",
        params: 1,
      },
      {
        name: "sendTransaction",
        call: "relay_sendTransaction",
        params: 2,
      },
      {
        name: "getTransactionStatus",
        call: "relay_getTransactionStatus",
        params: 1,
      },
    ],
  });

  const balanceCollapseData = {
    title: "Check balance",
    content: (
      <Balance
        itxProvider={web3}
        signer={signer}
        signerHandler={setSigner}
      ></Balance>
    ),
    heightState: [signer],
  };

  const contractCollapseData = {
    title: "Fill contract info",
    content: (
      <Contract
        ipfsNode={ipfs}
        contractAddressParentHandler={setContractAddress}
        contractAbiHandler={changeContractAbi}
      ></Contract>
    ),
    heightState: [],
  };

  const signAndSendCollapseData = {
    title: "Sign and send transaction",
    content: (
      <SignAndSend
        itxProvider={web3}
        signer={signer}
        contractAddress={contractAddress}
        abiProperies={contractAbi}
        inputs={contractInputs}
        inputsHandler={changeContractInputs}
        result={result}
        resultHandler={setResult}
      ></SignAndSend>
    ),
    heightState: [contractInputs, result],
  };

  const collapses =
    signer === ""
      ? [balanceCollapseData]
      : contractAddress !== "" && contractAbi.length !== 0
      ? [balanceCollapseData, contractCollapseData, signAndSendCollapseData]
      : [balanceCollapseData, contractCollapseData];

  return (
    <>
      <div className="fixed top-0 w-full h-16 flex justify-center z-10 bg-white shadow-md">
        <img
          alt="ETH Contract Relayer Logo"
          src="https://hcti.io/v1/image/1233eda9-010f-4c55-a894-989b4be34ee7"
        />
      </div>
      <div className="pt-16 h-screen flex items-center justify-center">
        {infuraConnected ? (
          <Accordion collapses={collapses}></Accordion>
        ) : (
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <p className="text-4xl font-light leading-loose text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">
              The provided infura project ID is not valid.<br></br>Please, provide a valid one as it's necessary for the relay part to work.<br></br>Also be sure infuraId parameter is the one having the Infura Project ID.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
