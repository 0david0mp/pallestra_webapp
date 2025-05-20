window.addEventListener('load', function() {
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        console.log(card);
        card.addEventListener('click', () => {
            location.href = '/' + card.id + '.html';
        });
    });
});
