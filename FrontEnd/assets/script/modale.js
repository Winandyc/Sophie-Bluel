// Partie 1: Sélection des éléments DOM pour les boutons de filtre
const btnAll = document.querySelector(".filter__btn-id-null");
const btnId1 = document.querySelector(".filter__btn-id-1");
const btnId2 = document.querySelector(".filter__btn-id-2");
const btnId3 = document.querySelector(".filter__btn-id-3");
const inputFile = document.querySelector(".js-image");
const displayedImage = document.querySelector("#selectedImage");
const inputTitle = document.querySelector(".js-title");
const labelFile = document.querySelector(".form-group-photo label");
const iconeFile = document.querySelector(".fa-image");
const paragraphFile = document.querySelector(".form-group-photo p");
const inputCategory = document.querySelector(".js-categoryId");

const sectionProjets = document.querySelector(".gallery");

let data = null;
let id;
generationProjets(data, null);

// Partie 2: Réinitialisation de la section des projets : pour un code plus propre. cette étape vide la section
// existante pour éviter d'accumuler ou de conserver des éléments de projets précédents. Cela permet de présenter
// uniquement les projets correspondant aux critères du filtre actuel.
function resetSectionProjets() {
    sectionProjets.innerHTML = "";
}

// Partie 3: Fonction pour générer les projets en fonction des données et de l'identifiant de catégorie
async function generationProjets(data, id) { // (id= fait référence à un attribut spécifique associé à chaque projet
    // dans les données récupérées depuis l'API. Exemple : Objets, Appartements, Hôtels et Restaurants : id = 1, 2, 3)
    try {
        // Partie 4: Requête pour récupérer les données des projets depuis l'API
        const response = await fetch('http://localhost:5678/api/works');
        data = await response.json(); // Récupère les données au format JSON
    } catch (e) {
        // Partie 5: Gestion des erreurs de récupération des données (pratique de développement défensive. Sert à
        // améliorer l'expérience utilisateur)
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique aura lieu dans une minute<br><br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site";
        sectionProjets.appendChild(p); // Affichage du message d'erreur dans la section des projets
        await new Promise(resolve => setTimeout(resolve, 60000)); // Attente d'une minute
        window.location.href = "index.html"; // Redirection vers la page d'accueil
    }

    resetSectionProjets(); // Partie 6: Réinitialisation de la section des projets

    // Partie 7: Filtrage des résultats en fonction de l'identifiant de catégorie sélectionné
    if ([1, 2, 3].includes(id)) {
        data = data.filter(data => data.categoryId == id); // (Si la condition précédente est vraie, cela filtre les
        //données (data) pour ne garder que les éléments dont la propriété categoryId est égale à la valeur de id.
        // Cela signifie que seuls les projets ayant le même categoryId que la valeur de id seront conservés dans le tableau data.
    }

    // Partie 8: Mise à jour visuelle du bouton de filtre actif
    // Désactive visuellement tous les boutons de filtre
    document.querySelectorAll(".filter__btn").forEach(btn => {
        btn.classList.remove("filter__btn--active"); // Supprime la classe "filter__btn--active" de chaque bouton
    });

    // Active visuellement le bouton de filtre correspondant à l'ID sélectionné
    document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");
    // Sélectionne le bouton spécifique correspondant à l'ID et ajoute la classe "filter__btn--active" le marquant
    // visuellement comme sélectionné ou actif


    // Partie 9: Vérification s'il y a des projets à afficher ou si les données sont indéfinies
    if (data.length === 0 || data === undefined) {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Aucun projet à afficher <br><br>Toutes nos excuses pour la gêne occasionnée";
        sectionProjets.appendChild(p); // Affichage du message indiquant l'absence de projets
        return;
    }

    // Partie 10: Génération des éléments HTML représentant les projets
    if (id === null || [1, 2, 3].includes(id)) {
        for (let i = 0; i < data.length; i++) {
            // Création d'une balise figure pour chaque projet
            const figure = document.createElement("figure");
            sectionProjets.appendChild(figure); // Ajout à la section des projets

            // Ajout d'une classe spécifique pour un lien vers la modale lors de la suppression
            figure.classList.add(`js-projet-${data[i].id}`);

            // Création d'une balise img pour l'image du projet
            const img = document.createElement("img");
            img.src = data[i].imageUrl; // Définition de l'URL de l'image
            img.alt = data[i].title; // Définition du texte alternatif de l'image
            figure.appendChild(img); // Ajout de l'image à la figure

            // Création d'une balise figcaption pour le titre du projet
            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = data[i].title; // Définition du titre du projet
            figure.appendChild(figcaption); // Ajout du titre à la figure
        }
    }
}

