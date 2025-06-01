import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Shell } from "lucide-react";
import Combobox from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const { push } = useRouter();
  const { toast } = useToast();
  const [load, setLoad] = useState(false);
  const [dialCode, setDialCode] = useState("");
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = () => {
    setIsTermsAgreed(!isTermsAgreed);
  };

  const handlesignupGoogle = async () => {
    try {
      await signIn("google", { redirect: false, callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    setLoad(true);
    e.preventDefault();
    const body = {
      name: firstName + " " + lastName,
      email,
      password,
      phone,
    };

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !isTermsAgreed
    ) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Uh oh! Something went wrong.",
        description: "All fields are required!",
        variant: "destructive",
      });
      setLoad(false);
      return;
    }

    try {
      if (password.length < 8) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Uh Oh! 😒",
          description: "The password must be at least 8 characters!",
          variant: "destructive",
        });
        setLoad(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Uh oh! Something went wrong.",
          description: "Password and confirm password do not match!",
          variant: "destructive",
        });
        setLoad(false);
        return;
      }

      setLoad(true);
      await axios.post("/api/user/post", {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
        phone: phone,
      });
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Success!",
        description:
          "The user has been successfully registered. You will be redirected to the login page!",
        variant: "default",
      });
      setTimeout(() => {
        push("/user/login");
        setLoad(false);
      }, 1500);
    } catch (error) {
      setLoad(false);
      console.log(error);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Uh oh! Something went wrong.",
        description: "Error while fetching",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.value = dialCode;
      phoneInputRef.current.focus();
    }
  }, [dialCode]);

  return (
    <>
      <Head>
        <title>DBIX | Signup</title>
      </Head>
      <div className="w-full h-screen flex justify-center items-center relative lg:px-0 px-6">
        <Card className="mx-auto max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dbix@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-1">
                  <Combobox setDialCode={setDialCode} />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    ref={phoneInputRef}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-2  w-fit">
                <Checkbox />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>
              <Button
                type="submit"
                disabled={load}
                className="w-full flex items-center gap-2"
              >
                {load ? (
                  <>
                    <Shell size={24} strokeWidth={2} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create an account!"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handlesignupGoogle}
              >
                Sign up with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/user/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
