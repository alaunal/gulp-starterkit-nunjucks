import Typed from 'typed.js';

const heroIntro = () => {
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
};

export default heroIntro;
