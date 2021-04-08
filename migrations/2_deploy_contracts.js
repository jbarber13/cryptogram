const CryptoGram = artifacts.require("CryptoGram");

module.exports = async function(deployer) {
  await deployer.deploy(CryptoGram);
};