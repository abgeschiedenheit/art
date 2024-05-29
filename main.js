const $form = document.querySelector("form");
const $input = document.querySelector("input[type='search']");
const $deck = document.querySelector(".deck");
const $top = document.querySelector(".footer");
const $root = document.documentElement;

// Event listener to scroll to the top smoothly
$top.addEventListener("click", scrollToTop);

// Event listener for form submission
$form.addEventListener("submit", handleFormSubmit);

// Function to scroll to the top of the document
function scrollToTop() {
  $root.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  if (typeof data === 'undefined') {
    console.error("Data object is not defined.");
    return;
  }

  let obj = {
    keyword: $input.value,
    id: data.id,
  };

  data.id++;
  data.search.unshift(obj);
  request(data.search[0].keyword);

  $form.reset();
}

// Function to send an API request
function request(keyword) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.harvardartmuseums.org/object?keyword=" +
    encodeURI(keyword) +
    "&primaryimageurl:*&hasimage=1&q=imagepermissionlevel:1&size=100&fields=primaryimageurl,title,dated,people,culture&sort=random&apikey=8c10f88a-3252-4db8-b69c-a317f6353025"
  );
  xhr.responseType = "json";

  xhr.addEventListener("load", function () {
    handleApiResponse(xhr.response);
  });
  xhr.send();
}

// Function to handle the API response
function handleApiResponse(response) {
  clearDeck();

  if (response.records.length === 0) {
    showNotFoundMessage();
    return;
  }

  response.records.forEach(record => {
    if (record.people && record.people.length > 0) {
      createAndAppendCard(record);
    }
  });

  document.querySelector(".index").classList.add("hidden");
  document.querySelector(".notfound").classList.add("hidden");
  $top.classList.add("view");
  $top.classList.remove("hidden");
}

// Function to clear the deck
function clearDeck() {
  if ($deck.hasChildNodes()) {
    $deck.innerHTML = "";
    document.querySelector(".index").classList.add("hidden");
  }
}

// Function to show not found message
function showNotFoundMessage() {
  document.querySelector(".index").classList.add("hidden");
  document.querySelector(".notfound").classList.remove("hidden");
  $top.classList.add("hidden");
  $top.classList.remove("view");
}

// Function to create and append a card to the deck
function createAndAppendCard(record) {
  let $card = document.createElement("div");
  let $source = document.createElement("a");
  let $image = document.createElement("img");
  let $description = document.createElement("p");
  let $title = document.createElement("span");
  let $date = document.createElement("span");
  let $artist = document.createElement("span");
  let $culture = document.createElement("span");

  $card.className = "card";
  $image.className = "artwork";
  $description.className = "description";
  $artist.className = "artist";
  $culture.className = "culture";
  $title.className = "title";
  $date.className = "date";

  $deck.append($card);
  $card.append($source);
  $source.append($image);
  $card.append($description);
  $description.append($artist);
  $description.append($culture);
  $description.append($title);
  $description.append($date);

  $image.onerror = function () {
    // Option 1: Hide the card if the image is broken
    $card.style.display = "none";

    // Option 2: Replace with a placeholder image
    // $image.src = 'path_to_placeholder_image';
  };

  $source.href = record.primaryimageurl;
  $image.src = record.primaryimageurl;
  $title.textContent = record.title;
  $date.textContent = record.dated;
  $artist.textContent = record.people[0].displayname;
  $culture.textContent = record.culture;

  $image.alt = $title.textContent;
  $image.title = $title.textContent;
  $description.alt = $artist.textContent;
  $description.title = $artist.textContent;
}