const api = "https://eldenring.fanapis.com/api/";

const search_bar = document.getElementById("search_bar");
const search_type = document.getElementById("search_type");
search_type.value = "select";
const items = document.getElementById("items");
const prev_button = document.getElementById("prev_button");
prev_button.style.display = "none";
const next_button = document.getElementById("next_button");
next_button.style.display = "none";


const options = document.getElementById("options");
const ammo_status_option = document.getElementById("ammo_status");
const armor_type_option = document.getElementById("armor_type");
const ash_affinity_option = document.getElementById("ash_affinity");
const item_type_option = document.getElementById("item_type");
const location_option = document.getElementById("location");
const location_option_select = document.getElementById("location_select");
location_option_select.value = "";
const scaling_option = document.getElementById("scaling");

const apply_button = document.getElementById("apply_options");
apply_button.style.display = "none";
const clear_button = document.getElementById("clear_options");
clear_button.style.display = "none";
hide_options();

let page_number = 0;
let api_page_number = 0;
let api_page_numbers = [];

for (input of document.getElementsByTagName("input")) {
    if (input.type == "text")
        input.value = "";
    input.checked = false;
}
async function search_api(type, name) {
    const result = await fetch(api + type + "?name=" + name + "&page=" + api_page_number);
    let json = await result.json();
    return json;
}

function hide_options() {
    for (option of options.children) {
        if (option.innerHTML == "Apply")
            continue;
        option.style.display = "none";
    }
}

function check_weapon(weapon) {
    let scaling_list = ["Str", "Dex", "Int", "Fai", "Arc"];
    let good = false;
    let num_checked = 0;
    for (aspect of scaling_list) {
        good = false;
        num_checked = 0;
        // Check strength 
        for (sc of scaling_option.querySelector("#" + aspect + "_scaling").querySelectorAll("input")) {
            if (!sc.checked)
                continue;
            num_checked++;
            for (weapon_scale of weapon.scalesWith) {
                if (weapon_scale.name == aspect && weapon_scale.scaling == sc.name)
                    good = true;
            }
        }
        if (!good && num_checked)
            return false;
    }

    if (!good)
        return !num_checked;
    good = good || !num_checked;
    return good;
}

function check_ammo(ammo) {
    for (st of ammo_status_option.querySelectorAll("input")) {
        if (!st.checked)
            continue;
        let passive = ammo.passive;
        if (passive[0] == '-' || passive == "None")
            return st.value == "None";
        console.log(passive);
        return (passive.includes(st.value));
    }
    return true;
}

function check_armor(armor) {
    let num_checked = 0;
    for (at of armor_type_option.querySelectorAll("input")) {
        if (!at.checked)
            continue;
        num_checked++;
        if (at.value == armor.category)
            return true;
    }
    return !num_checked;
}

function check_ash(ash) {
    let num_checked = 0;
    for (aa of ash_affinity_option.querySelectorAll("input")) {
        if (!aa.checked)
            continue;
        num_checked++;
        if (aa.value == ash.affinity)
            return true;
    }
    return !num_checked;
}

function check_item(item) {
    for (it of item_type_option.querySelectorAll("input")) {
        if (!it.checked)
            continue;
        return it.value == item.type;
    }
    return true;
}

function check_location(location) {
    return (location_option_select.value == "" || location_option_select.value == location.region);
    // return true;
}

function clear_options() {
    for (opt of options.querySelectorAll("input")) {
        opt.checked = false;
    }
}

async function search() {
    items.innerHTML = "";
    hide_options();
    if (search_type.value == "select") {
        next_button.style.display = "none";
        return;
    }
    apply_button.style.display = "";
    clear_button.style.display = "";
    switch (search_type.value) {
        case "ammos":
            document.getElementById("ammo_status").style.display = "";
            ammo_status_option.style.display = "";
            for (i of ammo_status_option.children)
                i.style.display = "";
            break;
        case "armors":
            armor_type_option.style.display = "";
            for (i of armor_type_option.children)
                i.style.display = "";
            break;
        case "ashes":
            ash_affinity_option.style.display = "";
            for (i of ash_affinity_option.children)
                i.style.display = "";
            break;
        case "items":
            item_type_option.style.display = "";
            for (i of item_type_option.children)
                i.style.display = "";
            break;
        case "locations":
            location_option.style.display = "";
            for (i of location_option.children)
                i.style.display = "";
            break;
        case "shields":
        case "weapons":
            document.getElementById("scaling_title").style.display = "";
            scaling_option.style.display = "";
            for (i of scaling_option.children)
                i.style.display = "";
            break;
        default:
            break;
    }

    // const page_started = page_number;
    do {
        json = await search_api(search_type.value, search_bar.value);
        for (i of json.data) {
            if ((search_type.value == "weapons" || search_type.value == "shields") && !check_weapon(i)) {
                continue;
            }
            if (search_type.value == "ammos" && !check_ammo(i)) {
                continue;
            }
            if (search_type.value == "armors" && !check_armor(i)) {
                continue;
            }
            if (search_type.value == "ashes" && !check_ash(i)) {
                continue;
            }
            if (search_type.value == "items" && !check_item(i)) {
                continue;
            }
            if(search_type.value == "locations" && !check_location(i)){
                continue;
            }
            let item = document.createElement("div");
            item.className = "item";
            let name = document.createElement("h2");
            name.className = "item_name";
            name.innerHTML = i.name;
            item.append(name);
            let img = document.createElement("img");
            img.className = "item_image";
            img.src = i.image;
            img.alt = i.name;
            item.append(img);

            items.append(item);
            let desc = document.createElement("p");
            desc.className = "item_desc";
            desc.innerHTML = i.description;
            if(search_type.value == "npcs"){
                desc.innerHTML = "Location: " + i.location + "\nRole: " + i.role;
            }
            item.append(desc);
        }
        if (items.children.length < 20)
            api_page_number++;
    } while (json.count && items.children.length < 20);
    if (page_number >= api_page_numbers.length)
        api_page_numbers.push(api_page_number);
    // page_number = page_started;
    if (!page_number)
        prev_button.style.display = "none";
    else
        prev_button.style.display = "";
    if (page_number == Math.floor(json.total / 20) || items.children.length < 20)
        next_button.style.display = "none";
    else
        next_button.style.display = "";
}

search_bar.addEventListener("change", function () {
    page_number = 0;
    api_page_number = page_number;
    search();
});
search_type.addEventListener("change", function () {
    page_number = 0;
    api_page_number = page_number;
    search();
});

prev_button.addEventListener("click", function () {
    page_number--;
    api_page_number = api_page_numbers[page_number];
    search();
});
next_button.addEventListener("click", function () {
    page_number++;
    api_page_number++;
    search();
});
apply_button.addEventListener("click", function () {
    page_number = 0;
    api_page_number = page_number;
    search();
});
clear_button.addEventListener("click", function () {
    page_number = 0;
    api_page_number = page_number;
    clear_options();
});