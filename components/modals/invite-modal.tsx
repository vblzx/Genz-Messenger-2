"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data} = useModal();
    const origin = useOrigin();
    
    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [ copied, setCopied ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout( () => {
            setCopied(false);
        }, 1000 );
    } 

    const onNew = async () => {
        try{
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", { server: response.data });

        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-zinc-700 text-black p-0, overflow-hidden" > 
                <DialogHeader className="pt-8 px-6"> 
                    <DialogTitle className="text-2xl text-center dark:text-white font-bold"> 
                    Invite Friends to Your Community 
                    </DialogTitle>
                    <DialogDescription className="text-center dark:text-white"> 
                        Give your community a personality with a name and an image. You can always change it later. 
                    </DialogDescription>
                </DialogHeader>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-bold dark:text-white"> 
                            Community Invite Link     
                        </Label> 
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input disabled={isLoading} className="bg-zinc-300/50 dark:bg-white bold border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                                value={inviteUrl}
                            />
                            <Button disabled={isLoading} className="bg-indigo-500" onClick={onCopy} size='icon' >
                                { copied? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4"/>}
                                
                            </Button>
                        </div>
                        <Button onClick={onNew} disabled={isLoading} variant="link" size="sm" className="text-xs text-indigo-500 mt-4">
                            Generate a new link 
                            <RefreshCw className="w-4 h-4 ml-2"/>
                        </Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}