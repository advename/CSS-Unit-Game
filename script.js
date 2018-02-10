let mainContainer = document.querySelector("main #main-container");
let mainContainerSize = mainContainer.getBoundingClientRect();
let svg = document.querySelector("main svg");
let svgDesktop = document.querySelector("main #desktop-svg rect.cls-5");
let bigBox = document.querySelector("#bigBox");
let play = document.querySelector("main #play");
const levelTemplate = document.querySelector("#level-template");
const sideBar = document.querySelector("#sidebar");
let leftDirection = document.querySelector("#direction .left");
let rightDirection = document.querySelector("#direction .right");
let currentLevel = 1;
let sideBarContainer = document.querySelector("#sidebar-container");
let sideBarContainerSize = sideBarContainer.getBoundingClientRect();

let topValue, data, widthOfSideBar, levelContainer;
const link = "https://spreadsheets.google.com/feeds/list/1T2dyKXx_OuFsAcSLnPaUYEamOZpcW4uEDNOEZqYZcok/od6/public/values?alt=json";

init();
// INITIALIZE SIZES
function init() {
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

        play.style.height = svgDesktopSize.height + "px";
        play.style.width = (svgDesktopSize.width - .9) + "px";

        topValue = Math.abs((getOffset(svgDesktop).top) - (getOffset(play).top));

        play.style.top = -1 * topValue + "px";
        play.style.bottom = topValue + "px";

    }

    sidebar.style.width = (sideBarContainerSize.width - 40) + "px";


    widthOfSideBar = sideBarContainerSize.width + 41;
}


function createLevels() {
    data.forEach(elem => {
        const levelTemplate = document.querySelector("#level-template").content;

        const clone = levelTemplate.cloneNode(true);
        clone.querySelector("#level-n").id = "level-" + elem.level;
        clone.querySelector(".level-number").textContent = "Level " + elem.level;
        clone.querySelector(".description").textContent = elem.description;

        if (elem.level == 1) {
            clone.querySelector("#level-" + elem.level).style.left = "0px;"
        }
        if (elem.bboxa) {
            clone.querySelector(".bigBox-control").classList.remove("hide");
            clone.querySelector("button").setAttribute("onClick", "bigBoxSize('"+elem.level + "','" + elem.bboxh + "','" + elem.bboxh + "')");
        }
        sideBar.appendChild(clone);
    });
    document.querySelector("#level-1").style.left = "0px";
    levelContainer = document.querySelectorAll(".level-container");
    levelContainer.forEach(elem=>{
        elem.style.width = (sideBarContainerSize.width - 39)+"px";
    })
}



function changeLevel(direction) {
    if (direction == "left") {
        console.log("+++++++++++++++++");

        console.log(currentLevel-1);
        console.log(currentLevel);
        console.log(document.querySelector("#level-" + (1 + currentLevel)));


        document.querySelector("#level-" + (currentLevel - 1)).style.left = "0px";
        document.querySelector("#level-" + currentLevel).style.left = (1 * widthOfSideBar) + "px";


        if (currentLevel == 2) {
            leftDirection.classList.add("hide");
        } else if (currentLevel == (data.length) - 1) {
            rightDirection.classList.remove("hide");
        }
        if (currentLevel > 1) {
            currentLevel = currentLevel - 1;
        }

    } else if (direction == "right") {
        document.querySelector("#level-" + currentLevel).style.left = (-1 * widthOfSideBar) + "px";

        document.querySelector("#level-" + (currentLevel + 1)).style.left = "0px";

        if (currentLevel == 1) {
            leftDirection.classList.remove("hide");
        } else if (currentLevel == (data.length) - 1) {
            rightDirection.classList.add("hide");
        }
        if (currentLevel < 5) {
            currentLevel = currentLevel + 1;
        }

    }
}


function bigBoxSize(levelN, height, width){
    let bbheightInput = document.querySelector("#level-"+levelN+" .bigBox-control .inputHeight").value;
    let bbhWidthInput = document.querySelector("#level-"+levelN+" .bigBox-control .inputWidth").value;
    console.log(bbhWidthInput);
    bigBox.style.height = bbheightInput + "px";
    bigBox.style.width = bbheightInput + "px";
}



// Transform Google JSON data to normal array
class FetchGoogleJSON {
    constructor(url, callback, prettify = true) {
        let re = /^https:/;
        if (!re.test(url)) {
            url = "https://spreadsheets.google.com/feeds/list/" + url + "/od6/public/values?alt=json";
        }
        fetch(url).then(e => e.json()).then(d => {
            if (prettify) {
                callback(new PrettifyGoogleJSON(d).get());
            } else {
                callback(d);
            }
        })
    }
}
class PrettifyGoogleJSON {
    constructor(googleData) {
        this.newJSON = [];
        let re = /^gsx\$/;
        googleData.feed.entry.forEach(obj => {
            let temp = {};
            for (let prop in obj) {
                if (re.test(prop)) {
                    let parts = prop.split('$')
                    temp[parts[1]] = obj[prop].$t;
                }
            }
            this.newJSON.push(temp);
        });
    }

    get() {
        return this.newJSON;
    }
}


// Fetch data
new FetchGoogleJSON(link, show);

function show(d) {
    console.log(d);
    data = d;
    createLevels();
}
