const loadData = async () => {
  try {
    // const arr = ["_id", "name", "price", "slug"];

    // let thead = `<thead><tr>`;
    // arr.forEach((value, index) => {
    //   thead += `<th>${value}</th>`;
    // });
    // thead += "</tr></thead>";
    // $("#sample_data").append(thead);
    // const { data } = await $.ajax({ url: "/api/v1/products/" });
    // let html = "<tbody>";

    // data.data.forEach((val, ind) => {
    //   val.arr = arr;
    //   html += `<tr>`;
    //   arr.forEach((value, index) => {
    //     html += `<td>${val[value]}</td>`;
    //   });
    //   html += `</tr>`;
    // });
    // html += "</tbody>";
    // $("#sample_data").append(html);
    $("#sample_data").DataTable({
      processing: true,
      serverSide: true,
      serverMethod: "get",
      ajax: {
        url: "api/v1/products/getTableProduct",
      },
      columns: [
        {
          data: "_id",
          render: function (data) {
            return '<div class= "my-3">' + data + "</div>";
          },
        },
        {
          data: "name",
          render: function (data) {
            return '<div class= "my-3">' + data + "</div>";
          },
        },

        {
          data: "price",
          render: function (data) {
            return '<div class= "my-3">' + data + " VND</div>";
          },
        },
        {
          data: "slug",
          render: function (data) {
            return '<div class= "my-3">' + data + "</div>";
          },
        },
      ],
    });
    
    showAlert("success", "Load Data successfully!");
  } catch (err) {
    showAlert("error", err);
  }
};
const loadCategory = function () {
  $.ajax({
    url: "/api/v1/categories",
    method: "GET",
    success: (data) => {
      $("#category").empty();
      $("#category").append(
        "<option selected disabled hidden></option>"
      );
      data.data.data.forEach((value) => {
        $("#category").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
};
const loadBrand = function () {
  $.ajax({
    url: "/api/v1/brands",
    method: "GET",
    success: (data) => {
      $("#brand").empty();
      $("#brand").append(
        "<option selected disabled hidden></option>"
      );
      data.data.data.forEach((value) => {
        $("#brand").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
};
const showModal = function () {
  $("label").remove(".error");
  loadCategory();
  $("#dynamic_modal_title").text("Add Product");

  $("#sample_form")[0].reset();
  $("#category_product").empty();

  $("#action").val("Add");

  $("#action_button").text("Add");

  $("#action_modal").modal("show");
};


$(document).ready(function() {
  loadData();
  loadCategory();
  loadBrand();
})
$(add_data).click(function() {
  showModal();
})
