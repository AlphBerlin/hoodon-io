import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {mix} from 'polished';
import {ColorPickerProps, ColorVariant} from '@/types/types';

const ColorPicker: React.FC<ColorPickerProps> = ({
                                                     onColorChange,
                                                     defaultColor = '#C4A484'
                                                 }) => {
    const [selectedColor, setSelectedColor] = useState<ColorVariant>({
        base: defaultColor,
        variant: 50
    });
    const [customColor, setCustomColor] = useState<string>(defaultColor);

    const skinColors: string[] = [
        // Dark to light browns
        '#3B2F2F', '#4C3834', '#6B4423', '#8B7355', '#C4A484', '#DEB887',
        // Pale/beige tones
        '#F5D0C5', '#F3D5B5', '#E7C697', '#C0C0C0', '#8B4513', '#D2691E',
        // Additional tones
        '#FFE135', '#90EE90', '#4169E1', '#9370DB', '#DDA0DD'
    ];

    const getVariantColor = (baseColor: string, variant: number): string => {
        // Create a more subtle gradient effect
        const mixRatio = (variant - 50) / 50; // Will be between -1 and 1
        if (mixRatio < 0) {
            // Darker variants (smoother transition)
            return mix(-mixRatio * 0.7, baseColor, '#000000');
        } else {
            // Lighter variants (smoother transition)
            return mix(mixRatio * 0.7, baseColor, '#FFFFFF');
        }
    };

    useEffect(() => {
        const variantColor = getVariantColor(selectedColor.base, selectedColor.variant);
        onColorChange(variantColor);
    }, [selectedColor, onColorChange]);

    const handleColorClick = (color: string) => {
        setSelectedColor({
            base: color,
            variant: 50
        });
    };

    const handleCustomColorChange = (color: string) => {
        setCustomColor(color);
        handleColorClick(color);
    };

    const handleVariantChange = (variant: number) => {
        setSelectedColor(prev => ({
            ...prev,
            variant
        }));
    };

    return (
        <Card className="w-80">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">Skin</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-6 gap-2 mb-4">
                    {skinColors.map((color, index) => (
                        <button
                            key={index}
                            className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                selectedColor.base === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                            }`}
                            style={{backgroundColor: color}}
                            onClick={() => handleColorClick(color)}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>

                <div className="relative px-4">
                    {/* Gradient Track */}
                    <div
                        className="h-3 rounded-full relative overflow-hidden"
                        style={{
                            background: `linear-gradient(to right, 
                                ${getVariantColor(selectedColor.base, 0)},
                                ${selectedColor.base} 50%,
                                ${getVariantColor(selectedColor.base, 100)}
                            )`
                        }}
                    />

                    {/* Slider Handle Container */}
                    <div className="absolute inset-0 -top-1.5">
                        {/* Outer white circle */}
                        <div
                            className="absolute w-6 h-6 rounded-full bg-white shadow-md transform -translate-x-1/2"
                            style={{
                                left: `${selectedColor.variant}%`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {/* Inner color circle */}
                            <div
                                className="absolute top-1/2 left-1/2 w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    backgroundColor: getVariantColor(selectedColor.base, selectedColor.variant),
                                }}
                            />
                        </div>
                    </div>

                    {/* Hidden Range Input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedColor.variant}
                        onChange={(e) => handleVariantChange(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Adjust color variant"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ColorPicker;