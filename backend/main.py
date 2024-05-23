from flask import Flask, request
from flask_cors import CORS
from scripts import scanner
app = Flask(__name__)
CORS(app)

@app.route("/")
def infos():
  return {
    "API" : "BabaTool",
    "Title" : "Vulnerability scanner"
  }

@app.route("/scan", methods=['POST']) # dans la route / scan on peut soumettre un formulaire
def full_scan():
  # On récupère les données dans le body
  data = request.get_json()
  target_url = data.get("target_url")
  links_to_ignore = data.get("links_to_ignore")
  test_auth = data.get("test_auth")
  auth = data.get("auth_infos")

  vuln_scanner = scanner.Scanner(target_url, links_to_ignore)
  if test_auth and auth == None:
    return {"error" : "You need to pass auth_infos"}
  if test_auth and auth != None:
    vuln_scanner.auth(auth["url"], auth["cred"])
  vuln_scanner.crawl()
  vuln_scanner.run_scanner()
  return vuln_scanner.data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)