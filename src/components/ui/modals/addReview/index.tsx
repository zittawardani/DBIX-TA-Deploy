import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../../button';
import ReactEditor from '../../reactEditor';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ScrollArea, ScrollBar } from '../../scroll-area';
import { useToast } from '../../use-toast';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { LoaderPinwheelIcon, StarIcon } from 'lucide-react';
import AlertSuccesss from '../../succesAlerts';



const ModalAddReview = ({ updated, setUpdated }: { updated: boolean, setUpdated: Dispatch<SetStateAction<boolean>> }) => {
  const [content, setContent] = useState('')
  const { id } = useRouter().query
  const { data: session, status }: any = useSession()
  const [open, setOpen] = useState(false)
  const [rate, setRate] = useState(5)
  const { toast } = useToast()
  const [load, setLoad] = useState(false)
  const [alertSuccessOpen, setAlertSuccessOpen] = useState(false)

  const handleClickRate = (index: number) => {
    setRate(index + 1)
  }

  const handleSubmit = async () => {
    if (id) {
      if (!content) {
        toast({
          title: 'Ouch!',
          description: 'Yoou must fill the reviews field! 😁',
          variant: 'destructive',
        })
      } else {
        if (session?.user && status === 'authenticated') {
          const body = {
            rate,
            context: content,
            userId: String(session.user.id)
          }
          setLoad(true)
          try {
            await axios.post(`/api/product/post/reviews?code_product=${String(id)}`, body)
            setLoad(false)
            setOpen(false)
            setAlertSuccessOpen(true)
            setUpdated(!updated)
          } catch (error) {
            setLoad(false)
            console.log(error)
            alert('networkError')
          }
        } else {
          toast({
            title: 'Ouch!',
            description: 'Yoou must login to add  reviews in our produtcs! 😁',
            variant: 'destructive',
          })
        }
      }
    }
  }

  return (
    <>
      <Drawer onClose={() => {
        setContent('')
        setRate(1)
      }} open={open} onOpenChange={setOpen} >
        <DrawerTrigger>
          <Button size={'sm'} className='mt-2'>Add review</Button>
        </DrawerTrigger>
        <DrawerContent className='max-w-screen-xl mx-auto w-full'>

          <DrawerHeader className='space-y-3'>
            <DrawerTitle className='font-semibold flex flex-col gap-2 text-left'>
              <span>Overall Ratings</span>
              <span className='text-xs text-muted-foreground font-normal flex items-center gap-1'>You have rated this product in {rate} <StarIcon size={14} /></span>
            </DrawerTitle>
            <DrawerDescription className='grid grid-cols-5 gap-3 w-fit'>
              {Array.from({ length: 5 }, (v, i) => (
                <Button key={i} size={'icon'} variant={rate === i + 1 ? 'default' : 'outline'} onClick={() => handleClickRate(i)}>{i + 1}</Button>
              ))}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='m-3 max-h-[41vh] overflow-auto shadow-lg'>
            <ReactEditor setValue={setContent} value={content} autoFoucus placeholder='Type a review here, you can add a images!' />
            <ScrollBar orientation='vertical' />
          </ScrollArea>
          <DrawerFooter className='flex items-end gap-3 w-full flex-row justify-end'>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button disabled={load} onClick={handleSubmit}>{
              load ? (
                <LoaderPinwheelIcon />
              ) : 'Submit'
            }</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AlertSuccesss open={alertSuccessOpen} func={() => {
      }} />
    </>

  );
};

export default ModalAddReview;