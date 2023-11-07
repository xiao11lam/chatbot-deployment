from flask import Flask, render_template, request, jsonify

from chat import get_response

app = Flask(__name__)





@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response = get_response(text)

#     if response == "I do not understand...":
#         response = "Leave your email, we will help you?"


    if "@" in text:
        response = "Thank you for your email. We'll be in touch as soon as possible!"



    message = {"answer": response}
    return jsonify(message)

if __name__=="__main__":
    app.run(debug=True)