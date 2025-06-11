const data = `{
    "data": [
        {
            "height": -0.08666217689311455,
            "time": "2025-06-11T00:18:00+00:00",
            "type": "low"
        },
        {
            "height": -0.0843896545728786,
            "time": "2025-06-11T03:16:00+00:00",
            "type": "high"
        },
        {
            "height": -0.08843082417996062,
            "time": "2025-06-11T08:17:00+00:00",
            "type": "low"
        },
        {
            "height": -0.058571994952537905,
            "time": "2025-06-11T17:10:00+00:00",
            "type": "high"
        }
    ],
    "meta": {
        "cost": 1,
        "dailyQuota": 10,
        "datum": "MSL",
        "end": "2025-06-12 00:00",
        "lat": 58.7984,
        "lng": 17.8081,
        "offset": 0,
        "requestCount": 2,
        "start": "2025-06-11 00:00",
        "station": {
            "distance": 6,
            "lat": 58.75,
            "lng": 17.867,
            "name": "station",
            "source": "ticon3"
        }
    }
}`

function tides(data){
    const tide1 = data.data[0].time;
    const tide2 = data.data[1].time;
    const tide3 = data.data[2].time;
    const tide4 = data.data[3].time;

    document.getElementById("tide1").textContent = `${new Date(tide1).toLocaleString()}`;
    document.getElementById("tide2").textContent = `${new Date(tide2).toLocaleString()}`;
    document.getElementById("tide3").textContent = `${new Date(tide3).toLocaleString()}`;
    document.getElementById("tide4").textContent = `${new Date(tide4).toLocaleString()}`;
}