import $ from 'jquery';

export default class Navigation {
  constructor(el) {
    this.$el = $(el);
    this.$body = $(document.body);
    this.$mainHeader = $('.main-header');

    this.$primaryTier = this.$el.find('.nav-menu');
    this.$secondaryTier = this.$el.find('nav-menu-item > .nav-submenu');
    this.$tertiaryTier = this.$el.find('.nav-submenu-item > .nav-submenu');

    this.$toggleWrapper = this.$el.find('.navigation-toggle-mobile-wrapper');
    this.$toggleParent = this.$toggleWrapper.parent();
    this.$navIcons = this.$el.find('.nav-icon');

    this.$branding = $('.header-branding');

    this._alternateNavSwitch();
    this._bindEvents();
  }

  _bindEvents() {
    this.$navIcons.on('click', (e) => {
      this._toggleSubDropdown(e);
    });

    this.$el.find('.nav-menu-item.has-dropdown > a').on('click', (event) => {
      this._toggleDropdown(event);
    });

    this.$body.on('keyup', (event) => {
      if (event.keyCode == 27) {
        this._closeAllDropdowns();
      }
    });

    this.$el.on('click', (event) => {
      event.stopPropagation();
    });

    this.$body.on('click', (event) => {
      if (this.$el.find('ul.active')) {
        this._closeAllDropdowns();
      }
    });

    this.$el.find('.search-toggle > a').on('click', (event) => {
      event.preventDefault();
      this._toggleSearch(event);
    });

    this.$el.find('.nav-submenu').on('mouseleave', (event) => {
      event.preventDefault();
      this._closeDropdown(event);
    });

    this.$el.find('.nav-submenu').on('mouseenter', (event) => {
      event.preventDefault();
      this._cancelCloseDropdown();
    });

    $('.navigation-toggle-mobile-wrapper').on('click', (event) => {
      event.preventDefault();
      this._toggleMobileNav();
    });
  }

  _toggleSubDropdown(event) {
    const $target = $(event.target);
    const $parent = $target.parent();
    const $dropdown = $target.siblings('ul');
    const $window = $(window);
    const rightDistance = $window.width() - ($parent.offset().left + $parent.width());

    event.preventDefault();

    if (rightDistance > 238) {
      $dropdown.addClass('fly-right');
    } else {
      $dropdown.addClass('fly-left');
    }

    if (! $parent.hasClass('menu-open')) {
      this.$tertiaryTier.removeClass('active');
      this.$navIcons.addClass('icon-plus').removeClass('icon-minus');
    }

    $parent.toggleClass('menu-open');
    $dropdown.toggleClass('visible active');
    this._closeInactiveDropdowns();
    $target.toggleClass('icon-plus icon-minus');
  }

  _toggleDropdown(event) {
    const $target = $(event.target);
    const $parent = $target.parent();
    const $dropdown = $target.siblings('ul');
    const $navIcon = $target.find('.nav-icon');

    if (!$target.closest('.navigation-tier').hasClass('nav-submenu')) {
      $('.nav-menu-item > .nav-submenu').removeClass('active');
      $navIcon.removeClass('icon-minus').addClass('icon-plus');
    }

    if (!$parent.hasClass('menu-open')) {
      event.preventDefault();
      $parent.addClass('menu-open');
      $dropdown.addClass('visible active');
      this._closeInactiveDropdowns();
      $navIcon.removeClass('icon-plus').addClass('icon-minus');
    }
  }

  _toggleSearch(event) {
    event.preventDefault();
    this.$el.find('.search-form-wrapper').toggleClass('visible');
    this.$el.find('.search-input').focus();
  }

  _toggleMobileNav(event) {

    if ($('body').hasClass('mobile-nav-open')) {
      $('body').removeClass('mobile-nav-open').addClass('mobile-nav-closed');
      this.$primaryTier.removeClass('visible').addClass('hidden');
    } else {
      $('body').removeClass('mobile-nav-closed').addClass('mobile-nav-open');
      this.$primaryTier.removeClass('hidden').addClass('visible');
    }
  }

  _closeDropdown(event) {
    const $dropdown = $(event.target);

    if ($dropdown.hasClass('visible')) {
      this.closeMenu = setTimeout(() => {
        $dropdown.removeClass('visible active');
        $dropdown.parent().removeClass('menu-open');
      }, 2000);
    }
  }

  _cancelCloseDropdown() {
    clearTimeout(this.closeMenu);
  }

  _closeAllDropdowns() {
    const $dropdowns = this.$el.find('ul');

    for (let i = 0; i < $dropdowns.length; i++) {
      let $dropdown = $($dropdowns[i]);

      if ($dropdown.parent().hasClass('menu-open')) {
        $dropdown.parent().find('ul').removeClass('visible active');
        $dropdown.parent().find('.nav-icon').removeClass('icon-minus').addClass('icon-plus');
        $dropdown.parent().removeClass('menu-open');
      }
    }
  }

  _closeInactiveDropdowns() {
    const $dropdowns = this.$el.find('.nav-submenu:not(.active)');

    for (let i = 0; i < $dropdowns.length; i++) {
      let $dropdown = $($dropdowns[i]);
      if ($dropdown.hasClass('visible')) {
        $dropdown.removeClass('visible fly-right fly-left');
        $dropdowns.parent().removeClass('menu-open');
      }
    }
  }

  _alternateNavSwitch() {
    if ($('.navigation-alternate').hasClass('navigation-left')) {
      this.$primaryTier.insertBefore('.header-branding');
    }
    this.$primaryTier.addClass('show-menu');
    this.$branding.addClass('show-branding');
  }
}
