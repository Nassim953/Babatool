# SUJET/RESUME

C'est un projet qui à pour but de développer une toolbox automatique conçue pour simplifier le processus de réalisation de tests d'intrusion en automatisant de nombreuses tâches.

# Lois et décrets


# les besoins pour la toolbox

- découverte de ports et de services
- détection de vulnérabilités
- analyse de la sécurité des mots de passe et la réalisation de tests d'authentification

La toolbox sera capable de fournir des résultats clairs et détaillés, présentés sous forme de rapports et de visualisation graphiques, pour aider les utilisateurs à comprendre les vulnérabilités identifiées et à prendre des mesures pour les corriger.

Le fonctionnement général de la toolbox comprendra les étapes suivantes:

1. Configuration : L'utilisateur configurera la toolbox pour répondre
aux besoins spécifiques du test d'intrusion.
2. Exploration : La toolbox explorera le système cible pour identifier
les ports, les services et les vulnérabilités.
3. Exploitation : La toolbox exploitera les vulnérabilités identifiées
pour obtenir un accès non autorisé au système cible.
4. Post-exploitation : La toolbox effectuera une analyse approfondie
du système cible pour identifier les données sensibles et les
mesures de sécurité en place.
5. Reporting : La toolbox produira des rapports détaillés sur les
résultats des tests d'intrusion et les vulnérabilités identifiées, ainsi
que des visualisations graphiques pour aider les utilisateurs à
comprendre les résultats.

La toolbox automatisée pour les tests d'intrusion développée dans ce projet
offrira plusieurs fonctions principales pour permettre une réalisation complète
et efficace des tests d'intrusion.

1. Découverte de ports et de services : La toolbox explorera le système
cible pour identifier les ports et les services en cours d'exécution. Cela
permettra à l'utilisateur de connaître l'architecture du système cible et
les services disponibles.
2. Détection de vulnérabilités : La toolbox recherchera les vulnérabilités
connues dans les ports et les services identifiés précédemment. Elle
pourra également identifier les vulnérabilités qui n'ont pas été corrigées
par les mises à jour de sécurité.
3. Analyse de la sécurité des mots de passe : La toolbox sera capable
d'analyser la sécurité des mots de passe utilisés pour accéder aux
services du système cible. Elle pourra identifier les mots de passe faibles,
réutilisés et potentiellement compromis.
4. Tests d'authentification : La toolbox pourra réaliser des tests
d'authentification pour vérifier si les identifiants et mots de passe fournis
sont valides.
5. Exploitation de vulnérabilités : La toolbox sera capable d'exploiter les
vulnérabilités identifiées pour obtenir un accès non autorisé au système
cible. Cette fonction sera utilisée pour vérifier l'efficacité des mesures de
sécurité en place et pour identifier les vulnérabilités qui peuvent être
exploitées pour un accès non autorisé.
6. Post-exploitation : La toolbox pourra effectuer une analyse approfondie
du système cible pour identifier les données sensibles et les mesures de
sécurité en place.
7. Reporting : La toolbox produira des rapports détaillés sur les résultats
des tests d'intrusion et les vulnérabilités identifiées, ainsi que des
visualisations graphiques pour aider les utilisateurs à comprendre les
résultats.



Ma tool box va se focaliser sur les sites/serveurs web, je vais dans un premier temps vous expliquer les différentes façons d'intéragir avec un site web.

On peut faire des requetes GET a travers l'url et/ou on manupule le site avec POST
Pour créer un scanner de vulnérabilité il faut pouvoir alller dans toutes les pages possibles
Trouver un moyen d'envoyer des données dans l'application (URL ou form)
Envoyer des payload 
et analyser la réponse


XSS permet d'injecter du code javascript dans un siteweb
types:
Persistent/stored XSS --> store into the db
Reflected XSS --> on an url
ex : Not persistent not stored
only work if the target visits a specially crafted url
http://target.com/page.php?smth=<script>alert('XSS')</script>
DoOM based XSS --> dangeureux

lancer le docker 
docker run -d  -p 5000:5000  my-python-app