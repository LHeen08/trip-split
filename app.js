//  Get total cost
const totalCostInput = document.querySelector("#total-cost-input").value;
const totalNights = document.querySelector("#total-nights-for-trip").value;

//  List of people
let personList = [];

let newPayment = 0;
let pplCounter = document.querySelector("#ppl-num");
pplCounter.value = 0;

//  Add a person button
const addPersonBtn = document.querySelector("#addPerson");

//  Want to add delete trash can in table
// const deletePersonBtn = document.querySelector("#deletePerson");

//  Event listeners
addPersonBtn.addEventListener("click", addPerson);
// deletePersonBtn.addEventListener("click", deletePerson);

//  Add a person to the table
function addPerson() {
    //  Prevent form from submitting
    // event.preventDefault();
    if (validateInput("Input")) {
        //  get the name and night values from the form
        let nameInput = document.querySelector("#name-input").value;
        let nightsInput = document.querySelector("#nights-select").value;

        let person = {
            name: nameInput,
            nights: nightsInput,
            payment: 0,
            adjustment: 0, // The adjustment to be made on the payment
        };

        //  Add to person list
        personList.push(person);
        // console.log(personList.length);
        if (personList.length === 2) {
            // console.log(personList[1]);
        }

        //  reset the form
        document.getElementById("form-id").reset();

        updateTable();
    }
}

