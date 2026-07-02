/**
 * Page Loader - Synchronously loads HTML page partials into the DOM.
 * Uses synchronous XMLHttpRequest which works with file:// protocol.
 * This script MUST be included in <body> BEFORE script.js.
 */
(function () {
  'use strict';

  function loadHTML(file) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', file, false); // synchronous
      xhr.send();
      if (xhr.status === 200 || xhr.status === 0) { // status 0 for file://
        return xhr.responseText;
      }
    } catch (e) {
      console.warn('[PageLoader] Could not load ' + file + ': ' + e.message);
    }
    return '';
  }

  // --- Welcome page: insert at the very start of <body> ---
  var welcomeHTML = loadHTML('pages/welcome.html');
  if (welcomeHTML) {
    document.body.insertAdjacentHTML('afterbegin', welcomeHTML);
  }

  // --- Main content pages: insert into #main-content ---
  var mainContainer = document.getElementById('main-content');
  if (mainContainer) {
    var mainPages = [
      'pages/home.html',
      'pages/game.html',
      'pages/arena.html',
      'pages/visualization.html',
      'pages/benchmark.html'
    ];
    for (var i = 0; i < mainPages.length; i++) {
      var html = loadHTML(mainPages[i]);
      if (html) {
        mainContainer.insertAdjacentHTML('beforeend', html);
      }
    }
  }

  // --- Modals: insert before </body> ---
  var modalPages = [
    'pages/algorithm-modal.html',
    'pages/complexity-modal.html',
    'pages/arena-battle.html'
  ];
  for (var j = 0; j < modalPages.length; j++) {
    var modalHTML = loadHTML(modalPages[j]);
    if (modalHTML) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  }
})();
