//  Get total cost
let totalCostInput = document.querySelector("#total-cost-input").value;
let totalNights = document.querySelector("#total-nights-for-trip").value;

//  List of people
let personList = [];

let newPayment = 0;
let pplCounter = document.querySelector("#ppl-num");
pplCounter.value = 0;

//  Add a person button
const addPersonBtn = document.querySelector("#add-person");
const exportBtn = document.querySelector("#export-btn")


//  Want to add delete trash can in table
// const deletePersonBtn = document.querySelector("#deletePerson");

//  Event listeners
addPersonBtn.addEventListener("click", addPerson);
exportBtn.addEventListener("click", exportTable);


//  Handle enter button for input
document.getElementById("name-input").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        addPersonBtn.click();
    }
});

document.getElementById("nights-select").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        addPersonBtn.click();
    }
});


//  Handle on change of total cost
document.getElementById("total-cost-input").onchange = function () {
    // console.log("Cost changed...");
    totalCostInput = document.getElementById("total-cost-input").value;

    let costText = "";

    //  Validate the input 
    if (validateTotalCost(totalCostInput)) {
        costText = "";
        document.getElementById("cost-invalid").innerHTML = costText;
        updateTable();
    } else {
        costText = "Cost invalid"
        document.getElementById("cost-invalid").innerHTML = costText;
    }
};


//  TODO need to decide if i want to be able to change the total nights for the trip
//  Problems- tablenights for each person will not be updated
document.getElementById("total-nights-for-trip").onchange = function () {
    totalNights = document.getElementById("total-nights-for-trip").value;
    document.getElementById("total-nights-for-trip").disabled = true;
};

//  Add a person to the table
function addPerson() {
    if (validateInput("Input")) {
        //  get the name and night values from the form
        let nameInput = document.getElementById("name-input").value;
        let nightsInput = document.getElementById("nights-select").value;

        //  Capitalize name
        // nameInput = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
        nameInput = nameInput.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        let person = {
            name: nameInput,
            nights: nightsInput,
            payment: 0,
            adjustment: 0, // The adjustment to be made on the payment
        };

        //  Add to person list
        personList.push(person);

        //  reset the form
        document.getElementById("form-id").reset();

        updateTable();
    }
}

//  Calculate the payment for each person
/*  
    So each person has there nights staying out of the total nights
    The person.payment is then calculated by getting the perNight payment of the trip (without and adjustment)
    Then we add to the nonAdjustmentSum which is the sum of everyone in the groups payment

    With the non adjustment sum we then divide that by the number of people going and add that to each persons final payment
    This ensures everyone pays an equal amount based on their nights that they are staying and the whole cost
    of the trip is covered

    Bc if we just added everyones nonAdjustedPayment with differing lengths of stay the total 
    would come up short to the cost of the trip

*/
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

//  Calculate the adjustment
function calculateAdjustment(nonAdjustmentSum) {
    let adjustmentTotal = totalCostInput - nonAdjustmentSum;
    // console.log("Adjustment Total: " + adjustmentTotal);
    let adjustmentPerPerson = adjustmentTotal / personList.length;

    personList.forEach((person) => {
        person.adjustment = adjustmentPerPerson.toFixed(2);

        // console.log(person);
    });
}

//  Update the table with new array values
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
        for (let i = 0; i < howManyRows; i++) {
            //  Update name and nights as well
            tableBody.rows[i].cells[0].innerHTML = personList[i].name;
            tableBody.rows[i].cells[1].innerHTML = personList[i].nights;

            // console.log("current row: " + i);
            let pymnt = (+personList[i].payment + +personList[i].adjustment).toFixed(
                2
            );
            // console.log("pymnt: "  + pymnt);
            tableBody.rows[i].cells[2].innerHTML = '$ ' + pymnt;
            // console.log("Updating rows..")
        }

        //  If the amount of rows arent equal to the amount of ppl we need to append one
        if (howManyPpl != howManyRows) {
            //  Add the new person to the table
            appendNewRow(howManyPpl);
        }
    }

    //  If there are rows in the table we should add a button that allow the user to export to JSON, csv ...
    if (pplCounter.value > 0) {
        document.getElementById("export-btn").style.display = "block";
    } else {
        document.getElementById("export-btn").style.display = "none";
    }

}

