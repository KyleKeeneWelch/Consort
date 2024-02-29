function addChangeEventListener(checkbox) {
  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      e.target.parentNode.children[0].disabled = false;
    } else {
      e.target.parentNode.children[0].disabled = true;
    }
  });
}

function initApp() {
  const checkboxes = document.querySelectorAll(".checkbox");
  const createUpdateRoomForm = document.getElementById("createUpdateRoomForm");
  const btnAddTag = document.getElementById("btnAddTag");
  const tagsContainer = document.getElementById("tagsContainer");

  checkboxes.forEach((checkbox) => {
    addChangeEventListener(checkbox);
  });

  createUpdateRoomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".checkbox")
      .forEach((checkbox) => (checkbox.disabled = true));
    e.target.submit();
  });

  btnAddTag.addEventListener("click", (e) => {
    const value = e.target.parentNode.children[1].value;

    if (value == "") return;

    const tagDiv = document.createElement("div");
    const checkBoxValue = document.createElement("input");
    const checkBox = document.createElement("input");
    const tagTitle = document.createElement("p");

    checkBoxValue.type = "hidden";
    checkBoxValue.name = "tags";
    checkBoxValue.disabled = true;
    checkBoxValue.value = value;
    checkBoxValue.classList.add("checkboxValue");

    checkBox.type = "checkbox";
    checkBox.name = "tags";
    checkBox.classList.add("checkbox");
    addChangeEventListener(checkBox);

    tagTitle.textContent = value;

    tagDiv.appendChild(checkBoxValue);
    tagDiv.appendChild(checkBox);
    tagDiv.appendChild(tagTitle);

    tagsContainer.prepend(tagDiv);

    e.target.parentNode.children[1].value = "";
  });
}

initApp();
