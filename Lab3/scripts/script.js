let d = new Date();
localStorage.setItem("start_time", d.getTime());
const submit_button = document.getElementById("submit_button");
submit_button.addEventListener('click', submit);
document.getElementById("q2_textbox").value = "";
function suffle_array(array)
{
    for(let i = array.length -1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const q1_options = document.getElementsByName("q1_option");
const q1_answers = ["let", "const", "var"];

function shuffle_q1()
{
    let q1_choices = suffle_array(["let", "var", "const", "int"]);
    for(let choice of q1_choices)
    {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = "q1_option";
        input.value = choice;

        let label = document.createElement("label");
        label.textContent = choice;
        label.prepend(input);
        
        document.getElementById("q1_options").append(label);
        
    }
    console.log(q1_choices);
}
shuffle_q1();

const q2_answer = "arr[2]";
const q3_answer = "true";
const q3_options = document.getElementsByName("q3_option");
for(let opt of q3_options){
    opt.checked = false;
}
const q4_options = document.getElementById("q4_dropdown");
q4_options.value = "";
const q4_answer = "a == b";
const q5_answer = "1995";
const q5_textbox = document.getElementById("q5_textbox");
q5_textbox.value = "";
function submit()
{
    let questions_correct = [true, false, false, false, false];
    // Check question one
    let q1_guesses = [];
    for(let i of q1_options)
    {
        if(i.checked)
        {
            q1_guesses.push(i.value);
        }
    }
    if(questions_correct[0] = (q1_guesses.length == q1_answers.length))
    {
        for(let guess of q1_guesses)
        {
            if(!q1_answers.includes(guess))
                questions_correct[0] = false;
        }
    }
    // Check question 2
    questions_correct[1] = document.getElementById("q2_textbox").value == q2_answer;
    // Check question 3
    for(let i of q3_options)
    {
        if(i.checked && i.value == q3_answer)
        {
            questions_correct[2] = true;
        }
    }
    // Check question 4
    questions_correct[3] = q4_options.value == q4_answer;
    // Check question 5
    questions_correct[4] = q5_textbox.value == q5_answer;
    console.log(questions_correct);

    const questions = document.getElementsByClassName("question");
    var score = 0;
    // Display feedback idk
    for(let i = 0; i < 5; i++)
    {
        score += questions_correct[i];
        let element = document.createElement("div");
        element.style.backgroundColor = questions_correct[i]? "green" : "red";
        element.innerHTML = questions_correct[i]? "Correct!" : "Wrong!";
        element.className = "question_feedback";
        if(!questions[i].getElementsByClassName("question_feedback").length)
            questions[i].append(element);
        else
        {
            questions[i].getElementsByClassName("question_feedback")[0].style.backgroundColor = element.style.backgroundColor;
            questions[i].getElementsByClassName("question_feedback")[0].innerHTML = element.innerHTML;

        }
    }
    score = score/questions_correct.length * 100;
    document.getElementById("score").innerHTML = "Score: " + score + (score >= 80? "! Good Job" : "");
    d = new Date();
    document.getElementById("quiz_time").innerHTML = "You took " + Math.floor((d.getTime() - localStorage.getItem("start_time"))/1000) + " seconds";
}