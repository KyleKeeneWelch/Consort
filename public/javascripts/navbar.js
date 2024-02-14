var titleElement = document.querySelector('title');
var title = titleElement.textContent;

if (title === 'Login' || title === 'Register') {
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarListItems = document.querySelectorAll('.navbar-nav li');

    navbarToggler.style.display = 'none'; // Hide button
    navbarListItems.forEach(function(item) {

        item.style.display = 'none'; // Hide all elements
    });
}