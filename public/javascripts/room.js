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
    var addCommentContainer = document.querySelector(".addCommentContainer");

    addCommentBtn.addEventListener("click", function() {
        addCommentContainer.style.display = "block";
        addCommentBtn.style.display = "none";
    });

    var cancelBtn = document.getElementById("cancelButton");
    
        // cancel button eventlistener

    cancelBtn.addEventListener("click", function() {
        addCommentContainer.style.display = "none";
        addCommentBtn.style.display = "inline-block";
        document.getElementById("commentBody").value = "";
    });
});

        // form we want to apply custom Bootstrap validation styles to

const forms = document.querySelectorAll('.needs-validation1')
        // check if form is valid
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        const commentBody = form.querySelector('#commentBody');

        if (!commentBody.validity.valid) {
            isInValid(commentBody);
        } 
    });
});

        // update Comment 

document.addEventListener('DOMContentLoaded', function () {
    const commentFrames = document.querySelectorAll('.comment-frame');

    commentFrames.forEach(commentFrame => {
        const btnUpdateComment = commentFrame.querySelector('.btnUpdateComment');
        const btnDeleteComment = commentFrame.querySelector('.btnDeleteComment');
        const btnCancelUpdateComment = commentFrame.querySelector('.btnCancelUpdateComment');
        const commentBody = commentFrame.querySelector('.comment-body p');
        
        const originalCommentText = commentBody.textContent;
        const updateCommentForm = commentFrame.querySelector('.updateCommentForm')
        const commentTextInput =  updateCommentForm.querySelector('.commentBody');

        if (btnUpdateComment && btnDeleteComment && btnCancelUpdateComment && commentBody && commentTextInput && updateCommentForm) {
            // update button 
            btnUpdateComment.addEventListener('click', function () {
                commentTextInput.value = originalCommentText; 
                commentTextInput.classList.remove('is-invalid')

                btnUpdateComment.style.display = 'none'; 
                btnDeleteComment.style.display = 'none';
                commentBody.style.display = 'none';

                updateCommentForm.style.display = 'inline-block';
                btnCancelUpdateComment.style.display = 'inline-block';
                commentTextInput.focus();
            });

            // Cancel button
            btnCancelUpdateComment.addEventListener('click', function (event) {
                btnUpdateComment.style.display = 'inline-block'; 
                btnDeleteComment.style.display = 'inline-block';
                commentBody.style.display = 'inline-block';

                updateCommentForm.style.display = 'none';
                btnCancelUpdateComment.style.display = 'none';
            })

            // blur event on commentTextInput
            commentTextInput.addEventListener('blur', function () {
                
                        btnUpdateComment.style.display = 'inline-block'; 
                        btnDeleteComment.style.display = 'inline-block';
                        commentBody.style.display = 'inline-block';
                    
                        updateCommentForm.style.display = 'none';
                        btnCancelUpdateComment.style.display = 'none';
                    
                
            });

            // Update comment - Enter
            commentTextInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    console.log(commentTextInput.value);
                    if (!commentTextInput.validity.valid) {
                        isInValid(commentTextInput);
                        return;
                    } 
                    
                    
                    const updatedCommentText = commentTextInput.value;
                    
                    commentBody.textContent = updatedCommentText;

                    btnUpdateComment.style.display = 'inline-block'; 
                    btnDeleteComment.style.display = 'inline-block';
                    commentBody.style.display = 'inline-block'; 

                    updateCommentForm.style.display = 'none';
                    btnCancelUpdateComment.style.display = 'none';
                    
                    
            //send form
                    updateCommentForm.submit();
            
                }
            });
        }
    });

});
