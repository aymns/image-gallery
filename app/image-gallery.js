"use strict";



let gallery = (function () {

    let _this = this;
    let gallery_dom_element;
    let photosContainer;

    let currentPage = 1;
    let pageNumbers = 1;
    let perPage = 10;

    let config = {};
    let ListOfPhotosFromServer = [];
    let nextPageDomElement = document.createElement('a');
    let prevPageDomElement = document.createElement('a');

    async function _init(_config) {
        config = _config;

        ListOfPhotosFromServer = await _config.jsonSourceAsync();
        pageNumbers = Math.ceil(ListOfPhotosFromServer.length / perPage);

        gallery_dom_element = document.querySelector(_config.domElementId)
        renderGalleryHtml();
        renderPage(1);
        return _this;
    }


    async function renderPrevGalleryPage() {
        await renderPage(currentPage - 1);
    }

    async function renderNextGalleryPage() {
        await renderPage(currentPage + 1);
    }


    async function renderPage(page) {
        if (page == 1)
            prevPageDomElement.hidden = true;
        else if (page < pageNumbers) {
            prevPageDomElement.hidden = false;
        }


        if (page >= pageNumbers)
            nextPageDomElement.hidden = true;
        else
            nextPageDomElement.hidden = false;

        if (page < 1 || page > pageNumbers)
            throw `Out of index excpetion, page ${page} doesn't exists`;

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

    return {
        init: _init
    }
}())


// support commonjs module
if (typeof module === "object" && module.exports) {
    module.exports = gallery;
}