App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    console.log("init");
    return await App.initWeb3();
  },

  initWeb3: async function () {
    console.log("initWeb3");

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("El usuario denego el acceso");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);



    return App.initContract();
  },

  initContract: function () {
    console.log("initContract");

    $.getJSON('ControlAcceso.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      console.log("data");

      console.log(data);

      var ctlAccArtifact = data;
      App.contracts.ControlAcceso = TruffleContract(ctlAccArtifact);

      // Set the provider for our contract
      App.contracts.ControlAcceso.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

     
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    console.log("bindEvents");
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-addRol', App.handleAddRol);
    $(document).on('click', '.btn-login', App.login);


  },

  markAdopted: function (adopters, account) {
    console.log("markAdopted");

    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  
  login: function (event) {
    console.log("handlelogin");
    usuario = window.document.getElementById("usuario").value;

    clave = window.document.getElementById("clave").value;

    event.preventDefault();

    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log("usuario: " +usuario + "clave: " + clave);

      // Execute adopt as a transaction by sending account
     // ctlAccInstancia.obtenerClave(usuario)
    // resultado = ctlAccInstancia.obtenerClave(usuario).call
    return ctlAccInstancia.obtenerClave(usuario);


    
   //return ctlAccInstancia.asignarRol('afasf', 'sdfsdfs');

    }).then(function (result) {
      console.log("result");

      console.log(result);

      password = result;

if (password==clave) {
  console.log('OK');
  window.location.replace("admin.html");

} else {
  console.log('KO');
  window.alert('Las credenciales usuario/clave no son válidas');
}

     // window.alert("El rol "+rol +  "fue asignado correctamente al usuario: " + usuario)

    
    }).catch(function (err) {
      console.log(err.message);
    });

  },

  handleAddRol: function (event) {
    console.log("handleAddRol");
    usuario = window.document.getElementById("usuario").value;

    rol = window.document.getElementById("rol").value;

    event.preventDefault();

    usuario = window.document.getElementById("usuario").value;

    rol = window.document.getElementById("rol").value;

    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log("usuario: " +usuario + "rol: " + rol);

      // Execute adopt as a transaction by sending account
      return ctlAccInstancia.asignarRol(usuario, rol);
    }).then(function (result) {
      console.log("result");

      console.log(result);

      window.alert("El rol "+rol +  "fue asignado correctamente al usuario: " + usuario)

    
    }).catch(function (err) {
      console.log(err.message);
    });

  },

  handleAdopt: function (event) {
    console.log("handleAdopt");


    event.preventDefault();

    usuario = window.document.getElementById("usuario").value;

    clave = window.document.getElementById("clave").value;

    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log(usuario + " " + clave);

      // Execute adopt as a transaction by sending account
      return ctlAccInstancia.asignarRol(usuario, clave);
    }).then(function (result) {
      console.log("result");

      console.log(result);

      window.location.replace("admin.html");

    
    }).catch(function (err) {
      console.log(err.message);
    });

  },
  handleAdopt2: function (event) {
    console.log("handleAdopt");

    

    usuario = window.document.getElementById("usuario").value;

    clave = window.document.getElementById("clave").value;


    console.log(usuario + " " + clave);
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, { from: account });
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  tieneRol: function (rol, account) {
    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;

      rolAsignado
      return ctlAccInstancia.rolAsignado(account, rol);
    }).then(function (retorno) {
      console.log(retorno);
    }).catch(function (err) {
      console.log(err.message);
    });



  },
  asignarRol: function (usuario, rol) {
    console.log("rolAsignado");
    var usuario = window.document.getElementById("usuario").value;

    var clave = window.document.getElementById("clave").value;
    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;


      return ctlAccInstancia.asignarRol(usuario, rol);
    }).then(function (adopters) {
      console.log("OK")
    }).catch(function (err) {
      console.log(err.message);
    });

  },
 
}

$(function () {
  $(window).load(function () {
    App.init();
  });
});
