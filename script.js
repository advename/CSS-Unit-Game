const mainContainer = document.querySelector("main #main-container");
const mainContainerSize = mainContainer.getBoundingClientRect();
const svg = document.querySelector("main svg");
const svgDesktop = document.querySelector("main #desktop-svg rect.cls-5");
const bigBox = document.querySelector("#bigBox");
const smallBox = document.querySelector("#smallBox");
const smallText = document.querySelector("#smallText");
const play = document.querySelector("main #play");
const levelTemplate = document.querySelector("#level-template");
const sideBar = document.querySelector("#sidebar");
const sideBarLevels = document.querySelector("#sidebar .sidebar-levels");
const leftDirection = document.querySelector("#direction .left");
const rightDirection = document.querySelector("#direction .right");
const sideBarContainer = document.querySelector("#sidebar-container");
const sideBarContainerSize = sideBarContainer.getBoundingClientRect();
const explainThis = document.querySelector("#info .explain-this");
const wrongMessage = document.querySelector("#info .wrong-message");
const correctMessage = document.querySelector("#info .correct-message");
const link = "https://spreadsheets.google.com/feeds/list/1T2dyKXx_OuFsAcSLnPaUYEamOZpcW4uEDNOEZqYZcok/od6/public/values?alt=json";


let topValue, data, widthOfSideBar, levelContainer, wrongTimeout;
let currentLevel = 1;

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

    // Resize sidebar
    sideBar.style.width = (sideBarContainerSize.width - 40) + "px";
    widthOfSideBar = sideBarContainerSize.width + 60;
    widthOfSideBar = sideBarContainerSize.width + 60;
    showInfo("true");

    // Jump directly to a level with the link css-game.com/#level-6
    // and disable frontpage
    if (window.location.hash != "") {
        let value = window.location.hash.replace("#level-", "");
        jumpToLevel(value);
        showInfo("false");
    }
}


// Transform Google JSON data to normal array (JONAS FROM KEA'S google spreadsheet to jSON code GitHub)
var FetchGoogleJSON = function (url, callback, prettify) {
    prettify = prettify === undefined ? true : prettify;
    var re = /^https:/;
    if (!re.test(url)) url = "https://spreadsheets.google.com/feeds/list/" + url + "/od6/public/values?alt=json";
    fetch(url).then(function (e) {
        return e.json()
    }).then(function (d) {
        if (prettify) callback((new PrettifyGoogleJSON(d)).get());
        else callback(d)
    })
};
var PrettifyGoogleJSON = function (googleData) {
    var $jscomp$this = this;
    this.newJSON = [];
    var re = /^gsx\$/;
    googleData.feed.entry.forEach(function (obj) {
        var temp = {};
        for (var prop in obj)
            if (re.test(prop)) {
                var parts = prop.split("$");
                temp[parts[1]] = obj[prop].$t
            }
        $jscomp$this.newJSON.push(temp)
    })
};
PrettifyGoogleJSON.prototype.get = function () {
    return this.newJSON
};
// and work with the retrieved data!
new FetchGoogleJSON(link, show);

function show(d) {
    console.log(d);
    data = d;
    createLevels();
    sideBarLevels.style.width = (data.length * (sideBarContainerSize.width - 40)) + "px";
}


// Fetch data, clone the template and append levels into body
function createLevels() {
    data.forEach(elem => {
        const levelTemplate = document.querySelector("#level-template").content;
        const clone = levelTemplate.cloneNode(true);

        clone.querySelector("#level-n").id = "level-" + elem.level;
        clone.querySelector(".level-number").textContent = "Level " + elem.level;
        clone.querySelector(".description").innerHTML = elem.description;

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
            if (elem.sboxh == 0) {
                clone.querySelector(".smallBox-control .inputHeight").classList.add("hide");
            }
            clone.querySelector(".smallBox-control .inputWidth").classList.add("hide");
        }
        clone.querySelector("button").setAttribute("onClick", "checkBoxSize('" + elem.level + "')");
        sideBarLevels.appendChild(clone);
    });
    levelContainer = document.querySelectorAll(".level-container");
    levelContainer.forEach(elem => {
        elem.style.width = (sideBarContainerSize.width - 40) + "px";
    })
    hideShowSmall(1);
    hideShowBig(1);
    changeTabFocus(1);
}

