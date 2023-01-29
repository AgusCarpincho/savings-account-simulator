import { SavingsAccount } from "../model/savingsAccount.js";
import { dollarizeChartSimulation, initializeShowSavingsChartComponents, showChartSimulationIdentifiedWithId, pesifyChartSimulation } from "../model/savingsChart.js";

export function initializeFormComponents() {
    const calculateButton = document.getElementById("calculateSavingsButton");
    calculateButton.onclick = calculate;

    const cleanOverviewButton = document.getElementById("cleanSavingsButton");
    cleanOverviewButton.onclick = cleanOverview;

    const addSavingsButton = document.getElementById("addSavingsButton");
    addSavingsButton.onclick = addToTable;

    const dollarizeButton = document.getElementById("dollarized-simulation-chart-button");
    dollarizeButton.onclick = dollarizeChartSimulation;

    const pesifyButton = document.getElementById("pesify-simulation-chart-button");
    pesifyButton.onclick = pesifyChartSimulation;
    
    const resultsItems = document.getElementById("resultsItems");

    const savingsAccountsCollectionLiterals = JSON.parse(localStorage.getItem("savingsAccounts"));
    let savingsAccountsCollection = [];
    
    for (const savingAccountLiteral of savingsAccountsCollectionLiterals) {
        savingsAccountsCollection.push(new SavingsAccount(savingAccountLiteral.id,savingAccountLiteral.amount, savingAccountLiteral.periodInMonths, savingAccountLiteral.tnaIndicator));
    }

    for (const savingsAccount of savingsAccountsCollection) {
        let trNode = document.createElement("tr");
        trNode.id = `simulation-${savingsAccount.id}`;
        trNode.innerHTML = `<th scope="row">${savingsAccount.id}</th>
                            <td>AR$ ${savingsAccount.amount}</td>
                            <td>${savingsAccount.percentageRealInterest()}%</td>
                            <td>${savingsAccount.percentageRealInterestByMonth()}%</td>
                            <td colspan="1">AR$ ${savingsAccount.proyection()}</td>
                            <td>AR$ ${savingsAccount.finalEarnings()}</td>
                            <button id="show-savings-chart-simul-${savingsAccount.id}" class="btn btn-primary show-chart-row-simulation-button" type="button">Ver gráfico <i class="fa-solid fa-chart-column"></i></button>
                            <button id="delete-simulation-button-${savingsAccount.id}" class="btn btn-primary delete-row-simulation-button" type="button">
                                <i class="fa-solid fa-trash"></i>
                            </button>`;
        resultsItems.appendChild(trNode);
        (document.getElementById(`delete-simulation-button-${savingsAccount.id}`)).onclick = () => {deleteSavingsAccountSimulationWithId(savingsAccount.id)};
        (document.getElementById(`show-savings-chart-simul-${savingsAccount.id}`)).onclick = () => {showChartSimulationIdentifiedWithId(savingsAccount.id)};
    }
}

