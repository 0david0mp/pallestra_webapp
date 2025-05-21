window.onload = function() {
    let cancelButton = document.getElementById('cancel-button');
    let loginForm = document.getElementById('login-form');
    let loginResult = document.getElementById('login-result');
    let cfInput = document.getElementById('cf-input');
    let passInput = document.getElementById('pass-input');

    cancelButton.addEventListener('click', () => {
        document.location.href = (document.referrer) ? document.referrer : '/';
    });

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
                loginResult.classList.add('error');
                loginResult.textContent = 'Invalid CF or password combination'
                throw new Error('Invalid credentials');
            } else {
                document.location.href = '/private/member-area.html';
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    });
};
