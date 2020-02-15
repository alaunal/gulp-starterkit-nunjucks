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

        let date = new Date();
        let h = date.getHours(); // 0 - 23
        let m = date.getMinutes(); // 0 - 59
        let s = date.getSeconds(); // 0 - 59
        let session = "AM";

        if (h == 0) {
            h = 12;
        }

        if (h > 12) {
            h = h - 12;
            session = "PM";
        }

        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;

        let time = h + ":" + m + ":" + s + " " + session;
        document.getElementById("js-clock").innerText = time;
        document.getElementById("js-clock").textContent = time;

        setTimeout(showTime, 1000);

    }

    showTime();

});
