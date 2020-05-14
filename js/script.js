const form = document.querySelector("form");
const dateSort = document.querySelector(".date-sort");
const voteSort = document.querySelector(".vote-sort");
const box = document.getElementById("listOfRequests");
const seachInput = document.getElementById("search");
let sort_type = "date",
  search = "";

function debounce(fn, time) {
  let timeOut;
  return function (...args) {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => fn.apply(this, args), time);
  };
}

const dataValidation = (elements) => {
  const name = elements[0];
  const email = elements[1];
  const topic = elements[2];
  const details = elements[4];
  const emailPattern = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
  if (!name.value) name.classList.add("is-invalid");
  if (!email.value || !emailPattern.test(email)) email.classList.add("is-invalid");
  if (!topic.value || topic.value.length > 100) topic.classList.add("is-invalid");
  if (!details.value) details.classList.add("is-invalid");
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {};
  if (!dataValidation(form.elements)) return;
  Array.from(form.elements).forEach((element) => {
    if (element.classList.contains("form-control")) {
      data[element.name] = element.value;
    }
  });
  fetch("http://localhost:7777/video-request", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => getVideoesList(sort_type, search));
});

const insertVideos = (res) => {
  box.innerHTML = "";
  res.forEach((element) => {
    box.innerHTML += `<div class="card mb-3" id=${element._id}>
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${element.topic_title}</h3>
          <p class="text-muted mb-2">${element.topic_details}</p>
          <p class="mb-0 text-muted">
            ${
              element.expected_result &&
              `<strong>Expected results:</strong> ${element.expected_result}`
            }
          </p>
        </div>
        <div class="d-flex flex-column text-center">
          <a class="btn btn-link" onclick="voteVideo('ups', '${
            element._id
          }')">🔺</a>
          <h3 class="total-votes">${
            element.votes.ups - element.votes.downs
          }</h3>
          <a class="btn btn-link" onclick="voteVideo('downs', '${
            element._id
          }')">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${element.status}</span>
          &bullet; added by <strong>${element.author_name}</strong> on
          <strong class="submit-date">${new Date(
            element.submit_date
          ).toDateString()}</strong>
        </div>
        <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
          <div class="badge badge-success">${element.target_level}</div>
        </div>
      </div>
    </div>`;
  });
};

const getVideoesList = (sort_type = "date", search = "") => {
  fetch(
    `http://localhost:7777/video-request?sort_type=${sort_type}&topic=${search}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => insertVideos(res));
};

window.addEventListener("load", () => getVideoesList());

const voteVideo = (vote_type, id) => {
  fetch("http://localhost:7777/video-request/vote", {
    method: "PUT",
    body: JSON.stringify({
      id,
      vote_type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const votesObj = res.votes;
      document.getElementById(id).querySelector(".total-votes").innerText =
        votesObj.ups - votesObj.downs;
    });
};

dateSort.addEventListener("click", () => {
  dateSort.classList.add("active");
  voteSort.classList.remove("active");
  sort_type = "date";
  getVideoesList("date", search);
});

voteSort.addEventListener("click", () => {
  dateSort.classList.remove("active");
  voteSort.classList.add("active");
  sort_type = "vote";
  getVideoesList("vote", search);
});

seachInput.addEventListener(
  "keyup",
  debounce((e) => {
    search = e.target.value;
    getVideoesList(sort_type, e.target.value);
  }, 300)
);
