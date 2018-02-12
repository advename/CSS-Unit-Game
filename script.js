let mainContainer = document.querySelector("main #main-container");
let mainContainerSize = mainContainer.getBoundingClientRect();
let svg = document.querySelector("main svg");
let svgDesktop = document.querySelector("main #desktop-svg rect.cls-5");
let bigBox = document.querySelector("#bigBox");
let smallBox = document.querySelector("#smallBox");
let smallText = document.querySelector("#smallText");
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
    /*
    Intention of the code was to resize the svg 4 to 5. However, percentage did the work too!
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
    }*/

    svg.style.height = "95%";
    svg.style.width = "95%";
    reSizePlay();

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
        play.style.width = (svgDesktopSize.width - 2.3) + "px";

        topValue = Math.abs((getOffset(svgDesktop).top) - (getOffset(play).top));

        play.style.top = -1 * topValue + "px";
        play.style.bottom = topValue + "px";

    }

    sideBar.style.width = (sideBarContainerSize.width - 40) + "px";
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
        if (elem.bboxa == 1) {
            clone.querySelector(".bigBox-control").classList.remove("hide");
        }
        if (elem.sboxa === "div") {
            clone.querySelector(".smallBox-control").classList.remove("hide");
            clone.querySelector(".smallBox-control h3").textContent = "Green container controls:"
        }
        if (elem.sboxa === "p") {
            clone.querySelector(".smallBox-control").classList.remove("hide");
            clone.querySelector(".smallBox-control h3").textContent = "Text controls:"
        }
        clone.querySelector("button").setAttribute("onClick", "checkBoxSize('" + elem.level + "')");
        sideBar.appendChild(clone);
    });
    document.querySelector("#level-1").style.left = "0px";
    levelContainer = document.querySelectorAll(".level-container");
    levelContainer.forEach(elem => {
        elem.style.width = (sideBarContainerSize.width - 39) + "px";
    })
    hideShowSmall(1);
    hideShowBig(1);
}



function changeLevel(direction) {
    if (direction == "left") {
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

        hideShowSmall(currentLevel);
        hideShowBig(currentLevel);
        defaultSize(currentLevel);
    } else if (direction == "right") {
        document.querySelector("#level-" + currentLevel).style.left = (-1 * widthOfSideBar) + "px";
        document.querySelector("#level-" + (currentLevel + 1)).style.left = "0px";

        if (currentLevel == 1) {
            leftDirection.classList.remove("hide");
        } else if (currentLevel == (data.length) - 1) {
            rightDirection.classList.add("hide");
        }
        if (currentLevel < data.length) {
            currentLevel = currentLevel + 1;
        }
        hideShowSmall(currentLevel);
        hideShowBig(currentLevel);
        defaultSize(currentLevel);
    }
}

function hideShowBig(level) {
    if (data[level - 1].bboxa == 0) {
        bigBox.style.display = "none";
    } else {
        bigBox.style.display = "block";
        bigBox.style.height = data[level - 1].bboxd
    }
}

function hideShowSmall(level) {
    let cLevel = level - 1;
    if (data[cLevel].sboxa === "div") {
        smallBox.classList.remove("hide");
        smallText.classList.add("hide");
        document.querySelector("#level-" + level + " .smallBox-control").classList.remove("textBorder");

    } else if (data[cLevel].sboxa === "p") {
        smallText.classList.remove("hide");
        smallBox.classList.add("hide");
        document.querySelector("#level-" + level + " .smallBox-control").classList.add("textBorder");
    } else {
        smallBox.classList.add("hide");
        smallText.classList.add("hide");
    }
    let marginString = data[level - 1].sboxm;
    let marginArray = marginString.split(/[/]/);
    if (marginArray.indexOf("0") > -1){
        document.querySelector("#level-" + level + " .sMarginTree").classList.add("hide");
    }
    else{
        document.querySelector("#level-" + level + " .sMarginTree").classList.remove("hide");
    }

    let paddingString = data[level - 1].sboxp;
    let paddingArray = paddingString.split(/[/]/);
    if (paddingArray.indexOf("0") > -1){
        document.querySelector("#level-" + level + " .sPaddingTree").classList.add("hide");
    }
    else{
        document.querySelector("#level-" + level + " .sPaddingTree").classList.remove("hide");
    }


}


