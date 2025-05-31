import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

interface props { 
    onDelete: () => void
    load: boolean
    modalDeleteView: boolean
    setModalDeleteView: Dispatch<SetStateAction<boolean>>
}

const DeleteDialog = ({ onDelete, load, modalDeleteView, setModalDeleteView  }: props ) => {

    return (
        <Dialog open={modalDeleteView} onOpenChange={setModalDeleteView}>
            <DialogTrigger asChild>
                <Button variant={'destructive'} size={'sm'}><Trash /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={load}>
                        {load ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
