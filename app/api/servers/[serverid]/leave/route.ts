import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverid: string }}
) {
    try{
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params){
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverid,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data:{
                members: {
                    deleteMany: {
                       profileId: profile.id 
                    }
                }
            }
        });

        return NextResponse.json(server);

    }catch(error){
        console.log("[SERVER_ID_LEAVE]",error);
        return new NextResponse("Internal Error",  { status : 500 });
    }
}