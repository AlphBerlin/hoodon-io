'use client'

import React, {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {Heart, ShoppingBag, ShoppingCart, Sparkles} from 'lucide-react'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import {ScrollArea} from "@/components/ui/scroll-area"
import {type Avatar, avatars, myAssets, products} from '@/utils/mock-data'
import {AvatarGrid} from './avatar-grid'
import {Icons} from "@/components/icons";
import {useUser} from "@/context/user-context";

interface HoodsPopoverProps {

}

export function HoodsPopover({}: HoodsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(avatars[1])
    const availableItems = products.filter(
        product => !myAssets.find(asset => asset.id === product.id)
    )
    const {setHoodUrl} = useUser()
    useEffect(() => {
        if(selectedAvatar){
            setHoodUrl(selectedAvatar.hood_url)
        }else {
            setHoodUrl(null)
        }
    },[selectedAvatar])


    const handleAvatarSelect = (avatar: Avatar | null) => {
        setSelectedAvatar(avatar)
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button className="rounded-full h-14 w-14 shadow-lg [&_svg]:size-8">
                    <Icons.logo className="w-16 h-16"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] max-w-[480px] p-0" align="end" sideOffset={16}>
                <Tabs defaultValue="my-hoods" className="w-full">
                    {/*<TabsList className="w-full">
                        <TabsTrigger value="my-hoods" className="flex-1">My Hoods</TabsTrigger>
                        <TabsTrigger value="store" className="flex-1">Store</TabsTrigger>
                    </TabsList>*/}
                    <ScrollArea className="h-[400px] p-4">
                        <div className="space-y-4">
                            {/*<div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search assets..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Select defaultValue="newest">
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="popular">Popular</SelectItem>
                                        <SelectItem value="price">Price</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>*/}
                            <TabsContent value="my-hoods">
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 20}}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold">Choose Hood</h3>
                                            {/*<Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-primary mb-4">
                                                        <Sparkles className="w-4 h-4 mr-2" />
                                                        Create Custom
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-4">
                                                    <div className="flex flex-col gap-4">
                                                        <ColorPicker
                                                            onColorChange={()=>{}}
                                                            defaultColor="#C4A484"  // optional
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>*/}
                                        </div>
                                        <AvatarGrid
                                            avatars={avatars}
                                            selectedId={selectedAvatar?.id ?? null}
                                            onSelect={handleAvatarSelect}
                                        />
                                    </div>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="store">
                                <ScrollArea className="h-[400px]">
                                    <div className="grid grid-cols-2 gap-4">
                                        {availableItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="group relative aspect-square rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                                <div className="absolute top-2 left-2 flex items-center gap-2">
                                                    <div
                                                        className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                                                        <Heart className="w-3 h-3"/>
                                                        <span className="text-xs font-medium">{item.likes}</span>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                                                        <ShoppingBag className="w-3 h-3"/>
                                                        <span className="text-xs font-medium">{item.purchases}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-10 w-10 rounded-full shadow-lg"
                                                >
                                                    <ShoppingCart className="w-4 h-4"/>
                                                </Button>
                                                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                                    <h3 className="text-sm font-medium mb-2 line-clamp-2">{item.name}</h3>
                                                    <Button
                                                        variant="secondary"
                                                        className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                                    >
                                                        ${item.price}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

