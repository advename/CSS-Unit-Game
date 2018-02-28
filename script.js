const mainContainer = document.querySelector("main #main-container");
const mainContainerSize = mainContainer.getBoundingClientRect();
const svg = document.querySelector("main svg");
const svgDesktop = document.querySelector("main #desktop-svg rect.cls-5");
const bigBox = document.querySelector("#bigBox");
const smallBox = document.querySelector("#smallBox");
const smallText = document.querySelector("#smallText");
const play = document.querySelector("main #play");
const levelTemplate = document.querySelector("#level-template").content;
const sideBar = document.querySelector("#sidebar");
const sideBarLevels = document.querySelector("#sidebar .sidebar-levels");
const leftDirection = document.querySelector("#direction .left");
const rightDirection = document.querySelector("#direction .right");
const sideBarContainer = document.querySelector("#sidebar-container");
const sideBarContainerSize = sideBarContainer.getBoundingClientRect();
const inputArray = document.querySelectorAll("#sidebar input");
const buttonArray = document.querySelectorAll("#sidebar button");
const showSolutionButton = document.querySelector("#sidebar-container .show-solution");
const result = document.querySelector("#result");
const resultMessage = document.querySelector("#result .message");
const resultState = document.querySelector("#result .state");
const resultProceed = document.querySelector("#result .proceed");
const infoClose = document.querySelector("#info .info-close");
const moreInfo = document.querySelector("#info .more-info");
const moreInfoBackground = document.querySelector(".dark-background");

//Google spreadsheet jSON link
var link =
    "https://spreadsheets.google.com/feeds/list/1T2dyKXx_OuFsAcSLnPaUYEamOZpcW4uEDNOEZqYZcok/od6/public/values?alt=json";

var topValue = void 0,
    data = void 0,
    widthOfSideBar = void 0,
    levelContainer = void 0,
    wrongTimeout = void 0;

//Global value of current level
var currentLevel = 1;

//Allowed units for vertical and hoizontal directions or global
var allowedH = ["vh", "px", "em", "%", "auto"];
var allowedW = ["vw", "px", "em", "%", "auto"];
var allowed = ["vh", "vw", "px", "em", "%", "auto"];

init();
// INITIALIZE SIZES
function init() {
    svg.style.height = "95%";
    svg.style.width = "95%";
    reSizePlay();

    function reSizePlay() {
        var svgDesktopSize = svgDesktop.getBoundingClientRect();

        function getOffset(el) {
            el = el.getBoundingClientRect();
            return {
                left: el.left + window.scrollX,
                top: el.top + window.scrollY
            };
        }
        play.style.height = svgDesktopSize.height + "px";
        play.style.width = svgDesktopSize.width - 1.3 + "px";
        topValue = Math.abs(getOffset(svgDesktop).top - getOffset(play).top);
        play.style.top = -1 * topValue + "px";
        play.style.bottom = topValue + "px";
    }

    console.log(sideBarContainerSize.width);
    // Resize sidebar
    sideBar.style.width = sideBarContainerSize.width - 40 + "px";
    showInfo("true");
    console.log("init");
}

// Transform Google JSON data to normal array (JONAS FROM KEA'S google spreadsheet to jSON code GitHub)
var FetchGoogleJSON = function FetchGoogleJSON(url, callback, prettify) {
    prettify = prettify === undefined ? true : prettify;
    var re = /^https:/;
    if (!re.test(url))
        url =
        "https://spreadsheets.google.com/feeds/list/" +
        url +
        "/od6/public/values?alt=json";
    fetch(url)
        .then(function (e) {
            return e.json();
        })
        .then(function (d) {
            if (prettify) callback(new PrettifyGoogleJSON(d).get());
            else callback(d);
        });
};
var PrettifyGoogleJSON = function PrettifyGoogleJSON(googleData) {
    var $jscomp$this = this;
    this.newJSON = [];
    var re = /^gsx\$/;
    googleData.feed.entry.forEach(function (obj) {
        var temp = {};
        for (var prop in obj) {
            if (re.test(prop)) {
                var parts = prop.split("$");
                temp[parts[1]] = obj[prop].$t;
            }
        }
        $jscomp$this.newJSON.push(temp);
    });
};
PrettifyGoogleJSON.prototype.get = function () {
    return this.newJSON;
};
// and work with the retrieved data!
new FetchGoogleJSON(link, show);

