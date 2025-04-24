import {TooltipProvider} from "@/components/ui/tooltip";
import {UserProvider} from "@/context/user-context";
import {UserAvatarMenu} from "@/components/user-avatar-menu";
import {Toaster} from "@/components/ui/toaster";
import React from "react";


export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode
}) {

    return (
        <main className="bg-secondary/20 h-full">
            <TooltipProvider>
                <UserProvider>
                    <Toaster/>
                    <div className="absolute top-2 right-2 z-50">
                        <UserAvatarMenu/>
                    </div>
                    {children}
                </UserProvider>
                {/*<BlobBackground/>*/}
            </TooltipProvider>
        </main>
    )
}

