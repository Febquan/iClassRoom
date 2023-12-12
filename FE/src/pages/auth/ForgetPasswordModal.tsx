import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { MyError } from "@/ultis/appType";

import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const Schema = z.object({
  email: z.string().email(),
});
type SchemaType = z.infer<typeof Schema>;

export function ForgetPasswordModal() {
  const navigate = useNavigate();
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const [errorMess, setErrorMess] = useState<string | undefined>();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const onSubmitEmail = async ({ email }: SchemaType) => {
    try {
      setisLoading(true);
      await api.post("user/auth/sendEmailChangePassword", { email });
      setisLoading(false);
      navigate(`/emailChangeSent/${email}`);
    } catch (error) {
      console.log(error);
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
      setisLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text text-muted-foreground text-[0.8rem]"
        >
          Forgot password ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change your password by Email</DialogTitle>
          <DialogDescription>
            PLease submit your account email
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEmail)}
            className="space-y-3"
            id="emailChangePass"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Your email account to send change password link
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {errorMess && (
          <span className="text-red-500 text-center w-full block text-[0.8rem] ">
            {errorMess}
          </span>
        )}
        <DialogFooter>
          <Button type="submit" form="emailChangePass">
            {isLoading ? <Spinner /> : "Send email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