//  Calculate the payment for each person
function calculatePaymentForEachPerson() {
    let nightsStaying = 0;
    let nonAdjustmentSum = 0;

    personList.forEach((person) => {
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

    //  Divide the total cost input by the amount of ppl, divide tthat by total nights to get the per night cost
    //  Get the per night cost
    perNight = totalCostInput / numberOfPPl / totalNights;
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

    personList.forEach((person) => {
        person.adjustment = adjustmentPerPerson.toFixed(2);

        // console.log(person);
    });
}

function updateTable() {
    let tableBody = document.getElementById("table-body");

    //  if the personList.length is != to the tableRows.length
    //  if rows == 0 we need to add a row
    let howManyPpl = personList.length;
    let howManyRows = tableBody.rows.length;

    //  Set the number of ppl
    pplCounter.value = howManyPpl;

    //  Calculate the payments for each person
    calculatePaymentForEachPerson();

    //  If there are no rows we need to add a person to the table
    if (howManyRows === 0 && personList != 0) {
        appendNewRow(howManyPpl);
    } else {
        // For each row in the table update the payment
        for (var i = 0; i < howManyRows; i++) {
            //  Update name and nights as well
            tableBody.rows[i].cells[0].innerHTML = personList[i].name;
            tableBody.rows[i].cells[1].innerHTML = personList[i].nights;

            // console.log("current row: " + i);
            let pymnt = (+personList[i].payment + +personList[i].adjustment).toFixed(
                2
            );
            // console.log("pymnt: "  + pymnt);
            tableBody.rows[i].cells[2].innerHTML = pymnt;
            // console.log("Updating rows..")
        }

        //  If the amount of rows arent equal to the amount of ppl we need to append one
        if (howManyPpl != howManyRows) {
            //  Add the new person to the table
            appendNewRow(howManyPpl);
        }
    }

    // howManyRows = tableBody.rows.length;
    // console.log("PersonList length: " + howManyPpl + "\nTable rows: " + howManyRows);
}

function appendNewRow(howManyPpl) {
    //  Get the correct index for the last person in the personList to add to table
    let personToAdd = howManyPpl - 1;

    let payment = (
        +personList[personToAdd].payment + +personList[personToAdd].adjustment
    ).toFixed(2);
    // console.log("payment:>>>>" + payment);

    //  Create a new row
    const newRow = document.createElement("tr");
    newRow.innerHTML =
        "<tr class='d-flex'>" +
        "<td class='col-sm-4'>" +
        personList[personToAdd].name +
        "</td>" +
        "<td class='col-sm-2'>" +
        personList[personToAdd].nights +
        "</td>" +
        "<td class='col-sm-4'>" +
        payment +
        "</td>" +
        "<td class='col-sm-2'>" +
        "<button class='btn' onclick='editRow(this)'><i class='bi bi-pen-fill'></i></button>" +
        "<button class='btn' onclick='deletePerson(this);'><i class='bi bi-trash-fill'></i></button>" +
        "</td>" +
        "</tr>";

    //  Append person to the table
    document.getElementById("table-body").appendChild(newRow);
}

//  Edit name and nights
function editRow(row) {
    //  Get modal from document body
    //  Fill the modal body with correct data from selected row.
    //  Save changes and update the table based on row index
    var rowToEdit = row.parentNode.parentNode.rowIndex;

    let personIndex = rowToEdit - 1;

    console.log("Row to edit: " + rowToEdit);
    $("#editRowModal").modal();

    //  When the modal is opened i need to populate the modal with values from personList at rowIndex -1
    var name = document.getElementById("modal-name-input");
    var nights = document.getElementById("modal-nights-input");

    //  Set the name placeholder to the current name in person list
    name.value = personList[personIndex].name;
    nights.value = personList[personIndex].nights;

    // Save changes on button press
    document.getElementById("save-edit").onclick = function () {
        if (validateInput("Edit")) {
            personList[personIndex].name = name.value;
            personList[personIndex].nights = nights.value;

            // console.log("PersonList: " + "Name: " + personList[0].name + "Nights: " + personList[0].nights);

            updateTable();

            $("#editRowModal").modal("hide");
        }
    };
}

//  Delete a person
function deletePerson(row) {
    var index = row.parentNode.parentNode.rowIndex;

    document
        .getElementById("paymentTable")
        .deleteRow(row.parentElement.parentElement.rowIndex);

    //  Remove that person from the person list as well
    //  array starts at 0 so remove 1 to get correct index
    // tableRows[1,2,3] array[0,1,2]
    personList.splice(index - 1, 1);

    //  When the row is deleted we need to the table
    updateTable();
}

function validateInput(inputOrEdit) {
    var inputValid = false;
    var validName, validNights;
    var nameText, nightText;

    if (inputOrEdit === "Input") {
        // Validate the input and change those elements in DOM
        var name = document.getElementById("name-input").value;
        var nights = parseInt(document.getElementById("nights-select").value);
        if (!name) {
            nameText = "Please enter a name";
            validName = false;
        } else {
            nameText = "";
            validName = true;
        }

        if (isNaN(nights) || nights < 1 || nights > totalNights) {
            nightText = "Invalid nights";
            validNights = false;
        } else {
            nightText = "";
            validNights = true;
        }

        if (validName && validNights) {
            inputValid = true;
        }

        document.getElementById("name-invalid").innerHTML = nameText;
        document.getElementById("number-invalid").innerHTML = nightText;
    } else if (inputOrEdit === "Edit") {
        // Validate the input and change those elements in DOM
        var name = document.getElementById("modal-name-input").value;
        var nights = parseInt(document.getElementById("modal-nights-input").value);

        // TODO make name not huge like 40 chars or something

        if (!name) {
            nameText = "Please enter a name";
            validName = false;
        } else {
            nameText = "";
            validName = true;
        }

        if (isNaN(nights) || nights < 1 || nights > totalNights) {
            nightText = "Invalid nights";
            validNights = false;
        } else {
            nightText = "";
            validNights = true;
        }

        if (validName && validNights) {
            inputValid = true;
        }

        document.getElementById("modal-name-invalid").innerHTML = nameText;
        document.getElementById("modal-number-invalid").innerHTML = nightText;
    }

    return inputValid;
}

//  TODO Need a reset table button
//  TODO Need to implement export to excel, JSON, csv
//  TODO implement a late addition feature

//  FIXME Need a submit button for the total cost and night input
//  FIXME fix formatting