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
        play.style.width = (svgDesktopSize.width - 1.3) + "px";

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
            clone.querySelector(".smallBox-control h3").textContent = "Green container controls:";
        }
        if (elem.sboxa === "p") {
            clone.querySelector(".smallBox-control").classList.remove("hide");
            clone.querySelector(".smallBox-control h3").textContent = "Text controls:";
            clone.querySelector(".smallBox-control .text-height").textContent = "Font-size:";
            clone.querySelector(".smallBox-control .text-width").classList.add("hide");
            clone.querySelector(".smallBox-control .inputWidth").classList.add("hide");
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
        } else if (currentLevel == data.length) {
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
        } else if (currentLevel == (data.length - 1)) {
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
    let marginArray = marginString.split(/[ ]/);
    if (marginArray.indexOf("0") > -1) {
        document.querySelector("#level-" + level + " .sMarginTree").classList.add("hide");
    } else {
        document.querySelector("#level-" + level + " .sMarginTree").classList.remove("hide");
    }

    let paddingString = data[level - 1].sboxp;
    let paddingArray = paddingString.split(/[ ]/);
    if (paddingArray.indexOf("0") > -1) {
        document.querySelector("#level-" + level + " .sPaddingTree").classList.add("hide");
    } else {
        document.querySelector("#level-" + level + " .sPaddingTree").classList.remove("hide");
    }


}

function getHeightUnit(levelN, box) {
    let heightInput = document.querySelector("#level-" + levelN + " " + box + " .inputHeight").value;
    let heightInputUnit = heightInput.substr(-2);
    if (heightInputUnit.includes("%")) {
        heightInputUnit = "%"
    };
    return heightInputUnit;
}

function getWidthUnit(levelN, box) {
    let widthInput = document.querySelector("#level-" + levelN + " " + box + " .inputWidth").value;
    let widthInputUnit = widthInput.substr(-2);
    if (widthInputUnit.includes("%")) {
        widthInputUnit = "%"
    };
    return widthInputUnit;
}

function getArrayUnit(levelN, box) {
    let arrayUnit = [];
    let arrayInput = document.querySelector("#level-" + levelN + " " + box).value;
    let arrayInputValues = arrayInput.split(/[ ]/);
    arrayInputValues.forEach(elem => {
        let temp = elem.substr(-2);
        if (temp.includes("%")) {
            temp = "%"
        };
        arrayUnit.push(temp);
    })
    return arrayUnit;
}

function marginArrayActive(levelN) {
    let status = 0;
    let array = data[(levelN - 1)].sboxm.split(/[ ]/);
    array.forEach(elem => {
        if (elem == 0) {
            status = 1;
        }
    });
    if (status == 1) {
        return false;
    } else {
        return true;
    }

}

function paddingArrayActive(levelN) {
    let status = 0;
    let array = data[(levelN - 1)].sboxp.split(/[ ]/);
    array.forEach(elem => {
        if (elem == 0) {
            status = 1;
        }
    });
    if (status == 1) {
        return false;
    } else {
        return true;
    }

}

// Replace all vh and vw to %
function replaceViewport(text){
    let temp = text.replace("vh","%");
    let temp2 = temp.replace("vw","%");
    return temp2;
}

