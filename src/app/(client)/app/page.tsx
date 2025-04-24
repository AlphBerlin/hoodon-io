"use client";

import TimeDisplay from "@/components/time-display";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {deleteChannel, getAvailableChannel} from "@/lib/channel-api-handler";
import {withUser} from "@/components/with-user";

export default function Home() {
    useEffect(() => {
        deleteChannel({}) //delete all my channel
    }, []);
    const AuthenticatedDashboard = withUser(DashboardComponent);

    return (<AuthenticatedDashboard/>)
        ;
}

const DashboardComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleMeetNowClick = async () => {
        setLoading(true);
        try {
            const data = await getAvailableChannel()
            if (data && data.name) {
                router.push(`/cupid/?ch=${data.name}`);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching channel: ", error);
            alert("Could not fetch available channel. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-0 flex-col items-center gap-12 p-10 sm:p-24">

            <div className="p-6">
                {/* Header */}
                <TimeDisplay/>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Meeting Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-900">Connect</h2>
                        <p className="mt-2 text-gray-600">
                            Create a Channel, invite caller or make it public to connect random users.
                        </p>
                        <div className="flex items-center mt-4 space-x-4">
                            <button
                                onClick={handleMeetNowClick}
                                disabled={loading}
                                className={`px-4 py-2 border ${loading ? "bg-gray-200" : "border-blue-500 text-blue-500 hover:bg-blue-50"} rounded-lg transition`}
                            >
                                {loading ? "Loading..." : "Meet Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