function show(d) {
    console.log(d);
    data = d;
    createLevels();
    sideBarLevels.style.width =
        data.length * (sideBarContainerSize.width - 40) + "px";
}

// Fetch data, clone the template and append levels into body
function createLevels() {
    data.forEach(function (elem) {
        var clone = levelTemplate.cloneNode(true);

        clone.querySelector("#level-n").id = "level-" + elem.level;
        clone.querySelector(".level-number").textContent = "Level " + elem.level;
        clone.querySelector(".description").innerHTML = elem.description;

        if (elem.level == 1) {
            clone.querySelector("#level-" + elem.level).style.left = "0px;";
        }
        if (elem.bboxa == 1) {
            clone.querySelector(".bigBox-control").classList.remove("hide");
        }
        if (elem.sboxa === "div") {
            clone.querySelector(".smallBox-control").classList.remove("hide");
            clone.querySelector(".smallBox-control h3").textContent =
                "Green container controls:";
        }
        if (elem.sboxa === "p") {
            clone.querySelector(".smallBox-control").classList.remove("hide");
            clone.querySelector(".smallBox-control h3").textContent =
                "Text controls:";
            clone.querySelector(".smallBox-control .text-height").textContent =
                "Font-size:";
            clone
                .querySelector(".smallBox-control .text-width")
                .classList.add("hide");
            if (elem.sboxh == 0) {
                clone
                    .querySelector(".smallBox-control .inputHeight")
                    .classList.add("hide");
            }
            clone
                .querySelector(".smallBox-control .inputWidth")
                .classList.add("hide");
        }
        clone
            .querySelector("button")
            .setAttribute("onClick", "checkBoxSize('" + elem.level + "')");
        sideBarLevels.appendChild(clone);
    });
    //Resize the width of each level container in the sidebar
    levelContainer = document.querySelectorAll(".level-container");
    levelContainer.forEach(function (elem) {
        elem.style.width = sideBarContainerSize.width - 50 + "px";
    });
    hideShowSmall(1);
    changeTabFocus(1);

    // Jump directly to a level with the link css-game.com/#level-6
    // and disable frontpage
    if (window.location.hash != "") {
        var value = window.location.hash.replace("#level-", "");
        for (var i = 0; i < value - 1; i++) {
            changeRight();
        }
        showInfo("false");
    }
}

// With arrow keys left and right to change levels
function changeLeft() {
    rightDirection.classList.remove("hide");
    currentLevel = currentLevel - 1;
    closeAllMessages();
    changeTabFocus(currentLevel);
    hideShowSmall(currentLevel);
    defaultSize(currentLevel);

    if (currentLevel === 1) {
        leftDirection.classList.add("hide");
    } else if (currentLevel == data.length) {
        rightDirection.classList.add("hide");
    }
    history.replaceState(undefined, undefined, "#level-" + currentLevel);
    sideBarLevels.style.left = -1 * (currentLevel - 1) * (sideBarContainerSize.width - 40) + "px";
    showSolutionButton.style.visibility = "hidden";
}

// With arrow keys left and right to change levels
function changeRight() {
    leftDirection.classList.remove("hide");
    currentLevel = currentLevel + 1;
    closeAllMessages();
    changeTabFocus(currentLevel);
    hideShowSmall(currentLevel);
    defaultSize(currentLevel);
    if (currentLevel === 1) {
        leftDirection.classList.add("hide");
    } else if (currentLevel == data.length) {
        rightDirection.classList.add("hide");
    }
    history.replaceState(undefined, undefined, "#level-" + currentLevel);
    sideBarLevels.style.left = -1 * (currentLevel - 1) * (sideBarContainerSize.width - 40) + "px";
    showSolutionButton.style.visibility = "hidden";
}

