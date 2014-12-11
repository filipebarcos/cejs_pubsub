(function($) {

  var $fields   = $('div.fields'),
      $quantity = $fields.find('select.quantity'),
      $product  = $fields.find('select.product'),
      $button   = $fields.find('button.add'),
      $tBody    = $('table.table tbody');

  var addProductToTable = function(product) {
    var foundRow = findProductRow(product);
    if (typeof foundRow === 'undefined') {
      $tBody.append(buildNewRow(product));
    } else {
      updateRow(foundRow, product);
    }
  };

  var updateRow = function(row, product) {
    var cells = $(row).find('td'),
        quantityCell = $(cells[2]),
        costCell = $(cells[3]);

    var currentQuantity = quantityCell.text(),
        newQuantity = parseInt(currentQuantity) + product.quantity;

    quantityCell.text(newQuantity);
    costCell.text(formatCost(calculateCost(newQuantity, product.cost)));
  };

  var buildNewRow = function(product) {
    return '<tr data-product-id="' + product.id + '">'
           + '<td>' + product.id + '</td>'
           + '<td>' + product.description + '</td>'
           + '<td>' + product.quantity + '</td>'
           + '<td class="align-right">' + formatCost(product.cost) + '</td></tr>';
  };

  var calculateCost = function(quantity, cost) {
    return parseFloat(parseInt(quantity) * parseFloat(cost));
  };

  var formatCost = function(cost) {
    return '$' + cost.toFixed(2);
  };

  var findProductRow = function(product) {
    return $.grep($tBody.find('tr'), function(row, index) {
      return product.id === row.getAttribute('data-product-id');
    })[0];
  };


  $button.click(function() {
    var selectedQuantity   = $quantity.find('option:selected').val(),
        selectedProduct    = $product.find('option:selected'),
        productId          = selectedProduct.val();

    if (selectedQuantity !== '' && productId !== '') {
      addProductToTable({
        id: productId,
        description: selectedProduct.text(),
        quantity: parseInt(selectedQuantity),
        cost: calculateCost(selectedQuantity, selectedProduct.data('cost')),
      });
    }
  });

})(jQuery);
