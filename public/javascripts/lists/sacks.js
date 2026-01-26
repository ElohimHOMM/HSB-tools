let rowCounter = 0;

function buildUnsizedTableRow(bag, table) {
    let row = buildRow();

    row.append(buildNameTd(bag.name));
    row.append(buildCheckbox());

    for (let k = 0; k < 5; k++) {
        row.append(buildEmpty());
    }

    table.append(row);
}

function buildMultiSizeTableRow(map, table) {
    map.get("Small").forEach(element => {
        let id = element.id;
        let name = element.name.replace("Small ", "");
        
        let row = buildRow();
        row.append(buildNameTd(name));
        row.append(document.createElement("td"));
        row.append(buildCheckbox("small"))
        if (map.get("Medium").some(e => e.name.includes(name))) {
            row.append(buildCheckbox("medium"))
        } else row.append(buildEmpty());
        if (map.get("Large").some(e => e.name.includes(name))) {
            row.append(buildCheckbox("medium"))
        } else row.append(buildEmpty());
        if (map.get("Extra Large").some(e => e.name.includes(name))) {
            row.append(buildCheckbox("medium"))
        } else row.append(buildEmpty());
        if (map.get("Enchanted").some(e => e.name.includes(name))) {
            row.append(buildCheckbox("medium"))
        } else row.append(buildEmpty());
        table.append(row);
    });
}

function buildRow() {
    let row = document.createElement("tr");
    let th = document.createElement("th");
    th.classList.add("text-center");
    th.setAttribute('scope', 'row');
    th.append(document.createTextNode(++rowCounter));
    row.append(th);
    return row
}

function buildNameTd(name) {
    let nameTd = document.createElement("td");
    nameTd.append(document.createTextNode(name));
    return nameTd
}

function buildCheckbox(size) {
    let td = document.createElement("td");
    td.classList.add("text-center");
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

function mapSacks(items) {
    let ret = Map.groupBy(items, ({name}) => {
        if (!name.match(new RegExp("Extra Large |Large |Medium |Small "))) {
            return "Unsized";
        }
        if (name.includes("Large Enchanted")) {
            return "Enchanted";
        }
        if (name.includes("Extra Large")) {
            return "Extra Large";
        }
        if (name.includes("Large ")) {
            return "Large";
        }
        if (name.includes("Medium")) {
            return "Medium";
        }
        if (name.includes("Small")) {
            return "Small";
        }
    });

    // Sort Method for Debugging Purposes
    // ret.forEach(element => element.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
    return ret;
}

$(function() {
    let itemJson = readItems();
    let filteredItems = itemJson.filter((item) => item.id.includes("SACK") && item.material !== 'INK_SACK' && item.tier !== 'SPECIAL');
    console.log(filteredItems);

    let mappedItems = mapSacks(filteredItems);
    console.log(mappedItems);

    let table = $("#table-container");

    mappedItems.get("Unsized").forEach(unsized_bag => buildUnsizedTableRow(unsized_bag, table));
    buildMultiSizeTableRow(mappedItems, table)
});