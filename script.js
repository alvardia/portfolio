const header = document.getElementById("about-header");
const text = "Hi, I'm Diana Alvarado";

let index = 0;
header.textContent = "";

function typeWriter() {
    if (index < text.length) {
        header.textContent += text[index];
        index++;
        setTimeout(typeWriter, 100);
    }
}

typeWriter();