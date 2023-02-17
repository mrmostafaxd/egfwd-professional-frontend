/////////////////////////////////
/*       global variables      */
/////////////////////////////////

// Personal API Key for OpenWeatherMap API
const apiKey = 'ca58cd12b4f07e16a15a2e9cb61423d3&units=imperial';

const zipInput = document.getElementById('zip');
const feelingsInput = document.getElementById('feelings');
const generateBtn = document.getElementById('generate');
const zipError = document.getElementById('zip-error');
const generateError = document.getElementById('generate-error');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const content = document.getElementById('content');


/////////////////////////////////
/*      Global functions       */
/////////////////////////////////

const getCurrentDate = () => {
    let d = new Date();
    return `${d.getMonth()+ 1}.${d.getDate()}.${d.getFullYear()}`;
};

const generateZipError = errorMessage => {
    zipInput.classList.add('error');
    zipError.textContent = errorMessage;

};

const generateApiError = errorMessage => {
    generateError.textContent = errorMessage;
};

// reset marked elements and error messages
const resetErrors = () => {
    zipInput.classList.remove('error');
    zipError.textContent = "";
    generateError.textContent = "";
};

// display the entries on the website
const modifyEntries = (dateEntry, tempEntry, feelingEntry) => {
    date.textContent = dateEntry ? `📅 ${dateEntry}` : "\xA0";
    temp.textContent = tempEntry ? `🌡 ${tempEntry}` : "\xA0";
    content.textContent = feelingEntry ? `❤️ ${feelingEntry}` : "\xA0";
};


/////////////////////////////////
/*       Event Handling        */
/////////////////////////////////

// prevent the user from entering non-numeric values
zipInput.addEventListener('input', () => {
    zipInput.value = zipInput.value.replace(/[^0-9]/g, '');
});

generateBtn.addEventListener('click', () => {
    resetErrors();
    // if the zip field is empty
    if (zipInput.value.trim() === "") {
        generateZipError("zip code field is empty");
        return;
    }

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipInput.value}&appid=${apiKey}`;

    chainFunctions(apiURL, '/postData', '/all');
});

const chainFunctions = async(apiURL, postRoute, getRoute) => {
    const weatherObj = {
        temp: await getApiData(apiURL), 
        date: getCurrentDate(),
        feelings: feelingsInput.value
    };
    // if there is problem in the api do not continue
    if(!weatherObj.temp) return;

    postData(postRoute, weatherObj);

    retrieveData(getRoute);
}

// get the temperature from api based on zip code
//      note: this will retrieve the last entry and display it if the zip code
//            is incorrect
const getApiData = async (url="") => {
    const response = await fetch(url);
    try {
        const data = await response.json();
        return data["main"]["temp"];
    } catch(error) {
        generateZipError("City not found")
        generateApiError("API has returned an error");
        return undefined;
    }
};

// POST the data object to the server 
const postData = async(url="", data="") => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error.message);
        generateApiError("Internal Server Error");
        return undefined;
    }
};

// GET data object from the server
//      note: this will retrieve the last entry and display it if some reason
//            the app failed to POST the correct data.   
const retrieveData = async (url) => {
    const request = await fetch(url);
    try {
        const data = await request.json();
        // if there was a problem in POST or GET
        if (!data.temp) throw new Error("empty data");
        modifyEntries(data.date, data.temp, data.feelings);
    } catch (error) {
        generateApiError("Internal Server Error");
        return undefined;
    }
};

