let dropdownOpen = false;

function menuButtonEventHandler() {
    let menuToggle = document.querySelector('#menu-toggle');
    console.log('top menu open: ' + menuToggle.checked)

    if (!menuToggle.checked) {
        document.querySelector('#menu-button').textContent = 'x';
    } else if (menuToggle.checked) {
        document.querySelector('#menu-button').textContent = '☰';
    }
}

function dropdownMenuEventHandler() {
    let dropdownMenu = document.querySelector('.dropdown');

    console.log('dropdown menu open: ' + dropdownOpen)

    dropdownOpen = !dropdownOpen;
    if (dropdownOpen) dropdownMenu.classList.add('open');
    else dropdownMenu.classList.remove('open');
}

async function contactFormSubmitHandler() {
    console.log('contacting...');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let reason = document.getElementById('reason');
    let valid = true;

    [name, email].forEach(e => { e.classList.remove('error'); });

    if (!name.value) {
        name.classList.add('error');
        valid = false;
    }
    if (!email.value || !email.value.match(/^\S+@\S+\.\S+$/)) {
        email.classList.add('error');
        valid = false;
    }

    if (!valid) {
        return;
    }

    let data = {
        name: name.value,
        email: email.value,
        reason: reason.value,
    }

    let result = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.log("Error posting new workout")
    }

    let res = await result.json();

    let par = document.createElement('p');
    let old = document.getElementById('contact-result')

    par.id = 'contact-result';

    par.classList.add(res.success ? 'success' : 'error');
    par.classList.add('adding');

    par.textContent = res.success ? 'data sent correctly!' : 'error on sending data';

    if (old) {
        reason.parentNode.replaceChild(par, old);
        return;
    }

    reason.parentNode.appendChild(par);
}

window.addEventListener('load', function() {
    let dropdownButton = document.querySelector('.dropdown');
    let menuButton = document.querySelector('#menu-button');
    let contactForm = document.querySelector('#contact');

    menuButton.addEventListener('click', () => {
        menuButtonEventHandler();
    });

    dropdownButton.addEventListener('click', dropdownMenuEventHandler);
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactFormSubmitHandler();
    });
});
