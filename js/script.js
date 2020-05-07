const form = document.querySelector("form");
const dateSort = document.querySelector(".date-sort");
const voteSort = document.querySelector(".vote-sort");
const box = document.getElementById("listOfRequests");
const seachInput = document.getElementById("search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = [];
  Array.from(form.elements).forEach((element) => {
    if (element.classList.contains("form-control")) {
      data.push(`${encodeURIComponent(element.name)}=${element.value}`);
    }
  });
  data = data.join("&");
  request.open("POST", "http://localhost:7777/video-request");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(data);
  request.onreadystatechange = () => {
    if (request.status === 200 && request.readyState === 4) getVideoesList();
  };
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

const getVideoesList = (sort_type = "date") => {
  fetch(`http://localhost:7777/video-request?sort_type=${sort_type}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => insertVideos(res));
};

window.addEventListener("load", () => getVideoesList());

const voteVideo = (vote_type, id) => {
  request.open("PUT", "http://localhost:7777/video-request/vote");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ id, vote_type }));
  request.onreadystatechange = () => {
    if (request.status === 200 && request.readyState === 4) {
      const votesObj = JSON.parse(request.responseText).votes;
      document.getElementById(id).querySelector(".total-votes").innerText =
        votesObj.ups - votesObj.downs;
    }
  };
};

dateSort.addEventListener("click", () => {
  dateSort.classList.add("active");
  voteSort.classList.remove("active");
  getVideoesList();
});

voteSort.addEventListener("click", () => {
  dateSort.classList.remove("active");
  voteSort.classList.add("active");
  getVideoesList("vote");
});

seachInput.addEventListener("keyup", (e) => {
  if(e.target.value) {
    fetch(`http://localhost:7777/video-request/search?topic=${e.target.value}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => insertVideos(res));
  } else getVideoesList();
});
