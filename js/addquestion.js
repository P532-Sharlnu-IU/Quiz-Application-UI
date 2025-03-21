let host = "https://quiz-service-latest-glur.onrender.com";
let questions = [];
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

    let list = document.getElementById("list");
    list.innerHTML = "";

    for (let question of questions) {
        let div = document.createElement("div");
        div.className = "card";
        let innerHtml = `

      <img src="https://quiz-service-latest-glur.onrender.com/questions/${question.id}/image" alt="question" style="width:100%">
      <div class="container">
        <h4><b>${question.id}</b></h4>
        <p>${question.description}</p>
        <form>
            <input type="radio" id="q${question.id}ptionA" name="q2Answer" value="A">
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

function add() {
    let form = document.forms[0];
    let formData = new FormData(form);
    // output as an object
    let data = Object.fromEntries(formData);
    let question = {};
    question.description = data.description;
    question.choices = [data.optionA, data.optionB, data.optionC];
    switch (data.answer) {
        case "A":
            question.answer = data.optionA;
            break;
        case "B":
            question.answer = data.optionB;
            break;
        case "C":
            question.answer = data.optionC;
            break;
    }
    addTheQuestion(question, data.imageFile);
}

async function addTheQuestion(question, imageFile) {
    let message = "";

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
    };
    let response = await fetch(host + "/questions", request);
    if (response.status == 200) {
        let id = await response.json();
        let result = await submitTheImage(id, imageFile);
        if (result) {
            message = "The question was added successfully!";
        } else {
            message =
                "Something went wrong! Question data was saved successfully but question image was not saved.";
        }
    } else {
        console.log(response);
        message = "Something went wrong! Question data could not be saved.";
    }
    alert(message);
    location.href = "addnewquestion.html";
}

async function submitTheImage(id, imageFile) {
    let formData = new FormData();
    formData.append("file", imageFile);
    let request = {
        method: "POST",
        body: formData,
    };
    let response = await fetch(
        host + "/questions/" + id + "/image",
        request
    );
    let result = await response.json();
    return result;
}