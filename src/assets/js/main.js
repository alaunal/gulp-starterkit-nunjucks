import LazyLoad from "vanilla-lazyload";
import Typed from 'typed.js';




window.addEventListener('load', () => {

  // -- LazyLoad Init
  new LazyLoad({
    elements_selector: '.lazy'
  }).update();


  // -- typed Init
  const typedInit = (element = '.typed', option) => {
    new Typed(element, option);
  };


  // -- Hero init typed
  let optHero = {
    strings: [
      'Front-end Web Developer',
      'Web Designer',
      'Traveller',
      'Talk less do more!'
    ],
    typeSpeed: 50,
    backSpeed: 20,
    backDelay: 2000,
    startDelay: 1000,
    loop: true
  };

  typedInit('.typedHero', optHero);

});
