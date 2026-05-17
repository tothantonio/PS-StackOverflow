const MAX_IMAGE_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;
const MAX_BYTES = 900_000;

/**
 * Resize/compress a file image to a JPEG data URL suitable for storing in imageUrl.
 */
export async function fileToCompressedDataUrl(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are supported.");
    }

    const dataUrl = await readFileAsDataUrl(file);
    const compressed = await compressDataUrl(dataUrl, file.type);

    if (compressed.length > MAX_BYTES) {
        throw new Error(
            "Image is still too large after compression. Use a smaller picture (under ~1 MB)."
        );
    }

    return compressed;
}

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read image file."));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
    });
}

function compressDataUrl(dataUrl: string, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const scale = Math.min(
                1,
                MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
            );
            const width = Math.max(1, Math.round(image.width * scale));
            const height = Math.max(1, Math.round(image.height * scale));

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("Could not process image."));
                return;
            }

            context.drawImage(image, 0, 0, width, height);

            const outputType = mimeType === "image/png" ? "image/png" : "image/jpeg";
            const quality = outputType === "image/jpeg" ? JPEG_QUALITY : undefined;
            resolve(canvas.toDataURL(outputType, quality));
        };
        image.onerror = () => reject(new Error("Could not load image."));
        image.src = dataUrl;
    });
}
