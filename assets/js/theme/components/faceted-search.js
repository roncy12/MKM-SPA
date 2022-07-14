import { hooks, api } from 'bigcommerce/stencil-utils';
import $ from 'jquery';
import Url from 'url';
import 'browserstate/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history';
import ProductCompare from '../global/product-compare';

function goToUrl(url) {
  // TODO: Wait for a fix from BC re: malformed pagionation links
  History.pushState({}, document.title, url);
}

export default class FacetedSearch {
  constructor(requestOptions, options, callback ) {
    this.requestOptions = requestOptions;
    this.callback = callback;

    this.options = $.extend({
      blocker: '.faceted-search-spinner',
      currentFiltersBlock: '.facet-selected-filters',
      sidebarToggle: '.faceted-sidebar-toggle',
      sidebarFilterToggle: '.faceted-search-title',
      moreToggle: '.faceted-search-more',
      bodyClass: 'scroll-locked',
    }, options);

    this._bindEvents();
    this._bindHooks();
  }


  // -------------------------- Event Binding -------------------------- //

  _bindEvents() {

    $(document.body).on('click', this.options.sidebarToggle, (event) => {
      this._toggleSidebar(event);
    });
    $(document.body).on('click', this.options.sidebarFilterToggle, (event) => {
      this._toggleFilterSidebar(event);
    });

    $(window).on('statechange', this._onStateChange.bind(this));
  }

  _bindHooks() {
    hooks.on('facetedSearch-facet-clicked', this._onFacetClick.bind(this));
    hooks.on('facetedSearch-range-submitted', this._onRangeSubmit.bind(this));
    hooks.on('sortBy-submitted', this._onSortBySubmit.bind(this));
  }


  // -------------------------- Filter Visibility Toggle -------------------------- //

  _toggleSidebar(event) {
    event.preventDefault();
    const $target = $(event.currentTarget);
    $target.toggleClass('button-alt');
    $target.parent().find('.faceted-search, .sorting').toggleClass('visible button-alt');
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _toggleFilterSidebar(event) {
    event.preventDefault();
    const $target = $(event.currentTarget);
    $target.toggleClass('show-filter');
    $target.parent().find('.faceted-search-filter-list').toggleClass('show-filter-list');
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }


  // -------------------------- State Change Triggers -------------------------- //

  _onFacetClick(event) {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const url = $target.attr('href');

    if ($target.hasClass('selected-filter-item')) {
      this._updateCurrentFacets($target.parent());
    }

    if ($target.hasClass('clear-all')) {
      $(this.options.currentFiltersBlock).remove();
    }

    goToUrl(url);
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _onRangeSubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href);
    let queryParams = $(event.currentTarget).serialize();

    if ($(document.body).hasClass('template-search')) {
      const currentSearch = `search_query=${$('.faceted-search').data('search-query')}` || '';
      queryParams = `${queryParams}&${currentSearch}`;
    }

    goToUrl(Url.format({ pathname: url.pathname, search: '?' + queryParams }));
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _onSortBySubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href, true);
    const queryParams = $(event.currentTarget).serialize().split('=');

    url.query[queryParams[0]] = queryParams[1];
    delete url.query['page'];

    goToUrl(Url.format({ pathname: url.pathname, query: url.query }));
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _onStateChange(event) {
    this._enterProgressState();

    api.getPage(History.getState().url, this.requestOptions, (err, content) => {
      this._leaveProgressState();

      if (err) { throw new Error(err); }

      this._refreshView(content);
    });
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _refreshView(content) {
    if (content) {
      this.callback(content);
    }
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  /*
   * If there is more than one active filter, just remove the one
   * If it's the only filter, remove the whole thing
   */
  _updateCurrentFacets($listItem) {
    if ($listItem.siblings().length) {
      $listItem.remove();
    } else {
      $(this.options.currentFiltersBlock).remove();
    }
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  // -------------------------- Overlay toggling -------------------------- //

  _enterProgressState() {
    $(document.body).addClass(this.options.bodyClass);
    $(this.options.blocker).addClass('visible');
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

  _leaveProgressState() {
    $(document.body).removeClass(this.options.bodyClass);
    $(this.options.blocker).removeClass('visible');
    if ($('.compare-enabled').length) {
      this.Compare = new ProductCompare();
    }
  }

}
