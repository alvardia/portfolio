import { processCoverImage } from "./imageProcessing.js";
import { tagMP3 } from "./tagger.js";


let storedImageFile = null;
let storedAudioFile = null;
let finalBlob = null;
let podcastModeOn = false;

const songTitleInput = document.getElementById("songTitle");
const genreInput = document.getElementById("genre");
const albumInput = document.getElementById("album");
const selectedMp3FileName = document.getElementById("selectedMp3FileName");

const podcastBtn = document.getElementById("podcastBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

const textInputs = [
    "songTitle",
    "artist",
    "album",
    "trackNumber",
    "genre"
];

// Drop Zone
function setDropZone(dropZone, fileType) {

    const input = dropZone.querySelector("input");

    dropZone.addEventListener("click", () => input.click());

    // drag and drop
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");

        const file = e.dataTransfer.files[0];
        if (!file){
            console.log("no file, debugging");
            return;
        }
        storeFile(file, fileType);
    })

    // fallback
    input.addEventListener("change", () => {
        if (input.files.length > 0) {
            storeFile(input.files[0], fileType);
        }
    })
}

function storeFile(file, fileType) {
    if (fileType === "image") {
        storedImageFile = file;
        console.log("Debugging. Image stored:", file);
        const img = document.querySelector("#imagePreview img");
        img.src = URL.createObjectURL(file);

        const imageDrop = document.getElementById("imageDrop");
        imageDrop.classList.add("filled");
    }
    else if (fileType === "audio") {
        storedAudioFile = file;
        console.log("Debugging. Audio stored:", file);

        const audioDrop = document.getElementById("audioDrop");
        audioDrop.classList.add("filled");
        selectedMp3FileName.textContent = "+ " + file.name;

        if (songTitleInput.value.trim() === "" || podcastModeOn === true ) {
            songTitleInput.value = file.name.replace(/\.mp3$/i, "");
        }
    }
}

setDropZone(document.getElementById("imageDrop"), "image");
setDropZone(document.getElementById("audioDrop"), "audio");

// Triggered by complile button: compiles data, tags mp3 files
podcastBtn.addEventListener("click", () => {
    console.log("trigger podcast")
    // toggle podcast mode
    podcastModeOn = (podcastModeOn === false) ? true : false;
    if (podcastModeOn === true) {
        genreInput.value = "Podcast";
        albumInput.value = "0Podcasts0"
    }
    else {
        genreInput.value = "";
        albumInput.value = ""
    }
    
});

// Triggered by download button: downloads the final tagged mp3 file
downloadBtn.addEventListener("click", async () => {
    console.log("download clicked");

    // compile first
    if ((!storedAudioFile || !storedImageFile)) {
        alert ("Please make sure all required fields are filled before downloading!")
        return;
    }    
    const tags = {
        title: songTitle.value,
        artist: artist.value,
        album: album.value,
        track: trackNumber.value,
        genre: genre.value,
    };

    const mp3Buffer = await storedAudioFile.arrayBuffer();
    const coverBytes = await processCoverImage(storedImageFile);
    const taggedBlob = tagMP3(mp3Buffer, tags, coverBytes);
    finalBlob = taggedBlob;

    if (!finalBlob) {
        alert ("Error downloading, please try again.")
        return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(finalBlob);
    a.download = songTitleInput.value + ".mp3";
    a.click();

    downloadBtn.classList.remove("ready");
    clearBtn.classList.add("ready");
});

// Triggered by clear button: clears all data
clearBtn.addEventListener("click", () => {
    // remove all stored files
    storedAudioFile = null;
    storedImageFile = null;
    finalBlob = null;

    // reset UI
    document.querySelector("#imagePreview img").src = "images/pinkWalk.png";
    document.querySelectorAll("#tagsForm input").forEach(input => { 
        input.value = "";
    });
    selectedMp3FileName.textContent = "+ Preview ♪┏(・o･)┛♪┗ ( ･o･) ┓";
    const imageDrop = document.getElementById("imageDrop");
    const audioDrop = document.getElementById("audioDrop");
    imageDrop.classList.remove("filled");
    audioDrop.classList.remove("filled");
    clearBtn.classList.remove("ready");
});

function allInputsFilled() {
    if (!storedAudioFile || !storedImageFile) return false;
    for (const id of textInputs) {
        const input = document.getElementById(id);
        if (input.value.trim() === "") {
            return false;
        }
    }
    return true;
}