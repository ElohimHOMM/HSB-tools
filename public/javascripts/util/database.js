function readItems() {    
    let items = $.ajax({
        url: "data/items.json",
        dataType: 'json',
        async: false
    }).responseJSON.items;
    return items;
}

function readEnigmas() {    
    let items = $.ajax({
        url: "data/enigma.json",
        dataType: 'json',
        async: false
    }).responseJSON.souls;
    return items;
}