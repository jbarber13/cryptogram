const CryptoGram = artifacts.require("CryptoGram");
const CryptogramSetters = artifacts.require("CryptogramSetters");

module.exports = async function(deployer) {
  

  await deployer.deploy(CryptoGram);
};