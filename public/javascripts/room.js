function initRoom() {
  const btnShowAddComment = document.getElementById("btnShowAddComment");
  const addCommentForm = document.getElementById("addCommentForm");
  const btnCancelAddComment = document.getElementById("btnCancelAddComment");
  const btnCancelUpdateComments = document.querySelectorAll(
    ".btnCancelUpdateComment"
  );
  const btnUpdateComments = document.querySelectorAll(".btnUpdateComment");
  const updateCommentForms = document.querySelectorAll(".updateCommentForm");

  addCommentForm.style.display = "none";

  updateCommentForms.forEach((form) => (form.style.display = "none"));

  btnShowAddComment.addEventListener("click", () => {
    addCommentForm.children[0].value = "";

    addCommentForm.style.display == "none"
      ? (addCommentForm.style.display = "block")
      : (addCommentForm.style.display = "none");

    addCommentForm.style.display == "none"
      ? (btnShowAddComment.textContent = "Add Comment")
      : (btnShowAddComment.textContent = "Cancel Comment");
  });

  btnCancelAddComment.addEventListener("click", () => {
    addCommentForm.children[0].value = "";
    addCommentForm.style.display = "none";

    btnShowAddComment.textContent = "Add Comment";
  });

  btnCancelUpdateComments.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.parentNode.children[0].value = "";
      e.target.parentNode.style.display = "none";

      e.target.parentNode.parentNode.children[0].textContent = "Update Comment";
    });
  });

  btnUpdateComments.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.parentNode.children[1].children[0].value = "";

      e.target.parentNode.children[1].style.display == "none"
        ? (e.target.parentNode.children[1].style.display = "block")
        : (e.target.parentNode.children[1].style.display = "none");

      e.target.parentNode.children[1].style.display == "none"
        ? (e.target.textContent = "Update Comment")
        : (e.target.textContent = "Cancel Comment");
    });
  });
}

initRoom();
