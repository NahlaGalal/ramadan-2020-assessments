const form = document.querySelector("form");
let request;
if (window.XMLHttpRequest) {
  request = new XMLHttpRequest();
} else {
  request = new ActiveXObject("Microsoft.XMLHTTP");
}

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

const getVideoesList = () => {
  request.open("GET", "http://localhost:7777/video-request");
  request.onreadystatechange = () => {
    if (request.status === 200 && request.readyState === 4) {
      const res = JSON.parse(request.responseText);
      const box = document.getElementById("listOfRequests");
      box.innerHTML = "";
      res.forEach((element) => {
        box.innerHTML += `<div class="card mb-3">
        <div class="card-body d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <h3>${element.topic_title}</h3>
            <p class="text-muted mb-2">${element.topic_details}</p>
            <p class="mb-0 text-muted">
              <strong>Expected results:</strong> ${element.expected_result}
            </p>
          </div>
          <div class="d-flex flex-column text-center">
            <a class="btn btn-link">🔺</a>
            <h3>${element.votes.ups - element.votes.downs}</h3>
            <a class="btn btn-link">🔻</a>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div>
            <span class="text-info">${element.status}</span>
            &bullet; added by <strong>${element.author_name}</strong> on
            <strong>${new Date(element.update_date).toDateString()}</strong>
          </div>
          <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
            <div class="badge badge-success">${element.target_level}</div>
          </div>
        </div>
      </div>`;
      });
    }
  };
  request.send();
};

window.addEventListener("load", getVideoesList);

/**
 * 
 *   const card = document.createElement("div");
        card.classList.add("card", "mb-3");
        const cardBody = document.createElement("div");
        cardBody.classList.add(
          "card-body",
          "d-flex",
          "justify-content-between",
          "flex-row"
        );
        const d_flex = document.createElement("div");
        d_flex.classList.add("d-flex", "flex-column");
        const topicTitle = document.createElement("h3");
        topicTitle.textContent = element.topic_title;
        const topicDetails = document.createElement("p");
        topicDetails.textContent = element.topic_details;
        topicDetails.classList.add("text-muted", "mb-2");
        const expectedReults = document.createElement("p");
        expectedReults.classList.add("mb-0", "text-muted");
        expectedReults.innerHTML = `<strong>Expected results:</strong> ${element.expected_result}`;
        d_flex.append(topicTitle, topicDetails, expectedReults);
        cardBody.append(d_flex);
        const d_flex_center = document.createElement("div");
        d_flex_center.classList.add("d-flex", "flex-column", "text-center");
        const voteUp = document.createElement("a");
        voteUp.classList.add("btn", "btn-link");
        voteUp.textContent = "🔺";
        const voteDown = document.createElement("a");
        voteDown.classList.add("btn", "btn-link");
        voteDown.textContent = "🔻";
        const voters = document.createElement("h3");
        voters.textContent = element.votes.ups - element.votes.downs;
        d_flex_center.append(voteUp, voters, voteDown);
        cardBody.append(d_flex_center);
        const cardFooter = document.createElement("div");
        cardFooter.classList.add(
          "card-footer",
          "d-flex",
          "flex-row",
          "justify-content-between"
        );
        const footerDiv = document.createElement("div");
        footerDiv.innerHTML = `<span class="text-info">NEW</span>
              &bullet; added by <strong>${element.author_name}</strong> on
              <strong>${new Date(element.update_date).toDateString()}</strong>`;
        cardFooter.append(footerDiv);
        const footer_d_flex = document.createElement("div");
        footer_d_flex.classList.add(
          "d-flex",
          "justify-content-center",
          "flex-column",
          "408ml-auto",
          "mr-2"
        );
        const badge = document.createElement("div");
        badge.classList.add("badge", "badge-success");
        badge.textContent = element.target_level;
        footer_d_flex.append(badge);
        cardFooter.append(footer_d_flex);
        card.append(cardBody, cardFooter);
        box.append(card);
 */