//  Append a new row to the table
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
        "<td class='w-25 align-middle'>" +
        personList[personToAdd].name +
        "</td>" +
        "<td class='w-25 align-middle'>" +
        personList[personToAdd].nights +
        "</td>" +
        "<td class='w-25 align-middle'>" +
        '$ ' + payment +
        "</td>" +
        "<td class='w-25 align-middle'>" +
        "<button class='btn mr-5' onclick='editRow(this)'><i class='bi bi-pen-fill'></i></button>" +
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
    let rowToEdit = row.parentNode.parentNode.rowIndex;

    let personIndex = rowToEdit - 1;

    // console.log("Row to edit: " + rowToEdit);
    $("#editRowModal").modal();

    //  When the modal is opened i need to populate the modal with values from personList at rowIndex -1
    let name = document.getElementById("modal-name-input");
    let nights = document.getElementById("modal-nights-input");

    let saveBtn = document.getElementById("save-edit");

    //  Set the name placeholder to the current name in person list
    name.value = personList[personIndex].name;
    nights.value = personList[personIndex].nights;


    //  Handle enter button
    name.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === "Enter") {
            saveBtn.click();
        }
    });

    nights.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === "Enter") {
            saveBtn.click();
        }
    });


    // Save changes on button press
    saveBtn.onclick = function () {
        if (validateInput("Edit")) {

            // Capitalize name
            name.value = name.value.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            personList[personIndex].name = name.value;
            personList[personIndex].nights = nights.value;

            updateTable();

            $("#editRowModal").modal("hide");
        }
    };
}

//  Delete a person
function deletePerson(row) {
    let index = row.parentNode.parentNode.rowIndex;

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

//  Validate the input of the {addPerson, modalEdit} forms
function validateInput(inputOrEdit) {
    let inputValid = false;
    let validName, validNights;
    let nameText, nightText;

    // console.log(totalNights);

    if (inputOrEdit === "Input") {
        // Validate the input and change those elements in DOM
        let name = document.getElementById("name-input").value;
        let nights = parseInt(document.getElementById("nights-select").value);
        if (!name || !allLetterInput(name)) {
            nameText = "Please enter a valid name";
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
        let name = document.getElementById("modal-name-input").value;
        let nights = parseInt(document.getElementById("modal-nights-input").value);

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

//  Export table to csv file
function exportTable() {

    //  Array to hold output values ( this is just to be able to calculate the payments and not show the adjustments...)
    let exportArray = [];
    let exPerson = ["Name", "Nights", "Payment"];

    exportArray.push(exPerson);

    personList.forEach(person => {

        exPerson = [
            person.name,
            person.nights,
            '$' + (+person.payment + +person.adjustment)
        ]

        exportArray.push(exPerson);
    });

    // console.log(exportArray);

    let csvContent = exportArray.map(e => e.join(",")).join("\n");

    //  TODO make sure this link stays hidden
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
    link.setAttribute('download', 'people.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()

}

//  Validate name is all letters (allowing punctuation)
function allLetterInput(inputText) {
    let letters = /^(\w+\s)*\w.+$/;

    if (inputText.match(letters)) {
        return true;
    } else {
        return false;
    }

}

//  Function validate total cost input
function validateTotalCost(total) {
    if (total.match(/^\d+(\.\d{1,2})?$/)) {
        return true;
    } else {
        return false;
    }
}


//  TODO implement a late addition feature
//  If i get the payments already set for everyone but someone wants to get added late
//  If we have a total payment of 1000
//  5 nights
//  


//  TODO persist data with JSON file
//  This could definitely create some issues
//  Import to table from csv
function importCSV(){
    //  Import button that imports a file

    //  Add the csv values to the person list

    

}



//  TODO Need a reset table button
// TODO see if i can use background colors for buttons. dont forget modal
//  TODO to change the nights we can make it so when the nights are change it gets the difference from the max nights and subtracts from each
//  Will need to handle when the nights for a person hits 0

//  FIXME fix formatting ... ongoing