// Partie 11: Écouteurs d'événements pour les filtres de catégorie
btnAll.addEventListener("click", () => {
    generationProjets(data, null); // Afficher tous les projets
});

btnId1.addEventListener("click", () => {
    generationProjets(data, 1); // Filtre pour la catégorie 1 (Objets)
});

btnId2.addEventListener("click", () => {
    generationProjets(data, 2); // Filtre pour la catégorie 2 (Appartements)
});

btnId3.addEventListener("click", () => {
    generationProjets(data, 3); // Filtre pour la catégorie 3 (Hôtels & restaurants)
});





//====================================================================================================================

/////////////////////////////////////////////////////
// Gestion des modules administarteur ///////////////
/////////////////////////////////////////////////////
// INDEX : 1- GESTION BOITE MODALE                 //
//         2- GESTION TOKEN LOGIN                  //
//         3- GENERATION DANS LA MODALE            //
//         4- GESTION SUPPRESSION PROJET           //
//         5- GESTION AJOUT PROJET                 //
/////////////////////////////////////////////////////


//////////////////////////////////////////////////////
// INDEX : 1-// GESTION BOITE MODALE /////////////////
//////////////////////////////////////////////////////

// Reset la section projets
function resetmodaleSectionProjets() {
    modaleSectionProjets.innerHTML = "";
}


// Ouverture de la modale
let modale = null;
let dataAdmin;
const modaleSectionProjets = document.querySelector(".js-admin-projets");

const openModale = function (e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute("href"))

    modaleProjets(); // Génère les projets dans la modale admin
    // attendre la fin de la génération des projets
    setTimeout(() => {
        modale.style.display = null
        modale.removeAttribute("aria-hidden")
        modale.setAttribute("aria-modal", "true")
    }, 25);
    // Ajout EventListener sur les boutons pour ouvrir la modale projet
    document.querySelectorAll(".js-modale-projet").forEach(a => {
        a.addEventListener("click", openModaleProjet)
    });

    // Apl fermeture modale
    modale.addEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
};

// Femerture modale au click extérieur

const modaleClickClose = document.querySelector(".modale")
modaleClickClose.addEventListener("click", () => {
    // console.log("click exterieur modale close")
    modale.style.display = 'none';
})

// Génère les projets dans la modale admin
async function modaleProjets() {
    const response = await fetch('http://localhost:5678/api/works');
    dataAdmin = await response.json();
    resetmodaleSectionProjets()
    for (let i = 0; i < dataAdmin.length; i++) {

        const div = document.createElement("div");
        div.classList.add("gallery__item-modale");
        modaleSectionProjets.appendChild(div);

        const img = document.createElement("img");
        img.src = dataAdmin[i].imageUrl;
        img.alt = dataAdmin[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(dataAdmin[i].id, "js-delete-work"); // GESTION DE SUPPRESION DES ELEMENTS PAR ID
        //Je fais une fonction asynchrone où j'enregistre dans un tableau "dataAdmin" tous les projets (fetch).
        //Je parcours à l'aide d'une boucle "for" chaque élément, individuellement.
        //Pour chaque élément, je créer un <p> (enfant de la div) dans lequel j'attribue une classe qui correspond à l'id de chaque projet et une autre
        //classe : "js-delete-work".

        //Suite ligne 267

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");
        p.appendChild(icon);

        const a = document.createElement("a");
        a.innerHTML = "Éditer";
        div.appendChild(a);
    }
    deleteWorks()
}

// Prévisualisation enlever au click sur flèche retour
const arrowLeft = document.querySelector(".fa-arrow-left")
arrowLeft.addEventListener("click", () => {
    // console.log("fleche retour")
    inputFile.value = ''; // Réinitialise la valeur de l'input file
    inputTitle.value = '';
    displayedImage.style.display = "none"; // Cache l'image sélectionnée
    paragraphFile.style.display = "flex";
    labelFile.style.display = "flex";
    iconeFile.style.display = "flex";
    inputCategory.value = "1";
})

// Prévisualisation enlever au click en dehors de la modale
const clickExt = document.querySelector(".modale-projet")
clickExt.addEventListener("click", () => {
    // console.log("click extérieur")
    inputFile.value = ''; // Réinitialise la valeur de l'input file
    inputTitle.value = '';
    displayedImage.style.display = "none"; // Cache l'image sélectionnée
    paragraphFile.style.display = "flex";
    labelFile.style.display = "flex";
    iconeFile.style.display = "flex";
    inputCategory.value = "1";
})

// Prévisualisation enlever au click sur la croix
const clickClose = document.querySelector(".fa-xmark")
clickClose.addEventListener("click", () => {
    // console.log("click sur la croix")
    inputFile.value = ''; // Réinitialise la valeur de l'input file
    inputTitle.value = '';
    displayedImage.style.display = "none"; // Cache l'image sélectionnée
    paragraphFile.style.display = "flex";
    labelFile.style.display = "flex";
    iconeFile.style.display = "flex";
    inputCategory.value = "1";
})

//  Ferme la modale
const closeModale = function (e) {
    e.preventDefault()
    if (modale === null) return

    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")
    modaleClickClose.style.display = "none"
};

// Définit la "border" du click pour fermer la modale
const stopPropagation = function (e) {
    e.stopPropagation()
};
// Selectionne les éléments qui ouvrent la modale
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
});


