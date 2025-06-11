const dataMock = {
   "data":[
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":-1.9599376403178197,
         "time":"2025-06-11T10:00:00+00:00",
         "type":"low"
      },
      {
         "height":1.8388718184358939,
         "time":"2025-06-11T15:39:00+00:00",
         "type":"high"
      },
      {
         "height":-2.01178618791781,
         "time":"2025-06-11T22:21:00+00:00",
         "type":"low"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      },
      {
         "height":1.665780660749532,
         "time":"2025-06-11T03:23:00+00:00",
         "type":"high"
      }
   ],
   "meta":{
      "cost":1,
      "dailyQuota":10,
      "datum":"MSL",
      "end":"2025-06-12 00:00",
      "lat":47.29,
      "lng":-2.52,
      "offset":0,
      "requestCount":7,
      "start":"2025-06-11 00:00",
      "station":{
         "distance":27,
         "lat":47.133,
         "lng":-2.25,
         "name":"pointe st. gildas",
         "source":"sg"
      }
   }
}

function tides(data){
    const tableBody = document.getElementById("maree-table-body");
    dataMock.data.forEach(entry => {
        const row = document.createElement("tr");
  
        const time = new Date(entry.time);
        const localTime = time.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  
        const type = entry.type === "high" ? "Marée haute" : "Marée basse";
  
        row.innerHTML = `
          <td>${localTime}</td>
          <td>${type}</td>
          <td>${entry.height.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
      });
}