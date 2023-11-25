import api from "./../../axios/axios.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from "axios";
import Spinner from "@/components/ui/spinner.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signSchema = z
  .object({
    userName: z.string().min(1, { message: "Emty field" }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
type SchemaType = z.infer<typeof signSchema>;

export default function SignupForm() {
  const [isLoading, setLoading] = useState(false);
  const [errorMess, setErrorMess] = useState(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(signSchema), // Hook up zodResolver
  });
  const onSignSubmit = async (data: SchemaType) => {
    try {
      setLoading(true);
      await api.post("/user/auth/signup", data);
      setLoading(false);
      navigate(`/emailVerify/${data.email}`);
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        console.log(err);
        setLoading(false);
        setErrorMess(err.response?.data.error);
      } else {
        // Just a stock error
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Enter for email below to sign up</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col gap-2 ">
        <form onSubmit={handleSubmit(onSignSubmit)} id="signUpForm">
          <div className="space-y-1">
            <Label htmlFor="userName">User Name</Label>
            <Input id="userName" {...register("userName")} />
            {errors.userName && (
              <span className="mt-[0.5rem] text-center w-full block text-[0.8rem]  text-red-500">
                {errors.userName.message}
              </span>
            )}
          </div>
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
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <span className="mt-[0.5rem] text-center w-full block text-[0.8rem]  text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1 mt-2">
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="mt-[0.5rem] text-center w-full block text-[0.8rem]  text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center items-center w-full ">
        {errorMess && <span className="text-destructive">{errorMess}</span>}
        <Button className="w-full" type="submit" form="signUpForm">
          {isLoading ? <Spinner /> : "Sign up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
