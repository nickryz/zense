import TimelineLite from 'gsap/TimelineLite'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import EasePack from 'gsap/EasePack'
import IScroll from 'iscroll/build/iscroll-probe';
import animation from 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
import addIndicators from 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'
import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic'
import Swiper from 'swiper';
import Counter from './misc/counter';
import HoverImg from './misc/hoverImg';
import ContactForm from './misc/contactform'
import Tingle from 'tingle.js'
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
let isHome = (body.getAttribute('data-ishome') == 'true') ? true : false;
// let isMobile = isMobile();

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', onLoad);


function init () {

    
    
    if(isHome) {

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

    if(isHome) {
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

    if(isHome) {
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

    // ==================== COUNTER ====================

    let counters = [].slice.call(document.querySelectorAll('.counter'));  
    let activeCounters = [];  
    if(counters.length) { 
        for(let i = 0; i < counters.length; ++i) {
            let counter = new Counter(counters[i]);   
            activeCounters.push(counter);   
        }
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


    

    let modalInfoTrigers = [].slice.call(document.querySelectorAll('.table__dscr-col'));

    if(modalInfoTrigers.length) {
        

        // ==================== POPUPs VIDEO ====================
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

        // ==================== POPUPs VIDEO /end ====================


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

