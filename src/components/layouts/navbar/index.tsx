import { Button } from "@/components/ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ButtoNavIcon from "@/components/ui/icons/buttonnav";
import { signOut, useSession } from "next-auth/react";
import { UserDataType } from "@/types/userDataTypes";
import { LoaderCircleIcon, MoonIcon, Sun } from "lucide-react";
import axios from "axios";
import Alerts from "@/components/ui/alerts";
import { useRouter } from "next/router";
import { ItemDataType } from "@/types/itemsDataTypes";
import { ProductDataType } from "@/types/productDataTypes";
import { useTheme } from "next-themes";

const Navbar = ({ items, setItems, products, setProducts }: { items: ItemDataType[], setItems: Dispatch<SetStateAction<ItemDataType[]>>, products: ProductDataType[], setProducts: Dispatch<SetStateAction<ProductDataType[]>> }) => {
  const [view, setView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: session, status }: any = useSession()
  const [load, setLoad] = useState(false)
  const { push } = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [userData, setUserdata] = useState<UserDataType>({
    id: "",
    name: "",
    email: "",
    emailVerified: false,
    image: "",
    items: [],
    type: "",
  })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { setTheme } = useTheme();

  useEffect(() => {
    if (view) {
      ref.current?.classList.remove("hidden")
    } else {
      setTimeout(() => {
        ref.current?.classList.add("hidden")
      }, 300)
    }
  }, [view])

  const getUserData = async () => {
    setLoad(true)
    try {
      if (session?.user.role === 'user') {
        const resp = await axios(`/api/user/get/${session?.user.id}`)
        setUserdata(resp.data)
        setItems(resp.data.items)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoad(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      getUserData()
    }
  }, [status, session?.user?.id])

  const updateUserItems = async () => {
    const body = { items }
    if (status === 'authenticated') {
      try {
        await axios.put(`/api/user/update/items/${session.user.id}`, body)
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    updateUserItems()
  }, [session && session?.user.role === 'user' && items.length])

  return (
    <div className="w-full flex py-5 relative lg:px-0  px-6 justify-between">
      <div className="font-bold text-lg flex items-center gap-5">
        <div className="flex gap-4 lg:hidden">
          <button name="buttonnav" onClick={() => setView(!view)} className="lg:hidden block">
            {view ? <CrossCircledIcon width={20} height={20} /> : <ButtoNavIcon />}
          </button>
        </div>
        <Link href={"/"}>E-Shop DBI</Link>
      </div>

      <div className="flex justify-center lg:w-fit">
        <div
          className={`lg:hidden flex lg:flex-row flex-col lg:items-center px-6 gap-5 absolute lg:static left-0 top-16 lg:h-full ${view ? "h-screen opacity-100" : "h-0 opacity-0"
            } transition-all duration-300 bg-white lg:w-fit w-full pt-3`}
          ref={ref}
        >
          <Link href={"/"} className="font-medium hover:opacity-80" onClick={() => setView(false)}>
            Home
          </Link>
          <Link href={"/aboutus"} className="font-medium hover:opacity-80" onClick={() => setView(false)}>
            Company
          </Link>
          <Link href={"/#services"} className="font-medium hover:opacity-80" onClick={() => setView(false)}>
            Services
          </Link>
          <Link href={"/contact"} className="font-medium hover:opacity-80" onClick={() => setView(false)}>
            Contact
          </Link>
        </div>
        <div className="lg:flex hidden lg:flex-row items-center lg:justify-between gap-10">
          <Link href={"/"} className="hover:opacity-80 font-semibold">
            Home
          </Link>
          <Link href={"/aboutus"} className="font-semibold hover:opacity-80">
            Company
          </Link>
          <Link href={"/#services"} className="font-semibold hover:opacity-80">
            Services
          </Link>
          <Link href={"/contact"} className="font-semibold hover:opacity-80">
            Contact
          </Link>
        </div>
      </div>
      <div className="items-center gap-3 flex">
        {status === 'unauthenticated' && <div className="flex items-center gap-3 lg:hidden">
          <Link href={"/user/login"}>
            <Button size={"sm"} variant={"default"}>
              Login or Signup
            </Button>
          </Link>
        </div>}

        {load ? (
          <div className="flex items-center gap-3 opacity-80">
            <LoaderCircleIcon size={20} className="animate-spin" />
            <p className="text-sm font-medium">Loading user...</p>
          </div>
        ) : (
          status === 'authenticated' && session.user.role === 'user' ? (
            <div className="flex items-center gap-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <div className="w-fit hover:opacity-70 transition-opacity">
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <img
                      src={userData.image}
                      alt={userData.name}
                      className="w-7 h-7 object-cover rounded-full border-2"
                    />
                    <p className="text-sm font-medium capitalize">{userData.name}</p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <p className="p-2 py-1 text-sm font-bold">{userData.email}</p>
                    <hr className="mb-2" />
                    <DropdownMenuItem>
                      <Link onClick={() => setDropdownOpen(false)} className="font-medium hover:opacity-80 w-full" href={'/user/profile'}>Profile</Link>
                    </DropdownMenuItem>

                    <div className="flex justify-center items-center p-2 py-1 w-full">
                      <Alerts ok={async () => {
                        await signOut({ redirect: false })
                        setUserdata({
                          id: "",
                          email: "",
                          emailVerified: false,
                          image: "",
                          items: [],
                          name: "",
                          type: "",
                        })
                        setItems([])
                        setProducts([])
                        setTimeout(() => {
                          push('/user/login')
                        }, 500);
                      }} desc="As a result, you will be logged out from your account and your session will end." btn="Signout" />
                    </div>
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>
            </div>
          ) : (
            <div className="lg:flex items-center gap-3 hidden">
              <Link href={"/user/login"}>
                <Button size={"sm"} variant={"secondary"}>
                  Login
                </Button>
              </Link>
              <Link href={"/user/signup"}>
                <Button size={"sm"}>Signup</Button>
              </Link>
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default Navbar;
