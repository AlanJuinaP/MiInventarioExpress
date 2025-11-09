// Cliente para chat con socket.io
(function(){
    const socket = io();

    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    function appendMessage(m){
        const div = document.createElement('div');
        div.innerHTML = `<strong>${m.user}</strong> <small>${m.time}</small><div>${m.text}</div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // recibir mensajes
    socket.on('chat:message', payload => {
        appendMessage(payload);
    });
    
    // enviar mensajes
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            // user desde session (resuelto en server por la vista)
            let user = 'Anon';
            try {
                if (window.MI_USER && window.MI_USER.username) user = window.MI_USER.username;
            } catch (err){}

            const now = new Date();
            const payload = {
                user,
                text,
                time: now.toLocaleString()
            };
            socket.emit('chat:message', payload);
            chatInput.value = '';
        });
    }
})();