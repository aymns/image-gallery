"use strict";

// demo code ...

(async function(){

    let modal = document.getElementById('modal');
    let imageViewer = modal.getElementsByTagName("img");

    let api_key = '11a41946317528f1433988728e7d6140';
    let api_end_point = 'https://www.flickr.com/services/rest';
    let page = 1;
    let perpage = 79;

    
    let PHOTO_SIZE = {
        THUMBNAIL: {
            value: '_q',
            name: "Thumbnail",
            size: "100 on longest side"
        },
        SMALL: {
            value: '_s',
            name: "Small",
            size: "75x75"
        },
        MEDIUM: {
            value: '_z',
            name: "Medium",
            size: "640 on longest side"
        },
        LARGE: {
            value: '_b',
            name: "Large",
            size: "1024 on longest side"
        },
        ORIGINAL: {
            value: '',
            name: "Original",
            size: "original"
        },
    };

    var data = await gallery.init({
        domElementId: "#gallery",
        jsonSourceAsync: getData,
        onPhotoSelected: function(photo){
            imageViewer[0].src = photo;
        }
    });

    async function getData() {
        return await fetch(`${api_end_point}/?method=flickr.photos.getRecent&api_key=${api_key}&per_page=${perpage}&page=${page}&format=json&nojsoncallback=1`)
            .then(r => r.json())
            .then(data => {
                return data.photos.photo.map(photo => {
                    return {
                        Thumb: getPhotoSourceUrl(photo, PHOTO_SIZE.THUMBNAIL),
                        Original: getPhotoSourceUrl(photo, PHOTO_SIZE.ORIGINAL)
                    }
                });
            })
            .catch(e => console.error('cannot get images from api' + e));
    }


    function getPhotoSourceUrl(photo, size) {
        var id = photo.id;
        var secret = photo.secret;
        var server_id = photo.server;
        var farm_id = photo.farm;
        return `https://farm${farm_id}.staticflickr.com/${server_id}/${id}_${secret}${size.value}.jpg`;
    }
}());