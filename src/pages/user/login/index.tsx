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
import Head from "next/head"
import { FormEvent, useState } from "react"
import { Shell, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"

export default function LoginForm() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [load, setLoad] = useState(false)
  const { push } = useRouter()

  const handleLoginCredentials = async (e: FormEvent) => {
    e.preventDefault()
    setLoad(true)
    if (!email || !password) {
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: 'Uh oh! Something went wrong.',
        description: 'Email & Password is required!',
        variant: 'destructive',
      })
      setLoad(false)
    } else {
      try {
        const resp = await signIn('Credentials', { redirect: false, callbackUrl: '/', email, password })
        if (resp?.error) {
          toast({
            className: cn(
              'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
            ),
            description: 'Email or password is not valid!',
            variant: 'destructive'
          })
          setLoad(false)
        } else {
          toast({
            className: cn(
              'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
            ),
            description: 'Login succesfully!',
            variant: 'default'
          })
          setTimeout(() => {
            push('/')
            setLoad(false)
          }, 1000)
        }
      } catch (error) {
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
          ),
          description: 'Error while fetching',
          variant: 'destructive'
        })
        setLoad(false)
      }
    }
  }

  const handleLoginGoogle = async () => {
    try {
      const resp = await signIn('google', {
        redirect: false,
        callbackUrl: '/'
      })
      if (resp?.error) {
        console.log('error while login!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Head>
        <title>DBI | Login</title>
      </Head>
      <div className="w-full flex h-screen justify-center items-center flex-col gap-5 lg:px-0 px-6">
        <Card className="mx-auto max-w-lg w-full p-5 flex-col gap-5 flex">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleLoginCredentials}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="youremail@example.com" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button disabled={load} type="submit" className="w-full flex items-center gap-2">
                {load ? (
                  <>
                    <Shell size={24} strokeWidth={2} className="animate-spin" />
                    Loading...
                  </>
                ) : 'Login'}


              </Button>
              <Button variant="outline" type="button" className="w-full" onClick={handleLoginGoogle}>
                Login with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/user/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
          <Link href={'/'} className="w-full flex justify-center items-center">
            <Button variant={'outline'} className=" w-fit">Back to website</Button>
          </Link>
        </Card>
      </div>
    </>
  )
}
