import "@/styles/globals.css";
import {Toaster} from "@/components/ui/toaster";
import React from "react";
import {ThemeToggle} from "@/components/theme-toggle";
import {Navigation} from "@/components/navigation";
import {Footer} from "@/components/footer";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <div className="fixed bottom-4 left-4 z-50">
                <ThemeToggle/>
            </div>
            <Navigation/>
            <main>{children}</main>
            <Footer/>
            <Toaster/>
        </main>
    );
}
