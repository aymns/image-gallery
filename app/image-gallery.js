"use strict";



let gallery = (function () {

    let _this = this;
    let api_key = '11a41946317528f1433988728e7d6140';
    let api_end_point = 'https://www.flickr.com/services/rest'

    async function _init(options) {
        let images = await fetchData(1, 10);
        return _this;
    }

    async function fetchData(page, perpage) {
        return await fetch(`${api_end_point}/?method=flickr.photos.getRecent&api_key=${api_key}&per_page=${perpage}&page=${page}&format=json&nojsoncallback=1`)
            .then(r => r.json())
            .then(data => {
                return data.photos.photo.map(photo => getPhotoSourceUrl(photo));
            })
            .catch(e => console.error('cannot get images from api' + e))
    }

    function getPhotoSourceUrl(photo) {
        var id = photo.id;
        var secret = photo.secret;
        var server_id = photo.server;
        var farm_id = photo.farm;

        return `https://farm${farm_id}.staticflickr.com/${server_id}/${id}_${secret}.jpg`;
    }

    return {
        init: _init,
        initialized : initialized
    }
}())


// support commonjs module
if(typeof module === "object" && module.exports) {  
    module.exports  = gallery;
}