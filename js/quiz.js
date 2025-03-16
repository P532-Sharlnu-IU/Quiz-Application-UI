let host = "https://quiz-service-latest-glur.onrender.com";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let quiz = null;
let currentIndex = 0;
let userAnswers = new Map();
let screen = document.getElementById("screen");
let item = document.getElementById("item");
let stepLabel = document.getElementById("stepLabel");
document.getElementById("navigation").classList.add("hide");

startTheQuiz();

async function startTheQuiz() {
    let response = await fetch(host + "/quizzes/" + id);
    quiz = await response.json();
    await displayTheQuestion(0);
}

async function goNext() {
    updateUserAnswers(currentIndex);
    currentIndex += 1;
    if (currentIndex == quiz.questions.length) {
        await displayTheResult();
        document.getElementById("controls").classList.add("hide");
        document.getElementById("navigation").classList.remove("hide");
    } else {
        await displayTheQuestion(currentIndex);
    }
}

function updateUserAnswers(index) {
    let question = quiz.questions[index];
    let form = document.forms[0];
    let formData = new FormData(form);
    // output as an object
    let data = Object.fromEntries(formData);
    switch (data.answer) {
        case "A":
            userAnswers.set(index, question.choices[0]);
            break;
        case "B":
            userAnswers.set(index, question.choices[1]);
            break;
        case "C":
            userAnswers.set(index, question.choices[2]);
            break;
    }
}

async function goBack() {
    currentIndex -= 1;
    if (currentIndex >= 0) {
        await displayTheQuestion(currentIndex);
    }
}

async function displayTheResult() {
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
        let q = quiz.questions[i];
        if (q.answer.trim() == userAnswers.get(i).trim()) {
            score += 1;
        }
    }
    item.innerHTML = "";
    item.innerHTML += `<h4>You completed the quiz ${quiz.title}.</h4>`;
    item.innerHTML += `<h4>You scored ${score} out of ${quiz.questions.length}.</h4>`;
}

async function displayTheQuestion(index) {
    let question = quiz.questions[index];
    await presentTheQuestion(question);
    stepLabel.innerText = `(Question ${index + 1} out of ${quiz.questions.length})`;
    if (index == 0) {
        document.getElementById("backButton").hidden = true;
    } else {
        document.getElementById("backButton").hidden = false;
    }
}

async function presentTheQuestion(question) {
    item.innerHTML = "";
    let div = document.createElement("div");
    div.className = "card";
    let innerHtml = `
     <img src="https://quiz-service-latest-glur.onrender.com/questions/${question.id}/image" alt="question" style="width:100%">
     <div class="container">
       <h4><b>${question.id}</b></h4>
       <p>${question.description}</p>
       <form>
           <input type="radio" id="optionA" name="answer" value="A">
           <label for="optionA" name="optionA">${question.choices[0]}</label><br>

           <input type="radio" id="optionB" name="answer" value="B">
           <label for="optionB" name="optionB">${question.choices[1]}</label><br>

           <input type="radio" id="optionC" name="answer" value="C">
           <label for="optionC" name="optionC">${question.choices[2]}</label><br>
       </form>
     </div>
         `;
    div.innerHTML = innerHtml;
    item.appendChild(div);
}