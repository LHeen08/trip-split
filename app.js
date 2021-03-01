//  Get total cost
const totalCostInput = document.querySelector("#total-cost-input").value;
// console.log(totalCostInput);

let newPayment = 0;
let pplCounter = document.querySelector('#ppl-num');

//  Add a person button
const addPersonBtn = document.querySelector("#addPerson");

//  Want to add delete trash can in table
// const deletePersonBtn = document.querySelector("#deletePerson");

//  Event listeners
addPersonBtn.addEventListener("click", addPerson);
// deletePersonBtn.addEventListener("click", deletePerson);

//  Add a person to the table
function addPerson(event) {

    //  Prevent form from submitting
    event.preventDefault();

    //  get the name and night values from the form
    let nameInput = document.querySelector('#name-input').value;
    let nightsInput = document.querySelector('#nights-select').value;

    //  Create a table row
    const newRow = document.createElement("tr");
    newRow.innerHTML = "<tr>" +
        "<td>" + nameInput + "</td>" +
        "<td>" + nightsInput + "</td>" +
        "<td>" + calculatePayment(nightsInput) + "</td>" +
        "</tr>";


    //  Append person to the table
    document.getElementById("table-body").appendChild(newRow);

    //  reset the form
    document.getElementById("form-id").reset();

    //  Set new payments for each person
    setPaymentsForEachPerson();

}


//  Calculate the payment for the current row
function calculatePayment(nightsInput) {
    //  Set payment = 0 for now
    let payment = 0;

    let numberOfPPl = document.querySelectorAll('#paymentTable tr').length;
    console.log(numberOfPPl);

    //  Set the number of ppl
    pplCounter.value = numberOfPPl;


    //  Divide the total cost input by the amount of ppl
    payment = totalCostInput / numberOfPPl;

    //  Calculate adjustment
    console.log("Nights input: " + nightsInput);


    //  Set the new payment
    newPayment = payment.toFixed(2);

    //  Return the calculated payment
    return payment.toFixed(2);
}


//  This function sets the payments for each person in the table, so the adjustments when someone new is added
function setPaymentsForEachPerson(tableLength) {
    let tbl = document.getElementById("table-body");
    //  Get the third td col
    let targetTDs = tbl.querySelectorAll('tr > td:nth-child(3)');

    for (var i = 0; i < targetTDs.length; i++) {
        // let newPayment = targetTDs[i];
        //  This outputs the payment cost
        targetTDs[i].innerHTML = newPayment;

    }

}

function calculateCorrectCostWithAdjustment(){
    //  Need the totalCost of the trip

    //  Need to calculate the perNight cost
    // let perNightCost = totalCost /

    //  Need to calculate the noAdjustment total

    //  subtract the totalCost from the noAdjustmentTotal

    //  Divide the adjustment by number of people to ge the adjusted cost per person

}