import $ from 'jquery';
import stateCountry from '../common/state-country';
import nod from '../common/nod';
import utils from 'bigcommerce/stencil-utils';
import updateState from '../core/updateState';
import SelectWrapper from '../components/SelectWrapper';

export default class ShippingEstimator {

  constructor(context, $element) {
    this.context = context;
    this.$element = $element;

    updateState(true, this.selectWrapCallback);

    this.$state = $('[data-field-type="State"]', this.$element);
    this.initFormValidation();
    this.bindStateCountryChange();
    this.bindEstimatorEvents();
  }

  initFormValidation() {
    this.shippingEstimator = 'form[data-shipping-estimator]';
    this.shippingValidator = nod({
      submit: this.shippingEstimator + ' .shipping-estimate-submit'
    });

    $('.shipping-estimate-submit', this.$element).click((event) => {
      // When switching between countries, the state/region is dynamic
      // Only perform a check for all fields when country has a value
      // Otherwise areAll('valid') will check country for validity
      if ($(this.shippingEstimator + ' select[name="shipping-country"]').val()) {
        this.shippingValidator.performCheck();
      }

      if (this.shippingValidator.areAll('valid')) {
        return;
      }

      event.preventDefault();
    });

    this.bindValidation();
    this.bindUPSRates();
  }

  bindValidation() {
    this.shippingValidator.add([
      {
        selector: this.shippingEstimator + ' select[name="shipping-country"]',
        validate: (cb, val) => {
          let countryId = Number(val),
            result = countryId !== 0 && !isNaN(countryId);
          cb(result);
        },
        errorMessage: this.context.validationCountry,
      },
      {
        selector: $(this.shippingEstimator + ' select[name="shipping-state"]'),
        validate: (cb, val) => {
          // dynamic. switching between dropdown and input.
          let $ele = $(this.shippingEstimator + ' select[name="shipping-state"]'),
            result;

          if ($ele.length) {
            let eleVal = $ele.val();
            result = eleVal && eleVal.length && eleVal !== this.context.validationStateProvince;
          } else {
            return;
          }

          cb(result);
        },
        errorMessage: this.context.validationState,
      }
    ]);
  }

  /**
   * Toggle between default shipping and ups shipping rates
   */
  bindUPSRates() {
    const UPSRateToggle = '.estimator-form-toggle-ups-rate';

    $('body').on('click', UPSRateToggle, (event) => {
      const $estimatorFormUps = $('.estimator-form-ups'),
        $estimatorFormDefault = $('.estimator-form-default');

      event.preventDefault();

      $estimatorFormUps.toggleClass('hidden');
      $estimatorFormDefault.toggleClass('hidden');
    });
  }

  bindStateCountryChange() {
    // Requests the states for a country with AJAX
    stateCountry(this.$state, this.context, {useIdForStates: true}, (err) => {
      if (err) {
        alert(err);
        throw new Error(err);
      }

      // When you change a country, you swap the state/province between an input and a select dropdown
      // Not all countries require the province to be filled
      // We have to remove this class when we swap since nod validation doesn't cleanup for us
      $(this.shippingEstimator).find('.form-field-success').removeClass('form-field-success');
    });
  }

  bindEstimatorEvents() {
    let $estimatorContainer = $('.shipping-estimator'),
        $estimatorForm = $('.estimator-form');

    $estimatorForm.on('submit', (event) => {
      let params = {
          country_id: $('[name="shipping-country"]', $estimatorForm).val(),
          state_id: $('[name="shipping-state"]', $estimatorForm).val(),
          zip_code: $('[name="shipping-zip"]', $estimatorForm).val()
      };

      event.preventDefault();

      utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
        $('.shipping-quotes').html(response.content);

        // bind the select button
        $('.select-shipping-quote').on('click', (event) => {
          let quoteId = $('.shipping-quote:checked').val();

          event.preventDefault();

          utils.api.cart.submitShippingQuote(quoteId, () => {
            location.reload();
          });
        });
      });
    });

    $('.shipping-estimate-show').on('click', (event) => {
      event.preventDefault();

      $(event.currentTarget).hide();
      $estimatorContainer.removeClass('hidden');
      $('.shipping-estimate-hide').show();
    });


    $('.shipping-estimate-hide').on('click', (event) => {
      event.preventDefault();

      $estimatorContainer.addClass('hidden');
      $('.shipping-estimate-show').show();
      $('.shipping-estimate-hide').hide();
    });
  }

  selectWrapCallback($selectEl) {
    // Sometimes the SelectWrapper callback fired before the
    // State element could finish replacing itself
    // This short delay prevents that
    setTimeout((() => {
      new SelectWrapper($selectEl);
    }), 1500);
  }
}
