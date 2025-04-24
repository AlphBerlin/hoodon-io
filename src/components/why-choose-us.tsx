'use client'

import {motion} from 'framer-motion'
import {Lock, Shield, Zap} from 'lucide-react'
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";

const features = [
    {
        icon: Shield,
        title: 'Secure',
        description: 'End-to-end encryption for all your communications.'
    },
    {
        icon: Lock,
        title: 'Anonymous',
        description: 'No phone numbers or personal information required.'
    },
    {
        icon: Zap,
        title: 'Fast',
        description: 'Lightning-fast messaging and crystal-clear calls.'
    }
]

export default function WhyChooseUs() {
    return (
        <section className="py-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose HoodOn?</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex items-start space-x-4"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.2}}
                        >
                            <feature.icon className="w-6 h-6 text-primary mt-1"/>
                            <div>
                                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    className="bg-muted"
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.5}}
                >
                    <div className="w-full h-full bg-background rounded">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {Array.from({length: 3}).map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-0 relative overflow-hidden">
                                                    <Image src={'/images/demo/image' + (index + 1) + '.jpg'}
                                                           alt={'image'} layout="fill" // Makes the image fill the container
                                                            />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext
                            />
                        </Carousel>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

