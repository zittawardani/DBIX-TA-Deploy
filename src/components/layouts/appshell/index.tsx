import { cloneElement, ReactElement, useEffect, useState } from "react";
import Navbar from "../navbar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import Footer from "../footer";
import { ItemDataType } from "@/types/itemsDataTypes";
import Sidebar from "../sidebar";
import Appbar from "../appbar";
import { ProductDataType } from "@/types/productDataTypes";
import axios from "axios";

interface props {
  children: ReactElement;
}

const Appshell = ({ children }: props) => {
  const { pathname } = useRouter();
  const path = ["/user/login", "/user/signup", "/404", "/admin/auth/login"]
  const pathProfile = ["/user/profile", "/user/profile/checkout/[id]"]
  const adminPath = ["/admin/dashboard", "/admin/products", "/admin/discussion", "/admin/contract", "/admin/monitoring", "/admin/order", "/admin/products/add", "/admin/products/edit/[id]", "/admin/products/details/[id]"]
  const [items, setItems] = useState<ItemDataType[]>([])
  const [products, setProducts] = useState<ProductDataType[]>([])

  useEffect(() => {
    getProductsByID()
  }, [items])

  const getProductsByID = async () => {
    if (items.length > 0) {
      const updatedProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const resp = await axios(`/api/product/get?code=${item.code_product}`)
            const { code_product, name, price, image } = resp.data
            return {
              code_product,
              name,
              price,
              qty: item.qty,
              image,
              desc: resp.data.desc || '',
              category: resp.data.category || '',
              variants: resp.data.variants || [],
              variant: item.variant,
              notes: item.notes
            }
          } catch (error) {
            console.error(`Error fetching product with code ${item.code_product}:`, error)
            return null
          }
        })
      )
      const validProducts = updatedProducts.filter(product => product !== null)
      setProducts(prevProducts => {
        const newProducts = validProducts.filter(newProduct =>
          !prevProducts.some(prevProduct => prevProduct.code_product === newProduct.code_product && prevProduct.variant === newProduct.variant)
        )
        return [...prevProducts, ...newProducts]
      })
    }
  }

  return (
    <div >
      <Toaster />
      {path.includes(pathname) ? (
        <div className="w-full">{children}</div>
      ) : (
        adminPath.includes(pathname) ? (
          <div className="flex justify-end w-full">
            <div className="lg:w-[16%] w-full fixed top-0 left-0 h-screen">
              <Sidebar />
            </div>
            <div className="flex-col lg:w-[84%] w-full">
              <Appbar />
              <main className="flex flex-1 flex-col">
                {children}
              </main>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col lg:gap-8 gap-4">
            <div className="w-full border-b shadow-lg sticky top-0 left-0 bg-background z-50">
              <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm mx-auto w-full xl:px-0 lg:px-3">
                <Navbar items={items} setItems={setItems} products={products} setProducts={setProducts} />
              </div>
            </div>

            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm mx-auto w-full xl:px-0 lg:px-3 px-6">
              {children && cloneElement(children, { items, setItems, products, setProducts })}
            </div>

            {pathProfile.includes(pathname) ? (
              ''
            ) : (
              <div className="w-full border-t">
                <Footer />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Appshell;
