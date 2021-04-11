import LazyLoad from "vanilla-lazyload";

window.addEventListener('load', () => {
  const modules = document.querySelectorAll('[data-module]');

  modules.forEach(node => {
    let moduleName = node.dataset.module;

    switch (moduleName) {
      case 'hero-intro':
        import('./modules/hero-intro')
        .then((module) => {
          module.default();
        });
        break;

      case 'cloker':
        import('./modules/clocker')
        .then((module) => {
          module.default();
        });
        break;

      case 'time':
        import('./modules/time')
        .then((module) => {
          module.default();
        });
      break;

      default:
        console.log('module not found!');
        break;
    }
  });

  // -- LazyLoad Init
  new LazyLoad({
    elements_selector: '.lazy'
  }).update();
});
