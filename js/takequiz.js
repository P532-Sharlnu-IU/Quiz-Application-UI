let host = "https://quiz-service-latest-glur.onrender.com";
let quizzes = [];
displayTheQuizzes();

async function getAll() {
    let response = await fetch(host + "/quizzes");
    let result = await response.json();
    return result;
}

async function displayTheQuizzes() {
    if (quizzes.length == 0) {
        quizzes = await getAll();
    }

    let list = document.getElementById("list");
    list.innerHTML = "";

    for (let quiz of quizzes) {
        let div = document.createElement("div");
        div.id = `{quiz.id}`;
        div.className = "card";
        div.onclick = function () {
            location.href = `quiz.html?id=${quiz.id}`;
        };
        let innerHtml = `
    <div class="container">
      <h4><b>${quiz.id}</b></h4>
      <p>${quiz.title}</p>
      <p>(${quiz.questionIds.length} questions)</p>
    </div>
        `;
        div.innerHTML = innerHtml;
        list.appendChild(div);
    }
}