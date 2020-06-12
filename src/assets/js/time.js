window.addEventListener('load', () => {

    const deg = 6;
    const toggle = document.querySelector('#toggle');
    const hr = document.querySelector('#hr');
    const mn = document.querySelector('#mn');
    const sc = document.querySelector('#sc');

    toggle.addEventListener('click', function (event) {
      // Don't follow the link
      event.preventDefault();

      let wrapper = document.querySelector('.c-time');
      wrapper.classList.toggle('light');
    }, false);

    setInterval(() => {
        let day = new Date();
        let hh = day.getHours() * 30;
        let mm = day.getMinutes() * deg;
        let ss = day.getSeconds() * deg;

        hr.style.transform = `rotateZ(${(hh)+(mm/12)}deg)`;
        mn.style.transform = `rotateZ(${mm}deg)`;
        sc.style.transform = `rotateZ(${ss}deg)`;

        console.log(ss);

    }, 1000);
});
