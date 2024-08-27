"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, { 
        message: "Channel name is required."
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general'!"
        }
    ),
    type: z.nativeEnum(ChannelType)
});

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { channel, server } = data;

    const router = useRouter(); 
    
    const isModalOpen = isOpen && type === "editChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT,

        }
    });

    useEffect( () => {
       if (channel){
        form.setValue("name",channel.name);
        form.setValue("type",channel.type);
       } 
    }, [form, channel ] );

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({ 
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                },
             })
            await axios.patch(url,values);

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
                   Edit a Channel 
                    </DialogTitle>
                    <DialogDescription className="text-center dark:text-white"> 
                        Channels help you organize your community  
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
                        <div className="space-y-8">        
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold dark:text-white"> 
                                            Channel Name 
                                        </FormLabel>
                                        <FormControl> 
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 dark:bg-white border-0 focus:ring-0 outline-none text-black ring-offset-0 focus:ring-offset-0"
                                                placeholder="Enter Channel Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-white"> Channel Type </FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-300/50 dark:bg-white border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none ">
                                                <SelectValue placeholder="Select a channel type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize"> 
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
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