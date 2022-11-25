$(document).ready(function () {
    $("select").select2({
      theme: "bootstrap-5",
    });
    $(".navbar-nav li").removeClass("active");
    $(".navbar-nav li")[0].className = "nav-item active";
  });