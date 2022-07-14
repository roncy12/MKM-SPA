import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import initFormSwatch from '../core/formSelectedValue';

export default class ProductUtils {
  constructor(el, options) {
    this.el = el;
    this.$el = $(el);
    this.productId = this.$el.find('[data-product-id]').val();
    this.$productMessage = this.$el.find('[data-product-message]');

    this.options = $.extend({
      buttonDisabledClass: 'disabled',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => console.log('Update requested.'),
      didUpdate: () => console.log('Update executed.'),
      switchImage: () => console.log('Image switch attempted.'),
    }, this.options.callbacks);

    this._bindEvents();
  }

  _bindEvents() {
    this.$el.on('click', '[data-product-quantity-change]', (event) => {
      this._updateQuantity(event);
    });

    this.$el.on('click', '[data-button-purchase]', (event) => {
      event.preventDefault();
      this._addProductToCart(event);
      this._toggleSpinner(event);
    });

    this.$el.on('change', '[data-product-option-change]', (event) => {
      this._productOptions(event);
    });

    initFormSwatch();
  }

  _getViewModel($el) {
    return {
      $price: $('[data-product-price-wrapper="without-tax"]', $el),
      $priceWithTax: $('[data-product-price-wrapper="with-tax"]', $el),
      $saved: $('[data-product-price-saved]', $el),
      $sku: $('[data-product-sku]', $el),
      $weight: $('[data-product-weight]', $el),
      $addToCart: $('[data-button-purchase]', $el),
    }
  }

  init(context) {
    this.context = context;

    this._updateAttributes(window.BCData.product_attributes);

    $('[data-product-option-change]').trigger('change');
  }

  _updateQuantity(event) {
    const $target = $(event.currentTarget);
    const $quantity = $target.closest('[data-product-quantity]').find('[data-product-quantity-input]');
    const min = parseInt($quantity.prop('min'), 10);
    const max = parseInt($quantity.prop('max'), 10);
    let newQuantity = parseInt($quantity.val(), 10);

    this.$productMessage.empty().removeClass('alert-success alert-error');

    if ($target.is('[data-quantity-increment]') && (!max || newQuantity < max)) {
      newQuantity = newQuantity + 1;
    } else if ($target.is('[data-quantity-decrement]') && newQuantity > min) {
      newQuantity = newQuantity - 1;
    }

    $quantity.val(newQuantity);
  }

  /**
  *
  * Handle product options changes
  *
  */
  _productOptions(event) {
    const $changedOption = $(event.currentTarget);
    const $form = $changedOption.parents('form');

    // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
    if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
      return;
    }

