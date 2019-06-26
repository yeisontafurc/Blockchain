pragma solidity ^0.5.0;

contract ControlAcceso {
  address creador;
  string usuario;
  string direccion;

  mapping(string => mapping(string => bool)) roles;
  
  mapping(string => string )usuarios;
  


  constructor () public{
    string memory superUsuario = toString(msg.sender);
    roles[superUsuario]['superadmin'] = true;
    usuarios["superadmin"] = "superadmin";
  }
  
    function crearUsuario(string memory usuario, string memory clave) public {
     usuarios[usuario]=clave;
   }

    function obtenerClave (string memory usuario)  public view  returns (string memory) {
    return usuarios[usuario];
  }
  
  function asignarRol(string memory usuario, string memory rol) public {
          roles[usuario][rol] = true;

      
  }
 

 function removerRol (string memory usuario, string memory rol) public {
    roles[usuario][rol] = false;
  } 
  
  function rolAsignado (string memory usuario, string memory rol)  public view  returns (bool) {
    return roles[usuario][rol];
  }
  

  
  function tieneRol (string memory rol) private  returns (bool) {
    
    string memory sender = toString(msg.sender);
    
    if (roles[toString(msg.sender)][rol] == true) {
      return true;
    }
    
  }

    function toString(address direccion) private returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(direccion) / (2**(8*(19 - i)))));
        return string(b);
    }
    
}