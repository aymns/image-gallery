"use strict";



let gallery = (function () {

    let _this = this;
    let gallery_dom_element;
    let photosContainer;

    let currentPage = 1;
    let pageNumbers = 1;
    let perPage = 10;
    let selectedImageElement = null;

    let config = {};
    let ListOfPhotosFromServer = [];
    let nextPageDomElement = document.createElement('a');
    let prevPageDomElement = document.createElement('a');


    async function _init(_config) {
        config = _config;

        if (typeof config.perPage === "number") {
            perPage = config.perPage;
        }

        ListOfPhotosFromServer = await _config.jsonSourceAsync();
        pageNumbers = Math.ceil(ListOfPhotosFromServer.length / perPage);

        gallery_dom_element = document.querySelector(_config.domElementId)
        renderGalleryHtml();
        renderPage(1);
        return Promise.resolve(this);
    }


    async function renderPrevGalleryPage() {
        await renderPage(currentPage - 1);
        onPrevPage();
    }

    async function renderNextGalleryPage() {
        await renderPage(currentPage + 1);
        onNextPage();
    }


    async function renderPage(page) {
        if (page == 1)
            prevPageDomElement.hidden = true;
        else if (page < pageNumbers) {
            prevPageDomElement.hidden = false;
        }


        if (page >= pageNumbers - 1)
            nextPageDomElement.hidden = true;
        else
            nextPageDomElement.hidden = false;

        if (page < 1 || page > pageNumbers)
            return;

        currentPage = page;
        let pagination_start_at = (currentPage - 1) * perPage;

        let displayedPhotos = ListOfPhotosFromServer.slice(pagination_start_at, pagination_start_at + perPage)
        photosContainer.innerHTML = "";

        displayedPhotos.map(function (photo) {
            let photoElement = document.createElement("div");;
            photoElement.className = "thumbnail";
            photoElement.innerHTML = `<label for='modal-1'><img src='${photo.Thumb}'/></label>`;
            photoElement.addEventListener('click', function () {
                onPhotoSelected(photo);
                selectedImageElement = photoElement;
            });
            photosContainer.appendChild(photoElement)
        });
    }

    function renderGalleryHtml() {

        nextPageDomElement.innerText = "next";
        prevPageDomElement.innerText = "previous";

        nextPageDomElement.addEventListener('click', function () {
            renderNextGalleryPage();
        });

        prevPageDomElement.addEventListener('click', function () {
            renderPrevGalleryPage();
        });

        photosContainer = document.createElement("div");
        photosContainer.className = "photos";
        gallery_dom_element.appendChild(photosContainer);

        var controls = document.createElement("div");
        controls.className = "controls"
        controls.appendChild(nextPageDomElement);
        controls.appendChild(prevPageDomElement);
        gallery_dom_element.appendChild(controls);
    }


    /*
        -----------------------------------------
                        Events
        -----------------------------------------
    */

    function onPhotoSelected(photo) {
        if (config.onPhotoSelected) {
            config.onPhotoSelected(photo.Original);
        }
    }


    function onNextPage() {
        if (config.onNextPage) {
            config.onNextPage(currentPage);
        }
    }


    function onPrevPage(photo) {
        if (config.onPrevPage) {
            config.onPrevPage(currentPage);
        }
    }

    /*
        -----------------------------------------
                        Public API
        -----------------------------------------
    */


    return {
        init: _init,
        getCurrentPage: () => currentPage,
        getNumberOfPages: () => pageNumbers,
        getSelectedImageElement: () => selectedImageElement,
        getGalleryImageContainer: () => photosContainer,
        nextPage: renderNextGalleryPage,
        prevPage: renderPrevGalleryPage
    }
}())


// support commonjs module
if (typeof module === "object" && module.exports) {
    module.exports = gallery;
}