// With arrow keys left and right to change levels
function changeLevel(direction) {
    if (direction == "left") {
        rightDirection.classList.remove("hide");
        currentLevel = currentLevel - 1;

        closeAllMessages();
        changeTabFocus(currentLevel);
        hideShowSmall(currentLevel);
        hideShowBig(currentLevel);
        defaultSize(currentLevel);
    } else if (direction == "right") {
        leftDirection.classList.remove("hide");
        currentLevel = currentLevel + 1;

        closeAllMessages();
        changeTabFocus(currentLevel);
        hideShowSmall(currentLevel);
        hideShowBig(currentLevel);
        defaultSize(currentLevel);
    }
    if (currentLevel === 1) {
        leftDirection.classList.add("hide");
    } else if (currentLevel == (data.length)) {
        rightDirection.classList.add("hide");
    }
    history.replaceState(undefined, undefined, "#level-"+currentLevel);
    sideBarLevels.style.left = (-1 * (currentLevel - 1) * (sideBarContainerSize.width - 40)) + "px";
}


function jumpToLevel(value) {
    value = value - 1;
    sideBarLevels.style.left = (-1 * value * (sideBarContainerSize.width - 40)) + "px";
    console.log("jump to level");
}

// Depending on current level, hide or show big red box
function hideShowBig(level) {
    if (data[level - 1].bboxa == 0) {
        bigBox.style.display = "none";
    } else {
        bigBox.style.display = "block";
        bigBox.style.height = data[level - 1].bboxd
    }
}