////////////////////////////////////////////////////
// INDEX : 2-//// GESTION TOKEN LOGIN //////////////
////////////////////////////////////////////////////

// Récupération du token
const token = localStorage.getItem("token");
const AlredyLogged = document.querySelector(".js-alredy-logged");

adminPanel()
// Gestion de l'affichage des boutons admin
function adminPanel() {
    document.querySelectorAll(".admin__modifer").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            AlredyLogged.innerHTML = "deconnexion";
        }
    });
}
////////////////////////////////////////////////////////////
// INDEX : 3-// GESTION SUPPRESSION D'UN PROJET /////////////
////////////////////////////////////////////////////////////

// Event listener sur les boutons supprimer par apport a leur id
function deleteWorks() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) { //variable i = index pour parcourir mon tableau "btnDelete"

        //Traduction de la ligne ci-dessus (269) : boucle "for" - variable "let" - index initié à 0 - SI mon index est < à la longueur
        //maximale (= "length") de mon tableau "btnDelete", alors index +1.
        //Tant que la condition est TRUE, alors le code est exécuté (ligne 250).

        btnDelete[i].addEventListener("click", deleteProjet); //ajout écouteur au clic sur chaque <p> (car je suis dans une boucle for qui parcourt mon tableau)
        // console.log(btnDelete[i])                     // Pour voir dans la console du navigateur mes <p> (class avec numéros)
    }
}

// Supprimer le projet
async function deleteProjet() {

    console.log("DEBUG DEBUT DE FUNCTION SUPRESSION")
    console.log(this.classList[0])
    console.log(token)

    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
            console.log(response)
            // Token good
            if (response.status === 204) {
                console.log("DEBUG SUPPRESION DU PROJET" + this.classList[0])
                refreshPage(this.classList[0])
            }
            // Token inorrect
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide")
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.log(error)
        })
}

// Rafraichit les projets sans recharger la page
async function refreshPage(i) {
    modaleProjets(); // Re lance une génération des projets dans la modale admin

    // supprime le projet de la page d'accueil
    const projet = document.querySelector(`.js-projet-${i}`);
    projet.style.display = "none";
}


////////////////////////////////////////////////////
// INDEX : 4-/ GESTION BOITE MODALE AJOUT PROJET ///
////////////////////////////////////////////////////

// Ouverture de la modale projet
let modaleProjet = null;
const openModaleProjet = function (e) {
    e.preventDefault()
    modaleProjet = document.querySelector(e.target.getAttribute("href"))

    modaleProjet.style.display = null
    modaleProjet.removeAttribute("aria-hidden")
    modaleProjet.setAttribute("aria-modal", "true")

    // Apl fermeture modale
    modaleProjet.addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
    modaleProjet.querySelector(".js-modale-return").addEventListener("click", backToModale)
};


// Fermeture de la modale projet
const closeModaleProjet = function (e) {
    if (modaleProjet === null) return

    modaleProjet.setAttribute("aria-hidden", "true")
    modaleProjet.removeAttribute("aria-modal")

    modaleProjet.querySelector(".js-modale-close").removeEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)

    modaleProjet.style.display = "none"
    modaleProjet = null

    closeModale(e)
};

