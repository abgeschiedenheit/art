const $form = document.querySelector('form');
const $input = document.querySelector('input');
const $deck = document.querySelector('.deck');
const $top = document.querySelector('.footer');
const $root = document.documentElement;

$top.addEventListener('click', function () {
  $root.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

$form.addEventListener('submit', function () {
  event.preventDefault();

  let obj = {
    keyword: $input.value,
    id: data.id
  };

  data.id++;
  data.search.unshift(obj);
  request(data.search[0].keyword);

  $form.reset();
});

function request(keyword) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.harvardartmuseums.org/object?keyword=' + encodeURI(keyword) + '&primaryimageurl:*&hasimage=1&q=imagepermissionlevel:1&size=16&fields=primaryimageurl,title,dated,people,culture&sort=random&apikey=8c10f88a-3252-4db8-b69c-a317f6353025');
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if ($deck.hasChildNodes() === true) {
      $deck.innerHTML = '';

      document.querySelector('.intro').className = 'prompt intro hidden';
    }

    for (let i = 0; i < xhr.response.records.length; i++) {
      if (xhr.response.records[i].people === undefined || xhr.response.records[i].people === null) {
        continue;
      }

      let $card = document.createElement('div');
      let $source = document.createElement('a');
      let $image = document.createElement('img');
      let $description = document.createElement('p');
      let $title = document.createElement('span');
      let $date = document.createElement('span');
      let $artist = document.createElement('span');
      let $culture = document.createElement('span');

      $card.className = 'card';
      $image.className = 'artwork';
      $description.className = 'description';
      $artist.className = 'artist';
      $culture.className = 'culture';
      $title.className = 'title';
      $date.className = 'date';

      $deck.append($card);
      $card.append($source);
      $source.append($image);
      $card.append($description);
      $description.append($artist);
      $description.append($culture);
      $description.append($title);
      $description.append($date);

      $source.href = xhr.response.records[i].primaryimageurl;
      $image.src = xhr.response.records[i].primaryimageurl;
      $title.textContent = xhr.response.records[i].title;
      $date.textContent = xhr.response.records[i].dated;
      $artist.textContent = xhr.response.records[i].people[0].displayname;
      $culture.textContent = xhr.response.records[i].culture;

      $image.alt = $title.textContent;
      $image.title = $title.textContent;
      $description.alt = $artist.textContent;
      $description.title = $artist.textContent;

      document.querySelector('.no-results').className = 'prompt no-results hidden';
      $top.className = 'footer view';
    }

    if (xhr.response.records.length === 0) {
      document.querySelector('.no-results').className = 'prompt no-results view';
      $top.className = 'footer hidden';
    }
  });
  xhr.send();
}
