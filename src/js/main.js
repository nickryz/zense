import TimelineLite from 'gsap/TimelineLite'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import EasePack from 'gsap/EasePack'
import IScroll from 'iscroll/build/iscroll-probe';
import animation from 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
import addIndicators from 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'
import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic'
import Swiper from 'swiper';
import Counter from './misc/counter';
import AddCart from './misc/addCart';
import HoverImg from './misc/hoverImg';
import ContactForm from './misc/contactform'
import Tingle from 'tingle.js'
// import Client from 'shopify-buy';
// import './misc/isMobile';
// import TweenLite from 'gsap/TweenLite';
// import Scrollbar from 'smooth-scrollbar';

// brakepoints
let tabletPr = 992;
let mobileLs = 768;

// start param
let body = document.body;
let wW = window.innerWidth;
let wH = window.innerHeight;
let page = body.getAttribute('data-pageid');
// let pageType = 
// let isMobile = isMobile();

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', onLoad);


function init () {

    
    
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
                    TweenLite.to(window, 1, {scrollTo:link});
                })
            }
        }
    }
 
    // ==================== MOBILE MENU ====================

    burgerElem.addEventListener('click', mobileMenuHandler);
    overlay.addEventListener('click', mobileMenuHandler);

}

function onLoad() {
    // ==================== SCROLL MAGIC ====================
    var controller = new ScrollMagic.Controller({
        refreshInterval: 5
    });
    var scenes = [];
    var activeScenes = [];

    // fixed menu
    scenes.push(function(){
        let headerEl = document.getElementById('main-header');
        let paddingOffset = 16;
        
        return new ScrollMagic.Scene({
            offset: paddingOffset 
        })
        .setClassToggle('#main-header', 'full')
        .addTo(controller);

    });

    if(page == 'home') {
        // scrolling section
        scenes.push(function(){
            if(wW < mobileLs) return;
            let scrollContainer = document.querySelector('.section__text-scroll-outer');
            let scrollLay = document.querySelector('.section__text-scroll-inner');
            let scrollTl = new TimelineLite()
                            .to(scrollLay, 0.6, {y: -(scrollLay.scrollHeight - scrollContainer.clientHeight), ease: Power0.easeNone},"+=0.2")
                            .to(scrollLay, 0.2, {})

            function getScrollOfset() {
                let pinnedImg = document.querySelector('.section--3');
                let pinnedImgCord = pinnedImg.getBoundingClientRect();
                let x = pinnedImgCord.top + pageYOffset - (window.innerHeight/2 - pinnedImg.clientHeight/2);
                return x;
            }

            return new ScrollMagic.Scene({
                duration: scrollLay.scrollHeight * 2,
                offset: getScrollOfset(),
                reverse: true,
                triggerHook: 0.5 
            })
            .setTween(scrollTl)
            // .addIndicators()
            .setPin(".section--3")
            .addTo(controller);
        });

        // scene 2 (parallax)
        scenes.push(function(){ 
            if(wW < mobileLs) return;
            let section1 = document.querySelector('.section--1')
            let paralaxTween1 = new TimelineLite()
                                .fromTo(".section--1 .parallax-lay", 1, {y: '-20%'}, {y: '20%',ease: Power0.easeNone})
                                .fromTo(".section--1 .parallax-img", 1, {y: '-130%'}, {y: '30%',ease: Power0.easeNone}, 0)
            return new ScrollMagic.Scene({
                triggerElement: '.section--1', 
                offset: -window.innerHeight,
                duration: window.innerHeight*2 + section1.clientHeight
            })
            .setTween(paralaxTween1)
            .addTo(controller);
        });

        // scene 3 (parallax)
        scenes.push(function(){
            if(wW < mobileLs) return;
            let section2 = document.querySelector('.section--2')
            let scene3;
            let paralaxTween2 = new TimelineLite()
                .fromTo(".section--2 .parallax-lay", 1, {y: '-10%'}, {y: '10%',ease: Power0.easeNone})
                .fromTo(".section--2 .parallax-img", 1, {y: '30%'}, {y: '-30%',ease: Power0.easeNone}, 0)
            return new ScrollMagic.Scene({
                triggerElement: section2, 
                offset: -window.innerHeight,
                duration: window.innerHeight*2 + section2.clientHeight
            })
            .setTween(paralaxTween2)
            .addTo(controller);
        });

    }
    
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
    // } 
  
    // ==================== UPDATES WHEN RESIZE ==================== 
    
    
    let resizeTimeout = null;
    var timeoutDurationScrollMagic = 400; 

    window.addEventListener('resize', updateOnResize.bind(this))

    function updateOnResize() {
        wW = window.innerWidth;
        wH = window.innerHeight;

        // for scrollMagic
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
                e.preventDefault();
                let formLink = 'https://thezense.com/cart/';

                for(let product in cartList) {
                    let stroke = product + ":" + cartList[product] + ",";
                    formLink += stroke;
                }
                // console.log(formLink.slice(0,-1))
                window.open(formLink.slice(0, -1), '_blank');
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
                productItem.querySelector('[data-video-src]').setAttribute('data-video-src', products[product].videosrc);
                // price
                productItem.querySelector('[data-price]').innerHTML = products[product].currency + products[product].price;
                // product ID (add to cart btn)
                productItem.querySelector('[data-product-id]').setAttribute('data-product-id', product);
                // counter input ID
                productItem.querySelector('.counter-input').setAttribute('id', product);
                // faq text
                let faqBox = productItem.querySelector('[data-faq-box]')
                for(let i = 0; i < products[product].faq.length; ++i) {
                    let faqP = document.createElement('div');
                        faqP.classList.add('info-dscr__text');
                        faqP.innerHTML = products[product].faq[i];
                    faqBox.appendChild(faqP);
                }
                // ingridients list
                let ingriBox = productItem.querySelector('[data-ingridients-list]')
                for(let i = 0; i < products[product].ingridients.length; ++i) {
                    let ingriP = document.createElement('li');
                        // ingri.classList.add('info-dscr__text');
                        ingriP.innerHTML = products[product].ingridients[i];
                    ingriBox.appendChild(ingriP);
                }
                // images
                productItem.querySelector('[media="(max-width: 576px)"]').setAttribute('srcset', root + products[product].images.sm);
                productItem.querySelector('[media="(max-width: 992px)"]').setAttribute('srcset', root + products[product].images.md);
                productItem.querySelector('[data-img-origin]').setAttribute('srcset', root + products[product].images.lg);
                productItem.querySelector('[data-img-default]').setAttribute('srcset', root + products[product].images.default);

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

                    if(target.classList.contains('modal-triger')) {
                        let videoContainer = document.getElementById('video-content');
                        setVideo(videoContainer.content, target);
                        modal.open();
                    } else if (target.classList.contains('info-triger')) {
                        let infoW = e.currentTarget.querySelector('.info-dscr');
                        infoW.classList.add('opened');
                    } else if (target.classList.contains('info-dscr__close')) {
                        let infoW = e.currentTarget.querySelector('.info-dscr');
                        infoW.classList.remove('opened');
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
                    container.innerHTML = sum;
                } else {
                    let addQty = function() {
                        container.innerHTML = sum;
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

}


// ==================== MOBILE MENU HANDLER====================


let burgerElem = document.getElementById('burger-btn');
let overlay = document.getElementById('overlay');
let nav = document.getElementById('nav');


function mobileMenuHandler(e) {
    burgerElem.classList.toggle('clicked');
    overlay.classList.toggle('show');
    nav.classList.toggle('show');
    body.classList.toggle('overflow');
}

