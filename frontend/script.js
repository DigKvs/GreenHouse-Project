import { service } from "./firebaseConnect.js";

service.user = "GreenHouse";

// ----------------------- FUNÇÃO PARA ENVIAR ------------------------
const set_data = async () => {
    let variavel = {}
    try
    {
        variavel = await service.load()
    }
    catch(e)
    {
        console.log(e)
    }
    
    variavel.Acionadores = {"Irrigacao" :  button1 ? 1 : 0, "Ventilacao": button2 ? 1 : 0}
    variavel.Modos = {"Manual": isAutomatic ? 0 : 1, "Luz": lampON ? 1 : 0, "Comporta": button3 ? 1 : 0}
  service.set(variavel);
};

// ----------------------- BOTÕES -----------------------
let lampButton = document.querySelector(".lampButton");
export let lampON = false;

lampButton.onclick = function () {
  let img = this.querySelector("img");
  lampButton.classList.toggle("lightON");
  lampButton.classList.toggle("bordinha");

  if (img.src.includes("light-bulb-night.png")) {
    img.src = "./images/light-bulb.png";
    lampON = true;
  } else {
    img.src = "./images/light-bulb-night.png";
    lampON = false;
  }
  set_data(); // toda vez que muda, manda pro Firebase
};

let switchElement = document.querySelector(".switch");
let switchText = document.querySelector(".switch-text");
let slider = document.querySelector(".slider");

export let isAutomatic = true;

switchElement.onclick = function () {
  isAutomatic = !isAutomatic;
  switchElement.classList.toggle("active");
  switchElement.classList.toggle("gradient");

  switchText.textContent = isAutomatic ? "Manual" : "Automático";
  set_data();
};

let buttons = document.querySelectorAll(".button");
export let button1 = false;
export let button2 = false;
export let button3 = false;

buttons.forEach((button) => {
  button.onclick = function () {
    let active = document.querySelectorAll(".grid-active");
    if (button.classList.contains("active-raining")) {
      button1 = !button1;
      active[0].classList.toggle("gradient", button1);
    }
    if (button.classList.contains("active-airdrop")) {
      button2 = !button2;
      active[1].classList.toggle("gradient", button2);
    }
    if (button.classList.contains("active-door")) {
      button3 = !button3;
      active[2].classList.toggle("gradient", button3);
    }
    set_data();
  };
});

// ----------------------- Att Text -----------------------

let tempInt = document.querySelector(".temp-interna")
let tempExt = document.querySelector(".temp-externa")
let umityInt =  document.querySelector(".umid-interna")
let umityExt = document.querySelector(".umid-externa")
let umityGND = document.querySelector(".solo-interno")

tempInt.textContent = 
tempExt.textContent = 
umityInt.textContent = 
umityExt.textContent = 
umityGND.textContent = 




// ----------------------- LOOP PARA ATUALIZAR -----------------------
setInterval(async () => {
  await service.load();
}, 10000);
