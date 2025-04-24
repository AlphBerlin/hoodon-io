'use client'
import WaitlistForm from '@/components/waitlist-form'
import WhyChooseUs from '@/components/why-choose-us'
import DemoSection from '@/components/demo-section'
import {Button} from "@/components/ui/button"
import {useRef} from "react";
import Image from "next/image";

export default function Home() {
    const demoSectionRef = useRef<any>(null);

    const handleScroll = () => {
        demoSectionRef.current?.scrollIntoView({behavior: 'smooth'});
    };
    // @ts-ignore
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="max-w-4xl w-full space-y-24 text-center">
                    <div className="flex flex-col items-center justify-center h-screen px-4 text-center space-y-8">
                        {/* Heading */}
                        <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-4">
                            Welcome to
                        </h1>

                        {/* Responsive Logo */}
                        <Image
                            src="/logo.png"
                            alt="HoodOn Logo"
                            width={0}
                            height={0}
                            sizes="(min-width: 768px) 400px, 300px"
                            className="w-[300px] md:w-[400px] lg:w-[500px] transition-transform duration-300 ease-in-out transform hover:scale-110"
                        />


                        {/* Description */}
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-md md:max-w-lg">
                            Secure, anonymous messaging and calling. Join our waitlist!
                        </p>

                        {/* Waitlist Form */}
                        <WaitlistForm/>

                        {/* Button */}
                        <Button
                            variant="outline"
                            size="lg"
                            className="mt-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                            onClick={handleScroll}
                        >
                            See Demo
                        </Button>
                    </div>
                    <WhyChooseUs/>
                    <div id="demo-section" ref={demoSectionRef}>
                        <DemoSection/>
                    </div>
                </div>
            </main>
        </div>
    )
}

