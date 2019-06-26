var ControlAcceso = artifacts.require("ControlAcceso");

module.exports = function(deployer) {
  deployer.deploy(ControlAcceso);
};