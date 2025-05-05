import { getSensorData } from './apiRequests.js';

document.addEventListener("DOMContentLoaded", async () => {
    const dados = await getSensorData();

    document.querySelector(".temp-interna").textContent = `${dados.s_temp1 ?? 0}°C`;
    document.querySelector(".umid-interna").textContent = `${dados.s_umid1 ?? 0}%`;
    document.querySelector(".solo-interno").textContent = `${dados.s_umid2 ?? 0}%`;
    document.querySelector(".temp-externa").textContent = `${dados.s_temp2 ?? 0}°C`;
    document.querySelector(".umid-externa").textContent = `${dados.s_umid2 ?? 0}%`;

    const tanque = document.querySelector(".water");
    if (tanque && dados.s_tank) {
        tanque.style.height = `${dados.s_tank}%`;
    }
});
