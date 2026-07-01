import { SONY_WALKMAN_S14_FILE_PRESET } from "./constants.js";

export function tagMP3(mp3ArrayBuffer, tags, coverImageBytes) {
    const writer = new ID3Writer(mp3ArrayBuffer);
    writer.setFrame("TIT2", tags.title);
    writer.setFrame("TPE1", [tags.artist]);
    writer.setFrame("TALB", tags.album);
    writer.setFrame("TRCK", tags.track);
    writer.setFrame("TCON", [tags.genre]);
    writer.setFrame("APIC", {
        type: SONY_WALKMAN_S14_FILE_PRESET.coverImage.type,
        data: coverImageBytes,
        description: "Cover",
        mimeType: "image/jpeg"
    });

    writer.addTag();

    return writer.getBlob();
}