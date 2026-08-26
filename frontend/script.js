// find the HTML element with ID askButton and store it in the variable askButton
// const = creating a variable
// askButton = variable name
// document = the JS object that represents the entire HTML webpage
// getElementById("askButton") = hey document, go find the element whose ID is askButton
const askButton = document.getElementById("askButton");

// store the question input element from HTML
const questionInput = document.getElementById("question");

// store the answer paragraph element from HTML, this is not the answer text
// answerParagraph is equal to <p id="answer"></p> from HTML
const answerParagraph = document.getElementById("answer");

const historyDiv = document.getElementById("history");


async function loadHistory() {

    const response = await fetch("http://127.0.0.1:8000/history");

    // json() extract JSON body from response object
    const data = await response.json();

    // innerHTML = everything between the opening and closing HTML tags
    historyDiv.innerHTML = "";

    for (const conversation of data) {

        // += for integers adds them together. for strings, it adds the word to the end
        // ` backtick is the f-string from python 
        // marked.parse creates a <p> so p cant be in another p, line move down and placed in div
        // class="conversation-card" means div belongs to this group. each conv. in loop gets that label
        historyDiv.innerHTML += `

        <div class="conversation-card">

            <p><strong>Question:</strong> ${conversation.question}</p>
            <p><strong>Answer:</strong></p>
            ${marked.parse(conversation.answer)}
            </div>
        `;
    }
}

questionInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        askButton.click();
    }
});


// run this code when the Ask button is clicked
askButton.addEventListener("click", async function () {

    // store the user's question
    // questionInput references the <input id="question"> element in HTML
    // THEN its asking for the value of question
    // so the HTML question value is contained in the JS variable "question"
    const question = questionInput.value;

    askButton.textContent = "Thinking...";
    askButton.disabled = true;

    // send the question to the FastAPI backend
    // fetch is like requests.post()
    // send something to this URL which is the FastAPI endpoint
    // send the request... and wait here until the server replies
    const response = await fetch("http://127.0.0.1:8000/ask", {

        // send a POST request by sending data
        method: "POST",

        // headers tells FastAPI we're sending JSON, otherwise FastAPI wouldn't know how to interpret it
        // content type = what type of data is in the body
        // then it would be the body is formatted as JSON
        // application/json is an HTTP standard not JS
        headers: {
            "Content-Type": "application/json"
        },

        // convert the JavaScript object into JSON
        // JSON.stringify means to convert this JS object (question: question) into JSON before sending
        // the body of this HTTP request is this JSON
        body: JSON.stringify({
            question: question
        })
    });

    // convert the HTTP response JSON into a JavaScript object
    const data = await response.json();

    // get the answer from the JS object
    const answer = data.answer;

    // converts the AI's markdown response into HTML, then displays that inside the answer paragraph
    // innerHTML only accepts HTML string, left side produces parsed string for HTML
    answerParagraph.innerHTML = marked.parse(answer);

    // change the ask button back 
    askButton.textContent = "Ask";
    askButton.disabled = false;

    // clear the input box
    questionInput.value = "";

    loadHistory();
});

