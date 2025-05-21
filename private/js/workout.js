const url = new URL(window.location.href)
const workoutId = parseInt(url.search.split('=')[1]);

let popupContainer = document.getElementById("new-exercise-popup-container");

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
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    deleteExerciseClickListener(cardOptions.order);
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
    card.classList.add('outlined');
    card.id = 'exercise-' + cardOptions.order;

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

    let body = await result.json();

    console.log(body);
    newCard({
        exercise: body.rows.exercise,
        order: body.rows.order,
        title: body.rows.name,
        imageRoute: "/media/barbell.svg",
        difficulty: body.rows.reps,
        cardContent: body.rows.description,
        actions: [{
            buttonClass: "tonal-button",
            buttonText: "see exercise"
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

async function deleteExerciseClickListener(order) {
    console.log("deleting exercise " + order + "...")

    let result = await fetch("/api/v1/workout/" + workoutId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ order: order })
    });

    if (!result.ok) {
        console.log("Error delete exercise " + order)
        return
    }

    document.getElementById(`exercise-${order}`).remove();
}

window.addEventListener('click', (event) => {
    if (event.target.id === 'new-exercise-popup-container') {
        closePopup();
    }
});

window.addEventListener('load', async () => {
    let newExerciseButton = document.getElementById("new-exercise-button");
    let heroTitle = document.querySelector("#hero h1");
    let description = document.querySelector("p#description");
    let sets = document.querySelector("p#sets");
    let difficulty = document.querySelector("p.difficulty");

    newExerciseButton.addEventListener('click', () => {
        openPopup();
    });

    try {
        let result = await fetch("/api/v1/workout/" + workoutId);

        if (!result.ok) {
            console.error("Error fetching selected workout (" + workoutId + ")");
        }

        let body = await result.json();

        console.log(body);

        heroTitle.textContent = body.details.name;
        sets.textContent += body.details.sets;
        description.textContent = body.details.description;
        difficulty.textContent = body.details.difficulty;
        difficulty.classList.add('difficulty-' + body.details.difficulty);

        body.rows.forEach(element => {
            newCard({
                exercise: element.exercise,
                order: element.order,
                title: element.name,
                imageRoute: "/media/barbell.svg",
                difficulty: element.reps,
                cardContent: element.description,
                actions: [{
                    buttonClass: "tonal-button",
                    buttonText: "see exercise"
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
        document.getElementById("submit-exercise").addEventListener('click', (event) => {
            newWorkoutSubmitListener();
            event.preventDefault();
        });

        document.getElementById("back-button").addEventListener('click', async () => {
            document.location.href = '/private/member-area.html'
        });
    }
})
