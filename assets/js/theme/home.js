import $ from 'jquery';
import PageManager from '../PageManager';
import ThemeUtilities from './global/theme-utilities';
import Carousel from './components/Carousel';

export default class Home extends PageManager {
  constructor() {
    super();
    this.utilities = new ThemeUtilities();
  }

  loaded(next) {
    this.Carousel = new Carousel({
      el: '[data-carousel-slides]',
      delay: this.context.carouselDelay,
      nav: '[data-carousel-pagination]',
    });
    this.Carousel2 = new Carousel({
      el: '[data-carousel-items]',
      delay: this.context.carouselDelay,
      nav: '[data-carousel-items-pagination]',
      groupCells: true,
      pageDots: false,
    });
    this._bindHomeEvents();
    next();
  }

  _bindHomeEvents() {
    $(document.body).on('click', ".faceted-search-title", (event) => {
      this._toggleFilterSidebar(event);
    });
  }

  _toggleFilterSidebar(event) {
    event.preventDefault();
    const $target = $(event.currentTarget);
    $target.toggleClass('show-filter');
    $target.parent().find('.faceted-search-filter-list').toggleClass('show-filter-list');
  }
}
