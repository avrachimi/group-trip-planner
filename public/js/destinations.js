const openMenu = document.getElementById('mobile-open-menu');
const exitMenu = document.getElementById('mobile-exit-menu');
const nav = document.querySelector('nav');

openMenu.addEventListener('click', () => {
    nav.classList.add('show-menu');
});

exitMenu.addEventListener('click', () => {
    nav.classList.remove('show-menu');
});


function viewDestination(id) {
    window.location.href = `/destinations/${id}`;
}