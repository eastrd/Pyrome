from flask import Flask, request, render_template
from os import getcwd, system, remove
#from html import escape


def GeneratePythonCode(UserCode):
    # Generate Python code with appropriate Error handling from User uploaded code
    PythonCodeBase = """
from os import system as command
nprint = print
from pprint import pprint as print
try:
***CODE GOES HERE***
except Exception as e:
    print("An Error Occurred:\\n\\t" + str(e))
    """
    # print(UserCode.split("\n"))
    UserCode = "\n".join(["\t" + line for line in UserCode.split("\n")])
    return PythonCodeBase.replace("***CODE GOES HERE***", UserCode)


app = Flask(__name__)


@app.route("/run", methods=["POST"])
def run():
    code = request.form["Python"]
    with open("test.py", "w+") as fTemp:
        fTemp.write(GeneratePythonCode(code))
    currentDir = getcwd() + "/"
    print(currentDir)
    system("python " + currentDir + "test.py > " + currentDir + "output.log")
    with open("output.log", "r") as fOut:
        output = fOut.read()
    # Clean up the script file and output log
    remove(currentDir + "test.py")
    remove(currentDir + "output.log")
    return output


@app.route("/load", methods=["POST"])
def load():
    ans = request.form["Script"]
    return ans


app.run(port=80)
