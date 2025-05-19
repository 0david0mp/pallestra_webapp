let dropdownOpen = false;

function menuButtonEventHandler(event) {
    let menuToggle = document.querySelector("#menu-toggle");
    console.log("top menu open: " + menuToggle.checked)

    if (!menuToggle.checked) {
        document.querySelector("#menu-button").textContent = "x";
    } else if (menuToggle.checked){
        document.querySelector("#menu-button").textContent = "=";
    }
}

function dropdownMenuEventHandler() {
    let dropdownMenu = document.querySelector(".dropdown");

    console.log("dropdown menu open: " + dropdownOpen)

    dropdownOpen = !dropdownOpen;
    if (dropdownOpen) dropdownMenu.classList.add("open");
    else dropdownMenu.classList.remove("open");
}

window.addEventListener('load', function() {
    let dropdownButton = document.querySelector(".dropdown");
    let menuButton = document.querySelector("#menu-button");

    menuButton.addEventListener("click", (event) => { menuButtonEventHandler(event); });

    dropdownButton.addEventListener("click", dropdownMenuEventHandler);
});
