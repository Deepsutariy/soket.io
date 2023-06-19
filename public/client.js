const socket = io()
let nm;

let textarea = document.querySelector('#textarea');
let messagearea = document.querySelector('.message_area');

do {
    nm = prompt('Please enter your name: ')
} while (!nm)

textarea.addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        send_message(event.target.value)
    }
})

function send_message(message) {
    let msg = {
        nick_name: nm,
        message: message.trim()
    }

    //--------------------------------send msg
    append_message(msg, 'outgoing')
    textarea.value = "";
    scrollbottom()

    //send to server via web socket manager
    socket.emit('message', msg)
}

function append_message(msg, type) {
    let main_div = document.createElement('div')
    // let classname = type
    main_div.classList.add(type, 'message')

    let markup = `
    <h4>${msg.nick_name}</h4>
    <p>${msg.message}</p>
    `

    main_div.innerHTML = markup

    messagearea.appendChild(main_div)
}

// -----------------------------------recieve msg

socket.emit('new_user_joined', nm)
// socket.on('user_joined',nm)
socket.on('message', (msg) => {
    append_message(msg, 'incoming')
    scrollbottom()
})


socket.emit('disconnect',nm)

function scrollbottom() {
    messagearea.scrollTop = messagearea.scrollHeight
}