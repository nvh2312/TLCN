const err_src = "/images/unnamed.jpg";
let arr_product = [];
let arr_invoice = [];
let arr_stored = [];
const loadData = async () => {
  try {
    $("#sample_data").DataTable({
      processing: true,
      serverSide: true,
      serverMethod: "get",
      ajax: {
        url: "api/v1/imports/getTableImport",
      },
      columns: [
        {
          data: "user",
          render: function (data) {
            return '<div class= "my-3">' + data.name + "</div>";
          },
        },
        {
          data: "invoice",
          render: function (data) {
            let html = "";
            data.forEach((value, index) => {
              const name =
                value.product.title.length > 39
                  ? value.product.title.slice(0, 40) + "..."
                  : value.product.title;
              html += `<div class= "my-3"> ${name} </div>`;
            });
            return html;
          },
        },
        {
          data: "totalPrice",
          render: function (data) {
            return '<div class= "my-3">' + data + "</div>";
          },
        },
        {
          data: "createdAt",
          render: function (data) {
            const theDate = new Date(Date.parse(data));
            const date = theDate.toLocaleString();
            return '<div class= "my-3">' + date + "</div>";
          },
        },
        {
          data: null,
          render: function (row) {
            let btnView = `<a href="/imports/${row.id}"><button type="button" class="btn btn-primary btn-sm mr-1">View</button></a>`;
            let btnEdit =
              '<button type="button" class="btn btn-primary btn-sm mr-1 edit" data-id="' +
              row.id +
              '"><i class="fa fa-edit"></i></button>';
            let btnDelete =
              '<button type="button" class="btn btn-danger btn-sm delete" data-id="' +
              row.id +
              '"><i class="fa fa-trash-alt"></i></button></div>';
            return `<div class= "my-3">${btnEdit}${btnDelete}${btnView}</div>`;
          },
        },
      ],
    });

    showAlert("success", "Load Data successfully!");
  } catch (err) {
    showAlert("error", err);
  }
};

function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}

async function loadProducts() {
  await $.ajax({
    url: "/api/v1/products",
    method: "get",
    success: (data) => {
      arr_product = data.data.data;
      arr_product.forEach((value) => {
        const name =
          value.title.length > 39
            ? value.title.slice(0, 40) + "..."
            : value.title;
        $("#invoice_items").append(
          "<option value=" + value.id + ">" + name + "</option>"
        );
      });
    },
  });
}

$("#add_data").click(function () {
  arr_invoice = [];
  $("#invoice_items").val();
  $("#action").val("Add");
  $("#action_button").text("Add");
  $("#action_modal").modal("show");
});

$("#invoice_items").change(async function () {
  $(".list-item").empty();
  //   arr_invoice = [];
  arr_stored = [];
  await $(this)
    .val()
    .forEach(async (value, index) => {
      let data = await arr_product.find((item) => item._id == value);
      const name =
        data.title.length > 39 ? data.title.slice(0, 40) + "..." : data.title;

      const item = {
        id: value,
        image: data.images[0],
        title: name,
        quantity: 1,
      };
      arr_stored.push(item);
      //   arr_invoice.push(item);
    });

  await arr_stored.forEach(async (value, index) => {
    const data = await arr_invoice.find((item) => item.id == value.id);
    console.log(data);
    if (data!= undefined) arr_stored[index] = data;
    const quantity = arr_stored[index].quantity;
    let html =
      `<hr><div class="d-flex"><div class="col-md-2"><img src="` +
      value.image +
      `" alt=""height="65" width="65" onerror="this.src='` +
      err_src +
      `';" style="border-radius: 0.275rem;" ></div><div class="col-md-5 product-name"><p class="mt-1">` +
      value.title +
      `</p></div><div class="col-md-2 quantity"><input id="` +
      index +
      `" type="number" value="${quantity}"class="form-control quantity-input" min="1" onchange="updateQuantity(this)"> </div><div class="col-md-3 price"><input class="form-control" type="number"></input></div> </div>`;
    $(".list-item").append(html);
  });
  arr_invoice = arr_stored;
});
function updateQuantity(value) {
    arr_invoice[value.id].quantity = value.value;
    console.log(arr_invoice);
  }

$(document).ready(async function () {
  $("select").select2({
    theme: "bootstrap-5",
  });
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li")[7].className = "nav-item active";
  loadData();
  await loadProducts();
});
