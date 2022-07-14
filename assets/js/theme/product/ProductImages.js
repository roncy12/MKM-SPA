import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import imagesLoaded from 'imagesloaded';
import flickity from 'flickity';

export default class ProductImages {
  constructor(el, context) {
    this.context = context;
    this.$el = $('[data-product-images]');
    this.$slideshowImage = $('[data-product-images-main]');
    this.variantLoaded = false;

    this._setupSlides();
    this._bindEvents();
  }

  _bindEvents() {
    $('body').on('click', '.product-thumbnail', (event) => {
      this._switchProductImage(event);
    });

    this.$el.on('settle', (event) => {
      this._slidesHeight(event);
    });

    this.$el.on('cellSelect', (event) => {
      this._slidesHeight(event);
    });

    $(window).on('resize', _.debounce((event) => {
      this._slidesHeight(event);
    }, 200));
  }

  _setupSlides() {
    this.$el.flickity({
      cellSelector: '.product-slideshow-image',
      prevNextButtons: true,
      contain: false,
      accessibility: false,
      pageDots: true,
      freeScroll: false,
      wrapAround: true,
      resize: true,
      initialIndex: this.$el.data('slideshow-position'),
    });
  }

  _slidesHeight() {
    $('.flickity-viewport', this.$el).imagesLoaded(() => {
      $('.flickity-viewport', this.$el).height($('.flickity-slider').find('.is-selected').height());
    });
  }

  _switchProductImage(event) {
    const $target = $(event.target);

    let $thumbnail = $(event.target);
    let index = $thumbnail.index();

    $thumbnail
      .addClass('active')
      .siblings()
      .removeClass('active');

    this.$el.flickity('select', index);
  }

  newImage(imgObj = {}) {
    const originalSrc = utils.tools.image.getSrc(imgObj.data, 'original');
    const largeImgSrc = utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['product_zoom']);
    const smallImgSrc = utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['thumbnail']);

    const largeNewImage = $(`<img class='product-slideshow-image' data-image-position='0' src='${largeImgSrc}' alt='${imgObj.alt}' data-product-images-main>`);
    const smallNewImage = $(`
      <span
        class='product-thumbnail'
        style="background-image: url('${smallImgSrc}');"
        data-image-position='0'
        data-high-res='${largeImgSrc}'
        data-product-thumbnail>
        <img class='show-for-sr' src='${smallImgSrc}' alt='${imgObj.alt}'>
      </span>`);

    if (this.variantLoaded) {
      this.$el.flickity('remove', this.$el.flickity('getCellElements')[0]);
      $('.product-thumbnails .product-thumbnail').first().remove();
    } else {
      this.variantLoaded = true;
    }

    this.$el.flickity('prepend', largeNewImage);

    $('.product-thumbnails').prepend(smallNewImage);

    $('.product-thumbnail').each(function(i) {
      $(this).attr('data-image-position', i);
    });

    $('.product-slideshow-image').each(function(i) {
      $(this).attr('data-image-position', i);
    });

    this.$el.flickity('select', 0);
  }
}
