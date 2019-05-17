$(document).ready(function() {

  showItems();
  $('#changeMessage').val('');

  function showItems() {
  clearItems();
  var itemButton = $('#itemButtons');
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/items',
    success: function(data, status) {
      $.each(data, function(index, item) {
        var id = item.id;
        var name = item.name;
        var price = (item.price).toFixed(2);
        var quantity = item.quantity;

        var button = '<button onclick="vendingItemButton(' + id + ')" type ="button" id="itemBtn" class="btn btn-default" style="width:200px;height:200px;margin:10px;">' + '<p align="left">' + id + '</p>' + '<p>' + name + '</p>' + '<p style="text-center">$' + price + '</p>' + '<p style="text-center">Quantity Left: ' + quantity + '</p>' + '</button>';
        itemButton.append(button);
      });
    },
    error: function(JQXHR, textStatus, errorThrown) {
      var error = $.parseJSON(JQXHR.responseText);
      $('#message').val(error.message);

    }
  });
}

  $('#Buy').click(function() {
    $("#changeMessage").val('');
    var itemId = $('#itemNumber').val();
    var amount = $('#moneyEntered').val();
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/money/' + amount + '/item/' + itemId,
      dataType: 'json',
      success: function(data) {
        var change = {
          "quarters": data.quarters,
          "dimes": data.dimes,
          "nickels": data.nickels
        };
        changeOutput(change);
        $('#message').val('Thanks');
        clearItems();
        showItems();
      },
      error: function(JQXHR, textStatus, errorThrown) {
        var error = $.parseJSON(JQXHR.responseText);
        $('#message').val(error.message);

      }
    });
  });


  $('#moneyEntered').val(0);

  function addCurrency(tag, amount) {
    $('#Add' + tag).click(function() {
      var moneyIn = parseInt($('#moneyEntered').val() * 100) + amount;
      $('#moneyEntered').val((moneyIn / 100).toFixed(2));
      $('#message').val('');
      $('#changeMessage').val('');
    });
  }

  var currencies = [
    ["dollar", 100],
    ["quarter", 25],
    ["dime", 10],
    ["nickel", 5]
  ];

  currencies.forEach(function(c) {
    addCurrency(c[0],c[1]);
  });

  $('#changeButton').click(function() {
    var moneyInPennies = $('#moneyEntered').val() * 100;
    var quarterCount = Math.floor(moneyInPennies / 25);
    moneyInPennies %= 25;
    var dimeCount = Math.floor(moneyInPennies / 10);
    moneyInPennies %= 10;
    var nickelCount = Math.floor(moneyInPennies / 5);
    moneyInPennies %= 5;
    var change = {
      "quarters": quarterCount,
      "dimes": dimeCount,
      "nickels": nickelCount,
      "pennies": moneyInPennies
    };
    changeOutput(change);
    $('#message').val('');
  });
});



function clearItems() {
  $('#itemButtons').empty();
}

function changeOutput(change) {
  var changeMessage = "" + change.quarters + " quarters " +
    change.dimes + " dimes " +
    change.nickels + " nickels ";
  $('#changeMessage').val(changeMessage);
  $('#moneyEntered').val(0);
  $("#itemNumber").val('');
  $('#message').val('');
}


function vendingItemButton(id) {
  $('#itemNumber').val(id);
  $('#message').val('');
}
