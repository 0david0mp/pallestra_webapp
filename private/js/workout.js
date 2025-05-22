const url = new URL(window.location.href)
const workoutId = parseInt(url.search.split('=')[1]);

let popupContainer = document.getElementById("new-exercise-popup-container");

function closePopup() {
    popupContainer.classList.remove("open");
}

function openPopup() {
    popupContainer.classList.add("open");
}

async function getExercises() {
    let select = document.getElementById('new-exercise');

    try {
        let result = await fetch('/api/v1/exercises');
        if (!result.ok) {
            console.log('error fetching exercises')
        }

        let body = await result.json();

        body.forEach(exercise => {
            let exerciseOption = document.createElement('option');
            exerciseOption.value = exercise.id;
            exerciseOption.textContent = exercise.name;

            select.appendChild(exerciseOption);
        });

    } catch (e) {
        console.log(e)
    }
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

            if (action.buttonText === 'delete') {
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

async function newExerciseSubmitListener() {
    let exercise = document.getElementById("new-exercise");
    let reps = document.getElementById("new-exercise-reps");

    let exerciseValue = exercise.value;
    let repsValue = reps.value;

    let data = {
        exercise: exerciseValue,
        reps: repsValue
    }

    let result = await fetch("/api/v1/workout/" + workoutId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.log("Error posting new exercise")
    }

    let body = await result.json();

    console.log(body);
    newCard({
        exercise: body.exercise,
        order: body.exercise_order,
        title: body.name,
        imageRoute: "/media/barbell.svg",
        difficulty: body.reps,
        cardContent: body.description,
        actions: [
            {
                buttonText: "delete"
            }]
    });

    document.querySelector("#new-exercise-popup form").reset();

    // close popup
    closePopup();
}

async function deleteExerciseClickListener(order) {
    console.log("deleting exercise " + order + "...")
    let card = document.getElementById(`exercise-${order}`);

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

    card.classList.add('deleting');
    setTimeout(() => card.remove(), 500);
}

// -------------------- main entry point

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

    getExercises();

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
        document.title = body.details.name;
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
                actions: [
                    {
                        buttonText: "delete"
                    }]
            });

        });
    } catch (err) {
        console.log("error requesting workouts")
        throw err;
    } finally {
        document.getElementById("submit-exercise").addEventListener('click', (event) => {
            newExerciseSubmitListener();
            event.preventDefault();
        });

        document.getElementById("back-button").addEventListener('click', async () => {
            document.location.href = '/private/member-area.html'
        });
    }
})
