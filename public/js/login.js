$("#login").click(async function (e) {
  e.preventDefault();
  try {
    const data = {
      email: $("#email").val(),
      password: $("#password").val(),
    };
    await $.ajax({
      url: "/api/v1/users/login",
      method: "post",
      data,
      success: (data) => {
        if (data.data.user.role == "admin") {
          showAlert("success", "Login successfully!");
          window.setTimeout(() => {
            location.assign("/products");
          }, 1500);
        } else {
          showAlert("error", "Tài khoản của bạn không có quyền truy cập!");
        }
      },
    });
  } catch (error) {
    showAlert("error", error.responseJSON.message);
  }
});

