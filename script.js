const networkProviderDic = {
    "A": "AIRTEL",
    "N": "9MOBILE",
    "9": "9MOBILE",
    "E": "ETISALAT",
    "M": "MTN",
    "G": "GLO"
};

const loadCodeForProviderDic = {
    "A": "*311*PIN#",
    "N": "*311*PIN#",
    "9": "*311*PIN#",
    "E": "*311*PIN#",
    "M": "*311*PIN#",
    "G": "*203*3*PIN#"
};

function getWords(text) {
    // Returns a list of words from a string, with punctuation removed
    return text.toUpperCase().match(/\w+/g);
}


function formatEpins() {
    const companyNameElem = document.getElementById('txtCompanyName');
    const epinListStringElem = document.getElementById('txtEpinDetails');
    const networkAndAmountElem = document.getElementById('lstNetworkAndAmount');

    // Show the output container
    document.getElementById("output").classList.remove("outputHidden");
    document.getElementById("outputHeader").style.display = "block";
    document.getElementById("output").style.display = "block";

    let numberOfDashes = 40;
    let companyName = "";
    let advertText = "";

    if (companyNameElem.value.includes("|")) {
        const listOfStrings = companyNameElem.value.split("|");
        companyName = listOfStrings[0];

        const lastElement = listOfStrings[listOfStrings.length - 1];
        if (listOfStrings.length === 2) {
            if (!isNaN(lastElement)) {
                numberOfDashes = parseInt(lastElement);
            } else {
                advertText = lastElement;
            }
        } else if (listOfStrings.length === 3) {
            advertText = listOfStrings[1];
            if (!isNaN(lastElement)) {
                numberOfDashes = parseInt(lastElement);
            }
        }
    } else if (companyNameElem.value.includes("/")) {
        const companyNameParts = companyNameElem.value.split("/");
        companyName = companyNameParts[0];
        numberOfDashes = parseInt(companyNameParts[1]);
    } else {
        companyName = companyNameElem.value;
    }

    const epinLongText = epinListStringElem.value;
    const [networkCode, cardAmount] = networkAndAmountElem.value.split("|");

    const allWordsList = getWords(epinLongText);
    const networkIndexList = [];
    for (let i = 0; i < allWordsList.length; i++) {
        if (allWordsList[i] === networkProviderDic[networkCode]) {
            networkIndexList.push(i);
        }
    }

    const epinList = [];
    for (const index of networkIndexList) {
        epinList.push(allWordsList[index - 1]);
    }

    let epinFinalString = "";

    const sixDaysFromNow = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);
    const formattedDate = sixDaysFromNow.toLocaleString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    for (let index = 0; index < epinList.length; index++) {
        const epinWithDashes = epinList[index].match(/.{1,4}/g).join('-');

        epinFinalString += `${companyName.toUpperCase()}\n`;
        epinFinalString += `${networkProviderDic[networkCode]} ₦${cardAmount}\n`;
        epinFinalString += `PIN: ${epinWithDashes}\n`;
        epinFinalString += `HOW TO LOAD: ${loadCodeForProviderDic[networkCode]}\n`;

        if (networkCode === "G") {
            epinFinalString += `e.g. *203*3*${epinList[index]}#\n`;
            epinFinalString += `USE BEFORE ${formattedDate}\n`;
        }

        if (advertText) {
            epinFinalString += `${advertText.toUpperCase()}\n`;
        }

        if (index < epinList.length - 1) {
            epinFinalString += "-".repeat(numberOfDashes) + "\n";
        }
    }

    document.getElementById("output").innerHTML = epinFinalString.trim();
    document.getElementById("outputHeader").innerHTML = "Click Copy Output Button";
    document.getElementById('btnFormatEpins').disabled = true;
}

function copyOutputContent() {
    const output = document.getElementById("output");
    navigator.clipboard.writeText(output.textContent);

    document.getElementById("outputHeader").innerHTML = "Output Copied! Print Now!"
    document.getElementById('txtCompanyName').value = "";
    document.getElementById('lstNetworkAndAmount').selectedIndex = 0;
    document.getElementById('txtEpinDetails').value = "";
    document.getElementById('btnFormatEpins').disabled = false;

    output.innerHTML = "";
    output.classList.add("outputHidden");
}

document.getElementById("footerYear").innerHTML = new Date().getFullYear();