    utils.api.productAttributes.optionChange(this.productId, $form.serialize(), (err, response) => {
      const viewModel = this._getViewModel(this.$el);
      const data = response ? response.data : {};

      this._updateAttributes(data);

      if (!$form.data('product-options-count')) {
        return;
      }

      if (viewModel.$sku.length) {
        viewModel.$sku.html(data.sku);
      }

      if (viewModel.$weight.length) {
        viewModel.$weight.html(data.weight.formatted);
      }

      if (viewModel.$price.length) {
        const priceStrings = {
          price: data.price,
          excludingTax: this.context.excludingTax,
        };
        viewModel.$price.html(this.options.priceWithoutTaxTemplate(priceStrings));
      }

      if (viewModel.$priceWithTax.length) {
        const priceStrings = {
          price: data.price,
          includingTax: this.context.includingTax,
        };
        viewModel.$priceWithTax.html(this.options.priceWithTaxTemplate(priceStrings));
      }

      if (viewModel.$saved.length) {
        const priceStrings = {
          price: data.price,
          savedString: this.context.priceYouSave,
        };
        viewModel.$saved.html(this.options.priceSavedTemplate(priceStrings));
      }

      if (data.image) {
        this.callbacks.switchImage(data.image);
      }

      this.$productMessage.empty().removeClass('alert-success alert-error');

      if (data.purchasing_message) {
        this.$productMessage.html(data.purchasing_message).addClass('alert-error');
      }

      if (!data.purchasable || !data.instock) {
        viewModel.$addToCart
          .addClass(this.options.buttonDisabledClass)
          .prop('disabled', true)
          .children('[data-button-text]')
          .text(this.context.soldOut);

      } else {
        let buttonText = this.context.addToCart;
        if (viewModel.$addToCart.is('[data-button-preorder]')) {
          buttonText = this.context.preOrder;
        }

        viewModel.$addToCart
          .removeClass(this.options.buttonDisabledClass)
          .prop('disabled', false)
          .children('[data-button-text]')
          .text(buttonText);
      }
    });
  }

  /**
  *
  * Add a product to cart
  *
  */
  _addProductToCart(event) {
    const form = this.$el.find('[data-product-form]')[0];
    const $form = $(form);

    // Do not do AJAX if browser doesn't support FormData OR
    if (window.FormData === undefined || !(this.$el.has(form))) {
      return;
    }

    event.preventDefault();

    this.callbacks.willUpdate($form);

    // Add item to cart
    utils.api.cart.itemAdd(new FormData(form), (err, response) => {
      let isError = false;

      if (err || response.data.error) {
        isError = true;
        response = err || response.data.error;
      } else {
        $('body').trigger('cart-quantity-update');
      }

      this._updateMessage(isError, response);
      this.callbacks.didUpdate(isError, response, $form);
    });
  }

  _toggleSpinner(event) {
    this.$el.find('.spinner').toggleClass('visible');
  }

  _updateMessage(isError, response) {
    let message = '';

    if (isError) {
      message = response;

      setTimeout(() => {
        this.$el.find('.product-add-button-wrapper .spinner').removeClass('visible');
      });
    } else {
      message = this.context.addSuccess;
      message = message
                  .replace('*product*', this.$el.find('[data-product-details]').data('product-title'))
                  .replace('*cart_link*', `<a href=${this.context.urlsCart}>${this.context.cartLink}</a>`)
                  .replace('*continue_link*', `<a href='/'>${this.context.homeLink}</a>`)
                  .replace('*checkout_link*', `<a href=${this.context.urlsCheckout}>${this.context.checkoutLink}</a>`);

      setTimeout(() => {
        this.$el.find('.product-add-button-wrapper .spinner').removeClass('visible');
      }, 800);
    }

    this.$productMessage.html(message).toggleClass('alert-error', isError).toggleClass('alert-success', !isError);

    if ($(this.$el).hasClass('single-product-wrap')) {
      $('html, body').animate({
        scrollTop: $('[data-product-message]').offset().top - 40
      }, 1000);
    }
  }

  _updateAttributes(data) {
    if (data === undefined) { return; }

    const behavior = data.out_of_stock_behavior;
    const inStockIds = data.in_stock_attributes;
    const outOfStockMessage = ` (${data.out_of_stock_message})`;

    if (behavior !== 'hide_option' && behavior !== 'label_option') {
      return;
    }

    $('[data-product-attribute-value]', this.$el).each((i, attribute) => {
      const $attribute = $(attribute);
      const attrId = parseInt($attribute.data('product-attribute-value'), 10);

      if (inStockIds.indexOf(attrId) !== -1) {
        this._enableAttribute($attribute, behavior, outOfStockMessage);
      } else {
        this._disableAttribute($attribute, behavior, outOfStockMessage);
      }
    });
  }

  _disableAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.hide();
    } else {
      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
      } else {
        $attribute.addClass('option-unavailable');
      }
    }
  }

  _enableAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.show();
    } else {
      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.html($attribute.html().replace(outOfStockMessage, ''));
      } else {
        $attribute.removeClass('option-unavailable');
      }
    }
  }

  _getAttributeType($attribute) {
    const $parent = $attribute.closest('[data-product-attribute]');
    return $parent ? $parent.data('product-attribute') : null;
  }
}
