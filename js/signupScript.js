const signupForm = document.querySelector("form");

const dataValidation = (elements) => {
  const name = elements[0];
  const email = elements[1];
  const emailPattern = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
  if (!name.value) name.classList.add("is-invalid");
  if (!email.value || !emailPattern.test(email.value))
    email.classList.add("is-invalid");
  if (document.querySelectorAll(".is-invalid").length) {
    document
      .querySelectorAll(".is-invalid")
      .forEach((elm) =>
        elm.addEventListener("input", (e) =>
          e.target.classList.remove("is-invalid")
        )
      );
    return false;
  }
  return true;
};

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {};
  if (!dataValidation(signupForm.elements)) return;
  Array.from(signupForm.elements).forEach((element) => {
    if (element.classList.contains("form-control")) {
      data[element.name] = element.value;
    }
  });
  fetch("http://localhost:7777/users/login", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => window.location.href = data.url);
});
