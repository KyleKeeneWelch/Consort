document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.querySelector('#email');
    const inputPassword = document.querySelector('#password')

    if (inputEmail) {
        const invalidFeedbackEmail = document.querySelector('#email + .invalid-feedback');
        isInValid(inputEmail);
    } else {
        console.error('Element with id "email" not found.');
    }
    if (inputPassword) {
        const invalidFeedbackEmail = document.querySelector('#password + .invalid-feedback');
        invalidFeedbackEmail.textContent = 'Data not recognized.';
        isInValid(inputPassword);
    } else {
        console.error('Element with id "password" not found.');
    }

});