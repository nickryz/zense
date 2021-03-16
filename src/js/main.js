import TimelineLite from 'gsap/TimelineLite'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import EasePack, { Power1, Elastic } from 'gsap/EasePack'
import AttrPlugin from 'gsap/AttrPlugin'
// import IScroll from 'iscroll/build/iscroll-probe';
import animation from 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
// import addIndicators from 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'
import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic'
import Swiper from 'swiper';
import Counter from './misc/counter';
import AddCart from './misc/addCart';
// import HoverImg from './misc/hoverImg';
import ContactForm from './misc/contactform'
import Tingle from 'tingle.js'
import BeerSlider from 'beerslider'

// import Client from 'shopify-buy';
// import './misc/isMobile';
// import TweenLite from 'gsap/TweenLite';
// import Scrollbar from 'smooth-scrollbar';

// brakepoints
let tabletPr = 992;
let mobileLs = 768;

// start param
let startLoadTime = new Date();
let loadTimer;
let preloader = document.getElementById('preloader');
const body = document.body;
let wrapper = document.getElementById('wrap');
let wW = window.innerWidth;
let wH = window.innerHeight;
let scrollTop;
let page = body.getAttribute('data-pageid');
// let isMobile = isMobile();


// =============== START LISTENERS ==============

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', onLoad);



// ==============================================
// ==================== INIT ====================
// ==============================================

function init () {

    // ==================== PRELOADER (default) ====================

    // preloader.style.display = 'flex';

    // console.log(preloader)
    if(!loadTimer) {
        loadTimer = setTimeout(hidePreloaderLogic.bind(this), 60000)
    }



    // if(wW > mobileLs) {
    //     let round = document.getElementById('round');
    //     document.addEventListener("mousemove", function (e) {
    //         console.dir(e.toElement)
    
    //         let X = e.clientX;
    //         let Y = e.clientY;
    
    //         TweenLite.to(round, 0.5, {
    //             x: X, 
    //             y: Y + window.pageYOffset, 
    //             // ease: Circ.easeOut,
    //             overwrite: 4,
    //             onComplete: () => {
    //                 console.log('yes')
    //             }
    //         })
    //     }, false);
    // }





    
    if(page == 'home') {

        // ==================== SCROLL TO ==================== 

        let scrollTrigers = [].slice.call(document.querySelectorAll('.scroll-triger'));
        if(scrollTrigers.length) {
            for(let i = 0; i < scrollTrigers.length; ++i) {
                scrollTrigers[i].addEventListener('click', function(e){
                    e.preventDefault();
                    let target = e.currentTarget;
                    let link = target.getAttribute('href');
                    if(!link) return;
                    TweenLite.to(window, 1, {
                        scrollTo:link, 
                        onComplete: ()=>{
                            scrollTop = window.pageYOffset || document.documentElement.scrollTop;;
                        }
                    });
                })
            }
        }
    }
 
    // ==================== MOBILE MENU ====================
    
    let burgerElem = document.getElementById('burger-btn');
    let overlay = document.getElementById('overlay');
    let nav = document.getElementById('nav');


    function mobileMenuHandler(e) {
        burgerElem.classList.toggle('clicked');
        overlay.classList.toggle('show');
        nav.classList.toggle('show');
        body.classList.toggle('overflow');
    }

    burgerElem.addEventListener('click', mobileMenuHandler);
    overlay.addEventListener('click', mobileMenuHandler);


    
}




// ==============================================
// ==================== LOAD ====================
// ==============================================

