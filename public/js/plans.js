function newCard(cardOptions) {
    const parent = document.getElementById('content');
    const min = cardOptions.min;
    const max = cardOptions.max;
    let card = document.createElement('div');
    let cardContent = document.createElement('div');
    let auxContainer = document.createElement('div');
    let header = document.createElement('h1');
    let par1 = document.createElement('p');
    let par2 = document.createElement('p');
    let list = document.createElement('ul');
    let priceHeader = document.createElement('h1')
    let mainPrice = Number.MAX_VALUE;
    let perMonth = document.createElement('p');

    card.classList.add('card');
    card.classList.add('plan');
    card.classList.add('outlined');

    card.appendChild(cardContent);
    cardContent.classList.add('card-content');

    cardContent.appendChild(auxContainer);

    auxContainer.appendChild(header);
    header.textContent = cardOptions.title;

    cardOptions.subTypes.forEach(type => {
        let item = document.createElement('li');
        item.textContent = type.months + ' months: ' + type.price + '€';
        list.appendChild(item);
        mainPrice = (mainPrice > (type.price / type.months) / max)
            ? ((type.price / type.months) / max).toFixed(2)
            : mainPrice;
    });

    priceHeader.id = 'price-header';
    perMonth.id = 'per-month';
    priceHeader.textContent = mainPrice + '€';
    perMonth.textContent = '/ person in 1 month';

    par1.textContent = cardOptions.cardContent;
    auxContainer.appendChild(par1);
    par2.textContent = 'From: ' + min +
        ' person' + ((min > 1) ? 's' : '') + ' up to: ' + max +
        ' person' + ((max > 1) ? 's' : '');
    auxContainer.appendChild(par2);

    auxContainer.appendChild(list);
    auxContainer.appendChild(priceHeader);
    auxContainer.appendChild(perMonth);

    // TODO: change
    parent.insertBefore(card, document.getElementById('new-workout-button'));
}

window.addEventListener('load', async () => {
    try {
        let result = await fetch('/api/v1/plans');

        if (!result.ok) {
            console.error('Error fetching plans')
        }

        let rows = await result.json();

        console.log(rows)

        rows.forEach(element => {
            newCard({
                id: element.id,
                title: element.name,
                cardContent: element.description,
                subTypes: element.subTypes,
                max: element.max_members,
                min: element.min_members
            });
        });
    } catch (err) {
        console.log('error requesting plans')
        throw err;
    }
})
