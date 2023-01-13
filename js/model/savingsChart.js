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
    
    /*      <section id="savings-chart" hidden>
              <canvas id="savings-chart-canvas"></canvas>
            </section> 
    */

    /* Charts configuration */
    
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
        }
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