//check input for current level
function checkBoxSize(levelN) {
    // Current levels array data
    let dataL = data[levelN - 1];

    //BIG BOX VARIABLES
    let bbHeightInput = document.querySelector("#level-" + levelN + " .bigBox-control .inputHeight").value;
    let bbHeightInputUnit = bbHeightInput.substr(-2);
    if (bbHeightInputUnit.includes("%")) {
        bbHeightInputUnit = "%"
    };
    let bbWidthInput = document.querySelector("#level-" + levelN + " .bigBox-control .inputWidth").value;
    let bbWidthInputUnit = bbWidthInput.substr(-2);
    if (bbWidthInputUnit.includes("%")) {
        bbWidthInputUnit = "%"
    };
    let bbActive = data[levelN - 1].bboxa;

    //SMALL BOX VARIABLES
    let sbHeightInput = document.querySelector("#level-" + levelN + " .smallBox-control .inputHeight").value;
    let sbHeightInputUnit = sbHeightInput.substr(-2);
    if (sbHeightInputUnit.includes("%")) {
        sbHeightInputUnit = "%"
    };
    let sbWidthInput = document.querySelector("#level-" + levelN + " .smallBox-control .inputWidth").value;
    let sbWidthInputUnit = sbWidthInput.substr(-2);
    if (sbWidthInputUnit.includes("%")) {
        sbWidthInputUnit = "%"
    };
    let sbActive = data[levelN - 1].sboxa;


    if (bbActive == 1 && sbActive == 1) {
        if (checkAllowedUnit(bbHeightInputUnit, bbWidthInputUnit, levelN) && checkAllowedUnit(sbHeightInputUnit, sbWidthInputUnit, levelN)) {
            console.log("passed both");
            // Because of created Window, change viewports to percentage in order to fit to size
            bbHeightInputUnit.replace("vh", "%");
            bbWidthInputUnit.replace("vw", "%");
            sbHeightInputUnit.replace("vh", "%");
            sbWidthInputUnit.replace("vw", "%");

            // Apply heights
            bigBox.style.height = bbHeightInput;
            bigBox.style.width = bbWidthInput;
            smallBox.style.height = sbHeightInput;
            smallBox.style.width = sbWidthInput;

            // Check if inputs are correct
            if (bbHeightInput === dataL.bboxh && bbWidthInput === dataL.bboxw && sbHeightInput === dataL.sboxh && sbWidthInput === dataL.sboxw) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to beis not right, try again");
            }
        }
    } else if (bbActive == 1) {

        console.log("passed bigBox");
        // Because of created Window, change viewports to percentage in order to fit to size
        bbHeightInputUnit.replace("vh", "%");
        bbWidthInputUnit.replace("vw", "%");

        // Apply heights
        bigBox.style.height = bbHeightInput;
        bigBox.style.width = bbWidthInput;

        // Check if inputs are correct
        if (bbHeightInput === dataL.bboxh && bbWidthInput === dataL.bboxw) {
            displayCorrectMessage(levelN, "CORRECT!")
        } else {
            displayWrongMessage(levelN, "Something seems not to be right, try again");
        }
    } else if (sbActive == 1) {
        console.log("passed smallBox");
        // Because of created Window, change viewports to percentage in order to fit to size
        sbHeightInputUnit.replace("vh", "%");
        sbWidthInputUnit.replace("vw", "%");

        // Apply heights
        smallBox.style.height = sbHeightInput;
        smallBox.style.width = sbWidthInput;

        // Check if inputs are correct.
        if (sbHeightInput === dataL.sboxh && sbWidthInput === dataL.sboxw) {
            displayCorrectMessage(levelN, "CORRECT!")
        } else {
            displayWrongMessage(levelN, "Something seems not to beis not right, try again");
        }
    } else {
        displayWrongMessage(levelN, "Sorry. Something went wrong :/ - Please contact lars@advena.me");
    }
}

function checkAllowedUnit(checkForHeight, checkForWidth, levelN) {
    let allowedH = ["vh", "px", "em", "%"];
    if (allowedH.indexOf(checkForHeight) > -1) {
        //do nothing
        console.log("exists");
        return true;
    } else {
        displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
        console.log("not existing");
        return false;
    }

    //check height units
    /*

        //check height units
        if (checkForHeight === "vh" || checkForHeight === "px" || checkForHeight === "em" || checkForHeight === "%" || checkForHeight === "vmin" || checkForHeight === "vmax") {
            //do nothing
            return true;
        } else {
            displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
            return false;
        }



    */

    //Check width units
    if (checkForWidth === "vw" || checkForWidth === "px" || checkForWidth === "em" || checkForWidth === "%" || checkForWidth === "vmin" || checkForWidth === "vmax") {
        //do nothing
        return true;
    } else {
        displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
        return false;
    }

}


function defaultSize(level){
    let defaultSizeDataBB = data[level - 1].bboxd;
    let defaultArrayBB = defaultSizeDataBB.split(/[/]/);
    let defaultSizeDataSB = data[level - 1].sboxd;
    let defaultArraySB = defaultSizeDataSB.split(/[/]/);
    bigBox.style.height =defaultArrayBB[0];
    bigBox.style.width = defaultArrayBB[1];
    if(data[level - 1].sboxa === "div"){
        smallBox.style.height = defaultArraySB[0];
        smallBox.style.width = defaultArraySB[1];
    }else if(data[level - 1].sboxa === "p"){
        smallText.style.fontSize = defaultArraySB[0];
    }
}

//display wrong message
function displayWrongMessage(levelN, message) {
    let wrongMessage = document.querySelector("#level-" + levelN + " .wrong-message");
    wrongMessage.textContent = message;
    wrongMessage.classList.remove("hide");
    setTimeout(function () {
        wrongMessage.classList.add("hide");
    }, 5000)

}
//display wrong message
function displayCorrectMessage(levelN, message) {
    let correctMessage = document.querySelector("#level-" + levelN + " .correct-message");
    correctMessage.textContent = message;
    correctMessage.classList.remove("hide");
    setTimeout(function () {
        correctMessage.classList.add("hide");
    }, 10000)

}

//show more or less info about css info
function showInfo(status) {
    let info = document.querySelector("#info");
    let moreInfo = document.querySelector("#info .more-info");
    console.log(typeof status);
    if (status == "true") {
        info.classList.add("active");
        moreInfo.style.display = "block";
    } else {
        info.classList.remove("active");
        moreInfo.style.display = "none";
    }
}


// disable mobile warning message for small screen
function letMeContinue() {
    document.querySelector("#screenWarning").style.display = "none";
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
