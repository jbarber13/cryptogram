const DSM = artifacts.require("DSM");

module.exports = async function(deployer) {
  await deployer.deploy(DSM);
};