import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Auth() {
  return (
    <div className=" bg-background h-[calc(100vh-5.2rem)] flex justify-center items-center ">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm></LoginForm>
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm></SignupForm>
        </TabsContent>
      </Tabs>
    </div>
  );
}
