const SimpleStorage = artifacts.require("tfg");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