// Retour au modale admin
const backToModale = function (e) {
    e.preventDefault()
    modaleProjet.style.display = "none"
    modaleProjet = null
    modaleProjets(dataAdmin)
};


// ////////////////////////////////////////////////////
// // INDEX : 5-/ GESTION AJOUT D'UN PROJET        ////
// ////////////////////////////////////////////////////

// Sélectionne le bouton "Ajouter Projet" dans le document HTML
const btnAjouterProjet = document.querySelector(".js-add-work");

// Ajoute un écouteur d'événement "click" au bouton, déclenchant la fonction addWork
btnAjouterProjet.addEventListener("click", addWork);

// Fonction asynchrone pour ajouter un projet
async function addWork(event) {
    event.preventDefault(); // Empêche le comportement par défaut du clic (rechargement de la page)

    // Récupère les valeurs des champs titre, catégorie et image
    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = selectedImage; // Utilise l'image sélectionnée précédemment

    // Vérifie si des champs sont vides ou si l'image n'est pas sélectionnée
    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs"); // Affiche un message d'alerte
        return; // Arrête l'exécution de la fonction
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide"); // Affiche un message d'alerte pour une catégorie non valide
        return; // Arrête l'exécution de la fonction
    } else {
        try {
            // Crée un objet FormData pour envoyer les données du formulaire
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            // Envoie les données du formulaire vers l'URL spécifiée avec la méthode POST
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Ajoute le token d'autorisation dans les en-têtes
                },
                body: formData, // Utilise les données du formulaire
            });

            // Gère différentes réponses en fonction du code de statut de la réponse HTTP
            if (response.status === 201) {
                alert("Projet ajouté avec succès :)"); // Affiche un message de succès
                modaleProjets(dataAdmin); // Exécute une fonction modale spécifique
                backToModale(event); // Revenir à la modale précédente
                generationProjets(data, null); // Génère des projets avec des données spécifiques
                // Cache les éléments d'interface pour l'ajout de l'image
                const inputFile = document.querySelector(".js-image");
                const displayedImage = document.querySelector("#selectedImage");
                paragraphFile.style.display = "flex";
                labelFile.style.display = "flex";
                iconeFile.style.display = "flex";
                inputFile.value = '';
                inputTitle.value = '';
                inputCategory.value = "1";
                displayedImage.style.display = "none"; // Affiche l'image sélectionnée

            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs"); // Affiche un message si des champs sont manquants
            } else if (response.status === 500) {
                alert("Erreur serveur"); // Affiche un message en cas d'erreur serveur
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet"); // Redirige vers la page de connexion si l'utilisateur n'est pas autorisé
                window.location.href = "login.html";
            }
        } catch (error) {
            // Gestion des erreurs
        }
    }
}

// Fonction pour gérer l'ajout et l'affichage de l'image sélectionnée
let selectedImage = null; // Variable globale pour stocker l'image sélectionnée
// Fonction pour gérer l'ajout et la validation de l'image sélectionnée
function addImage() {
    // Sélection des éléments HTML pour la manipulation de l'image
    const paragraphFile = document.querySelector(".form-group-photo p");
    const labelFile = document.querySelector(".form-group-photo label");
    const iconeFile = document.querySelector(".fa-image");

    // Ajoute un écouteur d'événement sur le changement de l'élément input de type fichier
    inputFile.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0]; // Récupère le fichier sélectionné

        // Validation du type de fichier
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i; // Extensions autorisées
        if (!allowedExtensions.exec(selectedFile.name)) {
            alert("Veuillez sélectionner un fichier au format photo (jpg, jpeg, png, pdf)"); // Affiche un message d'erreur
            inputFile.value = ''; // Réinitialise la valeur de l'input file
            displayedImage.style.display = "none"; // Cache l'image sélectionnée
            return;
        }

        if (selectedFile) {
            // Cache les éléments d'interface pour l'ajout de l'image
            paragraphFile.style.display = "none";
            labelFile.style.display = "none";
            iconeFile.style.display = "none";

            // Crée une URL pour l'image sélectionnée et l'affiche
            const imageUrl = URL.createObjectURL(selectedFile);
            displayedImage.src = imageUrl;
            displayedImage.style.display = "flex"; // Affiche l'image sélectionnée
            selectedImage = selectedFile; // Stocke l'image sélectionnée dans la variable globale
        }
    });
}

addImage(); // Appel de la fonction addImage pour initialiser le comportement de l'ajout d'image
