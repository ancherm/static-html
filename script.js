let mainContainer = document.getElementById("mainContainer");
let searchInput = mainContainer.querySelector('[type=search]');
let todosContainer = document.getElementById("todosContainer");

let resultArray = [];
let searchArray = [];

let loader = document.querySelector(".loader");


main();


async function main() {
    showLoader();
    resultArray = await jsonLoader();
    setTimeout(hideLoader, 2000);
}

async function jsonLoader() {
    let response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=20");
    let result = await response.json();
    return result;
}

function renderPage(array) {
    for (let i = 0; i < array.length; i++) {
        let elementContainer = document.createElement("div");
        elementContainer.id = array[i]["id"];

        todosContainer.appendChild(elementContainer);

        let idElement = document.createElement("div");
        idElement.textContent = "ID: " + array[i]["id"];
        elementContainer.append(idElement);

        let titleElement = document.createElement("div");
        titleElement.textContent = "Title: " + array[i]["title"];
        elementContainer.append(titleElement);

        let buttonElement = document.createElement("button");
        buttonElement.id = array[i]["id"];
        buttonElement.textContent = "Complete";

        elementContainer.append(buttonElement);
        
        if (array[i]["completed"]) {
            crossOut(elementContainer, buttonElement);
        }

    }
}

todosContainer.addEventListener("click", (event) => {
    if (event.target.nodeName === "BUTTON") {
        let array = [];

        if (searchArray.length === 0) {
            array = resultArray;
        } else {
            array = searchArray
        }

        let necessaryElement = array.find((el) => el.id === parseInt(event.target.getAttribute("id")));

        necessaryElement["completed"] = true;

        let element = document.getElementById(necessaryElement["id"]);

        // TODO
        // renderPage()
        crossOut(element, element.childNodes[2]);
    }
})

function debounce(f, ms) {
    return function exec(...args) {
        let prevCall = this.lastCall;
        this.lastCall = Date.now();

        if (prevCall === true && this.lastCall - prevCall <= ms) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => f(...args), ms);
    }
}

function handleInput(event) {
    let value = event.target.value;
    console.log(value);
    if (value !== "") {
        todosContainer.innerHTML = ""; 

        for (let i = 0; i < resultArray.length; i++) {
            let title = resultArray[i]["title"];

            if (title.includes(value)) {
                searchArray.push(resultArray[i]);
            }
        }
        renderPage(searchArray);
        searchArray = [];
    } else {
        todosContainer.innerHTML = ""; 
        renderPage(resultArray);
    }

}

function crossOut(containerEl, buttonEl) {
    containerEl.style.textDecoration = "line-through";
    buttonEl.style.textDecoration = "line-through";
}


let debouncedHandle = debounce(handleInput, 500);

searchInput.addEventListener("input", debouncedHandle);


function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
    todosContainer.style.display = "block";
    renderPage(resultArray);
}
