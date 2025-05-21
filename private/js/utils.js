export function newCard(cardOptions) {
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

            button.classList.add(buttonClass);

            if (action.buttonText) {
                button.textContent = action.buttonText;
                buttonContainer.appendChild(button);
            }

            // TODO: listeners encoded on cardOptions
            if (action.callback) {
                button.addEventListener('click', action.callback);
            }
        });
    }

    // TODO: card listener
    card.classList.add("card");
    card.id = cardOptions.id;

    card.addEventListener('click', () => {
        if (cardOptions.id.split('-')[0] === 'workout') {
            document.location.href = '/private/workout/' + cardOptions.id.split('-')[1];
        } else if (cardOptions.id.split('-')[0] === 'exercise') {
            console.log('open exercise ' + cardOptions.id.split('-')[1] + ' pop-up')
        }
    });

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

    // TODO
    parent.insertBefore(card, document.getElementById("new-workout-button"));
}
