foodly.define(['jquery', "jquery.currencies", 'shopInfo', 'shopifyCommon', 'utils'], function($, Currency, shopInfo, Shopify, utils){


  function QuantityBox(options) {
    var defOpt = {
      DOM : {}
    };

    this.options = utils.mergeOptions(defOpt, options);
    this.DOM     = utils.domFinder(this.options.DOM);

    for (var i = 0, max = this.DOM.quantityFieldsAll.length; i < max; i++) {

      quantityFieldDOM  = this.DOM.quantityFieldsAll[i];

      QuantityBox.initArrows(quantityFieldDOM.closest('.quantity-field'));

      quantityFieldDOM.addEventListener('change', function(e){
        this.inputChangeEvent(e);
      }.bind(this));
    }
  }

  QuantityBox.prototype.inputChangeEvent = function(event) {

    var target = event.currentTarget;

    var quantityParentDOM = target.closest('.quantity-field').parentElement;

    var totalPriceDOM     = quantityParentDOM.querySelector('.js-total-price');
    var productPriceDOM   = quantityParentDOM.querySelector('.js-price-and-value .money');
    var productPrice      = productPriceDOM.innerHTML;

    productPrice = productPrice.replace(/[^0-9.]/g, '');
    productPrice = parseFloat(productPrice.replace(/\./g, ''));

    var total = target.value * productPrice;
    // var currentMoneyFormat = Currency.moneyFormats[Currency.currentCurrency].money_format;
    // var totalFormated = totalPriceDOM.innerHTML = Shopify.formatMoney(total, currentMoneyFormat);


    changeMoneyValue(totalPriceDOM, total);
    function changeMoneyValue(elem, price) {
      var currentMoneyFormat = Currency.moneyFormats[Currency.currentCurrency].money_format;
      /*Fix for Shopify Commont js ${{amount_no_decimals}} bug*/
      currentMoneyFormat.match('amount_no_decimals') ? price *= 100 : null ;
      var priceFormated = Shopify.formatMoney(price, currentMoneyFormat);
      elem.innerHTML = priceFormated;

      var attrName, tempCur, tempPrice, tempPriceFormated;

      for (var i = 0; i < elem.attributes.length; i++) {
        attrName = elem.attributes[i].name;
        if (attrName.includes('data-currency-')) {
          tempCur = attrName.slice(14);
          tempCur = tempCur.toUpperCase();
          tempPrice = Currency.convert(price, Currency.currentCurrency, tempCur);
          tempPriceFormated = Shopify.formatMoney(tempPrice, Currency.moneyFormats[tempCur].money_format);
          elem.setAttribute(attrName, tempPriceFormated);
        }
      }

    }
    // var attrName, attrCurName;
    // attrCurName = 'data-currency-' + Currency.currentCurrency.toLowerCase();
    //
    // if ( totalPriceDOM && totalPriceDOM.getAttribute('data-currency') !== '' ){
    //     totalPriceDOM.setAttribute(attrCurName, totalFormated);
    //     for (var i = 0; i < totalPriceDOM.attributes.length; i++) {
    //       attrName = totalPriceDOM.attributes[i].name;
    //       if (attrName != attrCurName && attrName.includes('data-currency-')) {
    //         totalPriceDOM.removeAttribute(attrName);
    //       }
    //     }
    //   }
      // if ( window.shopCurrency != Currency.currentCurrency ) {
      //   Currency.convertAll(shopCurrency, $('[name=currencies]').val(), '.js-price-and-value span.money', 'money_format');
      // }

  }

  QuantityBox.initArrows = function(quantityContainer) {

    if (!quantityContainer) {
      return null;
    }

    var quantityField, quantityFieldValue, arrowUp, arrowDown;

    quantityField = quantityContainer.querySelector('input');
    arrowUp       = quantityContainer.querySelector('.js-up-quantity');
    arrowDown     = quantityContainer.querySelector('.js-down-quantity');

    arrowUp.addEventListener('click', function(e) {
      quantityFieldValue = parseInt(quantityField.value);
      quantityFieldValue++;
      quantityField.value = quantityFieldValue;
      utils.triggerEvent(quantityField, 'change');
    });

    arrowDown.addEventListener('click', function(e) {
      quantityFieldValue = parseInt(quantityField.value);

      if (quantityFieldValue > 0) {
        quantityFieldValue--;
      } else {
        quantityFieldValue = 0;
      }

      quantityField.value = quantityFieldValue;
      utils.triggerEvent(quantityField, 'change');
    });
  };

  return QuantityBox;
})
