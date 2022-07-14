import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import _ from 'lodash';

function getFieldId($field) {
  let fieldId = $field.prop('name').match(/(\[.*\])/);

  if (fieldId && fieldId.length !== 0) {
    return fieldId[0];
  }

  return '';
}

/**
 * Insert hidden field after State/Province field
 * @param {object} $stateField JQuery field object
 */
function insertStateHiddenField($stateField) {
  let fieldId = getFieldId($stateField),
      stateFieldAttrs = {
        type: 'hidden',
        name: `FormFieldIsText${fieldId}`,
        value: '1'
      };

  $stateField.after($('<input />', stateFieldAttrs));
}

/**
 * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
 * @returns {jQuery|HTMLElement}
 */
function makeStateRequired(stateElement, context) {
  let attrs,
    $newElement,
    $hiddenInput;

  attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
    result[item.name] = item.value;
    return result;
  });

  let replacementAttributes = {
    id: attrs.id,
    'data-label': attrs['data-label'],
    class: 'form-select',
    name: attrs.name,
    'data-field-type': attrs['data-field-type']
  };

  stateElement.closest('.form-field').find('[data-field-type]').replaceWith($('<select></select>', replacementAttributes));

  $newElement = $('[data-field-type="State"]');
  $hiddenInput = $('[name*="FormFieldIsText"]');

  if ($hiddenInput.length !== 0) {
    $hiddenInput.remove();
  }

  return $newElement;
}

/**
 * If a country with states is the default, a select will be sent,
 * In this case we need to be able to switch to an input field and hide the required field
 */
function makeStateOptional(stateElement) {
  let attrs,
    $newElement;

  attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
    result[item.name] = item.value;
      return result;
  });

  let replacementAttributes = {
    type: 'text',
    id: attrs.id,
    'data-label': attrs['data-label'],
    class: 'form-select form-input',
    name: attrs.name,
    'data-field-type': attrs['data-field-type']
  };

  stateElement.replaceWith($('<input />', replacementAttributes));

  $newElement = $('[data-field-type="State"]');

  if ($newElement.length !== 0) {
    insertStateHiddenField($newElement);
    $newElement.prev().find('small').hide();
  }

  return $newElement;
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param {Object} statesArray
 * @param {jQuery} $selectElement
 * @param {Object} options
 */
function addOptions(statesArray, $selectElement, options) {
  let container = [];
  container.push(`<option value="">${options.validationStateProvince}</option>`);
  if (!_.isEmpty($selectElement)) {
    _.each(statesArray.states, (stateObj)  => {
      if (options.useIdForStates) {
        container.push(`<option value="${stateObj.id}">${stateObj.name}</option>`);
      } else {
        container.push(`<option value="${stateObj.name}">${stateObj.name}</option>`);
      }
    });
    $selectElement.html(container.join(' '));
  }
}

/**
 *
 * @param {jQuery} stateElement
 * @param {Object} context
 * @param {Object} options
 * @param {Function} callback
 */
export default function(stateElement, context, options, callback) {
  context = context || {};

  /**
   * Backwards compatible for three parameters instead of four
   *
   * Available options:
   *
   * useIdForStates {Bool} - Generates states dropdown using id for values instead of strings
   */
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options.validationStateProvince = context.validationStateProvince;

  $('select[data-field-type="Country"]').on('change', (event) => {
    let countryName = $(event.currentTarget).val();

    if (countryName === '') {
      return;
    }

    utils.api.country.getByName(countryName, (err, response) => {
      let $currentInput;

      if (err) {
        alert(context.state_error);
        return callback(err);
      }

      $currentInput = $('[data-field-type="State"]');

      if (!_.isEmpty(response.data.states)) {
        // The element may have been replaced with a select, reselect it
        let $selectElement = makeStateRequired($currentInput, context);
        addOptions(response.data, $selectElement, options);
        callback(null, $selectElement);
      } else {
        let newElement = makeStateOptional($currentInput, context);
        callback(null, newElement);
      }
    });
  });
}