function calculate(){

    let amount = document.querySelector("#amountInput").value;
    let tna = document.querySelector("#tnaInput").value;
    let months = document.querySelector("#monthsInput").value;
    const TNA_LIMIT = 150;
    const AMOUNT_LIMIT = 10000000000;
    const MONTHS_LIMIT = 12;
    /* 
        parseFloat(tna) > TNA_LIMIT ||
        parseFloat(tna) > MONTHS_LIMIT ||*/
    
    if(parseFloat(amount).toFixed(2) > AMOUNT_LIMIT){
        swal({
            title: `El monto supera el limite de la aplicación(${AMOUNT_LIMIT}). Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }
    if(parseFloat(amount).toFixed(2) <= 0){
        swal({
            title: `El monto debe ser mayor a cero. Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }
    if(parseFloat(parseFloat(tna)).toFixed(2) > TNA_LIMIT){
        swal({
            title: `La TNA supera el limite actual (${TNA_LIMIT}). Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }
    if(parseFloat(tna).toFixed(2) <= 0){
        swal({
            title: `La TNA debe ser mayor a cero. Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }
    if(parseInt(months) > MONTHS_LIMIT){
        swal({
            title: `El período no puede superar los 12 meses. Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }
    if(parseInt(months) <= 0){
        swal({
            title: `El período no puede ser menor a un mes. Por favor, intente con otro valor.`,
            icon: "warning",
            dangerMode: true,
        });
        return;
    }

    let newSavingsAccount;
    let newId;
    try{
        let savingsAccountCollection = (JSON.parse(localStorage.getItem("savingsAccounts")));
        if(savingsAccountCollection.length > 0){
            newId = (savingsAccountCollection.at(savingsAccountCollection.length - 1)).id + 1;
        }
        else{
            newId = 1;
        }
        newSavingsAccount = new SavingsAccount(newId,parseInt(amount),parseInt(months),parseInt(tna));
    }
    catch(error){
        swal({
            title: `Los datos ingresados son incorrectos o falta alguno de ellos. Por favor, intente nuevamente.`,
            icon: "warning",
            dangerMode: true,
          });
        return;
    }

    const savingsChart = document.querySelector("#savings-chart");
    savingsChart.hidden = true;

    const overviewAmount = document.querySelector("#overviewAmount");
    overviewAmount.innerText = amount;
    
    const overviewPeriodInMonths = document.querySelector("#overviewPeriodInMonths");
    overviewPeriodInMonths.innerText = months;
    
    const overviewFinalInterest = document.querySelector("#overviewFinalInterest");
    overviewFinalInterest.innerText = newSavingsAccount.percentageRealInterest();

    const overviewInterestByMonth = document.querySelector("#overviewInterestByMonth");
    overviewInterestByMonth.innerText = newSavingsAccount.percentageRealInterestByMonth();

    const overviewProyection = document.querySelector("#overviewProyection");
    overviewProyection.innerText = newSavingsAccount.proyection();

    const overviewFinalEarnings = document.querySelector("#overviewFinalEarnings");
    overviewFinalEarnings.innerText = newSavingsAccount.finalEarnings();
    
    const overview = document.querySelector("#overview");
    overview.hidden = false;

    const overviewResults = document.querySelector("#overviewDescription");
    overviewResults.innerText = newSavingsAccount.description();
    
    // we show the back overview results button when calculate
    (document.getElementById('back-overview-results')).hidden = false;

    // i did this because is complex functionality about show both charts in ARS and USD
    localStorage.setItem("currentSavingsAccountVisualizing",JSON.stringify(newSavingsAccount));

    initializeShowSavingsChartComponents(newSavingsAccount);
}

function cleanOverview(){
    const overview = document.querySelector("#overview");
    const savingsChart = document.getElementById('savings-chart');
    savingsChart.hidden = true;
    overview.hidden = true;

    // we clean the form here
    const amountInput = document.getElementById('amountInput');
    const tnaInput = document.getElementById('tnaInput');
    const monthsInput = document.getElementById('monthsInput');

    amountInput.value = "";
    tnaInput.value = "";
    monthsInput.value = "";

    localStorage.setItem("currentSavingsAccountVisualizing",JSON.stringify({}));
}

function deleteSavingsAccountSimulationWithId(aSavingsAccountId){
    
    swal({
        title: `¿Estás seguro de que quieres borrar la simulación ${aSavingsAccountId}?`,
        text: "¡Una vez que la borres no podrás visualizarla nuevamente!",
        icon: "warning",
        buttons: ["No", "Si"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            let savingsAccounts = JSON.parse(localStorage.getItem('savingsAccounts'));
            for (let savingsAccount of savingsAccounts) {
                if(aSavingsAccountId == savingsAccount.id){
                    savingsAccounts = savingsAccounts.filter( savingsAccount => savingsAccount.id != aSavingsAccountId)
                    document.getElementById(`simulation-${aSavingsAccountId}`).remove();
                    localStorage.setItem('savingsAccounts',JSON.stringify(savingsAccounts));
                }
            }
            swal(`La simulación ${aSavingsAccountId} ha sido borrada`, {
            icon: "success",
            });
            return true;
        }else{
            swal("No se ha borrado la simulación");
            return false;
        }
      });
}

function addToTable(){

    const overview = document.querySelector("#overview");
    const savingsChartContainer = document.querySelector("#savings-chart");
    if(overview.hidden == true && savingsChartContainer.hidden == true){
        swal({
            title: "Para poder agregar una simulación debe calcularla previamente",
            icon: "warning",
            dangerMode: true,
          });
        return;
    }

    const resultsTable = document.getElementById("results");
    resultsTable.hidden = false;

    let amount = document.querySelector("#amountInput").value;
    let tna = document.querySelector("#tnaInput").value;
    let months = document.querySelector("#monthsInput").value;
    let newSavingsAccount;
    let savingsAccountCollection = JSON.parse(localStorage.getItem('savingsAccounts'));
    let newId; 

    if(savingsAccountCollection.length > 0){
        newId = (savingsAccountCollection.at(savingsAccountCollection.length - 1).id + 1);
    }
    else{
        newId = 1;
    }

    try{
        newSavingsAccount = new SavingsAccount(newId,parseInt(amount),parseInt(months),parseInt(tna));
        savingsAccountCollection.push(newSavingsAccount);
        localStorage.setItem("savingsAccounts",JSON.stringify(savingsAccountCollection))
    }
    catch(error){
        swal({
            title: "Para poder agregar una simulación debe calcularla previamente",
            icon: "warning",
            dangerMode: true,
          });
        return;
    }

    const resultsItems = document.getElementById("resultsItems");
    const trNode = document.createElement("tr");
    trNode.id = `simulation-${newSavingsAccount.id}`;

    trNode.innerHTML = `<th scope="row">${newSavingsAccount.id}</th>
                        <td>AR$ ${newSavingsAccount.amount}</td>
                        <td>${newSavingsAccount.percentageRealInterest()}%</td>
                        <td>${newSavingsAccount.percentageRealInterestByMonth()}%</td>
                        <td colspan="1">AR$ ${newSavingsAccount.proyection()}</td>
                        <td>AR$ ${newSavingsAccount.finalEarnings()}</td>
                        <button id="show-savings-chart-simul-${newSavingsAccount.id}" class="btn btn-primary show-chart-row-simulation-button" type="button">Ver gráfico <i class="fa-solid fa-chart-column"></i></button>
                        <button id="delete-simulation-button-${newSavingsAccount.id}" class="btn btn-primary delete-row-simulation-button" type="button">
                            <i class="fa-solid fa-trash"></i>
                        </button>`;
    
    resultsItems.appendChild(trNode);
    (document.getElementById(`delete-simulation-button-${newSavingsAccount.id}`)).onclick = () => {deleteSavingsAccountSimulationWithId(newSavingsAccount.id)};
    (document.getElementById(`show-savings-chart-simul-${newSavingsAccount.id}`)).onclick = () => {showChartSimulationIdentifiedWithId(newSavingsAccount.id)};
    overview.hidden = true
}