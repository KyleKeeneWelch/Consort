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

// Fetch all the forms we want to apply custom Bootstrap validation styles to

    const forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
    Array.from(forms).forEach(form => {

    form.addEventListener('submit', event => {
        const elements = form.elements;

// for loop checking the validation of each element in the form                
            for (let i = 0; i < elements.length; i++) {
                const input = elements[i];
                if (input.id == "email" || input.id == "confirm_password") {
                    continue;
                } else if (!input.validity.valid) {
                    isInValid(input);
                } else {
                    isValid(input);
                }
            }

        const inputEmail = form.querySelector('#email')
        const inputPassword = form.querySelector('#password')
        const inputConfirmPassword = form.querySelector('#confirm_password')
        const inputUsername = form.querySelector('#username')

        const invalidFeedbackEmail = document.querySelector('#email + .invalid-feedback')
        const invalidFeedbackConfirmPassword = document.querySelector('#confirm_password + .invalid-feedback')
        const invalidFeedbackUsername = document.querySelector('#passwordHelpInline + .invalid-feedback')
        
// checking inputEmail validation 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if ((!emailPattern.test(inputEmail.value))) {
            invalidFeedbackEmail.textContent = 'Invalid email format.'
            isInValid(inputEmail)
        } else if (inputEmail.value == 'dataFromDb@o'){
            invalidFeedbackEmail.textContent = 'User with email already exists.'
            isInValid(inputEmail)
        } else {
            isValid(inputEmail)
        }


// checking inputConfirmPassword validation    
        if (inputPassword.value !== inputConfirmPassword.value) {
            invalidFeedbackConfirmPassword.textContent = 'Confirm Password needs to match Password.'
            isInValid(inputConfirmPassword)
        } else if (!inputConfirmPassword.validity.valid) {
            invalidFeedbackConfirmPassword.textContent = ''
            isInValid(inputConfirmPassword)
        } else {
            isValid(inputConfirmPassword)
        }

    }, false)
    
    })


    var emailInput = document.getElementById('email');
    emailInput.removeAttribute('disabled');