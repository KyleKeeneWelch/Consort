document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.querySelector('#email');
    if (inputEmail) {
        const invalidFeedbackEmail = document.querySelector('#email + .invalid-feedback');
        invalidFeedbackEmail.textContent = 'User with email already exists.';
        isInValid(inputEmail);
    } else {
        console.error('Element with id "email" not found.');
    }
});