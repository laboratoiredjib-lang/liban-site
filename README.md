# Site personnel du Dr Liban Ismail Abdillahi

Site statique (HTML, CSS, JavaScript), sans framework ni serveur applicatif.

## Lancer en local
    cd liban_site
    python -m http.server 8765
puis ouvrir http://localhost:8765 (ouvrir `index.html` directement fonctionne aussi).
Les polices et les équations (KaTeX) sont chargées depuis internet.

## Modifier le contenu
Tout le contenu dynamique est dans `assets/js/data.js` : chiffres clés, axes de recherche,
publications, thèse, doctorants, enseignement, missions, parcours, contact.
Les paragraphes du profil se trouvent dans `index.html`. Les photos sont dans `assets/img/`.
