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



    $(document).on('click', '.btn-AsignarRol', App.enviarAsignarRoles);
    $(document).on('click', '.btn-login', App.login);
    $(document).on('click', '.btn-crearUsuarios', App.enviarCrearUsuarios);
    $(document).on('click', '.btn-addRol', App.agregarRol);
    $(document).on('click', '.btn-crear', App.crearUsuario);







  },


  redireccionar: function (pagina) {
    window.location.replace(pagina)
  },

  enviarCrearUsuarios: function (event) {


    var url_string = window.location;
    var url = new URL(url_string);
    var usuario = url.searchParams.get("usuario");



    tieneRol = App.rolAsignado(usuario, "superadmin");

    if (tieneRol == "true") {
      console.log("OK");
      window.location.replace("crearUsuarios.html?usuario=" + usuario);

    } else {
      window.alert("El usuario no tiene los privilegios suficientes")
    }

    // window.location.replace("crearUsuarios.html");

    console.log(event);

  },

  enviarAsignarRoles: function (event) {


    var url_string = window.location;
    var url = new URL(url_string);
    var usuario = url.searchParams.get("usuario");
    console.log("antes tiene rol");

    tieneRol = App.rolAsignado(usuario, "superadmin");

    console.log("despues tiene rol");
    if (tieneRol == true) {
      console.log("OK");
      window.location.replace("asignarRoles.html?usuario=" + usuario);

    } else {
      window.alert("El usuario no tiene los privilegios suficientes")
    }

    // window.location.replace("crearUsuarios.html");

    console.log(event);

  },



  login: function (event) {
    console.log("handlelogin");
    usuario = window.document.getElementById("usuario").value;

    usuarioGlobal = usuario;
    clave = window.document.getElementById("clave").value;

    event.preventDefault();

    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log("usuario: " + usuario + "clave: " + clave);

      return ctlAccInstancia.obtenerClave(usuario);

    }).then(function (result) {
      console.log("result");

      console.log(result);

      password = result;

      if (password == clave) {
        console.log('OK');

        ///Redireccionar a pagina de modulos
        window.location.replace("modulos.html?usuario=" + usuario);

      } else {
        console.log('KO');
        window.alert('Las credenciales usuario/clave no son válidas');
      }

      // window.alert("El rol "+rol +  "fue asignado correctamente al usuario: " + usuario)


    }).catch(function (err) {
      console.log(err.message);
    });

  },

  agregarRol: function (event) {
    console.log("handleAddRol");
    usuario = window.document.getElementById("usuario").value;

    rol = window.document.getElementById("rol").value;

    event.preventDefault();

    usuario = window.document.getElementById("usuario").value;

    rol = window.document.getElementById("rol").value;

    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log("usuario: " + usuario + "rol: " + rol);

      // Execute adopt as a transaction by sending account
      return ctlAccInstancia.asignarRol(usuario, rol);
    }).then(function (result) {
      console.log("result");

      console.log(result);

      window.alert("El rol " + rol + "fue asignado correctamente al usuario: " + usuario)


    }).catch(function (err) {
      console.log(err.message);
    });

  },


  rolAsignado: function (usuario, rol) {
    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;

      return ctlAccInstancia.rolAsignado(usuario, rol);
    }).then(function (retorno) {
      console.log("rol asignado " + rol + " " + retorno);
      return retorno;
      console.log(retorno);
    }).catch(function (err) {
      console.log(err.message);
    });



  },

  crearUsuario: function (event) {
    console.log("crearUsuario");
    usuario = window.document.getElementById("usuario").value;

    clave = window.document.getElementById("clave").value;

    event.preventDefault();


    var ctlAccInstancia;

    App.contracts.ControlAcceso.deployed().then(function (instance) {
      ctlAccInstancia = instance;
      console.log("usuario: " + usuario + " clave: " + clave);

      // Execute adopt as a transaction by sending account
      return ctlAccInstancia.crearUsuario(usuario, clave);
    }).then(function (result) {
      console.log("result");

      console.log(result);

      window.alert("El Usuario: " + usuario + "fue creado correctamente ");


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
