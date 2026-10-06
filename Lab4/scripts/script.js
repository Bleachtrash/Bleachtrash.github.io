const first_name_input = document.getElementById("first_name_input");
const last_name_input = document.getElementById("last_name_input");
const email_input = document.getElementById("email_input");
const phone_number_input = document.getElementById("phone_number_input");
const zip_code_input = document.getElementById("zip_code_input");
const city_p = document.getElementById("city_p");
const lat_p = document.getElementById("lat_p");
const lon_p = document.getElementById("lon_p");
const state_select = document.getElementById("state_select");
const county_select = document.getElementById("county_select");
const username_input = document.getElementById("username_input");
const username_availability = document.getElementById("username_availability");
const password_input = document.getElementById("password_input");
const password_again_input = document.getElementById("password_again_input");
const submit_button = document.getElementById("submit_button");
const password_good = document.getElementById("password_good");
username_availability.style.color = "red";
username_availability.style.fontStyle = "bold";

password_good.style.color = "red";
password_good.style.fontStyle = "bold";

for (let input of document.getElementsByTagName("input")){
    if(input.type == "text")
        input.value = "";
}

async function getCityFromZip(zip) {
    const result = await fetch("https://csumb.space/api/cityInfoAPI.php?zip=" + zip);
    let city_json = await result.json();
    return city_json;
}
async function getStates() {
    const result = await fetch("https://csumb.space/api/allStatesAPI.php");
    let states_json = await result.json();
    return states_json;
}
async function getCountiesFromState(state) {
    const result = await fetch("https://csumb.space/api/countyListAPI.php?state=" + state);
    let counties_json = await result.json();
    return counties_json;
}

async function zip_code_change() {
    if (zip_code_input.value.length != 5) {
        console.log("No long enough!");
        return;
    }
    const city_information = await getCityFromZip(zip_code_input.value);
    city_p.innerHTML += " " + city_information.city;
    lat_p.innerHTML += " " + city_information.latitude;
    lon_p.innerHTML += " " + city_information.longitude;
}
zip_code_input.addEventListener("change", zip_code_change);

async function onLoad(){
    state_select.appendChild(document.createElement("option"));
    const states = await getStates();
    for(let state of states){
        const state_option = document.createElement("option");
        state_option.value = state.usps;
        state_option.innerHTML = state.state;
        state_select.appendChild(state_option);
    }
    const password = await fetch("https://csumb.space/api/suggestedPassword.php?length=6");
    const password_json = await password.json();
    password_input.placeholder = password_json.password;
}
window.addEventListener("load", onLoad);

async function prop_counties() {
    county_select.innerHTML = "";
    const counties = await getCountiesFromState(state_select.value);
    console.log(counties);
    for(let county of counties){
        const county_option = document.createElement("option");
        county_option.value = county.county;
        county_option.innerHTML = county.county;
        county_select.appendChild(county_option);
    }
}
state_select.addEventListener("change", prop_counties);

async function checkUsernameAvailable(){
    const username = username_input.value;
    const result = await fetch("https://csumb.space/api/usernamesAPI.php?username="+username);
    const json = await result.json();
    if(json.available)
        username_availability.innerHTML = "";
    else
        username_availability.innerHTML = "Username not available!";
}

username_input.addEventListener("change", checkUsernameAvailable);

function check_password() {
    const password1 = password_input.value;
    const password2 = password_again_input.value;
    if(password1 != password2)
    {
        password_good.innerHTML = "Passwords must match!";
        return;
    }
    if(password1.length < 6)
    {
        password_good.innerHTML = "Password must be at least 8 letters long!";
        return;
    }

}
password_again_input.addEventListener("change", check_password);