// Depending on current level, hide or show small green box/text/margin/padding inputs
function hideShowSmall(level) {
    var cLevel = level - 1;
    if (data[cLevel].sboxa === "div") {
        smallBox.classList.remove("hide");
        smallText.classList.add("hide");
        document
            .querySelector("#level-" + level + " .smallBox-control")
            .classList.remove("textBorder");
    } else if (data[cLevel].sboxa === "p") {
        smallText.classList.remove("hide");
        smallBox.classList.add("hide");
        document
            .querySelector("#level-" + level + " .smallBox-control")
            .classList.add("textBorder");
    } else {
        smallBox.classList.add("hide");
        smallText.classList.add("hide");
    }
    var marginString = data[level - 1].sboxm;
    var marginArray = marginString.split(/[ ]/);
    if (marginArray.indexOf("0") > -1) {
        document
            .querySelector("#level-" + level + " .sMarginTree")
            .classList.add("hide");
    } else {
        document
            .querySelector("#level-" + level + " .sMarginTree")
            .classList.remove("hide");
    }

    var paddingString = data[level - 1].sboxp;
    var paddingArray = paddingString.split(/[ ]/);
    if (paddingArray.indexOf("0") > -1) {
        document
            .querySelector("#level-" + level + " .sPaddingTree")
            .classList.add("hide");
    } else {
        document
            .querySelector("#level-" + level + " .sPaddingTree")
            .classList.remove("hide");
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CHECK FOR INPUTS IF THEY ARE ACTIVE
// NEXT CHECK IF INPUT VALUES HAVE A VALID UNIT
// LAST CHECK IF INPUT MATCHES THE DATA OF INPUT
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function checkBoxSize(levelN) {
    // Current levels array data
    var dataL = data[levelN - 1];
    var sbActive = data[levelN - 1].sboxa;
    var bbActive = data[levelN - 1].bboxa;
    var marginActive = void 0;

    //BIG BOX VARIABLES

    var bHeightUnit = getHeightUnit(levelN, ".bigBox-control");
    var bHeightInput = document.querySelector(
        "#level-" + levelN + " .bigBox-table .inputHeight"
    ).value;

    var bWidthUnit = getWidthUnit(levelN, ".bigBox-control");
    var bWidthInput = document.querySelector(
        "#level-" + levelN + " .bigBox-table .inputWidth"
    ).value;

    //Green Box (small box) VARIABLES
    var sHeightUnit = getHeightUnit(levelN, ".smallBox-control");
    var sHeightInput = document.querySelector(
        "#level-" + levelN + " .smallBox-table .inputHeight"
    ).value;

    var sWidthUnit = getWidthUnit(levelN, ".smallBox-control");
    var sWidthInput = document.querySelector(
        "#level-" + levelN + " .smallBox-table .inputWidth"
    ).value;

    // Font size
    var sFontUnit = getHeightUnit(levelN, ".smallBox-control");
    var sFontInput = document.querySelector(
        "#level-" + levelN + " .smallBox-table .inputHeight"
    ).value;
    var sFontActive = data[levelN - 1].sboxh;

    // Margin
    var marginUnit = getArrayUnit(levelN, ".inputMargin");
    var inputMargin = document.querySelector("#level-" + levelN + " .inputMargin")
        .value;

    // Convert margin input from one value or two value to four values
    if (splitToArray(inputMargin).length == 1) {
        inputMargin =
            inputMargin + " " + inputMargin + " " + inputMargin + " " + inputMargin;
    } else if (splitToArray(inputMargin).length == 2) {
        inputMargin =
            splitToArray(inputMargin)[0] +
            " " +
            splitToArray(inputMargin)[1] +
            " " +
            splitToArray(inputMargin)[0] +
            " " +
            splitToArray(inputMargin)[1];
    }

    // Padding
    var paddingUnit = getArrayUnit(levelN, ".inputPadding");
    var inputPadding = document.querySelector(
        "#level-" + levelN + " .inputPadding"
    ).value;

    // Convert padding input from one value or two value to four values
    if (splitToArray(inputPadding).length == 1) {
        inputPadding =
            inputPadding +
            " " +
            inputPadding +
            " " +
            inputPadding +
            " " +
            inputPadding;
    } else if (splitToArray(inputPadding).length == 2) {
        inputPadding =
            splitToArray(inputPadding)[0] +
            " " +
            splitToArray(inputPadding)[1] +
            " " +
            splitToArray(inputPadding)[0] +
            " " +
            splitToArray(inputPadding)[1];
    }

    // Used to generate correct or false message at the end
    var checkStatus = 0;

    // Check every input for beeing active, then the unit and finaly the value
    if (bbActive == 1) {
        if (checkAllowedUnit(bHeightUnit, bWidthUnit, levelN)) {
            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            bigBox.style.height = replaceViewport(bHeightInput, levelN);
            bigBox.style.width = replaceViewport(bWidthInput, levelN);

            // Check if inputs are correct
            if (bHeightInput === dataL.bboxh && bWidthInput === dataL.bboxw) {} else {
                checkStatus = 1;
                shakeInput(bHeightInput);
                shakeInput(bWidthInput);
            }
        } else {
            checkStatus = 1;
            return;
        }
    }

    if (sbActive === "div") {
        if (checkAllowedUnit(sHeightUnit, sWidthUnit, levelN)) {
            console.log("Small box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallBox.style.height = replaceViewport(sHeightInput, levelN);
            smallBox.style.width = replaceViewport(sWidthInput, levelN);

            // Check if inputs are correct
            if (sHeightInput === dataL.sboxh && sWidthInput === dataL.sboxw) {} else {
                checkStatus = 1;
                shakeInput(sHeightInput);
                shakeInput(sWidthInput);
            }
        } else {
            checkStatus = 1;
            return;
        }
    }

    if (sbActive === "p") {
        if (checkAllowedUnit(sFontUnit, "px", levelN)) {
            console.log("Font box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.fontSize = replaceViewport(sFontInput, levelN);

            // Check if inputs are correct
            if (sFontInput === dataL.sboxh) {} else {
                checkStatus = 1;
                shakeInput(sFontInput);
            }
        } else {
            checkStatus = 1;
            return;
        }
    }

    if (marginArrayActive(levelN)) {
        if (marginUnit) {
            console.log("Margin box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.margin = replaceViewport(inputMargin, levelN);
            smallBox.style.margin = replaceViewport(inputMargin, levelN);

            // Check if inputs are correct
            if (inputMargin === dataL.sboxm) {} else {
                checkStatus = 1;
                shakeInput(inputMargin);
            }
        } else {
            checkStatus = 1;
            return;
        }
    }

    if (paddingArrayActive(levelN)) {
        if (paddingUnit) {
            console.log("Padding box passed");

            // Because of created Window, change viewports to percentage in order to fit to size
            // Apply heights
            smallText.style.padding = replaceViewport(inputPadding, levelN);
            smallBox.style.padding = replaceViewport(inputPadding, levelN);
            // Check if inputs are correct
            if (inputPadding === dataL.sboxp) {} else {
                checkStatus = 1;
                shakeInput(paddingUnit);
            }
        } else {
            checkStatus = 1;
            return;
        }
    }

    // If checkstatus is 0 = correct and display message
    if (checkStatus === 0) {
        displayResult("CORRECT!", true, levelN - 1);

        //Remove incorrect animation and background
        var activeInputs = document.querySelectorAll("#level-" + currentLevel + " input");
        activeInputs.forEach(function (elem) {
            elem.classList.remove("shake-input");
        });
    } else {
        displayResult("Not correct!", false);
    }
}

// get the height unit of an input
function getHeightUnit(levelN, box) {
    var heightInput = document.querySelector(
        "#level-" + levelN + " " + box + " .inputHeight"
    ).value;
    var temp = heightInput.replace(/\./g, "");
    var heightInputUnit = temp.replace(/[0-9]/g, "");
    return heightInputUnit;
}

// get the width unit of an input
function getWidthUnit(levelN, box) {
    var widthInput = document.querySelector(
        "#level-" + levelN + " " + box + " .inputWidth"
    ).value;
    var temp = widthInput.replace(/\./g, "");
    var widthInputUnit = temp.replace(/[0-9]/g, "");
    return widthInputUnit;
}

// get the unit of multiple inputs in an array for margin or padding input
function getArrayUnit(levelN, box) {
    var arrayUnit = [];
    var arrayInput = document.querySelector("#level-" + levelN + " " + box).value;
    var arrayInputValues = arrayInput.split(/[ ]/);
    arrayInputValues.forEach(function (elem) {
        var temp2 = elem.replace(/[0-9]/g, "");
        arrayUnit.push(temp2);
    });
    return arrayUnit;
}

// check if margin has been defined as active for current level
function marginArrayActive(levelN) {
    var status = 0;
    var array = data[levelN - 1].sboxm.split(/[ ]/);
    array.forEach(function (elem) {
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
    var status = 0;
    var array = data[levelN - 1].sboxp.split(/[ ]/);
    array.forEach(function (elem) {
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
    var array = input.split(/[ ]/);
    return array;
}

// Replace all vh and vw to %
function replaceViewport(text, levelN) {
    if (data[levelN - 1].viewporta == 0) {
        var temp = text.replace("vh", "%");
        var temp2 = temp.replace("vw", "%");
        return temp2;
    } else {
        return text;
    }
}

// check if either big box, small box, or font has valid units (font just checks checkForHeight - 2nd parameter is defined as 10px so it returns true)
function checkAllowedUnit(checkForHeight, checkForWidth, levelN) {
    var status = 0;

    if (allowedH.indexOf(checkForHeight) > -1) {
        //do nothing
        console.log("checkAllowedUnit true");
        //Check width units
        if (allowedW.indexOf(checkForWidth) > -1) {
            //do nothing
            console.log("checkAllowedUnit true");
            return true;
        } else {
            displayResult("Invalid unit!", false);
            console.log("checkAllowedUnit false");
            showSolutionButton.style.visibility = "visible";
            shakeInput(checkForWidth);
            return false;
        }
    } else {
        displayResult("Invalid unit!", false);
        console.log("checkAllowedUnit false");
        showSolutionButton.style.visibility = "visible";
        shakeInput(checkForHeight);
        return false;
    }
}

// check if array input has valid units
function checkAllowedUnitArray(array, levelN) {
    var status = 0;

    array.forEach(function (elem) {
        if (allowed.indexOf(elem) > -1) {} else {
            status = 1;
        }
    });
    if (status) {
        console.log("checkAllowedUnit false");
        displayResult("Invalid unit!", false);
        showSolutionButton.style.visibility = "visible";
        shakeInput(array);
        return false;
    } else {
        return true;
    }
}

//show and shake the input field with incorrect input
function shakeInput(value) {
    var activeInputs = document.querySelectorAll("#level-" + currentLevel + " input");
    var shakeInputAnimation = document.querySelectorAll("#sidebar .shake-input");

    //remove class from all inputs
    activeInputs.forEach(function (elem) {
        elem.classList.remove("shake-input");
    });

    setTimeout(function () {
        activeInputs.forEach(function (elem) {
            elem.classList.remove("shake-input");
            if (elem.value == undefined) {
                elem.classList.add("shake-input");
                console.log("undefined 2");
            }
            if (elem.value.indexOf(value) > -1) {
                elem.classList.add("shake-input");
                console.log("indexOf");
            } else {
                console.log("none");
            }
        });
    }, 50);

    console.log("nothing");
}

// depending on data, resize the boxes or text to their default sizes.
function defaultSize(level) {
    var defaultSizeDataBB = data[level - 1].bboxd;
    var defaultArrayBB = defaultSizeDataBB.split(/[/]/);
    var defaultSizeDataSB = data[level - 1].sboxd;
    var defaultArraySB = defaultSizeDataSB.split(/[/]/);
    bigBox.style.height = defaultArrayBB[0];
    bigBox.style.width = defaultArrayBB[1];
    if (data[level - 1].sboxa === "div") {
        smallBox.style.height = defaultArraySB[0];
        smallBox.style.width = defaultArraySB[1];
        smallBox.style.removeProperty("margin");
        smallBox.style.removeProperty("padding");
    } else if (data[level - 1].sboxa === "p") {
        smallText.style.fontSize = defaultArraySB[0];
        smallText.style.removeProperty("margin");
        smallText.style.removeProperty("padding");
    }
}

// Display Correct or wrong message with given Message input
function displayResult(message, value, level) {
    result.style.removeProperty("top");
    result.style.removeProperty("width");
    clearTimeout(wrongTimeout);
    if (value == false) {
        resultState.innerHTML = "&#10008; WRONG";
        resultMessage.textContent = message;
        resultMessage.style.removeProperty("display");
        resultProceed.style.display = "none";
        resultMessage.style.borderBottomRightRadius = "15px";
        resultState.style.background = "#c0392b";
        resultMessage.style.background = "#e74c3c";
        result.style.top = "0px";
        wrongTimeout = setTimeout(function () {
            result.style.removeProperty("top");
        }, 2500);
    } else {
        resultProceed.style.removeProperty("display");
        resultMessage.style.removeProperty("border-bottom-right-radius");
        resultState.innerHTML = "&#10003; CORRECT";
        if (data[level].noticemessage != "") {
            resultMessage.style.removeProperty("display");
            resultMessage.innerHTML = "<p>" + data[level].noticemessage;
        } else {
            resultMessage.style.display = "none";
        }
        resultState.style.background = "#27ae60";
        resultMessage.style.background = "#2ecc71";
        resultProceed.style.background = "#58d68d";
        result.style.top = "0px";
    }
    //resize result div for center positioning fix
    setTimeout(function () {
            var resultSize = result.getBoundingClientRect().width;
            result.style.width = resultSize+"px";
    }, 10);
}

// Close all messages as correct/wrong, explain this etc...
function closeAllMessages() {
    result.style.removeProperty("top");
    clearTimeout(wrongTimeout);
}

// Fix for using the TAB key switching between inputs only available for current active level
function changeTabFocus(level) {
    var inputActive = document.querySelectorAll("#level-" + level + " input");
    var buttonActive = document.querySelectorAll("#level-" + level + " button");

    //Disable all for tab
    inputArray.forEach(function (elem) {
        elem.setAttribute("tabIndex", "-1");
    });
    buttonArray.forEach(function (elem) {
        elem.setAttribute("tabIndex", "-1");
    });

    //Enable only active
    inputActive.forEach(function (elem) {
        elem.setAttribute("tabIndex", "0");
    });
    buttonActive.forEach(function (elem) {
        elem.setAttribute("tabIndex", "0");
    });
}

//show more or less info about css game (modal screen)
function showInfo(status) {
    if (status == "true") {
        infoClose.style.removeProperty("display");
        moreInfo.style.top = "0vh";
        moreInfoBackground.style.bottom = "0px";
    } else {
        infoClose.style.display = "none";
        moreInfo.style.removeProperty("top");
        moreInfoBackground.style.removeProperty("bottom");

        //First input field selected
        //let firstInput = document.querySelector("#level-1 input");
        //firstInput.focus();
    }
}

//Insert correct inputs and apply the checkBoxSize
function showSolution() {
    var levelN = currentLevel;
    try {
        document.querySelector(
                "#level-" + levelN + " .bigBox-table .inputHeight"
            ).value =
            data[levelN - 1].bboxh;
        document.querySelector(
                "#level-" + levelN + " .bigBox-table .inputWidth"
            ).value =
            data[levelN - 1].bboxw;
        document.querySelector(
                "#level-" + levelN + " .smallBox-table .inputHeight"
            ).value =
            data[levelN - 1].sboxh;
        document.querySelector(
                "#level-" + levelN + " .smallBox-table .inputWidth"
            ).value =
            data[levelN - 1].sboxw;
        document.querySelector(
                "#level-" + levelN + " .smallBox-table .inputHeight"
            ).value =
            data[levelN - 1].sboxh;
        document.querySelector("#level-" + levelN + " .inputMargin").value =
            data[levelN - 1].sboxm;
        document.querySelector("#level-" + levelN + " .inputPadding").value =
            data[levelN - 1].sboxp;
    } catch (err) {
        console.log("Error: " + err + ".");
    }
    checkBoxSize(levelN);
}

// eventListener for the "ENTER" key, which can be used to fire the "Apply & Check" button
document.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        checkBoxSize(currentLevel);
    }
});

// hide mobile warning message for small screen
function letMeContinue() {
    document.querySelector("#screenWarning").style.display = "none";
}

function refreshPage() {
    window.location.reload();
}

window.addEventListener('resize', function(event){
    document.querySelector("#resizeWarning").style.display = "table";
});
