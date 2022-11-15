const loadData = async () => {
  try {
    $("#sample_data").DataTable({
      processing: true,
      serverSide: true,
      serverMethod: "get",
      ajax: {
        url: "api/v1/orders/getTableOrder",
      },
      columns: [
        {
          data: "user",
          render: function (data) {
            return '<div class= "my-3">' + data.name + "</div>";
          },
        },
        {
          data: "cart",
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
          data: "createdAt",
          render: function (data) {
            const theDate = new Date(Date.parse(data));
            const date = theDate.toLocaleString();
            return '<div class= "my-3">' + date + "</div>";
          },
        },
        {
          data: "status",
          render: function (data) {
            let html = "";
            if (data == "Processed")
              html = `<div class= "my-3"><button class="btn btn-warning" disabled>${data}</button></div>`;
            if (data == "Cancelled")
              html = `<div class= "my-3"><button class="btn btn-error" disabled>${data}</button></div>`;
            if (data == "Waiting Goods")
              html = `<div class= "my-3"><button class="btn btn-info" disabled>${data}</button></div>`;
            if (data == "Delivery")
              html = `<div class= "my-3"><button class="btn btn-primary" disabled>${data}</button></div>`;
            if (data == "Success")
              html = `<div class= "my-3"><button class="btn btn-success" disabled>${data}</button></div>`;
            return html;
          },
        },
        {
          data: "totalPrice",
          render: function (data) {
            return `<div class= "my-3">${data} VND</div>`;
          },
        },
        {
          data: null,
          render: function (row) {
            let btnView = `<a href="/orders/${row.id}"><button type="button" class="btn btn-primary btn-sm mr-1" data-id="' +
              row.id +
              '">View</button></a>`;

            return `<div class= "my-3">${btnView}</div>`;
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
$(document).ready(function () {
  loadData();
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li")[2].className = "nav-item active";
});
