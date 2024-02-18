
'use strict'
        // adds the is-valid class

const isValid = (input) => {
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
}

        // adds the is-invalid class  

const isInValid = (input) => {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
    event.preventDefault()
}

        // form we want to apply custom Bootstrap validation styles to

const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission

Array.from(forms).forEach(form => {

    form.addEventListener('submit', event => {

        const inputEmail = form.querySelector('#email')
        const inputPassword = form.querySelector('#password')

        const invalidFeedbackEmail = form.querySelector('#email + .invalid-feedback')
        const invalidFeedbackPassword = form.querySelector('#password + .invalid-feedback')
        
            // checking inputEmail validation 

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if ((!emailPattern.test(inputEmail.value))) {
            invalidFeedbackEmail.textContent = 'Invalid email address format.'
            isInValid(inputEmail)
        } else {
            isValid(inputEmail)
        }
        

        if ((!inputPassword.validity.valid)){
            invalidFeedbackPassword.textContent = 'Password is required with a minimum of 8 characters'
            isInValid(inputPassword)
        } else {
            isValid(inputPasswordS)
        }

    }, false)
})