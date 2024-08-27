"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, { 
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
});

export const EditServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter(); 
    
    const isModalOpen = isOpen && type === "editServer";
    const { server } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    useEffect( () => {
        if (server){
            form.setValue("name",server.name)
            form.setValue("imageUrl", server.imageUrl)
        }
    }, [server,form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/servers/${server?.id}`,values);

            form.reset();
            router.refresh();
            onClose();
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:bg-zinc-700 text-black p-0, overflow-hidden" > 
                <DialogHeader className="pt-8 px-6"> 
                    <DialogTitle className="text-2xl text-center dark:text-white font-bold"> 
                    Customize your Community! 
                    </DialogTitle>
                    <DialogDescription className="text-center dark:text-white"> 
                        Give your community a personality with a name and an image. You can always change it later. 
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
                        <div className="space-y-8">
                            <div className="flex items-center justify-center text-center"> 
                                <FormField 
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> 
                            </div>    
                            
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold dark:text-white"> 
                                            Community Name 
                                        </FormLabel>
                                        <FormControl> 
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 dark:bg-white border-0 focus-visible: ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Community Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Save
                                </Button>
                        </DialogFooter>         
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}