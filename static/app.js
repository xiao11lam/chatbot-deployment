
// Define the submitEmail() function
function submitEmail() {
    // Capture the email entered by the user
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;

    // Replace the button with a "Submit Successfully" message
    const button = document.querySelector('.submit-email-button');
    button.innerHTML = "Submit Successfully";

    // Disable the button so the user cannot click it again
    button.disabled = true;

    // Hide the email input field
    emailInput.style.display = 'none'; // or you can use emailInput.style.display = 'hidden'; to hide it
}

// Your existing code...



class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        console.log(msg1)

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())



          .then(r => {

          if (r.answer === "I do not understand...") {
              // If the response is "I do not understand...", create an email input form
              r.answer = '<div>Leave your email, we will help you:</div>' +
                  '<input type="email" id="email-input" placeholder="Your email" style="border: 1px solid #f9f9f9; border-radius: 5px; padding: 8px; margin-top: 10px; font-size: 14px; width: 100%; margin-right: 5px;"> ' +
                  '<button class="submit-email-button" style="background-color: #d8acfc; color: #fff; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;" onclick="submitEmail()">Submit</button>'



          }



            let msg2 = { name: "Marita", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

            console.log(msg2)

          }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Marita")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();