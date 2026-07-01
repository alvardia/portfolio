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



const avatar = document.getElementById("profile-img");

function blink() {
    avatar.src = "images/blink.png";

    setTimeout(() => {
        avatar.src = "images/drawing.png";
        // Next blink in 2–6 seconds
        setTimeout(blink, 2000 + Math.random() * 4000);
    }, 120);
}

setTimeout(blink, 2000); 


avatar.addEventListener('click', function() {
    avatar.src = "images/blink.png";
    setTimeout(() => {
        avatar.src = "images/drawing.png";
    }, 120);
});