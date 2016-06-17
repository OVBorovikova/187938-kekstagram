'use strict';

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

window.pictures.forEach(function(picture) {
  getPicturesElement(picture, pictureContainer);
});

/** Отображаем блок с фильтрами **/

filtersToHide.classList.remove('hidden');
