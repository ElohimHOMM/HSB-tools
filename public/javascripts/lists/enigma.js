let rowCounter = 0;

function buildUnsizedTableRow(soul, table) {
    let row = buildRow();

    row.append(buildTextTd(soul.name));
    row.append(buildTextTd(soul.x));
    row.append(buildTextTd(soul.y));
    row.append(buildTextTd(soul.z));
    row.append(buildTextTd(soul.zone));
    row.append(buildEmpty());
    row.append(buildCheckboxTd());

    table.append(row);
}

function buildRow() {
    let row = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute('scope', 'row');
    th.append(document.createTextNode(++rowCounter)); // in theory the id is also in the database
    row.append(th);
    return row
}

function buildTextTd(text) {
    let nameTd = document.createElement("td");
    nameTd.append(document.createTextNode(text));
    return nameTd
}

function buildCheckboxTd(size) {
    let td = document.createElement("td");
    let checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "bag-checkbox-" + rowCounter + (size != null ? "-" + size : ""));
    td.appendChild(checkbox);
    return td;
}

function buildEmpty() {
    return document.createElement("td");
}

$(function() {
    let enigmaJson = readEnigmas();
    console.log(enigmaJson);

    let table = $("#table-container");

    enigmaJson.forEach(enigmaSoul => buildUnsizedTableRow(enigmaSoul, table));
});