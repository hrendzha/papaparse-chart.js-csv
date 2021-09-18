import './sass/main.scss';
import Chart from 'chart.js/auto';

//  https://retool.com/utilities/generate-api-from-csv
const BASE_URL = 'https://retoolapi.dev/rXuDhN/data';
const GLOBAL_MEAN_TEMPERATURE = 14;

const context = document.getElementById('myChart').getContext('2d');

fetchData()
  .then(getLabelsAndData)
  .then(drawChart)
  .catch(error => console.log(error));

async function fetchData() {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.globTemps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.northHemTemps.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
      acc.southHemTemps.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);

      return acc;
    },
    { years: [], globTemps: [], northHemTemps: [], southHemTemps: [] },
  );
}

function drawChart({ years, globTemps, northHemTemps, southHemTemps }) {
  new Chart(context, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: '# of Global average temperature',
          data: globTemps,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
        {
          label: '# of North hemisphere average temperature',
          data: northHemTemps,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
        {
          label: '# of South hemisphere average temperature',
          data: southHemTemps,
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback(value, index, values) {
              return value + '°C';
            },
          },
        },
      },
    },
  });
}
