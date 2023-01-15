$(document).ready(function () {
  var validateModal = new bootstrap.Modal(
    document.getElementById("validateModal"),
    {
      keyboard: false,
    }
  );
  var messageModal = new bootstrap.Modal(
    document.getElementById("messageModal"),
    {
      keyboard: false,
    }
  );
  $("#validateModal button[data-role='close']").click(() => {
    validateModal.hide();
  });
  $("#messageModal button[data-role='close']").click(() => {
    messageModal.hide();
  });
  $("input, select").change(function () {
    var formData = $("#addressForm").serializeObject();
    console.log(formData);
    console.log("Changed");
    $.post({
      url: "validate.php",
      type: "post",
      dataType: "JSON",
      data: formData,
      success: function (response) {
        console.log(response);
        if (!response.error) {
          console.log("Fixed", response);
          $("#validateModal .modal-body").html(`
                        Address: ${response.address2} <br>
                        City: ${response.city} <br>
                        State: ${response.state} <br>
                        Zip: ${response.zip} <br>
                    `);
          validateModal.show();
          $("#validateModal button[data-role='update-address']").click(() => {
            $("#address2").val(response.address2);
            $("#city").val(response.city);
            $("#state").val(response.state);
            $("#zip").val(response.zip);
            validateModal.hide();
          });
        }
      },
    });
  });

  $("form").submit(function (event) {
    event.preventDefault();
    var formData = $("#addressForm").serializeObject();
    console.log(formData);
    $.post({
      url: "submit.php",
      type: "post",
      dataType: "JSON",
      data: formData,
      success: function (response) {
        if (response.error) {
          $("#messageModal .modal-body").html(`
                        There is an issue ${response.text}
                    `);

          messageModal.show();
        } else {
          $("#messageModal .modal-body").html(`
                        Thank you
                    `);
          messageModal.show();
          $("form").get(0).reset();
        }
      },
    });
  });
});

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
