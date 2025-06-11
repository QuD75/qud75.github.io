const dataMock = `{
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
`

function tides(data){
    const parsed = JSON.parse(dataMock);
    const tide1 = parsed.data[0].time;
    const tide2 = parsed.data[1].time;
    const tide3 = parsed.data[2].time;
    const tide4 = parsed.data[3].time;
    const tide5 = parsed.data[4].time;
    const tide6 = parsed.data[5].time;
    const tide7 = parsed.data[6].time;
    const tide8 = parsed.data[7].time;
    const tide9 = parsed.data[8].time;
    const tide10 = parsed.data[9].time;
    const tide11 = parsed.data[10].time;
    const tide12 = parsed.data[11].time;

    document.getElementById("tide1").textContent = `${new Date(tide1).toLocaleString()}`;
    document.getElementById("tide2").textContent = `${new Date(tide2).toLocaleString()}`;
    document.getElementById("tide3").textContent = `${new Date(tide3).toLocaleString()}`;
    document.getElementById("tide4").textContent = `${new Date(tide4).toLocaleString()}`;
    document.getElementById("tide5").textContent = `${new Date(tide5).toLocaleString()}`;
    document.getElementById("tide6").textContent = `${new Date(tide6).toLocaleString()}`;
    document.getElementById("tide7").textContent = `${new Date(tide7).toLocaleString()}`;
    document.getElementById("tide8").textContent = `${new Date(tide8).toLocaleString()}`;
    document.getElementById("tide9").textContent = `${new Date(tide9).toLocaleString()}`;
    document.getElementById("tide10").textContent = `${new Date(tide10).toLocaleString()}`;
    document.getElementById("tide11").textContent = `${new Date(tide11).toLocaleString()}`;
    document.getElementById("tide12").textContent = `${new Date(tide12).toLocaleString()}`;
}