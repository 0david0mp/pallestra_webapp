window.onload = function() {
    let cancelButton = document.getElementById('cancel-button');
    let loginForm = document.getElementById('login-form');
    let cfInput = document.getElementById('cf-input');
    let passInput = document.getElementById('pass-input');

    loginForm.addEventListener('submit', async (event) => {
        let data = {
            cf: cfInput.value,
            pass: passInput.value,
        }

        event.preventDefault();
        try {
            let result = await fetch('/api/v1/login', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!result.ok) {
                console.log("Error loging in");
                return false;
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
};
