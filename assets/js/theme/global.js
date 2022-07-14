import $ from 'jquery';
import PageManager from '../PageManager';
import utils from 'bigcommerce/stencil-utils';
import ThemeInit from './global/theme-init';
import Navigation from './components/navigation';
import SelectWrapper from './components/SelectWrapper';
import HeaderTools from './global/header-tools';
import CurrencySelector from './global/currency-selector';
import QuickShop from './product/QuickShop';
import updateCartPreview from './global/update-cart-preview';
import dismissable from './core/alertDismissable';
import scrollReveal from 'scrollreveal';
import FormValidator from './components/FormValidator';
import FileUploadWrapper from './components/FileUploadWrapper';
import validetta from 'jquery-validetta';

export default class Global extends PageManager {
  constructor() {
    super();

    new Navigation($('.navigation'));
    new HeaderTools($('.header-tools'));
    new CurrencySelector($('.currency-selector'));
    new CurrencySelector($('.mobile-currency-selector'));

    const $select = $('select');
    if ($select.length) {
      $select.each((i, el) => {
        new SelectWrapper(el);
      });
    }
  }

  loaded(next) {
    this.validator = new FormValidator(this.context);
    this.validator.initGlobal();

    // bind click on dismissable alerts
    dismissable();

    updateCartPreview();

    const $quickShop = $('[data-quick-shop-trigger]');
    if ($quickShop.length) {
      new QuickShop('[data-quick-shop]', this.context);
    }

    const $upload = $('.form-field-file input');
    if ($upload.length) {
      $upload.each((i, el) => {
        new FileUploadWrapper(el, this.context).updateFilename();
      });
    }

    this._bindPagesEvents();

    next();
  }

  _bindPagesEvents() {
    $(document.body).on('click', ".collapse-item-title", (event) => {
      this._togglePagesCollapseContent(event);
    });
    if($(".faceted-search").children().length<1){
      $(".product-grid-container").removeClass('has-sidebar').addClass('no-sidebar');
    }
    $(window).scroll(function () {
      if ($(this).scrollTop() > 120) {
        $('.back-to-top').addClass("backtotop-show");
      } else {
        $('.back-to-top').removeClass("backtotop-show");
      }
    });
    $('.back-to-top').click(function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });
  }

  _togglePagesCollapseContent(event) {
    event.preventDefault();
    const $target = $(event.currentTarget);
    $target.toggleClass('show-collapse-item-title');
    $target.parent().find('.collapse-item-content').toggleClass('show-collapse-item-content');
  }
}
