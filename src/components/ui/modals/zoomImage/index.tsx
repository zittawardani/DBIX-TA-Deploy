
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";


const ModalZoomImage = ({ src, alt }: { src: string, alt: string }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger >
        <img src={src} alt={alt} className='w-10 h-5 object-cover relative' />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{alt}</AlertDialogTitle>
        <AlertDialogHeader>
          <img src={src} alt={alt} className='w-full h-[65vh] rounded-xl' />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


  );
};

export default ModalZoomImage;