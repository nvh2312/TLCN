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
        showAlert("success", "Login successfully!");
        window.setTimeout(() => {
          location.assign("/");
        }, 1500);
        
      },
    });
  } catch (error) {
    showAlert("error",error.responseJSON.message);
  }
});
