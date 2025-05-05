const apiBaseUrl = "http://localhost:8080";

export async function getSensorData() {
    try {
        const response = await fetch(`${apiBaseUrl}/sensors`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados dos sensores:", error);
        return {};
    }
}