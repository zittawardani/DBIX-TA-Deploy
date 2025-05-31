import { FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { FolderPlusIcon, ImagePlusIcon, X, LoaderCircle} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import {
  Breadcrumb, BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { ProductDataType } from '@/types/productDataTypes';


const ReactEditor = dynamic(() => import('@/components/ui/reactEditor'), { ssr: false })

const EditProductPage = () => {
  const [productName, setProductName] = useState('')
  const [desc, setDesc] = useState('')
  const [spec, setSpesification] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [minOrder, setMinOrder] = useState(1)
  const [variants, setVariants] = useState<string[]>([])
  const [variantValue, setVariantValue] = useState('')
  const [image, setImage] = useState<string[]>([])
  const [imageValue, setImageValue] = useState('')
  const [information, setInformation] = useState('')
  const [details, setDetails] = useState('')
  const [category, setCategory] = useState('website')
  const [variationInputView, setVariationInputView] = useState(false)
  const [imageInputView, setImageInputView] = useState(false)
  const variationInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [load, setLoad] = useState(false)
  const { toast } = useToast()

  const router = useRouter();
  const { id } = router.query;

  const categoryView = [
    "Website",
    "Web 3",
    "Android Application",
    "IOS Application",
    "Blockchain Service",
    "Bussiness Platform",
    "Gaming Exchange Based Token",
    "Payment Gateway",
    "Decentralized Exchange",
    "IOT",
    "Create Robot Trading",
    "Exchanger Platform",
    "Android Exchange",
    "IOS Exchange",
    "NFT Platform",
    "(COIN) - Sha 256",
    "(TOKEN) - ERC 20, BSC 20, TRC 20",
  ]

  const getDetailsProducts = async () => {

    try {
      const data = await axios(`/api/product/get?code=${id}`)
      const parsedData: ProductDataType = data.data
      console.log(parsedData)
      setProductName(parsedData.name)
      setCategory(parsedData.category)
      setDesc(parsedData.desc)
      setSpesification(String(parsedData.spec))
      setInformation(String(parsedData.information))
      setDetails(String(parsedData.details))
      setPrice(parsedData.price)
      setStock(Number(parsedData.stock))
      setMinOrder(Number(parsedData.minOrder))
      setVariants(parsedData.variants)
      setImage(parsedData.image)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDetailsProducts()
  }, [id])

  useEffect(() => {
    if (variants && image) {
      if (variants.length > 0) {
        setVariationInputView(true)
      } 
      if (image.length > 0) {
        setImageInputView(true)
      } 
      if (variants.length > 0 && image.length > 0) {
        setVariationInputView(true)
        setImageInputView(true)
      }
    }
  }, [variants && variants.length, image && image.length])

  //handleAddVariant menambahkan variant
  const handleAddVariation = (e: FormEvent) => {
    e.preventDefault()
    setVariants((prev) => [...prev, variantValue])
    setVariantValue('')
    if (variationInputRef.current) {
      variationInputRef.current.value = ''
      variationInputRef.current.focus()
    }
  }

  const handleAddImage = (e: FormEvent) => {
    e.preventDefault()
    setImage((prev) => [...prev, imageValue])
    setImageValue('')
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
      imageInputRef.current.focus()
    }
  }

  const handleDeleteVariants = (index: number) => {
    const values = variants.filter((_, i) => i !== index)
    setVariants(values)
  }
  const handleDeleteImage = (index: number) => {
    const values = image.filter((_, i) => i !== index)
    setImage(values)
  }

  const handleSave = async () => {
    setLoad(true)
    const body = {
      code_product: id,
      name: productName,
      price: price,
      image,
      category,
      variants,
      details,
      spec,
      information,
      stock: 10,
      minOrder: 1,
      desc,
    }

    try {
      await axios.put(`/api/product/update/${id}`, body)
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: 'Alerts!',
        description: 'Save succeded!',
        variant: 'default',
      })
      setTimeout(() => {
        setLoad(false)
        location.href = '/admin/products'
      }, 1000)
    } catch (error) {
      setLoad(false)
      console.log(error)
    }
  }

  return (
    <>
      {load ? (
        <div className='w-full flex h-[85vh] justify-center items-center'>
          <div className="flex items-center gap-3">
            <h1 className='text-xl'>Loading</h1>
            <LoaderCircle className='animate-spin' />
          </div>
        </div>
      ) : (
    <div className="container mx-auto p-4 space-y-6">
      <div className='space-y-2'>
        <h1 className="text-4xl font-bold">Edit Products</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">DBIX</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6">
        {/* Product Information Form */}
        <Card className="w-full lg:w-2/3 shadow-lg">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor="productName">Name<span className="text-red-500">*</span></Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product name"
                  required
                  className='mt-2'
                />
              </div>
              <div>
                <Label htmlFor="productName">Category<span className="text-red-500">*</span></Label>
                <div className='w-full mt-2'>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorires</SelectLabel>
                        {categoryView.map((item, index) => (
                          <SelectItem value={item.toLocaleLowerCase()} key={index}>{item}</SelectItem>
                        ))}

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <div className='w-full mt-2'>
                  <Textarea placeholder='Enter your short descriptions here...' value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="spesification">Spesification<span className="text-red-500">*</span></Label>
                <div className='w-full mt-2'>

                  <ReactEditor
                    value={spec}
                    setValue={setSpesification}
                    placeholder="Type your text here ..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="information">Information<span className="text-red-500">*</span></Label>
                <div className='w-full mt-2'>
                  <ReactEditor
                    value={information}
                    setValue={setInformation}
                    placeholder="Type your text here ..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="information">Details<span className="text-red-500">*</span></Label>
                <div className='w-full mt-2'>
                  <ReactEditor
                    value={details}
                    setValue={setDetails}
                    placeholder="Type your text here ..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="price">Price<span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Base pricing"
                  required
                  className='mt-2'
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock<span className="text-red-500">*</span></Label>
                <Input
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="Stock"
                  required
                  className='mt-2'
                />
              </div>
              <div>
                <Label htmlFor="minOrder">Minimal Order <span className="text-red-500">*</span></Label>
                <Input
                  id="minOrder"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  placeholder="Minimal Order"
                  required
                  className='mt-2'
                />
              </div>
              <div>
                <Label htmlFor="variation">Variants<span className="text-red-500">*</span></Label>
                {variationInputView ? (
                  <div className='flex flex-col gap-2 w-full mt-2 mb-4'>
                    <ul className='inline-flex flex-wrap gap-5'>
                      {variants.length > 0 && variants.map((item, index) => (
                        <li key={index} className='relative cursor-default text-muted-foreground group text-sm'>
                          <Badge>{item}</Badge>
                          <button onClick={() => handleDeleteVariants(index)} className='p-0.5 absolute rounded-md -top-2 bg-destructive hidden group-hover:block -right-3'>
                            <span className='text-white'><X size={14} /></span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <form onSubmit={handleAddVariation} className='space-y-2'>
                      <Input required ref={variationInputRef} type='text' placeholder='Type a variation here...' onChange={(e) => setVariantValue(e.target.value)} />
                      <div className='flex items-center gap-2'>
                        <Button type='submit' size={'sm'} className='w-fit'>Add</Button>
                        <Button type='button' onClick={() => {
                          setVariantValue('')
                          setVariationInputView(false)
                        }} size={'sm'} className='w-fit' variant={'destructive'}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button onClick={() => setVariationInputView(true)} className='border mt-2 hover:border-primary transition-colors border-dashed w-full rounded-md h-24 flex justify-center flex-col gap-2 items-center'>
                    <FolderPlusIcon />
                    <p className='text-muted-foreground text-sm'>Add Variation</p>
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='w-full lg:w-1/3 shadow-lg h-fit sticky top-20 space-y-4'>
          <Card className="">
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {imageInputView ? (
                <div className='flex flex-col gap-2 w-full mt-2 mb-4'>
                  <ul className='inline-flex flex-wrap gap-5'>
                    {image.map((item, index) => (
                      <li key={index} className='relative cursor-default text-muted-foreground group text-sm'>
                        <img src={item} alt={String(index)} className='w-16 h-16 object-cover' />
                        <button onClick={() => handleDeleteImage(index)} className='p-0.5 absolute rounded-md -top-2 bg-destructive hidden group-hover:block -right-3'>
                          <span className='text-white'><X size={14} /></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={handleAddImage} className='space-y-2'>
                    <Input required ref={imageInputRef} type='text' placeholder='Input image link here...' onChange={(e) => setImageValue(e.target.value)} />
                    <div className='flex items-center gap-2'>
                      <Button type='submit' size={'sm'} className='w-fit'>Add</Button>
                      <Button type='button' onClick={() => {
                        setImageValue('')
                        setImageInputView(false)
                      }} size={'sm'} className='w-fit' variant={'destructive'}>Cancel</Button>
                    </div>
                  </form>
                </div>
              ) : (
                <button onClick={() => setImageInputView(true)} className='border mt-2 hover:border-primary transition-colors border-dashed w-full rounded-md h-24 flex justify-center flex-col gap-2 items-center'>
                  <ImagePlusIcon />
                  <p className='text-muted-foreground text-sm'>Add Images</p>
                </button>
              )}
            </CardContent>
          </Card>
          <Button className='w-full h-20' onClick={handleSave}>Save product</Button>
        </div>

      </div>
    </div>
      )}
      </>
  );
}

export default EditProductPage;
