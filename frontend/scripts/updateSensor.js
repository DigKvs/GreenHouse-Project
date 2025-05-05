const apiBaseUrl = "http://localhost:8080/api/";

async function fetchLatestSensorData() {
    try {
        const response = await fetch(`${apiBaseUrl}/sensors`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        console.log("Sensor data recebida:", data);
        updateSensorDisplay(data);
    } catch (error) {
        console.error("Erro ao buscar os dados mais recentes:", error);
    }
}

function updateSensorDisplay(data) {
    const sensorDataElements = document.querySelectorAll(".sensor-data");
    if (sensorDataElements.length >= 4) {
        sensorDataElements[0].textContent = `${data.s_luminosity ?? 0}%`; // Luminosidade
        sensorDataElements[1].textContent = `${data.s_temp1 ?? 0}°C`;     // Temperatura Interna
        sensorDataElements[2].textContent = `${data.s_umid1 ?? 0}%`;      // Umidade Interna
        sensorDataElements[3].textContent = `${data.s_tank ?? 0}%`;       // Nível do tanque
    } else {
        console.error("Elementos .sensor-data não encontrados ou insuficientes.");
    }
}

// Executa assim que a página carregar
document.addEventListener("DOMContentLoaded", fetchLatestSensorData);