function onLoad() {
    // ==================== SWIPER ====================

    if(page == 'home') {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            watchSlidesVisibility: true,
            preloadImages: false,
            lazy: true, 
            loop: true, 
            spaceBetween: 80,
            loopedSlides: 3,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-btn',
            },
            breakpoints: {
                1199: {
                    spaceBetween: 40,
                    centeredSlides: true,  
                },
                992: {
                    centeredSlides: true,
                    slidesPerGroup: 1,
                    spaceBetween: 20  
                },    
                576: {
                    centeredSlides: true,
                    spaceBetween: 20
                },
                470: {
                    centeredSlides: true,
                    spaceBetween: 0
                }
                }
            }); 
    }          
    
    
    // ==============================================
    // ================= SHOP LOGIC =================
    // ==============================================

    
    // ==================== LOAD PRODUCT INFO ====================

    let root = (page == 'home') ? "./" : "../";
    let products;

    if(page == 'shop' || page == 'orders') {
        
        fetch(root + 'db/products.json').then(function(response) {
            return response.json();
        })
        .then(function(productList) {
            products = productList.products;
        })
        .then(()=> {
            if(page == 'shop') {
                renderProductList();
            } else if (page == 'orders') {
                renderOrderList();
            }
        })
    }

    // ==================== RENDER PRODUCT LIST ON ORDER PAGE ====================

    function renderOrderList() {
        let cartList = (window.localStorage.getItem('orderList')) ? JSON.parse(window.localStorage.getItem('orderList')) : false;
        if(!cartList) return;

        let productList = document.getElementById('items-list');
        let templateItem = document.getElementById('product-item');
        
        for(let product in cartList) {
            let productRow = templateItem.content.cloneNode(true);
            
            // product ID
            productRow.querySelector('[data-product-id]').setAttribute('data-product-id', product);
            // title
            productRow.querySelector('[data-title]').innerHTML = products[product].title;
            // qty
            productRow.querySelector('[data-qty]').innerHTML = cartList[product];
            // price
            productRow.querySelector('[data-price]').innerHTML = products[product].currency + products[product].price;
            // full price
            productRow.querySelector('[data-full-price]').innerHTML = products[product].currency + products[product].price * cartList[product];
            // img
            productRow.querySelector('[data-img-src]').setAttribute('src', root + products[product].images.order);
            // remove btn ID link
            productRow.querySelector('[data-remove-btn]').setAttribute('href', '#' + product);
            
            // set in list
            productList.appendChild(productRow)
        }


        // calculate full price
        let fullPriceContainer = document.getElementById('full-price');
        function calcFullPrice() { 
            let fullSum = 0;
            let currency = '';

            for(let product in cartList) {
                let itemSum = cartList[product] * products[product].price;
                fullSum += itemSum;
                if(!currency) {
                    currency = products[product].currency;
                } 
            }
            fullPriceContainer.innerHTML = currency + fullSum;
        }
        calcFullPrice();

        // remove from cart
        let removeItemBtns = [].slice.call(document.querySelectorAll('[data-remove-btn]'));
        for(let i = 0; i < removeItemBtns.length; ++i) {
            removeItemBtns[i].addEventListener('click', removeItem);
        }

        function removeItem(e) {
            e.preventDefault();
            let target = e.currentTarget;
            let idLink = e.currentTarget.getAttribute('href').slice(1);
            let elToRemove = document.querySelector(`[data-product-id="${idLink}"]`);
            elToRemove.parentElement.removeChild(elToRemove);
            removeFromLocalStorage(idLink);
            calcFullPrice();
            window.orderLogic.updateOrderSum();
        }

        function removeFromLocalStorage(key) {
            delete cartList[key];
            window.localStorage.setItem("orderList", JSON.stringify(cartList));
        }


        // order btn

        let orderBtn = document.getElementById('order-btn');

        if(orderBtn) {
            orderBtn.addEventListener('click', function(e){
                let target = e.target;
                let link = target.getAttribute('href');

                if(!link || link == '#') {

                    e.preventDefault();
                    let formLink = 'https://shop.thezense.com/cart/';
    
                    for(let product in cartList) {
                        let stroke = product + ":" + cartList[product] + ",";
                        formLink += stroke;
                    }
                    // console.log(formLink.slice(0,-1))
                    window.open(formLink.slice(0, -1), '_blank');
                }

            })
        }
    }

    // ==================== RENDER PRODUCT LIST ON SHOP PAGE ====================

    function renderProductList() {
        let productList = document.getElementById('product-list');
        let templateItem = document.getElementById('product-item');

        for(let product in products) {

            let productItem = templateItem.content.cloneNode(true);
                // title
                productItem.querySelector('[data-title]').innerHTML = products[product].title;
                // dscr
                let dscrBox = productItem.querySelector('[data-content-box]')
                for(let i = 0; i < products[product].dscr.length; ++i) {
                    let dscrP = document.createElement('div');
                        dscrP.classList.add('table__content');
                        dscrP.innerHTML = products[product].dscr[i];
                    dscrBox.appendChild(dscrP);
                }
                // video link
                let videoTriger = productItem.querySelector('[data-video-src]');
                if(products[product].videosrc) {
                    videoTriger.setAttribute('data-video-src', products[product].videosrc);
                } else {
                    videoTriger.parentElement.removeChild(videoTriger) 
                }
                // price
                productItem.querySelector('[data-price]').innerHTML = products[product].currency + products[product].price;
                // product ID (add to cart btn)
                productItem.querySelector('[data-product-id]').setAttribute('data-product-id', product);
                // counter input ID
                productItem.querySelector('.counter-input').setAttribute('id', product);
                // faq text
                let faqBox = productItem.querySelector('[data-faq-box]')
                if(products[product].faq) {
                    for(let i = 0; i < products[product].faq.length; ++i) {
                        let faqTitle = document.createElement('div');
                            faqTitle.classList.add('info-dscr__text', 'bold');
                            faqTitle.innerHTML = products[product].faq[i].quest;
                        faqBox.appendChild(faqTitle);
    
                        let answersList = products[product].faq[i].answer;
                        if(answersList) {
                            for(let t = 0; t < answersList.length; ++t) {
                                let faqP = document.createElement('div');
                                    faqP.classList.add('info-dscr__text');
                                    faqP.innerHTML = answersList[t];
                                faqBox.appendChild(faqP);
                            }
                        }
                            
                    }
                }
                // ingredients list
                let ingriBox = productItem.querySelector('[data-ingredients-list]')
                if(products[product].ingredients) {
                    for(let i = 0; i < products[product].ingredients.length; ++i) {
                        let ingriP = document.createElement('li');
                            // ingri.classList.add('info-dscr__text');
                            ingriP.innerHTML = products[product].ingredients[i];
                        ingriBox.appendChild(ingriP);
                    }
                } else {
                    let triger = productItem.querySelector('.ingrid-triger');
                    triger.parentElement.removeChild(triger)
                }
                // images
                productItem.querySelector('[media="(max-width: 576px)"]').setAttribute('srcset', root + products[product].images.sm);
                productItem.querySelector('[media="(max-width: 992px)"]').setAttribute('srcset', root + products[product].images.md);
                productItem.querySelector('[data-img-origin]').setAttribute('srcset', root + products[product].images.lg);
                productItem.querySelector('[data-img-default]').setAttribute('srcset', root + products[product].images.default);
                // btn status
                if(!products[product].isAvailable) {
                    let btn = productItem.querySelector('.accent-btn');
                        btn.innerHTML = 'OUT OF STOCK'
                        btn.classList.add('disable');
                }
                // set in list
                productList.appendChild(productItem)    
        }
        
            // add counters logic
            let counters = [].slice.call(document.querySelectorAll('.counter'));  
            let activeCounters = [];  
            if(counters.length) {    
                for(let i = 0; i < counters.length; ++i) {
                    let counter = new Counter(counters[i]);    
                    activeCounters.push(counter);     
                }
            } 
        

        // add btns trigers (order now, continue shop)
        let btns

        // add cart trigers 
            let addCartBtns = [].slice.call(document.querySelectorAll('[data-product-id]'));  
            let activeCartBtns = [];  
            if(addCartBtns.length) {   
                for(let i = 0; i < addCartBtns.length; ++i) {
                    let btn = new AddCart(addCartBtns[i]);       
                    activeCartBtns.push(btn);     
                }
            } 


            let modalInfoTrigers = [].slice.call(document.querySelectorAll('.table__dscr-col'));

            if(modalInfoTrigers.length) {
            

            // add popups Video and main-info
            
            // video
            var modal = new Tingle.modal({
                closeMethods: ['overlay', 'button'],
                closeLabel: "Close",
                cssClass: ['modal-frame'],
                onOpen: function() {  
                },
                onClose: function() {
                    modal.setContent('')   
                }
            });

            function setVideo(template, target) {
                let contentHTML = template.cloneNode(true);
                let iframeSrc = contentHTML.querySelector('iframe');
                let link = target.getAttribute('data-video-src');
                if(link) {
                    iframeSrc.src = link; 
                    modal.setContent(contentHTML);  
                }
            } 
            // video - end


            for(let i = 0; i < modalInfoTrigers.length; ++i) {
                modalInfoTrigers[i].addEventListener('click', function(e){
                    let target = e.target;
                    console.log(e.currentTarget)

                    if(target.classList.contains('modal-triger')) {
                        let videoContainer = document.getElementById('video-content');
                        setVideo(videoContainer.content, target);
                        modal.open();
                    } else if (target.classList.contains('faq-triger')) {
                        let infoW = e.currentTarget.querySelector('[data-faq-dscr]');
                        infoW.classList.add('opened');
                    } else if (target.classList.contains('ingrid-triger')) {
                        let infoW = e.currentTarget.querySelector('[data-ingrid-dscr]');
                        infoW.classList.add('opened');
                    } else if (target.classList.contains('info-dscr__close')) {
                        target.parentElement.classList.remove('opened');
                    } else if (target.classList.contains('continue')) {
                        e.preventDefault();
                        e.currentTarget.querySelector('.message').classList.remove('opened');
                    }
                })
            }
        }

      
    }
    
    
    // ==================== CART ==================== 

    // update qty in cart container (global)

    window.orderLogic = { 
        updateOrderSum: function() { 
            let container = document.getElementById('dot');
            let ordersListJSON = window.localStorage.getItem('orderList');
            if(!ordersListJSON) return;
            let ordersList = (ordersListJSON) ? JSON.parse(ordersListJSON) : false;
            let sum = 0;
            
            for (let product in ordersList) {
                sum += ordersList[product];
            } 
            if(sum > 0) {
                if(container.classList.contains('active')) {
                    container.innerHTML = ((sum + '').length > 2) ? "$" : sum;
                } else {
                    let addQty = function() {
                        container.innerHTML = ((sum + '').length > 2) ? "$" : sum;
                        container.removeEventListener('transitionend', addQty)
                    }   
                    
                    container.addEventListener('transitionend', addQty);
                    container.classList.add('active');
                }

            } else {

                if(container.classList.contains('active')) {
                    container.innerHTML = '';
                    container.classList.remove('active');
                }
            }
        }
    }
    window.orderLogic.updateOrderSum();

    // ==================== SCROLL MAGIC ====================

    // start params
    const controller = new ScrollMagic.Controller({
        // container: '#wrap',
        // refreshInterval: 50
    });
    let scenes = [];
    let activeScenes = [];

    // => FIXED MENU
    let headerEl = document.getElementById('main-header');

    scenes.push(function(){
        let paddingOffset = 16;
        
        return new ScrollMagic.Scene({
            offset: paddingOffset 
        })
        .setClassToggle('#main-header', 'full')
        .addTo(controller);

    });
    
    // HOME PAGE scenes

    if(page == 'home') {

    
        if(page == 'home') {
            
            // => TOP SECTION
            let topSection = document.querySelector('.top-section');
            
            // letters animation
            /*         
                    scenes.push(function(){
                        if(wW < mobileLs) return;
                        let wordsList = [].slice.call(document.querySelectorAll('.top-section .word'));
                        let tween = new TimelineLite();
                        
                        for(let i = 0; i < wordsList.length; ++i) {
                            let letters = [].slice.call(wordsList[i].querySelectorAll('.animated-letters'));
                            tween.staggerFromTo(letters, 0.5, {y: '100%'}, {y: '0%', ease: Power4.easeOut}, 0.05, 0);
                        }
                        return new ScrollMagic.Scene({
                            triggerElement: topSection, 
                        })
                        .setTween(tween)
                        .addTo(controller);
                    });
            */
    
            // => SECTION 1 
            let section1 = document.querySelector('.section--1')
            // scale
            scenes.push(function(){ 
                // if(wW < mobileLs) return;
                let tween = new TimelineLite()
                        .fromTo(".section--1 .parallax-img", 0.3, {scale: 0.8, y: (wW < mobileLs) ? 0 : '-50%'}, {scale: 1, y: (wW < mobileLs) ? 0 : '-50%', ease: Power0.easeNone}, 0)
                return new ScrollMagic.Scene({
                    triggerElement: section1, 
                    duration: (wW < mobileLs) ? 0 : section1.clientHeight / 2
                })
                .setTween(tween)
                .addTo(controller);
            });
    
            // => SECTION 2
            let section2 = document.querySelector('.section--2')
            // scale
            scenes.push(function(){
                // if(wW < mobileLs) return;
                let tween = new TimelineLite()
                    .fromTo(".section--2 .parallax-img", 0.3, {scale: 0.8}, {scale: 1,ease: Power0.easeNone}, 0)
                return new ScrollMagic.Scene({
                    triggerElement: section2, 
                    duration: (wW < mobileLs) ? 0 : section2.clientHeight / 2
                })
                .setTween(tween)
                .addTo(controller);
            });
    
            // => SECTION 3
            let section3 = document.querySelector('.section--3')
            // scrolling section
            scenes.push(function(){
                if(wW < mobileLs) return;
                let scrollContainer = document.querySelector('.section__text-scroll-outer');
                let scrollLay = document.querySelector('.section__text-scroll-inner');
                let scrollTl = new TimelineLite()
                                .to(scrollLay, 0.6, {y: -(scrollLay.scrollHeight - scrollContainer.clientHeight), ease: Power0.easeNone},"+=0.2")
                                .to(scrollLay, 0.2, {})
    
                function getScrollOfset() {
                    let pinnedImg = section3;
                    let pinnedImgCord = pinnedImg.getBoundingClientRect();
                    let x = pinnedImgCord.top + pageYOffset - (window.innerHeight/2 - pinnedImg.clientHeight/2);
                    
                    return x;
                }

                console.log(scrollLay.scrollHeight)
                
                return new ScrollMagic.Scene({
                    duration: scrollLay.scrollHeight * 2,
                    offset: getScrollOfset(),
                    reverse: true,
                    triggerHook: 0.5, 
                })
                .setTween(scrollTl)
                .setPin(section3)
                // .addIndicators() 
                .addTo(controller);
            });
    
            // scale
            scenes.push(function(){ 
                // if(wW < mobileLs) return;
                let tween = new TimelineLite()
                        .fromTo(".section--3 .parallax-img", 0.3, {scale: 0.8}, {scale: 1, ease: Power0.easeNone}, 0)
                return new ScrollMagic.Scene({
                    triggerElement: (wW < mobileLs) ? ".section--3 .parallax-img" : section3, 
                    duration: (wW < mobileLs) ? 0 : section3.clientHeight / 2
                })
                .setTween(tween)
                .addTo(controller);
            });
        }
    }


    // ABOUT PAGE scenes

    if(page == 'about') {
        let sectionsList = [].slice.call(document.querySelectorAll('.img-section'));
        
        // scale
        for(let i =0; i < sectionsList.length; ++i) {
            let scaledImg = sectionsList[i].querySelector('.scaled-anime');
            scenes.push(function(){ 
                // if(wW < mobileLs) return;
                let tween = new TimelineLite()
                        .fromTo(scaledImg, 0.3, {scale: 0.8}, {scale: 1, ease: Power0.easeNone}, 0)
                return new ScrollMagic.Scene({
                    triggerElement: sectionsList[i], 
                    duration: (wW < mobileLs) ? 0 : sectionsList[i].clientHeight / 2
                })
                .setTween(tween)
                .addTo(controller);
            });

        }


        // BA slider
        let slidersList = [].slice.call(document.querySelectorAll('.beer-slider'));

        for(let i = 0; i < slidersList.length; ++i) {
            console.log(BeerSlider)
            let sliderEl = new BeerSlider(slidersList[i], {start: 1});
            scenes.push(function(){ 
                let tween = new TimelineLite()
                        .to(slidersList[i].querySelector('.beer-reveal'), 0.7, {width: '50%', ease: Back.easeOut.config(1.7)})
                        .to(slidersList[i].querySelector('.beer-handle'), 0.7, {left: '50%', ease: Back.easeOut.config(1.7)}, 0)
                        .to(slidersList[i].querySelector('.beer-range'), 0.7, {attr:{'aria-valuenow': 50, value: 50}, ease: Back.easeOut.config(1.7)}, 0)
                return new ScrollMagic.Scene({
                    triggerElement: slidersList[i],
                    reverse: false
                })
                .setTween(tween)
                .addTo(controller);
            });

        }


    }



    // Add scenes (activate)
    function addScenes(newScenes) {
      // reset active scenes
      activeScenes = [];
      // loop over each scene and add/re-add
      newScenes.forEach(function (newScene, index) {
        if (typeof newScene === 'function') {   
          // add the new scene
          let newS = newScene();
          // push it to our active scenes array
          activeScenes.push(newS);
        }
      }); 
    }

    // if(wW >= mobileLs) {
    addScenes(scenes);

    // ==================== UPDATES WHEN RESIZE ==================== 
    
    let resizeTimeout = null;
    let timeoutDurationScrollMagic = 400; 

    window.addEventListener('resize', updateOnResize.bind(this))

    function updateOnResize() {
        wW = window.innerWidth;
        wH = window.innerHeight;

        // for SCROLL MAGIC
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeTimeout = setTimeout(function() {
            // loop over each active scene
            activeScenes.forEach(function (scene) {
              // make sure scene wasn't null
              if (scene) { 
                // destroy active scene
                scene.destroy(true);
              }
            });
            // after we have destroyed old scenes, re-add them
            addScenes(scenes);
          }, timeoutDurationScrollMagic);

        
        if(wW >= mobileLs && body.classList.contains('overflow')) {
            mobileMenuHandler();
        };
        
    }

    
    
  
    // ==================== HOVER IMG ====================

    // let hoverImgTrigerWrap = document.querySelectorAll('.scroll-col__list');
    // let activeTrigersWrap = [];
    // let targetElSelector = '.scroll-col__item';  
    // let imgContainerElSelector = '#hover-img';      

  
    // if(hoverImgTrigerWrap.length) {
    //     for(let i = 0; i < hoverImgTrigerWrap.length; ++i) {
    //         let triger = new HoverImg(hoverImgTrigerWrap[i], targetElSelector, imgContainerElSelector);  
    //         activeTrigersWrap.push(triger);
    //     }
    // } 
 
    // ==================== CONTACT FORM ====================

    if(document.querySelector('#contact-form')) {
    
        const form1 = new ContactForm({
            formSellector: '#contact-form',
            formListSellector: '.contact__input',
        })
    }


    // ==================== SMOOTH SCROLL ====================

    // if(page == 'home') {
        function smoothScroll() {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let isScrollFromWheel = false;
            let wrapperScrollHeight = window.scrollHeight;
            let tweenScroll;
            const doScrolling = e => {
                e.preventDefault();
                isScrollFromWheel = true;
                const scrollTime = 1;
                const scrollDistance = 170;
                const delta = e.wheelDelta / 120 || -e.detail / 3;
                scrollTop = scrollTop - parseInt(delta * scrollDistance);
                // scrollTop = Math.max(0, Math.min(wrapperScrollHeight - window.innerHeight, scrollTop));
                if(tweenScroll) tweenScroll.kill();
                tweenScroll = TweenMax.to(window, scrollTime, {
                    scrollTo: {
                        y: scrollTop, 
                        ease: Sine.easeNone,
                        autoKill: false
                    }, 
                    onComplete:function() {
                        isScrollFromWheel = false;
                    }
                }); 
            }; 
            document.addEventListener("mousewheel", doScrolling, {passive: false});
            document.addEventListener("DOMMouseScroll", doScrolling, {passive: false});
            
            
            let isScrolling = false;
            window.addEventListener("scroll", function(e){
                isScrolling = true;
            });
            
            setInterval(()=>{
                if(isScrolling && !isScrollFromWheel) {
                    isScrolling = false;
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                }
            }, 750)

        }

        smoothScroll()
    // } 

        // ==================== PRELOADER HIDE ====================

        loadTimer = setTimeout(hidePreloaderLogic.bind(this), 500) 

        
        
}

// ==================== PRELOADER HIDE ====================

function hidePreloaderLogic() {
    let preloaderHide = function() {
        // body.classList.remove('overflow');
        preloader.classList.remove('fade-out');
        preloader.classList.add('hide');
        preloader.removeEventListener('transitionend', preloaderHide);
    }
    
    preloader.addEventListener('transitionend', preloaderHide);
    preloader.classList.add('fade-out')
}


