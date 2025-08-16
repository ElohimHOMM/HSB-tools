function readItems() {    
    let items = $.ajax({
        url: "data/items.json",
        dataType: 'json',
        async: false
    }).responseJSON.items;
    return items;
}

function readItems() {    
    let items = $.ajax({
        url: "data/items.json",
        dataType: 'json',
        async: false
    }).responseJSON.items;
    return items;
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