async function fetchData(apiUrl, cacheKey, duration, displayFunction, headers = {}) {
    const now = Date.now();
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    if (cachedData && (now - cachedData.timestamp < duration * 60000)) {
        displayFunction(cachedData.data);
        return cachedData.data;
    }
    try {
        const response = await fetch(apiUrl, { headers }); 
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ data: data, timestamp: now }));
        displayFunction(data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de ' + cacheKey + ':', error);
        return null;
    }
}