const awaitReceipt = async (hash) => {
  return new Promise((resolve, reject) => {
    let txReceipt = null;

    let txReceiptRetry = setInterval(async () => {
      try {
        txReceipt = await window.web3.eth.getTransactionReceipt(hash);
        if (txReceipt != null) {
          resolve(txReceipt);
          clearInterval(txReceiptRetry);
        }
      } catch (e) {
        reject(e);
      }
    }, 2000);
  });
};

const awaitReceiptInfura = async (itxProvider, hash) => {
  return new Promise((resolve, reject) => {
    let statusResponse = null;

    let statusRetry = setInterval(async () => {
      try {
        statusResponse = await itxProvider.relay.getTransactionStatus(hash);

        if (statusResponse.broadcasts) {
          for (let i = 0; i < statusResponse.broadcasts.length; i++) {
            const bc = statusResponse.broadcasts[i];
            const receipt = await window.web3.eth.getTransactionReceipt(
              bc.ethTxHash
            );
            if (receipt && bc.confirmations > 1) {
              resolve(receipt);
              clearInterval(statusRetry);
            }
          }
        }
      } catch (e) {
        reject(e);
      }
    }, 5000);
  });
};

const showAndHideWithTimeout = (
  conditionHandler,
  trueValue = true,
  falseValue = false
) => {
  conditionHandler(trueValue);

  setTimeout(() => {
    conditionHandler(falseValue);
  }, 5000);
};

export { awaitReceipt, awaitReceiptInfura, showAndHideWithTimeout };