// Depending on current level, hide or show small green box/text/margin/padding
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CHECK FOR INPUTS IF THEY ARE ACTIVE
// NEXT CHECK IF INPUT VALUES HAVE A VALID UNIT
// LAST CHECK IF INPUT MATCHES THE DATA OF INPUT
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
    let sFontActive = data[levelN - 1].sboxh;

    // Margin
    let marginUnit = getArrayUnit(levelN, ".inputMargin");
    let inputMargin = document.querySelector("#level-" + levelN + " .inputMargin").value;

    // Convert margin input from one value or two value to four values
    if (splitToArray(inputMargin).length == 1) {
        inputMargin = inputMargin + " " + inputMargin + " " + inputMargin + " " + inputMargin;
    } else if (splitToArray(inputMargin).length == 2) {
        inputMargin = splitToArray(inputMargin)[0] + " " + splitToArray(inputMargin)[1] + " " + splitToArray(inputMargin)[0] + " " + splitToArray(inputMargin)[1];
    }

    // Padding
    let paddingUnit = getArrayUnit(levelN, ".inputPadding");
    let inputPadding = document.querySelector("#level-" + levelN + " .inputPadding").value;

    // Convert padding input from one value or two value to four values
    if (splitToArray(inputPadding).length == 1) {
        inputPadding = inputPadding + " " + inputPadding + " " + inputPadding + " " + inputPadding;
    } else if (splitToArray(inputPadding).length == 2) {
        inputPadding = splitToArray(inputPadding)[0] + " " + splitToArray(inputPadding)[1] + " " + splitToArray(inputPadding)[0] + " " + splitToArray(inputPadding)[1];
    }


    // Used to generate correct or false message at the end
    let checkStatus = 0;


    // Check every input for beeing active, then the unit and finaly the value
    if (bbActive == 1) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN)) {



            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput);
            bigBox.style.width = replaceViewport(bWidthInput);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw) {

            } else {
                checkStatus = 1;
            };
        } else {
            checkStatus = 1;
            return;
        };
    }

    if (sbActive === "div") {
        if (checkAllowedUnit(sHeightUnit, sWidthUnit, levelN)) {

            console.log("Small box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallBox.style.height = replaceViewport(sHeightInput);
            smallBox.style.width = replaceViewport(sWidthInput);

            // Check if inputs are correct
            if (sHeightInput === dataL.sboxh && sWidthInput === dataL.sboxw) {

            } else {
                checkStatus = 1;
            };
        } else {
            checkStatus = 1;
            return;
        };
    }

    if (sbActive === "p") {
        if (checkAllowedUnit(sFontUnit, "px", levelN)) {

            console.log("Font box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.fontSize = replaceViewport(sFontInput);

            // Check if inputs are correct
            if (sFontInput === dataL.sboxh) {

            } else {
                checkStatus = 1;
            };
        } else {
            checkStatus = 1;
            return;
        };
    }

    if (marginArrayActive(levelN)) {
        if (marginUnit) {

            console.log("Margin box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.margin = replaceViewport(inputMargin);
            smallBox.style.margin = replaceViewport(inputMargin);

            // Check if inputs are correct
            if (inputMargin === dataL.sboxm) {

            } else {
                checkStatus = 1;
            };
        } else {
            checkStatus = 1;
            return;
        };
    }

    if (paddingArrayActive(levelN)) {
        if (paddingUnit) {

            console.log("Padding box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.padding = replaceViewport(inputPadding);
            smallBox.style.padding = replaceViewport(inputPadding);
            // Check if inputs are correct
            if (inputPadding === dataL.sboxp) {

            } else {
                checkStatus = 1;
            };
        } else {
            checkStatus = 1;
            return;
        };
    }

    console.log("++++++")
    console.log(checkStatus);
    // If checkstatus is 0 = correct and display message
    if (checkStatus === 0) {
        displayCorrectMessage("CORRECT!");
        displayExplainThis(levelN - 1);
    } else {
        displayWrongMessage("Not correct!");
    }
}
// get the height unit of an input
function getHeightUnit(levelN, box) {
    let heightInput = document.querySelector("#level-" + levelN + " " + box + " .inputHeight").value;
    let heightInputUnit = heightInput.substr(-2);
    if (heightInputUnit.includes("%")) {
        heightInputUnit = "%"
    };
    return heightInputUnit;
}

// get the width unit of an input
function getWidthUnit(levelN, box) {
    let widthInput = document.querySelector("#level-" + levelN + " " + box + " .inputWidth").value;
    let widthInputUnit = widthInput.substr(-2);
    if (widthInputUnit.includes("%")) {
        widthInputUnit = "%"
    };
    return widthInputUnit;
}

// get the unit of multiple inputs for margin or padding input
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

// check if margin has been defined as active for current level
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
// check if padding has been defined as active for current level
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

// split multiple inputs from margin or padding into an array list. Instead of = "10px 10px 10px 10px" it is var array = ["10px","10px",...]
function splitToArray(input) {
    let array = input.split(/[ ]/);
    return array;
}



// Replace all vh and vw to %
function replaceViewport(text) {
    let temp = text.replace("vh", "%");
    let temp2 = temp.replace("vw", "%");
    return temp2;
}


// check if array input has valid units
function checkAllowedUnitArray(array, levelN) {
    let allowed = ["vh", "vw" , "px", "em", "%"];
    let status = 0;

    array.forEach(elem => {
        if (allowed.indexOf(elem) > -1) {} else {
            status = 1;
        }
    });
    if (status) {
        console.log("checkAllowedUnit false");
        displayWrongMessage("Invalid unit!");
        return false;
    } else {
        return true;
    }
}

// check if either big box, small box, or font has valid units (font just checks checkForHeight - 2nd parameter is defined as 10px so it returns true)
function checkAllowedUnit(checkForHeight, checkForWidth, levelN) {
    let allowedH = ["vh", "px", "em", "%"];
    let allowedW = ["vw", "px", "em", "%"];
    let status = 0;

    if (allowedH.indexOf(checkForHeight) > -1) {
        //do nothing
        console.log("checkAllowedUnit true");
        //Check width units
        if (allowedW.indexOf(checkForWidth) > -1) {
            //do nothing
            console.log("checkAllowedUnit true");
            return true;
        } else {
            displayWrongMessage("Invalid unit!");
            console.log("checkAllowedUnit false");
            return false;
        };
    } else {
        displayWrongMessage("Invalid unit!");
        console.log("checkAllowedUnit false");
        return false;
    }
}

// depending on data, resize the boxes or text to their default sizes.
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
function displayWrongMessage(message) {

    wrongMessage.textContent = message;
    wrongMessage.classList.remove("hide");
    wrongTimeout = setTimeout(function () {
        wrongMessage.classList.add("hide");
    }, 4000)

}
//display correct message
function displayCorrectMessage(message) {
    correctMessage.textContent = message;
    correctMessage.classList.remove("hide");
}

function displayExplainThis(level) {


    if (data[level].noticemessage != "") {
        explainThis.innerHTML = data[level].noticemessage;
        explainThis.classList.remove("hide");
        document.querySelector("#info .explanation").style.width = "50%";
    }
}

function closeAllMessages(){
    explainThis.classList.add("hide");
    correctMessage.classList.add("hide");
    wrongMessage.classList.add("hide");
    clearTimeout(wrongTimeout);
    document.querySelector("#info .explanation").style.removeProperty("width");
}

function changeTabFocus(level){
    console.log("+++++++++");
    console.log(level);
    let inputArray = document.querySelectorAll("#sidebar input");
    let buttonArray = document.querySelectorAll("#sidebar button");

    let inputActive = document.querySelectorAll("#level-" + level + " input")
    let buttonActive = document.querySelectorAll("#level-" + level + " button")

    //Disable all for tab
    inputArray.forEach(elem=>{
      elem.setAttribute("tabIndex", "-1");
    })
    buttonArray.forEach(elem=>{
      elem.setAttribute("tabIndex", "-1");
    })

    //Enable only active
    inputActive.forEach(elem=>{
      elem.setAttribute("tabIndex", "0");
    })
    buttonActive.forEach(elem=>{
      elem.setAttribute("tabIndex", "0");
    })
}

//show more or less info about css game (modal screen)
function showInfo(status) {
    let infoIcon = document.querySelector("#info .info-icon");
    let moreInfo = document.querySelector("#info .more-info");
    let moreInfoBackground = document.querySelector(".dark-background");

    if (status == "true") {
        moreInfo.style.top = "0vh";
        moreInfoBackground.style.bottom = "0px";
    } else {
        moreInfo.style.removeProperty("top");
        moreInfoBackground.style.removeProperty("bottom");
    }
}

// Info modal, switch between tablet example with units and
// explanation of margin and padding.
function switchMoreInfo(status) {
    let firstRight = document.querySelector("#info .info-right");
    let secondRight = document.querySelector("#info .info-second-right");
    let switchOne = document.querySelector("#info .switch-info-tab-1");
    let switchTwo = document.querySelector("#info .switch-info-tab-2");

    if (status == "second") {
        switchOne.classList.add("hide");
        firstRight.style.opacity = 0;
        setTimeout(function () {
            firstRight.classList.add("hide");
        }, 500);
        setTimeout(function () {
            secondRight.classList.remove("hide");
        }, 600);
        setTimeout(function () {
            secondRight.style.opacity = 1;
        }, 700);
        setTimeout(function () {
            switchTwo.classList.remove("hide");
        }, 800);

    } else {
        switchTwo.classList.add("hide");
        secondRight.style.opacity = 0;
        setTimeout(function () {
            secondRight.classList.add("hide");
        }, 500);
        setTimeout(function () {
            firstRight.classList.remove("hide");
        }, 600);
        setTimeout(function () {
            firstRight.style.opacity = 1;
        }, 700);
        setTimeout(function () {
            switchOne.classList.remove("hide");
        }, 800);

    }
}


// show more or less info about the website and creator
function showAbout(status) {
    let aboutIcon = document.querySelector("#about .about-icon");
    let moreAbout = document.querySelector("#about .more-about");
    let moreAboutBackground = document.querySelector(".dark-background");

    if (status == "true") {
        moreAbout.style.top = "0vh";
        moreAboutBackground.style.bottom = "0px";
    } else {
        moreAbout.style.removeProperty("top");
        moreAboutBackground.style.removeProperty("bottom");
    }
}

// eventListener for the "ENTER" key, which can be used to click the "Apply & Check" buttons
document.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        checkBoxSize(currentLevel);

    }
});

// disable mobile warning message for small screen
function letMeContinue() {
    document.querySelector("#screenWarning").style.display = "none";
}
