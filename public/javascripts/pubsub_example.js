if (typeof CEJS === 'undefined') { CEJS = {} };
if (typeof CEJS.Common === 'undefined') { CEJS.Common = {} };

CEJS.Common.Table = function() {
  var tBody, tFoot;

  var findProductRow = function(product) {
    return $.grep(tBody.find('tr'), function(row, index) {
      return product.id === row.getAttribute('data-product-id');
    })[0];
  };

  var addProductToTable = function(product) {
    var foundRow = findProductRow(product);
    if (typeof foundRow === 'undefined') {
      tBody.append(buildNewRow(product));
    } else {
      updateRow(foundRow, product);
    }
  };

  var updateRow = function(row, product) {
    var cells = $(row).find('td'),
        $quantityCell = $(cells[2]),
        $costCell = $(cells[4]);

    var currentQuantity = $quantityCell.text(),
        newQuantity = parseInt(currentQuantity) + product.quantity;

    $quantityCell.text(newQuantity);
    $costCell.text(formatCost(calculateCost(newQuantity, product.cost)));
  };

  var buildNewRow = function(product) {
    return '<tr data-product-id="' + product.id + '">'
           + '<td>' + product.id + '</td>'
           + '<td>' + product.description + '</td>'
           + '<td>' + product.quantity + '</td>'
           + '<td class="align-right">' + formatCost(product.cost) + '</td>'
           + '<td class="cost align-right">' + formatCost(calculateCost(product.quantity, product.cost)) + '</td></tr>';
  };

  var calculateCost = function(quantity, cost) {
    return parseFloat(parseInt(quantity) * parseFloat(cost));
  };

  var formatCost = function(cost) {
    return '$' + cost.toFixed(2);
  };

  var unformatCost = function(formattedCost) {
    return parseFloat(formattedCost.replace(/\$/, ''));
  };

  var updateTotal = function(cost) {
    var total = 0;
    $.each(tBody.find('td.cost'), function(index, cost) {
      total += parseFloat(cost.innerText.replace(/\$/, ''));
    });
    tFoot.find('td:last').text(formatCost(total));
  };

  var subscribeToProduct = function () {
    PubSub.subscribe('cejs.form.product', function(message, product) {
      addProductToTable(product);
      updateTotal();
    });
  };

  return {
    init: function () {
      var table = $('table.table');
      tBody = table.find('tbody');
      tFoot = table.find('tfoot');
      subscribeToProduct();
    },
  };
};

CEJS.Common.Form = function() {
  var fields, quantity, product, button;

  var addClickEventToButton = function() {
    button.click(function() {
      var selectedQuantity   = quantity.find('option:selected').val(),
          selectedProduct    = product.find('option:selected'),
          productId          = selectedProduct.val();

      if (selectedQuantity !== '' && productId !== '') {
        PubSub.publish('cejs.form.product', {
          id: productId,
          description: selectedProduct.text(),
          quantity: parseInt(selectedQuantity),
          cost: parseFloat(selectedProduct.data('cost')),
        });
      }
    });
  };

  return {
    init: function () {
      fields   = $('div.fields'),
      quantity = fields.find('select.quantity'),
      product  = fields.find('select.product'),
      button   = fields.find('button.add');
      addClickEventToButton();
    },
  };
};

(function() {
  new CEJS.Common.Table().init();
  new CEJS.Common.Form().init();
})();
