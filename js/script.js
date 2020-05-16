const videosPage = document.querySelector(".videos-page");
const adminPage = document.querySelector(".admin-page");

const form = document.querySelector("form");
const dateSort = document.querySelector("#date-sort");
const voteSort = document.querySelector("#vote-sort");
const box = document.getElementById("listOfRequests");
const seachInput = document.getElementById("search");
const showStatus = document.getElementsByName("status");

const userId = new URLSearchParams(window.location.search).get("id");
let sort_type = "date",
  search = "",
  status_type="All";

function debounce(fn, time) {
  let timeOut;
  return function (...args) {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => fn.apply(this, args), time);
  };
}

const dataValidation = (elements) => {
  const topic = elements[0];
  const details = elements[2];
  if (!topic.value || topic.value.length > 100)
    topic.classList.add("is-invalid");
  if (!details.value) details.classList.add("is-invalid");
  if (form.querySelectorAll(".is-invalid").length) {
    form
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
  fetch(`http://localhost:7777/users?id=${userId}`)
    .then((res) => res.json())
    .then(({ author_name, author_email }) => {
      let data = { author_name, author_email };
      if (!dataValidation(form.elements)) return;
      Array.from(form.elements).forEach((element) => {
        if (element.classList.contains("form-control")) {
          data[element.name] = element.value;
        }
      });
      return fetch("http://localhost:7777/video-request", {
        method: "POST",
        body: JSON.stringify({ ...data }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .then(() => getVideoesList(sort_type, search));
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
        ${
          element.status === "Done"
            ? `
            <iframe src=${element.video_ref.link}></iframe>
        `
            : `
          <a class="btn btn-link ${
            element.votes.ups.find((id) => id === userId) ? "disabled" : ""
          }" onclick="voteVideo('ups', '${element._id}')">🔺</a>
          <h3 class="total-votes">${
            element.votes.ups.length - element.votes.downs.length
          }</h3>
          <a class="btn btn-link ${
            element.votes.downs.find((id) => id === userId) ? "disabled" : ""
          }" onclick="voteVideo('downs', '${element._id}')">🔻</a>`
        }
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

const getVideoesList = (sort_type = "date", search = "", status_type = "All") => {
  fetch(
    `http://localhost:7777/video-request?sort_type=${sort_type}&topic=${search}&status_type=${status_type}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) =>
      userId === "5ebf73722a78b12bb0053b18"
        ? insertAdminVideos(res)
        : insertVideos(res)
    );
};

window.addEventListener("load", () => getVideoesList());

const voteVideo = (vote_type, id) => {
  fetch("http://localhost:7777/video-request/vote", {
    method: "PUT",
    body: JSON.stringify({
      id,
      vote_type,
      user_id: userId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const votesObj = res.votes;
      const totalVotes = document
        .getElementById(id)
        .querySelector(".total-votes");
      totalVotes.innerText = votesObj.ups.length - votesObj.downs.length;
      if (vote_type === "ups") {
        totalVotes.previousElementSibling.classList.add("disabled");
        totalVotes.nextElementSibling.classList.remove("disabled");
      } else {
        totalVotes.previousElementSibling.classList.remove("disabled");
        totalVotes.nextElementSibling.classList.add("disabled");
      }
    });
};

dateSort.addEventListener("click", () => {
  dateSort.parentElement.classList.add("active");
  voteSort.parentElement.classList.remove("active");
  sort_type = "date";
  getVideoesList("date", search, status_type);
});

voteSort.addEventListener("click", () => {
  dateSort.parentElement.classList.remove("active");
  voteSort.parentElement.classList.add("active");
  sort_type = "vote";
  getVideoesList("vote", search, status_type);
});

seachInput.addEventListener(
  "keyup",
  debounce((e) => {
    search = e.target.value;
    getVideoesList(sort_type, e.target.value, status_type);
  }, 300)
);

showStatus.forEach((input) =>
  input.addEventListener("change", (e) => {
    showStatus.forEach((input) => input.parentElement.classList.remove("active"));
    e.target.parentElement.classList.add("active");
    status_type = e.target.id;
    getVideoesList(sort_type, search, status_type);
  })
);

if (userId === "5ebf73722a78b12bb0053b18") {
  videosPage.classList.add("d-none");
  adminPage.classList.remove("d-none");
} else {
  videosPage.classList.remove("d-none");
  adminPage.classList.add("d-none");
}

const insertAdminVideos = (res) => {
  adminPage.innerHTML = "";
  res.forEach((element) => {
    adminPage.innerHTML += `<div class="card mb-3" id=${element._id}>
      <div class="card-header d-flex justify-content-between">
        <div>
          <label class="mr-sm-2 sr-only" for="inlineFormCustomSelect-${
            element._id
          }">Preference</label>
          <select class="custom-select mr-sm-2" id="inlineFormCustomSelect-${
            element._id
          }" >
            <option value="New" ${
              element.status === "New" ? "selected" : ""
            }>New</option>
            <option value="Planned" ${
              element.status === "Planned" ? "selected" : ""
            }>Planned</option>
            <option value="Done" ${
              element.status === "Done" ? "selected" : ""
            }>Done</option>
          </select>
        </div>
        <div class="input-group mr-5 ml-2 d-none">
          <input type="text" class="form-control" placeholder="Paste here youtube link" aria-label="youtube-link" aria-describedby="youtube-link">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary save-url" type="button" id="youtube-link">Save</button>
          </div>
        </div>
        <div>
          <button class="btn btn-danger" onclick=deleteVideo("${
            element._id
          }")>Delete</button>
        </div>
      </div>
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
          <a class="btn btn-link ${
            element.votes.ups.find((id) => id === userId) ? "disabled" : ""
          }" onclick="voteVideo('ups', '${element._id}')">🔺</a>
          <h3 class="total-votes">${
            element.votes.ups.length - element.votes.downs.length
          }</h3>
          <a class="btn btn-link ${
            element.votes.downs.find((id) => id === userId) ? "disabled" : ""
          }" onclick="voteVideo('downs', '${element._id}')">🔻</a>
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
  res.forEach((element) => {
    document
      .querySelector(`#inlineFormCustomSelect-${element._id}`)
      .addEventListener("change", (e) => {
        if (e.target.value === "Done")
          document
            .getElementById(element._id)
            .querySelector(".input-group")
            .classList.remove("d-none");
        else changeVideoStatus(element._id, e.target.value);
      });
    document
      .getElementById(element._id)
      .querySelector(".save-url")
      .addEventListener("click", () =>
        changeVideoStatus(
          element._id,
          "Done",
          document.getElementById(element._id).querySelector(".form-control")
            .value
        )
      );
  });
};

const deleteVideo = (id) => {
  fetch("http://localhost:7777/video-request", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => getVideoesList());
};

const changeVideoStatus = (id, status, resVideo = "") => {
  fetch("http://localhost:7777/video-request", {
    method: "PUT",
    body: JSON.stringify({ id, status, resVideo }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => getVideoesList());
};
