// import axios from 'axios';

window.addEventListener('load', () => {

    // const api = 'http://www.colr.org/json/color/random';
    // const body = document.querySelector('body');

    // function randomColor() {
    //     axios.get(api).then(res => {
    //         let color = res.data.colors[0].hex;

    //         if (!color) {
    //             console.error('Random color could not be fetched. 1');
    //         }

    //         color = '#' + color;

    //         body.style.backgroundColor = color;
    //     }).catch(() => console.error('Random color could not be fetched. 2'));
    // }

    // randomColor();

    // setInterval(randomColor, 8000);


    function showTime() {
        let time = new Date();
        let h = time.getHours().toString(); 
        let m = time.getMinutes().toString(); 
        let s = time.getSeconds().toString();
        const body = document.querySelector('.c-clock');

        if (h.length < 2) {
            h = '0' + h;
        }

        if (m.length < 2) {
            s = '0' + s;
        }

        if (s.length < 2) {
            s = '0' + s;
        }

        let clockStr = h + ":" + m + ":" + s;
        let colorStr = '#' + h + m + s;


        document.getElementById("js-clock").innerText = clockStr;
        document.getElementById("js-clock").textContent = clockStr;
        document.getElementById("js-hex").innerText = colorStr;
        document.getElementById("js-hex").textContent = colorStr;
        body.style.backgroundColor = colorStr;

        setTimeout(showTime, 1000);

    }

    showTime();

});