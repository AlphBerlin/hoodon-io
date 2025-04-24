import React from "react";
import {BlobBackground} from "@/components/blob-background";

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <BlobBackground/>
            {children}
        </main>
    );
}
