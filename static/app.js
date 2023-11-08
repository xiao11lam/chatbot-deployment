
// Define the submitEmail() function

let isEmail = false;


function submitEmail() {
    // Capture the email entered by the user
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;

    // Replace the button with a "Submit Successfully" message
    const button = document.querySelector('.submit-email-button');
    button.innerHTML = "Submit Successfully";

    // Disable the button so the user cannot click it again
    button.disabled = true;


    // Send the email information to the backend
    fetch('/predict', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {

                console.log('Email information sent to the backend');
                // Add a message to the chatbox
                const emailSentMessage = { name: "Marita", message: "Email information sent to the backend" };
                chatbox.messages.push(emailSentMessage);
                chatbox.updateChatText();

            } else {
                // Handle any errors here
                console.error('Error sending email information to the backend');
            }
        });


}



class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
        this.promptDisplayed = false; // Flag to track if the initial prompt has been shown

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
        if (this.state) {
            chatbox.classList.add('chatbox--active');

            if (!this.promptDisplayed) {
                // Display the initial prompt
                this.messages.push({ name: "Marita", message: "Hi, I am your free virtual health assistant provided by Dr. O’Dwyer from the Beacon Hospital. Please take a moment to read our consent and privacy form at [Consent URL].\n" +
                        "If you agree to the consent and privacy policy and to receive health updates via SMS, please reply 'Y'" });
                this.promptDisplayed = true;
                this.updateChatText(chatbox);
            }
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }


    onSendButton
    (chatbox) {
        var textField = document.getElementById('resultPanel');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        console.log(text1)
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        // console.log(msg1)


        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())


            .then(r => {
                // console.log(r.answer)
                // if (r.answer === "I do not understand...") {
                //     // If the response is "I do not understand...", create an email input form
                //     r.answer = '<div>Leave your email, we will help you:</div>' +
                //         '<input type="email" id="email-input" placeholder="Your email" style="border: 1px solid #f9f9f9; border-radius: 5px; padding: 8px; margin-top: 10px; font-size: 14px; width: 100%; margin-right: 5px;"> ' +
                //         '<button class="submit-email-button" style="background-color: #d8acfc; color: #fff; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;" onclick="submitEmail()">Submit</button>'
                //
                //
                //
                // }
                // if (isEmail == true) {
                //     // If the response is "I do not understand...", create an email input form
                //     r.answer = '<div>Leave computer, we will help you:</div>' +
                //         '<input type="email" id="email-input" placeholder="Your email" style="border: 1px solid #f9f9f9; border-radius: 5px; padding: 8px; margin-top: 10px; font-size: 14px; width: 100%; margin-right: 5px;"> ' +
                //         '<button class="submit-email-button" style="background-color: #d8acfc; color: #fff; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;" onclick="submitEmail()">Submit</button>'
                //
                // }

                let msg2 = { name: "Marita", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

                // console.log(msg2)

            }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });


    }

    // Make sure that this method is working correctly
    updateChatText() {
        if (!this.args.chatBox) {
            console.error('chatBox element is not correctly selected.');
            return;
        }

        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Marita") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = this.args.chatBox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();

// Just show the prompt directly without clicking
chatbox.toggleState(chatbox.args.chatBox);
chatbox.display();