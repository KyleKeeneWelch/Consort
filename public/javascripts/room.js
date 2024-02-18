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

        // Add comment button eventlistener

document.addEventListener("DOMContentLoaded", function() {
    var addCommentBtn = document.getElementById("addCommentBtn");
    var commentContainer = document.querySelector(".commentContainer");

    addCommentBtn.addEventListener("click", function() {
        commentContainer.style.display = "block";
        addCommentBtn.style.display = "none";
    });

    var cancelBtn = document.getElementById("cancelButton");
    
        // cancel button eventlistener

    cancelBtn.addEventListener("click", function() {
        event.preventDefault();
        commentContainer.style.display = "none";
        addCommentBtn.style.display = "inline-block";
        document.getElementById("commentInput").value = "";
    });
});

        // form we want to apply custom Bootstrap validation styles to

const forms = document.querySelectorAll('.needs-validation')
        // check if form is valid
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        const commentInput = form.querySelector('#commentInput');

        if (!commentInput.validity.valid) {
            isInValid(commentInput);
        } 
    });
});

