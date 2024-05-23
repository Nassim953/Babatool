import requests, time, re, urllib.parse as parse
from bs4 import BeautifulSoup

class Scanner:
  def __init__(self, url, ignore_links) -> None:
    self.session = requests.Session() # Creation d'une session quand on va essayer de se log
    self.target_url = url # Url cible du test
    self.target_links = list() # Liste de toutes les Url trouvées
    self.data = dict() # Données final
    self.links_to_ignore = ignore_links # Liste de liens à ignorer
    pass

  def auth(self, url, dict): # cette fonction va récupérer le fichier texte puis tester chaque mot de passe, elle prend en paramètre l'url cible et le json à envoyer
    self.data["is_auth"] = False
    with open('''./scripts/common.txt''', "r") as wl:
      for line in wl:
        dict["password"] = line.strip() # Strip permet de supprimer tous les espaces
        res = requests.post(url, data=dict) # On envoie les données en faisant une requete
        if "Login failed" not in res.text: # mettre "in" (à la place de "not in" si on decommmente tout)
          # print(f'''[-] {dict["password"]} is invalid password, retrying...''')
        # else:
          # print(f'''[+] {dict["password"]} is the valid password''')
          self.session.post(url, data=dict)
          self.data["is_auth"] = True
          break

  def extract_links_from(self, url): # Ici on récupère tous les liens avec une regex, dans une url cible
    res = self.session.get(url)
    return re.findall('(?:href=")(.*?)"', res.text)

  def crawl(self, url=None ): # cette fonction exécutée en amont (si on essaye pas de se connecter d'abord) permet de récupérer toutes les url présente dans ce site, elle fait un sitemap 
    if url == None: # Lors du premier crawl on ne passe pas d'url donc il prend par defaut la première url qui est celle qu'on entre au début (le site cible)
      url = self.target_url
    links = self.extract_links_from(url) # on récupère tous les liens qu'on trouve sur ce site
    for link in links: # maintenant pour chaque lien trouvé sur ce site on fait une fonction récursive qui va faire la même chose jusqu'a qu'il récupère toutes les urls
      link = parse.urljoin(url, link) # On colle le site racine avec le chemin ex: url = http://abc.com/test/test1.php, link = expl.php --> http://abc.com/test/expl.php
      if "#" in link:
          link = link.split("#")[0] # On ne garde pas ce qu'il y à apres un #
      if self.target_url in link and link not in self.target_links and link not in self.links_to_ignore: # Si l'url de base est dans l'url qu'on test (cela evite de tester des URLs genre blabla.com alors qu'on est sur le site test.com) et que l'url qu'on test n'est pas déjà dans la liste d'url téstée et que le l'url qu'on teste n'est pas dans la liste de liens à ignorer
        self.target_links.append(link) # On ajoute le lien dans les liens à tester
        self.crawl(link) # Et on recommence le crawl avec ce lien 

  def extract_forms(self, url): # Cette fonction récupère seulement les formulaire et le nombre de formulaire par page
    response = self.session.get(url)
    soup = BeautifulSoup(response.content, "lxml")
    nbr_forms = len(soup.find_all("form")) 
    return soup.find_all("form"), nbr_forms

  def test_xss_in_link(self, url): # Cette fonction teste les failles XSS dans un lien 
    xss_test_script = "<sCript>alert('XSS')</scriPt>"
    url = url.replace("=", "=" + xss_test_script)
    res = self.session.get(url)
    return xss_test_script in res.text

  def test_xss_in_form(self, form, url): # Cette fonction teste les failles XSS dans un formulaire 
    xss_test_script = "<sCript>alert('XSS')</scriPt>"
    res = self.submit_form(form, xss_test_script, url)
    return xss_test_script in res.text

  def submit_form(self, form, val, url): # cette fonction soumet un formulaire vers une url
    action = form.get("action")
    post_url = parse.urljoin(url, action)
    method = form.get("method")

    inputs = form.find_all("input")
    data = dict()
    for input in inputs:
      name = input.get("name")
      type = input.get("type")
      value = input.get("value")
      if type == "text":
        value = val
      data[name] = value
    
    if method == "post":
      return self.session.post(post_url, data=data)
    return self.session.get(post_url, params=data)

  def run_scanner(self): # cette fonction run le scanner 
    start = time.time()
    self.data["nbr_links"] = len(self.target_links)
    self.data["links"] = self.target_links
    self.data["nbr_forms"] = 0
    self.data["nbr_xss_in_form"] = 0
    self.data["links_with_vulns"] = list()
    self.data["nbr_xss_in_link"] = 0
    self.data["cves"] = list()
    
    for link in self.target_links:
      forms = self.extract_forms(link)
      self.data["nbr_forms"] += forms[1]
      for form in forms[0]:
        # print("\n\n[+] Testing form in " + link)
        is_vulnerable_to_xss = self.test_xss_in_form(form, link)
        if is_vulnerable_to_xss:
          # print("[+] XSS discovered in" + link + "in the following form")
          # print(form)
          self.data["nbr_xss_in_form"] += 1
          self.data["links_with_vulns"].append(link)
      if "=" in link:
        # print("\n\n[+] Testing " + link)
        is_vulnerable_to_xss = self.test_xss_in_link(link)
        if is_vulnerable_to_xss:
          # print("[+] XSS discovered in" + link)
          self.data["nbr_xss_in_link"] += 1
          self.data["links_with_vulns"].append(link)
    
    self.data["nbr_all_vuln"] = self.data["nbr_xss_in_link"] + self.data["nbr_xss_in_form"]
    if self.data["nbr_all_vuln"] > 0:
      self.data["cves"].append("https://nvd.nist.gov/vuln/detail/cve-2023-30777")
    self.data["exec_time"] = int(time.time() - start)