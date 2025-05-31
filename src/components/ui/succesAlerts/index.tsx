import React, { Dispatch, SetStateAction } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle } from '../alert-dialog';

const AlertSuccesss = ({ func, open=true }: { func?: () => void, open?: boolean }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className='lg:max-w-lg md:max-w-md max-w-sm mx-auto w-full rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>

          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={func}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertSuccesss;