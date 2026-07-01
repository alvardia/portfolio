import { SONY_WALKMAN_S14_FILE_PRESET } from "./constants.js";

export async function processCoverImage(file) {
    const image = await loadImage(file);
    const size = SONY_WALKMAN_S14_FILE_PRESET.coverImage.size;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, size, size);
    const blob = await new Promise(resolve => 
        canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
    return new Uint8Array(await blob.arrayBuffer());
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(file);
    });
}
