const answer = Math.floor(Math.random() * 98) + 1;
const input = document.getElementById("number_input");
input.value = "";
const guess_message = document.getElementById("guess_message");
const guesses = document.getElementById("guesses");
const tries_left_messag = document.getElementById("tries_left");
const guess_button = document.getElementById("guess_button");
guess_button.addEventListener('click', submit);
let guesses_list = [];
let tries_left = 7;
let done = false;
function submit(){
    const guess = parseInt(input.value);
    guess_message.style.fontWeight = "bold";
    if(!guess || guess < 1 || guess > 99)
    {
        guess_message.innerHTML = "Enter a value from 1 to 99!";
        guess_message.style.color = "red";
        return;
    }
    if(done)
        return;
    tries_left--;
    done = !tries_left;
    tries_left_messag.innerHTML = "Tries Left: " + tries_left;
    guesses_list.push(" " + guess);
    guesses.innerHTML = "Guesses: " + guesses_list;
    if(guess == answer){
        guess_message.innerHTML = "Correct!";

        guess_message.style.color = "green";
        done = true;
        return;
    }
    guess_message.style.color = "purple";
    if(guess < answer){
        guess_message.innerHTML = "Too small!";
    }
    if(guess > answer){
        guess_message.innerHTML = "Too large!";
    }
    if(!tries_left){
        guess_message.innerHTML = "You lose!";

        guess_message.style.color = "red";
    }
}