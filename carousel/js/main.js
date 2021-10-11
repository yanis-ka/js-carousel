class Carousel {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} options.slideToScroll Nombre d'élément à faire défiler
     * @param {Object} options.slidesVisible Nombre d'éléments visibles dans un slide
     * 
     */ 
    

    constructor (element, options = {}) {

    }
}


document.addEventListener('DOMContentLoaded', function() {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 3,
        slidesVisible:3
    })

})