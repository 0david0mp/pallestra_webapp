window.addEventListener('load', function() {
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        console.log(card);
        card.addEventListener('click', () => {
            let route = '/'
            if (card.id === 'member-area') {
                route += 'private/';
            }

            location.href = route + card.id + '.html';
        });

    });
});
