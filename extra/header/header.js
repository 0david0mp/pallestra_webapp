window.onload = function() {
    let dropdownButton = document.querySelector(".dropdown");
    let menuButton = document.querySelector("#menu-toggle");
    let dropdownOpen = false;
    let vw = window.innerWidth;

    menuButton.addEventListener("click", () => {
        console.log(menuButton.checked)
        if (menuButton.checked) {
            document.querySelector("#menu-button").textContent = "x";
        } else {
            document.querySelector("#menu-button").textContent = "=";
        }
    });

    dropdownButton.addEventListener("click", (event) => {
        let dropdownMenu = document.querySelector(".dropdown-menu");

        if (vw < 768) {
            dropdownOpen = !dropdownOpen;

            console.log(dropdownOpen)

            if (dropdownOpen) dropdownMenu.classList.add("open");
            else dropdownMenu.classList.remove("open");
        }
    });
}
