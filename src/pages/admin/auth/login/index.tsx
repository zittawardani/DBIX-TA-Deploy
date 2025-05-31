import Head from 'next/head';
import React from 'react';
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { FormEvent, useState } from "react"
import { Shell, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"


const AdminLoginPage = () => {
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [load, setLoad] = useState(false)
  const { push } = useRouter()

  const handleLoginCredentials = async (e: FormEvent) => {
    e.preventDefault()
    setLoad(true)
    try {
      const resp = await signIn('Admin', {
        redirect: false,
        username,
        password,
        callbackUrl: '/admin/dashboard'
      })
      if (resp?.error) {
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
          ),
          description: 'username or password is not valid! 😒',
          variant: 'destructive'
        })
        setLoad(false)
      } else {
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
          ),
          description: 'Login succesfully! ✅',
          variant: 'default'
        })
        setLoad(false)
        setTimeout(() => {
          push('/admin')
        }, 500);
      }
    } catch (error) {
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        description: 'Request timeout! please contact the developer.',
        variant: 'destructive'
      })
      setLoad(false)
      console.log(error)
    }

  }

  return (
    <>
      <Head>
        <title>DBI | admin-authentication</title>
      </Head>
      <div className="w-full flex h-screen justify-center items-center flex-col gap-5 lg:px-0 px-6">
        <Card className="mx-auto max-w-lg w-full p-5 flex-col gap-5 flex">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleLoginCredentials}>
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input id="username" type="text" placeholder="your username here..." onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder='your password here...' />
              </div>
              <Button disabled={load} type="submit" className="w-full flex items-center gap-2">
                {load ? (
                  <>
                    <Shell size={24} strokeWidth={2} className="animate-spin" />
                    Loading...
                  </>
                ) : 'Login'}
              </Button>
            </form>
          </CardContent>

        </Card>
      </div>
    </>
  );
};

export default AdminLoginPage;