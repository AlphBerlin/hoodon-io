import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
    MicIcon,
    MicOffIcon,
    VideoIcon,
    VideoOffIcon,
    PhoneOffIcon,
    ScanFace,
    UserX,
} from "lucide-react";
import {useStream} from "@/context/stream-context";
import {Button} from "@/components/ui/button";

interface NavItem {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    action: string;
    destructive?: boolean;
    secondaryState?: boolean;
}

interface FloatingToolbarProps {
    onAction: (action: string) => void; // Parent callback
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onAction }) => {
    const { muted, visible, hoodOn } = useStream();

    const navItems: NavItem[] = [
        {
            name: "Toggle Video",
            icon: visible ? VideoIcon : VideoOffIcon,
            action: "toggleVideo",
            secondaryState: !visible,
        },
        {
            name: "Toggle Audio",
            icon: muted ? MicOffIcon : MicIcon,
            action: "toggleAudio",
            secondaryState: muted,
        },
        {
            name: "Hoods",
            icon: hoodOn ? ScanFace : UserX,
            action: "hoodUpdate",
            secondaryState: !hoodOn,
        },
        // { name: "Chat", icon: MessageCircleIcon, action: "chat" },
        { name: "End Call", icon: PhoneOffIcon, action: "endCall", destructive: true },
    ];

    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary/30 to-secondary/30 bg-transparent/10 backdrop-blur-md rounded-full shadow-2xl flex items-center space-x-2 p-5 z-50"
            style={{ backdropFilter: "blur(10px)" }}
        >
            {navItems.map((item) => (
                <Tooltip.Root key={item.name}>
                    <Tooltip.Trigger asChild>
                        <Button
                            variant={item.destructive ? "destructive" : "default"}
                            className={` h-12 flex bg-opacity-80  items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
                                ${
                                item.secondaryState
                                    ? "bg-gray-400 bg-opacity-60 text-gray-700 hover:bg-opacity-80 hover:shadow-lg hover:scale-110"
                                    : "hover:shadow-lg hover:scale-110"
                            },
                            ${
                                item.destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary/50'
                            }
                            `}
                            aria-label={item.name}
                            onClick={() => onAction(item.action)}
                        >
                            <item.icon className="w-8 h-8" />
                            {item.action === "endCall" && <span className="ml-2 text-sm font-bold">Leave</span>}
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            side="top"
                            align="center"
                            className="bg-gray-700 text-white text-xs sm:text-sm rounded-md py-1 px-2 shadow-lg"
                        >
                            {item.name}
                            <Tooltip.Arrow className="fill-gray-700" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            ))}
        </div>
    );
};

export default FloatingToolbar;
