$(document).ready(function () {
  var validateModal = new bootstrap.Modal(
    document.getElementById("validateModal"),
    {
      keyboard: false,
    }
  );
  $("#validateModal button[data-role='close']").click(() => {
    validateModal.hide();
    $("#validateModal .alert").hide();
  });

  $("#addressForm").submit(function (event) {
    event.preventDefault();
    showLoading("#addressForm button[data-role='validate']");
    var formData = $("#addressForm").serializeObject();

    $.post({
      url: "validate.php",
      type: "post",
      dataType: "JSON",
      data: formData,
      success: function (response) {
        if (!response.error) {
          $("#validateModal .modal-body #pills-original").html(`
                        Address Line 1: ${formData.address1} <br>
                        Address Line 2: ${formData.address2} <br>
                        City: ${formData.city} <br>
                        State: ${formData.state} <br>
                        Zip: ${formData.zip} <br>
                    `);
          $("#validateModal .modal-body #pills-standardized").html(`
                        Address Line 1: ${response.address1} <br>
                        Address Line 2: ${response.address2} <br>
                        City: ${response.city} <br>
                        State: ${response.state} <br>
                        Zip: ${response.zip} <br>
                    `);
          validateModal.show();
          $("#validateModal button[data-role='save']").off('click').click(() => {
            showLoading("#validateModal button[data-role='save']");
            var addressToSave = $(
              ".address-types .nav-link#pills-original-tab"
            ).hasClass("active")
              ? formData
              : response;

            $.post({
              url: "submit.php",
              type: "post",
              dataType: "JSON",
              data: addressToSave,
              success: function (response) {
                if (response.error) {
                  $("#validateModal .alert")
                    .removeClass()
                    .addClass("alert alert-error")
                    .html(`There is an issue ${response.text}`)
                    .show();
                } else {
                  $("#validateModal .alert")
                    .removeClass()
                    .addClass("alert alert-success")
                    .html("Address saved successfully!")
                    .show();
                  $("form").get(0).reset();
                }
              },
              complete: function () {
                hideLoading("#validateModal button[data-role='save']");
              },
              error: function () {
                $("#validateModal .alert")
                  .removeClass()
                  .addClass("alert alert-error")
                  .html("Error happened!");
              },
            });
          });
        } else {
          alert(response.text);
        }
      },
      complete: function () {
        hideLoading("#addressForm button[data-role='validate']");
      },
      error: function () {
        alert('Error');
      },
    });
  });
});

// Show loading spinner
function showLoading(selector) {
  $(selector).prepend(
    '<span class="spinner-border spinner-border-sm" style="margin-right: 5px;" role="status" aria-hidden="true"></span>'
  );
}

// Hide loading spinner
function hideLoading(selector) {
  $(selector).children(".spinner-border").remove();
}

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};
