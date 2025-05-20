
let popupContainer = document.getElementById("new-workout-popup-container");

function closePopup() {
    popupContainer.classList.remove("open");
}

function openPopup() {
    popupContainer.classList.add("open");
}

function newCard(cardOptions) {
    const parent = document.getElementById("content");
    let card = document.createElement("div");
    let image = document.createElement("img");
    let cardContent = document.createElement("div");
    let auxContainer = document.createElement("div");
    let header = document.createElement("h1");
    let par = document.createElement("p");
    let buttonContainer = null;

    if (cardOptions.actions) {
        buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        cardOptions.actions.forEach(action => {
            let button = document.createElement("button");
            let buttonClass =
                (action.buttonClass === undefined)
                    ? 'outlined-button'
                    : action.buttonClass;

            if (buttonClass === 'error-button') {
                button.addEventListener('click', () => {
                    deleteWorkoutClickListener(cardOptions.id);
                });
            }

            button.classList.add(buttonClass);

            if (action.buttonText) {
                button.textContent = action.buttonText;
                buttonContainer.appendChild(button);
            }
        });
    }

    card.classList.add("card");
    card.id = `workout-${cardOptions.id}`;

    card.appendChild(image);
    image.src = cardOptions.imageRoute;

    card.appendChild(cardContent);
    cardContent.classList.add("card-content");

    cardContent.appendChild(auxContainer);

    auxContainer.appendChild(header);
    header.textContent = cardOptions.title;

    auxContainer.appendChild(par);
    par.textContent = cardOptions.difficulty;
    par.classList.add("difficulty");
    par.classList.add("difficulty-" + cardOptions.difficulty);

    par = document.createElement("p");
    auxContainer.appendChild(par);
    par.textContent = cardOptions.cardContent;

    if (buttonContainer) {
        cardContent.appendChild(buttonContainer);
    }

    parent.insertBefore(card, document.getElementById("new-workout-button"));
}

async function newWorkoutSubmitListener() {
    let name = document.getElementById("new-workout-name");
    let difficulty = document.getElementById("new-workout-difficulty");
    let frequency = document.getElementById("new-workout-frequency");
    let description = document.getElementById("new-workout-description");
    let sets = document.getElementById("new-workout-sets");

    let nameValue = name.value;
    let difficultyValue = difficulty.value;
    let frequencyValue = frequency.value;
    let descriptionValue = description.value;
    let setsValue = sets.value;

    let data = {
        name: nameValue,
        description: descriptionValue,
        frequency: frequencyValue,
        difficulty: difficultyValue.toLowerCase(),
        sets: setsValue
    }

    let result = await fetch("/api/v1/workouts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.log("Error posting new workout")
    }

    let rows = await result.json();

    console.log(rows);
    newCard({
        id: rows.id,
        title: rows.name,
        imageRoute: "media/barbell.svg",
        difficulty: rows.difficulty_level,
        cardContent: rows.description,
        actions: [{
            buttonClass: "tonal-button",
            buttonText: "see workout"
        },
        {
            buttonClass: "error-button",
            buttonText: "delete"
        }]
    });

    document.querySelector("#new-workout-popup form").reset();

    // close popup
    closePopup();
}

async function deleteWorkoutClickListener(id) {
    console.log("deleting workout " + id + "...")

    let result = await fetch("/api/v1/workouts", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    });

    if (!result.ok) {
        console.log("Error delete workout " + id)
        return
    }

    document.getElementById(`workout-${id}`).remove();
}

window.addEventListener('click', (event) => {
    if (event.target.id === 'new-workout-popup-container') {
        closePopup();
    }
});

window.addEventListener('load', async () => {
    let newWorkoutButton = document.getElementById("new-workout-button");

    newWorkoutButton.addEventListener('click', () => {
        openPopup();
    });

    try {
        let result = await fetch("/api/v1/workouts");

        if (!result.ok) {
            console.error("Error fetching workouts")
        }

        let rows = await result.json();

        console.log(rows)

        rows.forEach(element => {
            newCard({
                id: element.id,
                title: element.name,
                imageRoute: "media/barbell.svg",
                difficulty: element.difficulty_level,
                cardContent: element.description,
                actions: [{
                    buttonClass: "tonal-button",
                    buttonText: "see workout"
                },
                {
                    buttonClass: "outlined-button",
                    buttonText: ""
                },
                {
                    buttonClass: "error-button",
                    buttonText: "delete"
                }]
            });
        });
    } catch (err) {
        console.log("error requesting workouts")
        throw err;
    } finally {
        document.getElementById("submit-workout").addEventListener('click', (event) => {
            newWorkoutSubmitListener();
            event.preventDefault();
        });

<<<<<<< HEAD
        document.getElementById("logout-button").addEventListener('click', async () => {
            await fetch('/api/v1/logout');
            document.location.href = '/index.html'
=======
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async () => {
                let workoutId = card.id.split("-")[1];
                let result = await fetch("/api/v1/workout/" + workoutId);

                if (!result.ok) {
                    console.log('Error on fetching workout ' + workoutId);
                    return
                }

                let body = await result.json();

                console.log(body)
            });
>>>>>>> master
        });
    }
})
