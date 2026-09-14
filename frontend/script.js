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

// new Set() creates a collection that stores unique chat IDs with unread AI responses
const unreadChatIds = new Set();

const newChatButton = document.getElementById("newChatButton");

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

    // click is NOT inside the context menu
    && !contextMenu.contains(event.target)

    // ENTIRE SEQUENCE FROM ABOVE
        // IF... the sidebar is open
        // AND the click was outisde the sidebar
        // AND the click was not on the toggle button
        // then close the sidebar
) {
    sidebar.classList.add("collapsed");
    console.log("Closing sidebar");
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

    unreadNotificationsClass = unreadChatIds.has(chatId) ? " unread" : "";

    chatSessionsContainer.innerHTML += `
    
        <div class="chat-session" data-chat-id="${chatId}">
            <span class="chat-title">${title}</span>
            <span class="unread-dot${unreadNotificationsClass}"></span>
        </div>
    `;

    // checks whether this chat ID is stored as unread
    // .has() means check whether that chatId currently exists inside the set
    if (unreadChatIds.has(chatId)) {

        // finds the unread dot inside this specific chat session
        const unreadDot = document.querySelector(

            `.chat-session[data-chat-id="${chatId}"] .unread-dot`
        );

        // makes the stored unread notification visible again
        unreadDot.classList.add("unread");
    }
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

    const response = await fetch("/chat-sessions");

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

            // clears the input box when switching to another chat
            questionInput.value = "";

            askButton.textContent = "Ask";
            askButton.disabled = false;

            document.querySelectorAll(".chat-session").forEach(function(chat) {
                chat.classList.remove("active");
            });

            button.classList.add("active");

            // finds the unread notification dot inside the chat that was just opened
            const unreadDot = button.querySelector(".unread-dot");

            // removes the unread class so the notification dot becomes hidden again
            unreadDot.classList.remove("unread");

            // data-chat-id corresponds to the template literal as HTML attribute NOT CLASS
            currentChatId = parseInt(button.getAttribute("data-chat-id"));

            // removes the opened chat ID from the Set because its response has now been seen
            unreadChatIds.delete(currentChatId);

            const response = await fetch(

            `/chat-sessions/${currentChatId}`
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

// flow goes = no current chat --> blank screen --> no old chat highlighted
newChatButton.addEventListener("click", function() {

    currentChatId = null;

    questionInput.value = "";
    askButton.textContent = "Ask";
    askButton.disabled = false;

    chatContainer.innerHTML = `

        <div class="new-chat-message">
            <h2>New Chat</h2>
            <p>Ask a question to start a conversation</p>
        </div>
    `;

    document.querySelectorAll(".chat-session").forEach(function(button) {

        button.classList.remove("active");
    });

    // physically collapses the sidebar
    sidebar.classList.add("collapsed");

    // moves your header/input bar back to their normal positions
    document.body.classList.remove("sidebar-open");

    questionInput.focus();
});


async function loadHistory() {

    const response = await fetch("/history");

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

        // .value gets the current text entered inside the question input element
        const question = questionInput.value;

        // stores which chat this request started from so changing chats later doesn't change response belongs
        // basically copying the value at this moment 
        let requestChatId = currentChatId;

        // remembers whether this request originally start from the new chat screen
        const requestStartedAsNewChat = requestChatId === null;

        // .trim() removes the whitespace from the beginning/end so blank spaces don't count as question
        if (question.trim() === "") {

            addSystemMessage("Please enter a valid question.");
            return;
        }

        askButton.textContent = "Thinking...";
        askButton.disabled = true;


        // .queryselector() searches the HTML and returns the first element with this class
        // stores the new-chat-message HTML element OR null if it is not on the page
            // const newChatMessage = document.querySelector(".new-chat-message");


        // checks whether newChatMessage actually contains an HTML element
        // if the new chat placeholder exists, run the code inside the braces
        if (currentChatId === null) {

            // = "" replaces everything currently inside the chatContainer
            chatContainer.innerHTML = "";
        }

        // .insertAdjacentHTML("beforeend",...) adds new HTML to the end of chatContainer without
            // replacing its existing contents
        chatContainer.insertAdjacentHTML("beforeend", `
        
            <div class="user-row">
                <div class="user-message">
                    ${question}
                </div>
            </div>
        `);
        
        
        // send the question to the FastAPI backend
        // fetch is like requests.post()
        // send something to this URL which is the FastAPI endpoint
        // send the request... and wait here until the server replies
        const response = await fetch("/ask", {

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
                chat_id: requestChatId
            })
        });

        // this is placed here so not using data from a failed request and stops it before
        // check whether the server responded with an error status
        if (!response.ok) {

            // manually create an error so the catch block handles it
            // something went wrong... stop executing this try block and jump to catch
            throw new Error("Server returned an error.");
        }

        const responseChatId = response.headers.get("X-Chat-Id");

        console.log("Chat ID header from backend:", responseChatId);

        // converts the returned chat ID from text into a number and stores it as request's perm chat ID
        requestChatId = parseInt(responseChatId);

        // only change the currently viewed chat ID if the user has not switched to another chat
        // are we currently starting from new chat, where there wasn't an ID yet?
        // OR
        // are we still looking at the same chat this request belongs to?
        // IF SO then safe to set currentChatId to the returned ID
        if (
            (requestStartedAsNewChat && currentChatId === null) ||
            currentChatId === requestChatId
        ) {

            currentChatId = requestChatId;
        }

        // .body is the response data stream
        // .getReader() is built-in JS method that creates an object used to read data from stream
        const reader = response.body.getReader();

        // TextDecoder is a built-in JS class that converts bytes into readable text
        const decoder = new TextDecoder();

        // creates an empty AI message element that the streamed text will fill
        // refer to definition above for insertAdjacentHTML...
        chatContainer.insertAdjacentHTML("beforeend", `
        
            <div class="ai-row">
                <div class="ai-message streaming-message"></div>
            </div>
        `);

        // querySelector finds the first HTML element with the streaming-message class
        const aiMessage = document.querySelector(".streaming-message");

        // stores all text chunks together as one complete answer
        let fullAnswer = "";

        while (true) {

            // .read() gets the next chunk from the stream
            // value = the chunk of bytes
            // done = boolean saying whether the stream ended
            // waits for the next stream chunk, then stores bytes in VALUE and finished status in DONE
            const { value, done } = await reader.read();

            // ends the loop when the stream is finished
            if (done) {
                break;
            }

            // .decode() converts the byte chunk into text
            // stream: true = tells TextDecoder that more chunks are still coming
            const textChunk = decoder.decode(value, { stream: true });

            fullAnswer += textChunk;

            // marked.parse converts the accumulated Markdown answer into HTML
            aiMessage.innerHTML = marked.parse(fullAnswer);
        };

    // .classList.remove() removes the temporary streaming-message class after AI response finishes
    aiMessage.classList.remove("streaming-message");

    // if the AI response finished in a chat that the user is no longer viewing
    if (currentChatId !== requestChatId) {

        // stores this chat ID in the Set so the app remembers it has an unread AI response
        unreadChatIds.add(requestChatId);
    }

    await loadChatSessions();

    }


    catch (errorObject) {

        // this comes from throw error and shows the message of the errorObject 
        if (errorObject.message === "Server returned an error.") {

            addSystemMessage("The server encountered an error. Please try again.");
        }

        else {

            addSystemMessage("Unable to reach the server.");
        }

        // error prints text with icon and in red in the dev console
        console.error(errorObject);
    }

    finally {

        // only reset the controls if the user is still viewing
            // the same chat that started this request
        if (currentChatId === requestChatId) {
            // change the ask button back 
            askButton.textContent = "Ask";
            askButton.disabled = false;

            // clear the input box
            questionInput.value = "";
        };
    }

});

loadChatSessions();

document.addEventListener("click", function(event) {

    if(!contextMenu.contains(event.target)) {

        contextMenu.style.display = "none";
    }

});


deleteChat.addEventListener("click", async function (event) {

    event.stopPropagation();

    const chatId = parseInt(contextMenu.dataset.chatId);

    await fetch (`/chat-sessions/${chatId}`, {

        method: "DELETE"
    });

    contextMenu.style.display = "none";

    await loadChatSessions();
});

renameChat.addEventListener("click", async function() {

    const chatId = parseInt(contextMenu.dataset.chatId);

    const newTitle = prompt("Enter a new chat title: ");

    await fetch (`/chat-sessions/${chatId}`, {

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