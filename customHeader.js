const navbar = document.querySelector(".navbar--report-info-cnt---8y9Bb");

if (navbar) {
  const h1Element = navbar.querySelector("h1");

  if (h1Element) {
    h1Element.remove();
  }

  const imgElement = document.createElement("img");
  imgElement.src =
    "https://navigates.vn/wp-content/uploads/2023/03/dai-hoc-sai-gon-1-1-1.jpg";
  imgElement.style.backgroundImage =
    "url(https://navigates.vn/wp-content/uploads/2023/03/dai-hoc-sai-gon-1-1-1.jpg)";
  imgElement.style.backgroundSize = "contain";
  imgElement.style.backgroundRepeat = "no-repeat";
  imgElement.style.backgroundPosition = "left center";
  imgElement.style.height = "52px";
  imgElement.style.width = "80px";

  navbar.appendChild(imgElement);
}