//check input for current level
function checkBoxSize(levelN) {

    // Current levels array data
    let dataL = data[levelN - 1];
    let sbActive = data[levelN - 1].sboxa;
    let bbActive = data[levelN - 1].bboxa;
    let marginActive;

    //BIG BOX VARIABLES
    let bHeightUnit = getHeightUnit(levelN, ".bigBox-control");
    let bHeightInput = document.querySelector("#level-" + levelN + " .bigBox-table .inputHeight").value;

    let bWidthUnit = getWidthUnit(levelN, ".bigBox-control");
    let bWidthInput = document.querySelector("#level-" + levelN + " .bigBox-table .inputWidth").value;



    //Green Box (small box) VARIABLES
    let sHeightUnit = getHeightUnit(levelN, ".smallBox-control");
    let sHeightInput = document.querySelector("#level-" + levelN + " .smallBox-table .inputHeight").value;

    let sWidthUnit = getWidthUnit(levelN, ".smallBox-control");
    let sWidthInput = document.querySelector("#level-" + levelN + " .smallBox-table .inputWidth").value;

    // Font size
    let sFontUnit = getHeightUnit(levelN, ".smallBox-control");
    let sFontInput = document.querySelector("#level-" + levelN + " .smallBox-table .inputHeight").value;

    // Margin
    let marginUnit = getArrayUnit(levelN, ".inputMargin");
    let inputMargin = document.querySelector("#level-" + levelN + " .inputMargin").value;

    // Padding
    let paddingUnit = getArrayUnit(levelN, ".inputPadding");
    let inputPadding = document.querySelector("#level-" + levelN + " .inputPadding").value;

    if (bbActive == 1 && sbActive === "p" && marginArrayActive(levelN) && paddingArrayActive(levelN)) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) && checkAllowedUnit(sFontUnit, "px", levelN) && marginUnit && paddingUnit) {

            console.log("big box and p and margin and padding passed")

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);
            smallText.style.fontSize = replaceViewport(sFontInput);
            smallText.style.padding = replaceViewport(inputPadding);
            smallText.style.margin = replaceViewport(inputMargin);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw && sFontInput === dataL.sboxh && inputMargin === dataL.sboxm && inputPadding === dataL.sboxp) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }
    } else if (bbActive == 1 && sbActive === "p" && marginArrayActive(levelN)) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) && checkAllowedUnit(sFontUnit, "px", levelN) && marginUnit) {

            console.log("big box and p and margin passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);
            smallText.style.fontSize = replaceViewport(sFontInput);
            smallText.style.margin = replaceViewport(inputMargin);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw && sFontInput === dataL.sboxh && inputMargin === dataL.sboxm) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }

    }else if (bbActive == 1 && sbActive === "p" && paddingArrayActive(levelN)) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) && checkAllowedUnit(sFontUnit, "px", levelN) && paddingUnit) {

            console.log("big box and p and padding passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);
            smallText.style.fontSize = replaceViewport(sFontInput);
            smallText.style.padding = replaceViewport(inputPadding);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw && sFontInput === dataL.sboxh && inputPadding === dataL.sboxp) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }

    }else if (bbActive == 1 && sbActive === "p") {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) && checkAllowedUnit(sFontUnit, "px", levelN)) {

            console.log("big box and p passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);
            smallText.style.fontSize = replaceViewport(sFontInput);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw && sFontInput === dataL.sboxh) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }

    }else if (bbActive == 1 && sbActive === "div") {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) && checkAllowedUnit(sHeightUnit, sWidthUnit, levelN)) {

            console.log("big box and small box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);
            smallBox.style.height = replaceViewport(sHeightInput);
            smallBox.style.width = replaceViewport(sWidthInput);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw && sHeightInput === dataL.sboxh && sWidthInput === dataL.sboxw) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }
    }else if (bbActive == 1) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN) ) {

            console.log("Big box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw) {
                displayCorrectMessage(levelN, "CORRECT!")
            } else {
                displayWrongMessage(levelN, "Something seems not to be right, try again");
            }
        }
    } else {
        displayWrongMessage(levelN, "Sorry. Something went wrong :/ - Please contact lars@advena.me");
    }
}







// getHeightUnit(1,'.bigBox-control')
// checkAllowedUnit(getHeightUnit(1,'.bigBox-control'), getWidthUnit(1, '.bigBox-control'), 1);

// checkAllowedUnitArray(getArrayUnit(5, ".inputPadding");, 5);
function checkAllowedUnitArray(array, levelN) {
    let allowed = ["vh", "px", "em", "%"];
    let status = 0;

    array.forEach(elem => {
        if (allowed.indexOf(elem) > -1) {} else {
            displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
            status = 1;
        }
    });
    if (status) {
        return false;
    } else {
        return true;
    }
}

function checkAllowedUnit(checkForHeight, checkForWidth, levelN) {
    let allowedH = ["vh", "px", "em", "%"];
    let allowedW = ["vw", "px", "em", "%"];

    if (allowedH.indexOf(checkForHeight) > -1) {
        //do nothing
        console.log("exists");
        //Check width units
        if (allowedW.indexOf(checkForWidth) > -1) {
            //do nothing
            console.log("exists 2");
            return true;
        } else {
            displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
            console.log("not existing 2");
            return false;
        };
    } else {
        displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
        console.log("not existing");
        //Check width units
        if (allowedW.indexOf(checkForWidth) > -1) {
            //do nothing
            console.log("exists 2");
            return true;
        } else {
            displayWrongMessage(levelN, "Ups. Seems like you used an unit not made for that direction.");
            console.log("not existing 2");
            return false;
        }
    }
}


function defaultSize(level) {
    let defaultSizeDataBB = data[level - 1].bboxd;
    let defaultArrayBB = defaultSizeDataBB.split(/[/]/);
    let defaultSizeDataSB = data[level - 1].sboxd;
    let defaultArraySB = defaultSizeDataSB.split(/[/]/);
    bigBox.style.height = defaultArrayBB[0];
    bigBox.style.width = defaultArrayBB[1];
    if (data[level - 1].sboxa === "div") {
        smallBox.style.height = defaultArraySB[0];
        smallBox.style.width = defaultArraySB[1];
    } else if (data[level - 1].sboxa === "p") {
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
