let assert = require('assert');
let gallery = require('../app/image-gallery');
require('jsdom-global')()

document.body.innerHTML = "<div id='gallery'></div>";
let imageSamples = [{
    Thumb: "https://farm66.staticflickr.com/65535/48428837092_48e9014faa_q.jpg",
    Original: "https://farm66.staticflickr.com/65535/48428837092_48e9014faa.jpg"
  },
  {
    Thumb: "https://farm66.staticflickr.com/65535/48428837092_48e9014faa_q.jpg",
    Original: "https://farm66.staticflickr.com/65535/48428837092_48e9014faa.jpg"
  }
]

describe('gallery', function () {
  let initGalleryAsync;
  
  before(function () {
    initGalleryAsync = gallery.init({
      domElementId: '#gallery',
      jsonSourceAsync: async function () {
        return Promise.resolve(imageSamples)
      },
      onPhotoSelected: function () {
      },
      perPage: 1
    });
  })

  it('Renders the image gallery', function () {
    let photoElement = document.querySelector('img[src="' + imageSamples[0].Thumb + '"]');
    assert.notEqual(photoElement, null)
  });

  it('Has two pages', function (done) {
    initGalleryAsync.then((myGallery) => {
      assert.equal(2, myGallery.getNumberOfPages());
      done();
    }).catch(done);;
  })

  it('Handle on image click', function(done){
    initGalleryAsync.then((myGallery) => {
      myGallery.getGalleryImageContainer().querySelector("div").click();
      assert.notEqual(null, myGallery.getSelectedImageElement());
      done();
    })
    .catch(done);
  })


  it('Handle next page', function(done){
    initGalleryAsync.then((myGallery) => {
      myGallery.nextPage();
      assert.equal(myGallery.getCurrentPage(), 2);
      done();
    })
    .catch(done);
  })

  
  it('Handle next page', function(done){
    initGalleryAsync.then((myGallery) => {
      myGallery.prevPage();
      assert.equal(myGallery.getCurrentPage(), 1);
      done();
    })
    .catch(done);
  })
});