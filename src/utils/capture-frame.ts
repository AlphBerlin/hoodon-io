import html2canvas from 'html2canvas';

export const captureFrame = async (element: HTMLElement): Promise<string> => {
    const canvas = await html2canvas(element, {
        backgroundColor: null,
    });
    return canvas.toDataURL('image/png');
};

export const createSpriteSheet = (frames: string[]): Promise<string> => {
    return new Promise((resolve) => {
        const frameCount = frames.length;
        const frameDim = Math.ceil(Math.sqrt(frameCount));

        // Create temporary image elements to get dimensions
        const img = new Image();
        img.onload = () => {
            const frameWidth = img.width;
            const frameHeight = img.height;

            const canvas = document.createElement('canvas');
            canvas.width = frameWidth * frameDim;
            canvas.height = frameHeight * frameDim;
            const ctx = canvas.getContext('2d')!;

            let loadedFrames = 0;
            frames.forEach((frameData, index) => {
                const frameImg = new Image();
                frameImg.onload = () => {
                    const row = Math.floor(index / frameDim);
                    const col = index % frameDim;
                    ctx.drawImage(
                        frameImg,
                        col * frameWidth,
                        row * frameHeight,
                        frameWidth,
                        frameHeight
                    );
                    loadedFrames++;
                    if (loadedFrames === frameCount) {
                        resolve(canvas.toDataURL('image/png'));
                    }
                };
                frameImg.src = frameData;
            });
        };
        img.src = frames[0];
    });
};