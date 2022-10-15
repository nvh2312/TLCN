import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Input from "../components/input/Input";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import Label from "../components/label/Label";
import Navbar from "../components/navbar/Navbar";
import AuthenticationPage from "./AuthenticationPage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Tối thiểu 8 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message: "Bắt buộc phải có chữ hoa, chữ thường, ký tự đặc biệt, số",
      }
    ),
});

const SignInPage = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const handleSignIn = (values) => {
    if (!isValid) return;
    console.log(
      "🚀 ~ file: SignInPage.jsx ~ line 45 ~ handleSignIn ~ values",
      values
    );
    reset({
      email: "",
      password: "",
    });
    toast.success("Chào mừng bạn đến HC.VN");
    navigate("/");
  };
  return (
    <div className="bg-[#f8f8fc]">
      <Header></Header>
      <Navbar></Navbar>
      <AuthenticationPage>
        <form
          className="pb-6"
          autoComplete="off"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Mời bạn nhập email"
              control={control}
            />
            {errors.email && (
              <p className="text-red-500 text-lg font-medium">
                {errors.email?.message}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="password">Mật khẩu</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
            {errors.password && (
              <p className="text-red-500 text-lg font-medium">
                {errors.password?.message}
              </p>
            )}
          </Field>

          <div className="flex items-center justify-between px-44 mt-8">
            <div className="flex items-center">
              <span className="text-black text-xl">
                Bạn đã chưa có tài khoản? &nbsp;
              </span>

              <Link
                to="/sign-up"
                className="text-xl text-[#1DC071] font-semibold"
              >
                Đăng ký
              </Link>
            </div>

            <Link
              to="/password"
              className="text-xl text-[#1DC071] font-semibold"
            >
              Quên mật khẩu
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disable={isSubmitting}
            style={{
              width: "100%",
              maxWidth: 300,
              margin: "30px auto",
            }}
          >
            Đăng nhập
          </Button>
        </form>
      </AuthenticationPage>
      <Footer></Footer>
    </div>
  );
};

export default SignInPage;
