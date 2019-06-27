var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "boost fetch audit attend actor snake pull moon ethics venue brother risk";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    //develop: {
    //  port: 8545
    //},
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/d7e05852912546d3afcd56121efda3d3")
      },
      network_id: 3
    }   
  }
};