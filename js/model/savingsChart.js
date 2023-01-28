import { SavingsAccount } from "./savingsAccount.js";

export function createLebelsForChartAccordingToAPeriod(aSavingsAccount) {
    const labels = [];
    for (let index = 1; index < aSavingsAccount.periodInMonths + 1; index++) {
        labels.push(`${index}º Mes`);
    }
    return labels;
}

export function obteinDataForChartAccordingToActualSavingsAccountOverview(aSavingsAccount){
    return aSavingsAccount.earningsByMonthDataForARecapitalizedSavingsAccount()
}

export function initializeShowSavingsChartComponents(aSavingsAccount){
    
    const chartContainer = document.getElementById('savings-chart');
    let chartCanvas = document.getElementById('savings-chart-canvas');
    const showChartButton = document.getElementById('show-savings-chart');
    const backOverviewResults = document.getElementById('back-overview-results');
    const overview = document.getElementById("overview");

    
    
    /* remove the actual canvas and creates a new one */
    chartContainer.removeChild(document.getElementById('savings-chart-canvas'))
    chartCanvas = document.createElement("canvas");
    chartCanvas.id = 'savings-chart-canvas';
    chartContainer.appendChild(chartCanvas);

    showChartButton.onclick = () => {
        chartContainer.hidden = false;
        overview.hidden = true;
    }

    backOverviewResults.onclick = () => {
        chartContainer.hidden = true;
        overview.hidden = false;
    }

    const labels = createLebelsForChartAccordingToAPeriod(aSavingsAccount);
    const data = obteinDataForChartAccordingToActualSavingsAccountOverview(aSavingsAccount);

    new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
            label: 'Ganancias mensuales (en AR$)',
            data: data,
            borderColor: 'rgb(99, 19, 173)',
            backgroundColor: 'blueviolet',
            borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        resposive: true,
      }
    });
}

export function showChartSimulationIdentifiedWithId(simulationId){

    const chartContainer = document.getElementById('savings-chart');
    let chartCanvas = document.getElementById('savings-chart-canvas');
    
    /* remove the actual canvas and creates a new one */
    chartContainer.removeChild(document.getElementById('savings-chart-canvas'))
    chartCanvas = document.createElement("canvas");
    chartCanvas.id = 'savings-chart-canvas';
    chartContainer.appendChild(chartCanvas);
    
    // creates the savings account object model

    const savingsAccountLiteralObjects = (JSON.parse(localStorage.getItem("savingsAccounts"))).find( element => element.id == simulationId);
    const savingsAccount = new SavingsAccount(savingsAccountLiteralObjects.id,savingsAccountLiteralObjects.amount,savingsAccountLiteralObjects.periodInMonths,savingsAccountLiteralObjects.tnaIndicator);

    localStorage.setItem("currentSavingsAccountVisualizing",JSON.stringify(savingsAccount));
    
    // extract the data from the savings account
    const labels = createLebelsForChartAccordingToAPeriod(savingsAccount);
    const data = obteinDataForChartAccordingToActualSavingsAccountOverview(savingsAccount);

    // we hide the overview, create the chart and show it
    let overview =  (document.getElementById("overview"));
    overview.hidden = true;

    new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
              label: 'Ganancias mensuales (en AR$)',
              data: data,
              borderColor: 'rgb(99, 19, 173)',
              backgroundColor: 'blueviolet',
              borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    chartContainer.hidden = false;

    // additionally we hide the backOverviewButton

    const backOverviewButton = document.getElementById('back-overview-results');
    backOverviewButton.hidden = true;
}

export async function dollarizeChartSimulation() {

  async function obteinLastUSDARSQuotation() {
    
    let quotation = 0;
    await fetch("../../utility/USDARSQuotations.json")
                        .then( response => response.json())
                        .then( quotationsArray => {
                          const randomIndex = Math.floor(Math.random() * quotationsArray.length);
                          quotation = quotationsArray[randomIndex];
                        });
    return parseFloat(quotation);
  }
  // we use the current savings account that we are visualizing
  
  let lastUSDARSQuotation = await obteinLastUSDARSQuotation();

  const currentSavingsAccountVisualizing = JSON.parse(localStorage.getItem("currentSavingsAccountVisualizing"));

  let savingsAccount = new SavingsAccount(0,parseFloat(currentSavingsAccountVisualizing.amount)*lastUSDARSQuotation,parseInt(currentSavingsAccountVisualizing.periodInMonths),parseInt(currentSavingsAccountVisualizing.tnaIndicator));

  // actualizamos el grafico con el nuevo plazo fijo dolarizado

  // manipulamos un poco el DOM

  const chartContainer = document.getElementById('savings-chart');
  let chartCanvas = document.getElementById('savings-chart-canvas');
    
  chartContainer.removeChild(document.getElementById('savings-chart-canvas'))
  chartCanvas = document.createElement("canvas");
  chartCanvas.id = 'savings-chart-canvas';
  chartContainer.appendChild(chartCanvas);

  const labels = createLebelsForChartAccordingToAPeriod(savingsAccount);
  const data = obteinDataForChartAccordingToActualSavingsAccountOverview(savingsAccount);
  let overview =  (document.getElementById("overview"));

  overview.hidden = true;

  // creamos el nuevo grafico
  new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
            label: `Ganancias mensuales (en U$D). última cotización del dólar oficial U$D 1 = AR$ ${((1/lastUSDARSQuotation)/2).toFixed(2)}`, // i divided the result because its the official dollar value not blue and its almost the half lol
            data: data,
            backgroundColor: 'rgb(138, 207, 34)',
            borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  chartContainer.hidden = false;
}