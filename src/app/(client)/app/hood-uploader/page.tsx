'use client'
import HoodUploader from '@/components/HoodUploader';
import {useAuth} from "@/context/auth-context";

export default function UploadPage() {

    const {user} = useAuth()

    if(!user){
        return <></>
    }

    return (
        <div className="container mx-auto py-8">
            <HoodUploader
                userId={user!.id}
                onUploadComplete={() => {
                }}
            />
        </div>
    );
}