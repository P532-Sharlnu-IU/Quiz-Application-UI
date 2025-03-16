let host = "http://localhost:8080";
let questions = [];
let list = document.getElementById("list");
let quiz = document.getElementById("quiz");
let quizHeader = document.getElementById("quizHeader");
quizHeader.innerText = `The new quiz(0 questions)`;
let quizId = null;
let quizQuestions = [];

displayTheQuestions();

async function getAll() {
    let response = await fetch(host + "/questions");
    let result = await response.json();
    return result;
}

async function displayTheQuestions() {
    if (questions.length == 0) {
        questions = await getAll();
    }
    list.innerHTML = "";
    for (let question of questions) {
        let div = document.createElement("div");
        div.id = `${question.id}`;
        div.onclick = function () {
            if (div.parentNode.id == "list") {
                quiz.appendChild(div);
                quizQuestions.push(div.id);
            } else {
                list.appendChild(div);
                const index = quizQuestions.indexOf(div.id);
                quizQuestions.splice(index, 1);
            }
            let n = quiz.childElementCount;
            quizHeader.innerText = `The new quiz(${n} questions)`;
            console.log(quizQuestions);
        };
        div.className = "card";
        let innerHtml = `

  <img src="http://localhost:8080/questions/${question.id}/image" alt="question" style="width:100%">
  <div class="container">
    <h4><b>${question.id}</b></h4>
    <p>${question.description}</p>
    <form>
        <input type="radio" id="q${question.id}tionA" name="q2Answer" value="A">
        <label for="q${question.id}ptionA">${question.choices[0]}</label><br>

        <input type="radio" id="q${question.id}ptionB" name="q2Answer" value="B">
        <label for="q${question.id}ptionB">${question.choices[1]}</label><br>

        <input type="radio" id="q${question.id}ptionC" name="q2Answer" value="C">
        <label for="q${question.id}ptionC">${question.choices[2]}</label><br>
    </form>
  </div>

      `;
        div.innerHTML = innerHtml;
        list.appendChild(div);
    }
}

async function saveTheQuiz() {
    let quizTitle = document.getElementById("quizTitle").value;
    let endpoint = "";
    let request = {};
    if (!quizId) {
        endpoint = host + "/quizzes";
        request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "title": quizTitle, "questionIds": quizQuestions }),
        };
    } else {
        endpoint = host + "/quizzes/" + quizId;
        request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "id": quizId, "title": quizTitle, "questionIds": quizQuestions }),
        };
    }

    let response = await fetch(endpoint, request);
    if (response.status == 200) {
        quizId = await response.json();
        alert("The quiz was saved successfully!");
    }
    else {
        alert("The quiz was not saved. Something went wrong.")
    }
}

async function saveTheQuizAndNew() {
    await saveTheQuiz();
    location.href = "createquiz.html";
}