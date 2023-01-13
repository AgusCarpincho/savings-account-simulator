export class SavingsAccount{

    constructor(anId,anAmount,aPeriodInMonths,aTnaIndicator){
        /* 
        tea = (1 + tna/12)
        */
        if (anAmount <= 0 || aPeriodInMonths <= 0 || aTnaIndicator <= 0) {
            throw new Error(`The input values are invalid. Values: amount:${anAmount} period:${aPeriodInMonths} tna:${aTnaIndicator}`);
        };
        if (Number.isNaN(anAmount) || Number.isNaN(aPeriodInMonths) || Number.isNaN(aTnaIndicator)) {
            throw new Error(`The input values are invalid. Values: amount:${anAmount} period:${aPeriodInMonths} tna:${aTnaIndicator}`);
        };

        if (anAmount>=10000000000) {
            throw new Error("The value of amount exceeds 10.000.000.000,00 which is the maximun limit of amount");
        }
        this.id = anId;
        this.amount = anAmount;
        this.periodInMonths = aPeriodInMonths;
        this.tnaIndicator = aTnaIndicator;
    }
    description(){
        return `Plazo fijo de AR$${this.amount} con TNA del ${this.tnaIndicator}% con vigencia de ${this.periodInMonths} meses`
    }
    proyection(){
        let proyection = parseFloat(parseFloat(this.amount) +parseFloat(this.finalEarnings()));
        return proyection.toFixed(2)
    }
    proyectionForAMonth(){
        return (this.amount * (1 + this.percentageRealInterest()/100)).toFixed(2)
    }
    percentageRealInterest(){
        return (this.tnaIndicator/12*this.periodInMonths).toFixed(2)
    }
    percentageRealInterestByMonth(){
        return (this.percentageRealInterest()/this.periodInMonths).toFixed(2)
    }
    earningsByMonthDataForARecapitalizedSavingsAccount(){
        let data = [];
        let savingsAccountButForSingleMonth = new SavingsAccount("This is an ID",this.amount,1,this.tnaIndicator);

        for (let month = 0; month < this.periodInMonths; month++) {
            data.push(savingsAccountButForSingleMonth.earningsAccordingToASavingsAccountAdjustedForASingleMonth());
            savingsAccountButForSingleMonth = new SavingsAccount("This is an ID",savingsAccountButForSingleMonth.proyectionForAMonth(),1,savingsAccountButForSingleMonth.tnaIndicator);
        }
        return data
    }
    earningsAccordingToASavingsAccountAdjustedForASingleMonth(){
        return this.amount*(this.tnaIndicator/12)/100
    }
    finalEarnings(){
        let data = this.earningsByMonthDataForARecapitalizedSavingsAccount();
        let finalEarnings = 0;
        data.forEach(earningsByMonth => {
            finalEarnings = finalEarnings + earningsByMonth
        });
        return finalEarnings.toFixed(2)
    }
}