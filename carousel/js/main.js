class Carousel {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} [options.slideToScroll=1] Nombre d'élément à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visibles dans un slide
     * @param {Boolean} [options.loop=false] Doit-on boucler en fin de slides
     */ 
    

    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slideToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []

        //Modif du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel-container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel-item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.moveCallbacks.forEach(cb => cb(0))
        this.onResize()

        //Evenements
        this.root.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }
        })
        window.addEventListener('resize', this.onResize.bind(this))
    }

    /**
     * Applique mes bonnes dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) +'%'
        this.items.forEach(item => {
            item.style.width = (100 / this.slidesVisible) / ratio + '%'
        })
    }


    createNavigation() {
        let nextButton = this.createDivWithClass('carousel-next')
        let prevButton = this.createDivWithClass('carousel-prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel-prev-hidden')
            } else {
                prevButton.classList.remove('carousel-prev-hidden')
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel-next-hidden')
                
            } else {
                nextButton.classList.remove('carousel-next-hidden')            
            }
        })
    }

    next() {
        this.goToItem(this.currentItem + this.slideToScroll)
    }

    prev() {
        this.goToItem(this.currentItem - this.slideToScroll)
    }

    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index 
     */
    goToItem(index) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined) && index > this.currentItem) {
            // + this.options.slideToScroll - this.options.slidesVisible
            if (this.options.loop) {
                index = 0
            } else {
                return
            }
        }
        let translateX = (index * (-100)) / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    onResize () {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(this.currentItem))
        }
    }

    /**
     * @returns {Number}
     */
    get slideToScroll () {
        return this.isMobile ? 1 : this.options.slideToScroll
    }
    
    /**
     * @returns {Number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }
}


document.addEventListener('DOMContentLoaded', function() {
    new Carousel(document.querySelector('#carousel1'), {
        slidesVisible: 3,
        slideToScroll: 2,
        loop: true
    })
    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 2,
        slidesVisible: 2
    })

    new Carousel(document.querySelector('#carousel3'))
})