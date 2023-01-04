var chat = {
  // (A) INIT CHAT
  name : null, // user's name
  socket : null, // chat websocket
  ewrap : null, // html chat history
  emsg : null, // html chat message
  ego : null, // html chat go button
  init : () => {
    // (A1) GET HTML ELEMENTS
    chat.ewrap = document.getElementById("chatShow");
    chat.emsg = document.getElementById("chatMsg");
    chat.ego = document.getElementById("chatGo");

    // (A2) USER'S NAME
var gn = prompt("Nombrate", "Anonimo");
if(gn == "Anonimo")
{


    chat.name = "Anonimo" + generateRandomString(8);
} else {
  chat.name = gn;
}

var wsip = prompt("IP Del Servidor: (ejemplo: 192.168.0.1:8000)", "0.tcp.ngrok.io:11914") 
   // if (chat.name == null || chat.name=="") { chat.name = "Mysterious"; }

    // (A3) CONNECT TO CHAT SERVER
    chat.socket = new WebSocket("ws://" + wsip);

    // (A4) ON CONNECT - ANNOUNCE "I AM HERE" TO THE WORLD
    chat.socket.addEventListener("open", () => {
      chat.controls(1);
      chat.send("Joined the chat room.");
    });

    // (A5) ON RECEIVE MESSAGE - DRAW IN HTML
    chat.socket.addEventListener("message", evt => chat.draw(evt.data));

    // (A6) ON ERROR & CONNECTION LOST
    chat.socket.addEventListener("close", () => {
      chat.controls();
      alert("Websocket connection lost!");
    });
    chat.socket.addEventListener("error", err => {
      chat.controls();
      console.log(err);
      alert("Websocket connection error!");
    });
  },

  // (B) TOGGLE HTML CONTROLS
  controls : enable => {
    if (enable) {
      chat.emsg.disabled = false;
      chat.ego.disabled = false;
    } else {
      chat.emsg.disabled = true;
      chat.ego.disabled = true;
    }
  },

  // (C) SEND MESSAGE TO CHAT SERVER
  send : msg => {
    if (msg == undefined) {
      msg = chat.emsg.value;
      chat.emsg.value = "";
    }


if(msg.startsWith("/c "))
{
  var commandContent = text.split("/c ")[1];
  if(commandContent.contains("/c "))
  {} else {
    var commandName = commandContent.split(" ")[0];
    var commandParams = commandContent.split(" ");
    //the command params start in [1] index

    switch(commandName)
    {
      case "cambiarnombre":
        var oldname = chat.name;
     //s chat.name = commandParams[1];
      chat.socket.send(JSON.stringify({
        name: "Chat",
        msg: oldname + " >> " + chat.name
      }));
      break;
      default:
        chat.socket.send(JSON.stringify({
          name: "Chat",
          msg: "Comando no encontrado"
        }));
        break;
    }
  }

} else
{

    chat.socket.send(JSON.stringify({
      name: chat.name,
      msg: msg
    }));
  }

    return false;
  },

  // (D) DRAW MESSAGE IN HTML
  draw : msg => {
    // (D1) PARSE JSON
    msg = JSON.parse(msg);
    console.log(msg);

    // (D2) CREATE NEW ROW
    let row = document.createElement("div");
    row.className = "chatRow";
    row.innerHTML = `<div class="chatName">${msg["name"]}<br></div><div class="chatMsg">${msg["msg"]}</div>`;
    chat.ewrap.appendChild(row);

    // (D3) AUTO SCROLL TO BOTTOM - MAY NOT BE THE BEST...
    window.scrollTo(0, document.body.scrollHeight);
  }
};

const  generateRandomString = (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1= ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}
window.addEventListener("DOMContentLoaded", chat.init);