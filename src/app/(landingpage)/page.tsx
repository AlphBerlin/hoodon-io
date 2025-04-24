import {Suspense} from 'react'
import {HeroScene} from '@/components/hero-scene'
import {FeaturesSection} from '@/components/features-section'
import {PlansSection} from '@/components/plans-section'
import {PlansSectionSkeleton} from '@/components/plans-section-skeleton'
import DemoSection from "@/components/demo-section";

export default function Page() {
    return (
        <>
            <div className="overflow-x-hidden">
                <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20">
                    <HeroScene/>
                    <div className="relative z-10 text-center">
                        {/*<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800">*/}
                        {/*  Welcome to HoodOn.io*/}
                        {/*</h1>*/}
                        {/*<p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                            Experience crystal-clear video calls with our cutting-edge platform. Connect with anyone,
                            anywhere, anytime.
                        </p>*/}
                    </div>
                </section>

                <FeaturesSection/>
                <DemoSection/>

                <Suspense fallback={<PlansSectionSkeleton/>}>
                    {/*<PlansSection/>*/}
                </Suspense>
            </div>
        </>
    )
}

