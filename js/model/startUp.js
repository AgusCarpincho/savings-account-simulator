export function initializeLocalStorageForApplication(){
    (localStorage.getItem("savingsAccounts") == null) ? localStorage.setItem("savingsAccounts",JSON.stringify([])) : console.log("The structures were created previously ...");
    (localStorage.getItem("currentSavingsAccountVisualizing") == null) ? localStorage.setItem("currentSavingsAccountVisualizing",JSON.stringify({})) : console.log("The structures were created previously ...");
}