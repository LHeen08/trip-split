//  Get total cost
const totalCostInput = document.querySelector("#total-cost-input").value;
const totalNights = document.querySelector("#total-nights-for-trip").value;
console.log("Total Cost: " + totalCostInput);


//  List of people
let personList = [];


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

    let person = {
        "name": nameInput,
        "nights": nightsInput,
        "payment": 0,
        "adjustment": 0 // The adjustment to be made on the payment
    }

    // console.log(person.name, person.nights, person.payment);

    // addToTable();

    //  Add to person list
    personList.push(person);
    console.log(personList.length);
    if (personList.length == 2) {
        console.log(personList[1]);
    }

    calculatePaymentForEachPerson();

    //  reset the form
    document.getElementById("form-id").reset();

    updateTable();

}

//  Calculate the payment for each person
function calculatePaymentForEachPerson() {
    let nightsStaying = 0;
    let nonAdjustmentSum = 0;

    personList.forEach(person => {

        nightsStaying = person.nights;
        //  Calculate the payment based on nights stayed
        person.payment = calculatePayment(nightsStaying);
        nonAdjustmentSum += person.payment;
        // console.log(person);

    });

    calculateAdjustment(nonAdjustmentSum);
}

//  Calculate the payment for the current row
function calculatePayment(nightsInput) {

    let perNight = 0;
    let noAdjustmentPayment = 0;

    //  Get the number of people
    let numberOfPPl = personList.length;

    //  Set the number of ppl
    pplCounter.value = numberOfPPl;

    //  Divide the total cost input by the amount of ppl, divide tthat by total nights to get the per night cost
    //  Get the per night cost
    perNight = (totalCostInput / numberOfPPl) / totalNights;
    // console.log(perNight);

    //  Without the adjustment the cost is the perNight * the users selected stay length
    noAdjustmentPayment = perNight * nightsInput;

    //  Round up for money
    noAdjustmentPayment = Math.ceil(noAdjustmentPayment * 100) / 100;

    //  Return the calculated payment
    return noAdjustmentPayment;
}

function calculateAdjustment(nonAdjustmentSum) {

    let adjustmentTotal = totalCostInput - nonAdjustmentSum;
    // console.log("Adjustment Total: " + adjustmentTotal);
    let adjustmentPerPerson = adjustmentTotal / personList.length;

    personList.forEach(person => {
        person.adjustment = adjustmentPerPerson.toFixed(2);

        console.log(person);
    });
}


function updateTable() {

    let tableBody = document.getElementById('table-body');

    //  if the personList.length is != to the tableRows.length
    //  if rows == 0 we need to add a row
    let howManyPpl = personList.length;
    let howManyRows = tableBody.rows.length;

    //  If there are no rows we need to add a person to the table
    if (howManyRows == 0) {

        appendNewRow(howManyPpl);

    } else {

        // For each row in the table update the payment
        for (var i = 0; i < howManyRows; i++) {
            console.log("current row: " + i);
            let pymnt = (+personList[i].payment + +personList[i].adjustment).toFixed(2);
            // console.log("pymnt: "  + pymnt);
            tableBody.rows[i].cells[2].innerHTML = pymnt;
        }

        //  Add the new person to the table
        appendNewRow(howManyPpl);

    }
}

function appendNewRow(howManyPpl) {

    //  Get the correct index for the last person in the personList to add to table
    let personToAdd = howManyPpl - 1;

    let payment =(+personList[personToAdd].payment + +personList[personToAdd].adjustment).toFixed(2);
    console.log("payment:>>>>" + payment);


    //  Create a new row
    const newRow = document.createElement("tr");
    newRow.innerHTML = "<tr>" +
        "<td>" + personList[personToAdd].name + "</td>" +
        "<td>" + personList[personToAdd].nights + "</td>" +
        "<td>" + payment + "</td>" +
        "</tr>";

    //  Append person to the table
    document.getElementById("table-body").appendChild(newRow);
}

// TODO Need to be able to edit and delete
//  TODO NEED to persist data