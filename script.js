/*
    FR/

    Programme permettant de zoomer de façon frontale dans plusieurs couches qui sont des divs HTML

    L'ordre dans le HTML défini l'ordre d'apparition des couches et est ensuite automatiquement géré en Javascript

    Seule la sensibilité doit être réglée, elle est signalée plus bas


    EN/

    Program that allows you to zoom in several layers which are HTML divs

    The order in the HTML defines the order layers are displayed, from the deepest to the most superficial,  everything else is automatically managed in Javascript

    Only the sensitivity must be set, it is indicated below


    © Paul Fagot - 2021

*/



//----- VARIABLE GLOBALES -----

// !!!! Reglagle de la sensibilité !!!!
const SENSIBILITE = 0.0005

//tableau contenant l'ensemble des images de la page HTML
const IMAGES = document.querySelectorAll('.image')

//scaling de l'image actuelle
let scale = 1;

//index_cible = index qui avance ou recule pour cibler la dernière image
let index_cible = IMAGES.length-1; //au début il vise la dernière image du tableau 'IMAGES' = la plus proche de l'utilisateur

//variable qui vise la bonne image grâce à l'index cible
let image_cible = IMAGES[index_cible];




//----- FONCTIONS -----


//toujours remplir la page avec les images

function ajustImages(){
    if(window.innerWidth/window.innerHeight > 1.77777777778){ //RATIO 16:9 ou plus large encore

        document.querySelectorAll('img').forEach((layer) => {
            layer.style.width = '100%'; //la width prime
            layer.style.height = 'auto';
        });
    }

    else{
        document.querySelectorAll('img').forEach((layer) => {
            layer.style.width = 'auto';
            layer.style.height = '100%'; //la height prime
        });
    }
}


//à la fin de chaque coup de zoom on check si le zoom est assez grand pour passer à l'image suivante, ou si l'on doit au cotnraire revenir en arrière

function checkOrder(){
    image_cible = IMAGES[index_cible]; //on met à jour constamment l'image en cours selon l'index_cible

    //cas où l'image à dépassé l'écran, besoin de passer à la couche suivante
    if(scale > 3 && index_cible != 0){

        image_cible.classList.add('disabled'); //cacher l'image trop grande
        index_cible -= 1; //passer à l'image du dessous
        image_cible = IMAGES[index_cible]

        scale = 1; //reset le scaling
    }

    //cas où on est revenu en arrière jusqu'à la taille initale, besoin de remonter à la couche précédente
    else if(scale < 1 && index_cible != IMAGES.length-1){

        image_cible.style.transform = 'scale(1)'; //replace précisément l'image à son emplacement d'origine

        index_cible += 1; //repasser à l'iamge du dessus
        image_cible = IMAGES[index_cible];
        image_cible.classList.remove('disabled'); //cacher l'image trop grande

        scale = 3; //reset le scaling

    }

    //cas où on déscroll alors qu'on est déjà au tout début des couches
    else if(scale < 1 && index_cible == IMAGES.length-1){
        scale = 1;

    }
}


//fonction qui zoome dans l'image en cours au wheel (= scroll)

function zoom(event) {
    event.preventDefault();
    console.log(event.deltaY)



    if(index_cible != 0){ //si on est pas à l'image d'arrière plan
        scale -= event.deltaY * -SENSIBILITE; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RÉGLER LA SENSIBILITÉ <<<<<<<<

        // Restrict scale
        scale = Math.min(Math.max(.125, scale), 4);

        // Apply scale transform
        image_cible.style.transform = `scale(${scale})`;
        image_cible.style.filter = 'blur(' + ((Math.exp(scale)) - 3) + 'px)'; //floute de façon exponentielle avec le zoom des IMAGES

        checkOrder(); //appel à la fonction décrite plus haut
    }

    else{
        scale -= event.deltaY * -SENSIBILITE;

        // Restrict scale
        scale = Math.min(Math.max(.125, scale), 4);

        checkOrder(); //appel à la fonction décrite plus haut
    }
}

//pas d'utilisation de deltaY pour compatibilité mobile
function zoomMobile(event) {
    event.preventDefault();

    if(index_cible != 0){ //si on est pas à l'image d'arrière plan
            scale += SENSIBILITE*100;

            // Restrict scale
            scale = Math.min(Math.max(.125, scale), 4);

            // Apply scale transform
            image_cible.style.transform = `scale(${scale})`;
            image_cible.style.filter = 'blur(' + ((Math.exp(scale)) - 3) + 'px)'; //floute de façon exponentielle avec le zoom des IMAGES

            checkOrder(); //appel à la fonction décrite plus haut
        }

        else{
            scale += SENSIBILITE*100;

            // Restrict scale
            scale = Math.min(Math.max(.125, scale), 4);

            checkOrder(); //appel à la fonction décrite plus haut
        }
}


ajustImages();

//puis on met l'event qui détecte le wheel (scroll) et lance toute la chaîne
window.addEventListener('wheel', zoom);

//équivalent mobile
window.addEventListener('touchmove', zoomMobile);


//équivalent mobile
window.addEventListener('resize', ajustImages);
