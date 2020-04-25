const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = [], request;
  Array.from(form.elements).forEach((element) => {
    if (element.classList.contains("form-control")) {
      data.push(`${encodeURIComponent(element.name)}=${element.value}`);
    }
  });
  data = data.join("&");
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  }else{
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  request.open("POST", "http://localhost:7777/video-request");
  request.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  request.onreadystatechange = () => {
    if (request.status === 200 && request.readyState === 4) {
      console.log(JSON.parse(request.responseText))
    }
  };
  request.send(data);
});
