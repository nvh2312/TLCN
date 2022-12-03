let totalRevenue = 0;
let totalInvoice = 0;
let theDay;
let theWeek;
let theYear;
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const oneJan = new Date(currentDate.getFullYear(), 0, 1);
const numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
const currentWeek = Math.ceil((numberOfDays-1) / 7);
const arr_status = [
  {
    status: "Cancelled",
    quantity: 0,
  },
  {
    status: "Processed",
    quantity: 0,
  },
  {
    status: "Waiting Goods",
    quantity: 0,
  },
  {
    status: "Delivery",
    quantity: 0,
  },
  {
    status: "Success",
    quantity: 0,
  },
];
function showChart() {
  $("#myPieChart").remove();
  $("#showChartPie").append('<canvas id="myPieChart"><canvas>');
  let ctx = document.getElementById("myPieChart");
  const myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        arr_status[0].status,
        arr_status[1].status,
        arr_status[2].status,
        arr_status[3].status,
        arr_status[4].status,
      ],
      datasets: [
        {
          data: [
            arr_status[0].quantity,
            arr_status[1].quantity,
            arr_status[2].quantity,
            arr_status[3].quantity,
            arr_status[4].quantity,
          ],
          backgroundColor: ["red", "orange", "gray", "blue", "green"],
          hoverBackgroundColor: [
            "#dc3545",
            "#ffc107",
            "#adb5bd",
            "#2c9faf",
            "#20c997",
          ],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });
}
async function loadPieChart(dt) {
  try {
    if (dt == undefined) dt = {};
    arr_status[0].quantity = 0;
    arr_status[1].quantity = 0;
    arr_status[2].quantity = 0;
    arr_status[3].quantity = 0;
    arr_status[4].quantity = 0;

    const data = await $.ajax({
      url: "api/v1/orders/countOption",
      method: "POST",
      data: dt,
    });
    if (dt.date) {
      await data.forEach(async (value) => {
        await arr_status.forEach((status) => {
          if (
            value._id.year == theYear &&
            value._id.week == theWeek &&
            value._id.date == theDay &&
            status.status == value._id.status
          ) {
            status.quantity = value.count;
          }
        });
      });
    }
    if (!dt.date && dt.week) {
      await data.forEach(async (value) => {
        await arr_status.forEach((status) => {
          if (
            value._id.year == currentYear &&
            value._id.week == currentWeek &&
            status.status == value._id.status
          )
            status.quantity = value.count;
        });
      });
    }
    if (!dt.date && !dt.week && dt.month) {
      await data.forEach(async (value) => {
        await arr_status.forEach((status) => {
          if (
            value._id.year == currentYear &&
            value._id.month == currentMonth &&
            status.status == value._id.status
          )
            status.quantity = value.count;
        });
      });
    }
    if (!dt.week && !dt.month && dt.year) {
      await data.forEach(async (value) => {
        await arr_status.forEach((status) => {
          if (
            value._id.year == currentYear &&
            status.status == value._id.status
          )
            status.quantity = value.count;
        });
      });
    }
    if (dt.year == undefined) {
      await data.forEach(async (value) => {
        await arr_status.forEach((status) => {
          if (status.status == value._id.status) status.quantity = value.count;
        });
      });
    }

    showChart();
  } catch (error) {
    showAlert("error", "Đã có lỗi xảy ra");
  }
}
$(document).ready(async function () {
  $("select").select2({
    theme: "bootstrap-5",
  });
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li")[0].className = "nav-item active";
  loadPieChart();
  const countUser = await $.ajax({
    url: "api/v1/users",
    method: "GET",
  });
  const totalRevenue = await $.ajax({
    url: "api/v1/orders/sumOption",
    method: "POST",
  });
  const totalImport = await $.ajax({
    url: "api/v1/imports/sumOption",
    method: "POST",
  });
  const topProduct = await $.ajax({
    url: "api/v1/orders/topProduct",
    method: "POST",
  });
  const topInventory = await $.ajax({
    url: "api/v1/products?sort=-inventory&limit=5",
    method: "GET",
  });
  topProduct.forEach((value, index) => {
    $("#sell-product")
      .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${index + 1}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
  });
  topInventory.data.data.forEach((value, index) => {
    $("#inventory-product")
      .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${index + 1}
</div>
<div class="col-md-2">
    <img src="${value.images[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.inventory} sản phẩm
</div>`);
  });
  document.getElementById("totalRevenue").innerHTML =
    (totalRevenue[0].total_revenue / 1000000).toFixed() + " Triệu VND";
    document.getElementById("totalInvoice").innerHTML =
    (totalImport[0].total / 1000000).toFixed() + " Triệu VND";
  $("#totalUser").html(countUser.results);
  $("#totalOrder").html(arr_status[4].quantity);
});
async function changeData(e) {
  let data;
  if (e.id == "allYear") data = {};
  if (e.id == "inYear") data = { year: true };
  if (e.id == "inMonth") data = { year: true, month: true };
  if (e.id == "inWeek") data = { year: true, week: true };
  if (e == "inDay") data = { year: true, week: true, date: true };

  loadPieChart(data);
  const totalRevenue = await $.ajax({
    url: "api/v1/orders/sumOption",
    method: "POST",
    data,
  });
  let revenueValue = 0;
  if (data.date) {
    await totalRevenue.some((value) => {
      if (
        value._id.year == theYear &&
        value._id.week == theWeek &&
        value._id.date == theDay
      ) {
        revenueValue = value.total_revenue;
        return true;
      }
    });
  }
  if (!data.date && data.week) {
    await totalRevenue.some((value) => {
      if (value._id.year == currentYear && value._id.week == currentWeek) {
        revenueValue = value.total_revenue;
        return true;
      }
    });
  }
  if (!data.week && data.month) {
    await totalRevenue.some((value) => {
      if (value._id.year == currentYear && value._id.month == currentMonth) {
        revenueValue = value.total_revenue;
        return true;
      }
    });
  }
  if (!data.week && !data.month && data.year) {
    await totalRevenue.some((value) => {
      if (value._id.year == currentYear) {
        revenueValue = value.total_revenue;
        return true;
      }
    });
  }
  if (data.year == undefined) revenueValue = totalRevenue[0].total_revenue;

  document.getElementById("totalRevenue").innerHTML =
    (revenueValue / 1000000).toFixed() + " Triệu VND";

    const totalImport = await $.ajax({
        url: "api/v1/imports/sumOption",
        method: "POST",
        data,
      });
      let importValue = 0;
      if (data.date) {
        await totalImport.some((value) => {
          if (
            value._id.year == theYear &&
            value._id.week == theWeek &&
            value._id.date == theDay
          ) {
            importValue = value.total;
            return true;
          }
        });
      }
      if (!data.date && data.week) {
        await totalImport.some((value) => {
          if (value._id.year == currentYear && value._id.week == currentWeek) {
            importValue = value.total;
            return true;
          }
        });
      }
      if (!data.week && data.month) {
        await totalImport.some((value) => {
          if (value._id.year == currentYear && value._id.month == currentMonth) {
            importValue = value.total;
            return true;
          }
        });
      }
      if (!data.week && !data.month && data.year) {
        await totalImport.some((value) => {
          if (value._id.year == currentYear) {
            importValue = value.total;
            return true;
          }
        });
      }
      if (data.year == undefined) importValue = totalImport[0].total;
    
      document.getElementById("totalInvoice").innerHTML =
        (importValue / 1000000).toFixed() + " Triệu VND";

  const topProduct = await $.ajax({
    url: "api/v1/orders/topProduct",
    method: "POST",
    data,
  });
  $("#sell-product").empty();
  if (data.date) {
    let vt = 0;
    await topProduct.forEach((value, index) => {
      if (
        value._id.year == theYear &&
        value._id.week == theWeek &&
        value._id.date == theDay
      ) {
        vt++;
        $("#sell-product")
          .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${vt}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
      }
    });
  }
  if (!data.date && data.week) {
    let vt = 0;
    await topProduct.forEach((value, index) => {
      if (value._id.year == currentYear && value._id.week == currentWeek) {
        vt++;
        $("#sell-product")
          .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${vt}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
      }
    });
  }
  if (!data.week && data.month) {
    let vt = 0;
    await topProduct.forEach((value, index) => {
      if (value._id.year == currentYear && value._id.month == currentMonth) {
        vt++;
        $("#sell-product")
          .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${vt}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
      }
    });
  }
  if (!data.week && !data.month && data.year) {
    let vt = 0;
    await topProduct.forEach((value, index) => {
      if (value._id.year == currentYear) {
        vt++;
        $("#sell-product")
          .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${vt}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
      }
    });
  }
  if (data.year == undefined) {
    await topProduct.forEach((value, index) => {
      $("#sell-product")
        .append(`<div class="col-md-1 d-flex text-center align-items-center justify-content-center">
    ${index + 1}
</div>
<div class="col-md-2">
    <img src="${value.image[0]}"
        class="img-fluid" alt="Phone">
</div>
<div class="col-md-7 d-flex text-center align-items-center">
${value.title}
</div>
<div class="col-md-2 d-flex text-center align-items-center justify-content-center">
${value.quantity} sản phẩm
</div>`);
    });
  }

  $("#totalOrder").html(arr_status[4].quantity);
}

$("#birthday").on("change", function () {
  console.log(this.value)
  const date = new Date(this.value);
  theDay = date.getDay() == 0 ? 7 : date.getDay();
  console.log(theDay)
  const oneJ = new Date(date.getFullYear(), 0, 1);
  const numberOfD = Math.floor((date - oneJ) / (24 * 60 * 60 * 1000));
  theWeek = Math.ceil((numberOfD - 1) / 7);
  theYear = date.getFullYear();
  changeData("inDay");
});
