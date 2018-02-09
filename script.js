let mainContainer = document.querySelector("main #main-container");
let mainContainerSize = mainContainer.getBoundingClientRect();
let svg = document.querySelector("main svg");
let svgDesktop = document.querySelector("main #desktop-svg rect.cls-5");

let play = document.querySelector("main #play");
let topValue;


if (mainContainerSize.width < mainContainerSize.height) {
    let size = mainContainerSize.width / 5;
    svg.style.height = (size * 4) + "px";
    svg.style.width = (size * 5) + "px";
    //mainContainer.style.height = (size*4) + "px";
    reSizePlay();
} else {
    let size = mainContainerSize.height / 5;
    svg.style.height = (size * 4) + "px";
    svg.style.width = (size * 5) + "px";
    //mainContainer.style.height = (size*4) + "px";
    reSizePlay();

}

function reSizePlay() {
    let svgDesktopSize = svgDesktop.getBoundingClientRect();

    function getOffset(el) {
        el = el.getBoundingClientRect();
        return {
            left: el.left + window.scrollX,
            top: el.top + window.scrollY
        }
    }

    console.log(svgDesktopSize.height);
    play.style.height = svgDesktopSize.height + "px";
    play.style.width = (svgDesktopSize.width - .4) + "px";

    topValue = Math.abs((getOffset(svgDesktop).top) - (getOffset(play).top));


    console.log(topValue);
    play.style.top = -1 * topValue + "px";
    play.style.bottom = topValue + "px";

}
