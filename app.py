from flask import Flask, render_template, request, jsonify

from chat import get_response

app = Flask(__name__)





@app.get("/")
def index_get():
    return render_template("base.html")


def get_rule_based_response(msg):
    default_answer = '<div>Leave your email, we will help you:</div>' + \
      '<input type="email" id="email-input" placeholder="Your email" style="border: 1px solid #f9f9f9; border-radius: 5px; padding: 8px; margin-top: 10px; font-size: 14px; width: 100%; margin-right: 5px;"> ' + \
      '<button class="submit-email-button" style="background-color: #d8acfc; color: #fff; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;" onclick="submitEmail()">Submit</button>'

    return default_answer

@app.route("/predict", methods=["POST"])
def predict():
    text = request.get_json().get("message")
    response = get_rule_based_response(text)
    data = request.get_json()
    email = data.get("email")
    print(email)

    # Check if email information exists (not an empty string)
    if email:
        # If the email information exists, change the response
        response = "great day"

    message = {"answer": response}
    return jsonify(message)

if __name__=="__main__":
    app.run(debug=True)