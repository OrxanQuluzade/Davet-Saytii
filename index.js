document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const nextNameBtn = document.getElementById("nextNameBtn");
    const guestNameText = document.getElementById("guestNameText");
    const greetingTitle = document.getElementById("greetingTitle");

    // Səsi başlatmaq üçün funksiya
    function playAudio() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().then(() => {
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
            }).catch(err => {
                console.log("Səs avtomatik başlatıla bilmədi:", err);
            });
        }
    }

    // "Davam Et" düyməsinə kliklədikdə səs başlasın
    if (nextNameBtn) {
        nextNameBtn.addEventListener("click", () => {
            playAudio();
            
            // Dəvətnamə mətni yenilənsin
            if (greetingTitle) greetingTitle.textContent = "Əziz Qonağımız!";
            if (guestNameText) guestNameText.textContent = "Sizi özəl günümüzdə aramızda görməkdən şad olarıq!";
        });
    }

    // Musiqi düyməsinə kliklədikdə səs dayansın/başlasın
    if (musicToggleBtn && bgMusic) {
        musicToggleBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                playAudio();
            } else {
                bgMusic.pause();
                musicToggleBtn.textContent = "🔇";
            }
        });
    }
});
