import {useUser} from "@/context/user-context";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import ProfileCreationDialog from "@/app/(client)/app/profile/profile-creation-dialog";

export function withUser<P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> {
    return function WithAuthComponent(props: P) {
        const {user, loading} = useUser();
        const router = useRouter();
        const [showProfileDialog, setShowProfileDialog] = useState(false);

        useEffect(() => {
            if (!user && !loading) {
                setShowProfileDialog(true);
            }
        }, [user, loading]);

        return (
            <>
                <ProfileCreationDialog
                    isOpen={showProfileDialog}
                    onClose={() => setShowProfileDialog(false)}
                />
                {/* Main Component */}
                <Component {...props} />
            </>
        );
    };
}