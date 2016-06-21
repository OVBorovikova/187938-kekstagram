'use strict';

var PHOTOS_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

/** Прячем блок с фильтрами **/

var filtersToHide = document.querySelector('.filters');
filtersToHide.classList.add('hidden');

/** Создаем блок фотографий для каждой записи массива **/

var pictureContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var getPicturesElement = function(data, container) {
  var element = elementToClone.cloneNode(true);

  element.querySelector('.picture-likes').textContent = data.likes;
  element.querySelector('.picture-comments').textContent = data.comments;

  container.appendChild(element);

  var imageElement = new Image();

/** Обработчик загрузки **/

  imageElement.onload = function() {
    var photo = element.querySelector('img');
    photo.setAttribute('src', data.url);
    photo.width = 182;
    photo.height = 182;
  };

  /** Обработчик ошибки **/

  imageElement.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  imageElement.src = data.url;

  return element;
};

/** Загрузка  данных по XMLHttpRequest **/

var getPhotos = function(callback) {

  pictureContainer.classList.add('pictures-loading');

  var xhr = new XMLHttpRequest();

  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    pictureContainer.classList.remove('pictures-loading');
    pictureContainer.classList.add('pictures-failure');
  };

  xhr.onerror = function() {
    pictureContainer.classList.remove('pictures-loading');
    pictureContainer.classList.add('pictures-failure');
  };

  xhr.onload = function(evt) {
    pictureContainer.classList.remove('pictures-loading');
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

  xhr.open('GET', PHOTOS_LOAD_URL);
  xhr.send();
};

var renderPhotos = function(pictures) {
  pictureContainer.innerHTML = '';
  pictures.forEach(function(picture) {
    getPicturesElement(picture, pictureContainer);
  });
};

/** Фильтрация **/

var getFilteredPhotos = function(pictures, filter) {

  var picturesToFilter = pictures.slice(0);

  switch (filter) {
    case 'filter-popular':
      break;
    case 'filter-new':
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      picturesToFilter = picturesToFilter.filter(function(picture) {
        var pictureLoadedTime = new Date(picture.date);
        var interval = today - Date.parse(pictureLoadedTime);
        return interval <= FOUR_DAYS;
      });
      picturesToFilter.sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
      break;
    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return picturesToFilter;
};

var pictures = [];

var setFilterEnabled = function(filter) {
  var filteredPhotos = getFilteredPhotos(pictures, filter);
  if (filteredPhotos.length === 0) {
    pictureContainer.classList.add('pictures-notfound');
  } else {
    renderPhotos(filteredPhotos);
  }
};
var setFiltrationEnabled = function() {
  var filters = document.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id);
    };
  }
};

getPhotos(function(loadedPhotos) {
  pictures = loadedPhotos;
  setFiltrationEnabled();
  renderPhotos(pictures);
});

/** Отображаем блок с фильтрами **/

filtersToHide.classList.remove('hidden');
