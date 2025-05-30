function newCard(cardOptions) {
    const parent = document.getElementById('content');
    let card = document.createElement('div');
    let cardContent = document.createElement('div');
    let auxContainer = document.createElement('div');
    let header = document.createElement('h1');

    card.classList.add('card');
    card.classList.add('adding');
    card.classList.add('outlined');

    card.appendChild(cardContent);
    cardContent.classList.add('card-content');

    cardContent.appendChild(auxContainer);

    auxContainer.appendChild(header);
    header.textContent = cardOptions.title;

    parent.appendChild(card);
}

window.addEventListener('load', async () => {
    try {
        let result = await fetch('/api/v1/courses');

        if (!result.ok) {
            console.error('Error fetching courses')
        }

        let rows = await result.json();

        console.log(rows)

        rows.forEach(element => {
            newCard({
                title: element.name,
            });
        });
    } catch (err) {
        console.log('error requesting courses')
        throw err;
    }
})
