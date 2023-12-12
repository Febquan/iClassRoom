import api from "./../../axios/axios.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from "axios";
import Spinner from "@/components/ui/spinner.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, MailIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgetPasswordModal } from "./ForgetPasswordModal.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { loginSetState } from "../../store/authSlice";
import { useQueryClient } from "@tanstack/react-query";

const Schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password length must be greater than 6" }),
});
type SchemaType = z.infer<typeof Schema>;
export default function LoginForm() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMess, setErrorMess] = useState<string | undefined>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema), // Hook up zodResolver
  });
  const fetchUserInfo = async (data: SchemaType) => {
    const res = await api.post(
      "/user/auth/login",
      {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    );
    if (res.data.success == true) {
      return res.data.userInfo;
    } else {
      return null;
    }
  };
  const onLoginSubmit = async (data: SchemaType) => {
    console.log(data);
    try {
      setLoading(true);

      await queryClient.fetchQuery({
        queryKey: ["userInfo"],
        queryFn: () => fetchUserInfo(data),
      });
      dispatch(loginSetState());
      setLoading(false);
      // dispatch(setUserInFo(res.data.userInfo));
      navigate("/home");
    } catch (error) {
      const err = error as MyError;
      console.log(err);
      setLoading(false);
      setErrorMess(err.response?.data.error);
    }
  };
  const onEmailLogin = () => {
    window.location.href =
      import.meta.env.VITE_BACK_END_URL + "/user/auth/google";
  };
  const onFacebookLogin = () => {
    window.location.href =
      import.meta.env.VITE_BACK_END_URL + "/user/auth/facebook";
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter for email below to login or quick continue with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col gap-2 ">
          <div className=" flex gap-2">
            <Button
              variant="outline"
              className="w-[50%]"
              onClick={onFacebookLogin}
            >
              <Facebook></Facebook>
              <span className=" ml-1">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="w-[50%] "
              onClick={onEmailLogin}
            >
              <MailIcon></MailIcon>
              <span className=" ml-1">Gmail</span>
            </Button>
          </div>
          <Separator></Separator>
          <form onSubmit={handleSubmit(onLoginSubmit)} id="loginform">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {errors.email && (
                <span className="mt-[0.5rem] text-center w-full block text-[0.8rem]  text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-1 mt-2">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="mt-[0.5rem] text-center w-full block text-[0.8rem]  text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </form>
          {errorMess && (
            <span className="text-red-500 text-center w-full block ">
              {errorMess}
            </span>
          )}

          <ForgetPasswordModal></ForgetPasswordModal>
        </CardContent>

        <CardFooter className="flex justify-center items-center w-full ">
          <Button className="w-full" type="submit" form="loginform">
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
