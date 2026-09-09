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
    // const answerParagraph = document.getElementById("answer");

const chatContainer = document.getElementById("chatContainer");

const inputBar = document.getElementById("inputBar");

const chatSessionsContainer = document.getElementById("chatSessionsContainer");

const sidebar = document.getElementById("sidebar");

const sidebarToggle = document.getElementById("sidebarToggle");

let currentChatId = null;

const contextMenu = document.getElementById("contextMenu");

const deleteChat = document.getElementById("deleteChat");

const renameChat = document.getElementById("renameChat");



sidebarToggle.addEventListener("click", function () {

    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-open");
});

document.addEventListener("click", function (event) {

    // does the sidebar currently have the collapsed class? 
    // ! flips the answer so if true it is now false
    // its asking... is the sidebar open?
    if (!sidebar.classList.contains("collapsed")

    // does the sidebar contain the element that was clicked? 
    && !sidebar.contains(event.target)

    // the click was NOT on the toggle button
    && !sidebarToggle.contains(event.target) 

    // ENTIRE SEQUENCE FROM ABOVE
        // IF... the sidebar is open
        // AND the click was outisde the sidebar
        // AND the click was not on the toggle button
        // then close the sidebar
) {
    sidebar.classList.add("collapsed");
    document.body.classList.remove("sidebar-open");
}});


function addConversation(question, answer) {

    // += for integers adds them together. for strings, it adds the word to the end
    // ` backtick is the f-string from python 
    // marked.parse creates a <p> so p cant be in another p, line move down and placed in div
    // class="conversation-card" means div belongs to this group. each conv. in loop gets that label
    chatContainer.innerHTML += `

        <div class="user-row">
            <div class="user-message">
                ${question}
            </div>
        </div>

        <div class="ai-row">
            <div class="ai-message">
                ${marked.parse(answer)}
            </div>
        </div>
        `;

    chatContainer.scrollTop = chatContainer.scrollHeight;
}


function addChatSession(chatId, title) {

    chatSessionsContainer.innerHTML += `
    
        <div class="chat-session" data-chat-id="${chatId}">
            ${title}
        </div>
    `;
}


// passes in "Unable to reach the server." from addSystemMessage
function addSystemMessage(message) {

    chatContainer.innerHTML += `

    <div class="system-message">
        ${message}
    </div>
    `;

}


async function loadChatSessions() {

    const response = await fetch("http://127.0.0.1:8000/chat-sessions");

    const chatSessions = await response.json();

    chatSessionsContainer.innerHTML = "";

    for (const chat of chatSessions) {

        addChatSession(
            
            chat.id,
            chat.title
        );
    }

    // .chat-session is corresponding to the CLASS in the template literal
    const chatButtons = document.querySelectorAll(".chat-session");

    for (const button of chatButtons) {

        button.addEventListener("click", async function () {

            document.querySelectorAll(".chat-session").forEach(function(chat) {
                chat.classList.remove("active");
            });

            button.classList.add("active");

            // data-chat-id corresponds to the template literal as HTML attribute NOT CLASS
            currentChatId = parseInt(button.getAttribute("data-chat-id"));

            const response = await fetch(

            `http://127.0.0.1:8000/chat-sessions/${currentChatId}`
        );

        const conversations = await response.json();

        chatContainer.innerHTML = "";

        for (const conversation of conversations) {

            addConversation(

                conversation.question,
                conversation.answer
            );
        }
    });

    button.addEventListener("contextmenu", async function (event) {

        event.preventDefault();
        event.stopPropagation();

        const chatId = parseInt(button.getAttribute("data-chat-id"));

        const menu = document.getElementById("contextMenu");

        // remembers that context menu is currently at chat #7
        menu.dataset.chatId = chatId;

        // move the menu where the mouse already is
        menu.style.left = event.pageX + "px";
        menu.style.top = event.pageY + "px";

        menu.style.display = "block"; 
    });

}}


async function loadHistory() {

    const response = await fetch("http://127.0.0.1:8000/history");

    // json() extract JSON body from response object
    const data = await response.json();

    // innerHTML = everything between the opening and closing HTML tags
    chatContainer.innerHTML = "";

    for (const conversation of data) {

        addConversation(
            conversation.question,
            conversation.answer
        );
    }
}

questionInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        askButton.click();
    }
});


// run this code when the Ask button is clicked
askButton.addEventListener("click", async function () {


    try {

    // store the user's question
    // questionInput references the <input id="question"> element in HTML
    // THEN its asking for the value of question
    // so the HTML question value is contained in the JS variable "question"
    const question = questionInput.value;

    // trim is like python .strip()
    if (question.trim() === "") {

        addSystemMessage("Please enter a valid question.");
        return;
    }

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
            question: question,
            chat_id: currentChatId
        })
    });

    // convert the HTTP response JSON into a JavaScript object
    const data = await response.json();

    currentChatId = data.chat_id;

    // get the answer from the JS object
    const answer = data.answer;

    addConversation(question, answer);

    await loadChatSessions();

    }   


    catch (errorObject) {

        addSystemMessage("Unable to reach the server.")

        // error prints text with icon and in red in the dev console
        console.error(errorObject);
    }

    finally {

    // change the ask button back 
    askButton.textContent = "Ask";
    askButton.disabled = false;

    // clear the input box
    questionInput.value = "";

    }
});

loadChatSessions();

document.addEventListener("click", function(event) {

    if(!contextMenu.contains(event.target)) {

        contextMenu.style.display = "none";
    }

});


deleteChat.addEventListener("click", async function () {

    const chatId = parseInt(contextMenu.dataset.chatId);

    await fetch (`http://127.0.0.1:8000/chat-sessions/${chatId}`, {

        method: "DELETE"
    });

    contextMenu.style.display = "none";

    loadChatSessions();
});

renameChat.addEventListener("click", async function() {

    const chatId = parseInt(contextMenu.dataset.chatId);

    const newTitle = prompt("Enter a new chat title: ");

    await fetch (`http://127.0.0.1:8000/chat-sessions/${chatId}`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json"

            },

            // stringify converts JS object to JSON
            body: JSON.stringify({
                title: newTitle
        })
    });

    loadChatSessions();
})