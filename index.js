\/* =========================================
   EMAILJS CONFIGURATION
========================================= */
const EMAILJS_PUBLIC_KEY = "U4M_W0iXRCPd7lXqD";
const EMAILJS_SERVICE_ID = "service_ew9gjz1";
const EMAILJS_TEMPLATE_ID = "template_g5kwrzq";
const FEEDBACK_TEMPLATE_ID = "template_2emas1m";

const TARGET_EMAIL = "orxnquluzada@gmail.com";

/* =========================================
   INITIALIZE EMAILJS SAFELY
========================================= */
(function initEmailJS() {
    if (typeof emailjs !== "undefined") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.warn("EmailJS SDK yüklənmədi.");
    }
})();

/* =========================================
   DOM ELEMENTS & AUDIO SETUP
========================================= */
let nextNameBtn, yesBtn, noBtn, submitBtn, feedbackBtn, bgMusic, musicToggleBtn;

document.addEventListener("DOMContentLoaded", () => {
    nextNameBtn = document.getElementById("nextNameBtn");
    yesBtn = document.getElementById("yesBtn");
    noBtn = document.getElementById("noBtn");
    submitBtn = document.getElementById("submitBtn");
    feedbackBtn = document.getElementById("feedbackBtn");
    bgMusic = document.getElementById("bgMusic");
    musicToggleBtn = document.getElementById("musicToggleBtn");

    // Səhifə yüklənəndə 1-ci addımı göstər
    showStep("step1");

    // Səs Düyməsi İdarəetməsi
    if (musicToggleBtn && bgMusic) {
        musicToggleBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggleBtn.textContent = "🎵";
                }).catch(err => console.log("Səs xətası:", err));
            } else {
                bgMusic.pause();
                musicToggleBtn.textContent = "🔇";
            }
        });
    }

    // Düymə Dinləyiciləri
    if (nextNameBtn) {
        nextNameBtn.addEventListener("click", (e) => {
            submitName(e);
            playAudio();
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            playAudio();
            nextStep(3);
        });
    }

    if (submitBtn) submitBtn.addEventListener("click", finishSelection);
    if (feedbackBtn) feedbackBtn.addEventListener("click", sendFeedback);

    // Xeyr Düyməsinin Qaçma Sistemini Aktivləşdir
    if (noBtn) {
        noBtn.addEventListener("pointerdown", dodgeNoButton, { passive: false });
        noBtn.addEventListener("mouseenter", dodgeNoButton);
    }
});

/* =========================================
   AUDIO PLAYBACK FUNCTION
========================================= */
function playAudio() {
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
        }).catch(err => {
            console.log("Audio avtomatik oxuna bilmədi:", err);
        });
    }
}

/* =========================================
   STEP NAVIGATION
========================================= */
function showStep(stepId) {
    const steps = document.querySelectorAll(".step");
    steps.forEach(step => step.classList.remove("active"));

    const targetStep = document.getElementById(stepId);
    if (targetStep) targetStep.classList.add("active");
}

function nextStep(stepNumber) {
    showStep(`step${stepNumber}`);
}

/* =========================================
   STEP 1: NAME VALIDATION
========================================= */
function submitName(event) {
    if (event) event.preventDefault();

    const nameInput = document
        .getElementById("userName")
        .value
        .trim();

    if (!nameInput) {
        alert("Zəhmət olmasa əvvəlcə adınızı daxil edin!");
        return;
    }

    const askNameEl = document.getElementById("askName");
    const displayNameEl = document.getElementById("displayName");

    if (askNameEl) askNameEl.textContent = nameInput;
    if (displayNameEl) displayNameEl.textContent = nameInput;

    nextStep(2);
}

/* =========================================
   NO BUTTON DODGE SYSTEM
========================================= */
function rectRelativeTo(element, containerRect) {
    const rect = element.getBoundingClientRect();

    return {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
    };
}

let noBtnBusy = false;

function dodgeNoButton(event) {
    if (event) {
        event.preventDefault();
    }

    if (noBtnBusy || !noBtn || !yesBtn) {
        return;
    }

    noBtnBusy = true;

    const container = document.querySelector("#step2 .btn-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    if (!noBtn.classList.contains("dodging")) {
        const noRect = rectRelativeTo(noBtn, containerRect);

        noBtn.style.left = `${noRect.left}px`;
        noBtn.style.top = `${noRect.top}px`;
        noBtn.classList.add("dodging");
    }

    const yesRect = rectRelativeTo(yesBtn, containerRect);
    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;
    const padding = 10;

    const maxX = Math.max(containerRect.width - buttonWidth, 0);
    const maxY = Math.max(containerRect.height - buttonHeight, 0);

    let newLeft;
    let newTop;
    let tries = 0;

    function overlapsYes(left, top) {
        return (
            left < yesRect.left + yesRect.width + padding &&
            left + buttonWidth > yesRect.left - padding &&
            top < yesRect.top + yesRect.height + padding &&
            top + buttonHeight > yesRect.top - padding
        );
    }

    do {
        newLeft = Math.random() * maxX;
        newTop = Math.random() * maxY;
        tries++;
    } while (overlapsYes(newLeft, newTop) && tries < 12);

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;

    noBtn.style.pointerEvents = "none";

    setTimeout(() => {
        if (noBtn) noBtn.style.pointerEvents = "";
    }, 150);

    noBtn.classList.remove("dodge-pulse");
    void noBtn.offsetWidth;
    noBtn.classList.add("dodge-pulse");

    setTimeout(() => {
        noBtnBusy = false;
    }, 60);
}

window.addEventListener("resize", () => {
    if (!noBtn || !noBtn.classList.contains("dodging")) {
        return;
    }

    const container = document.querySelector("#step2 .btn-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const maxX = Math.max(containerRect.width - noBtn.offsetWidth, 0);
    const maxY = Math.max(containerRect.height - noBtn.offsetHeight, 0);

    const currentLeft = parseFloat(noBtn.style.left) || 0;
    const currentTop = parseFloat(noBtn.style.top) || 0;

    noBtn.style.left = `${Math.min(currentLeft, maxX)}px`;
    noBtn.style.top = `${Math.min(currentTop, maxY)}px`;
});

/* =========================================
   FINAL DATE SUBMISSION
========================================= */
async function finishSelection(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const date = document.getElementById("datePicker").value;
    const time = document.getElementById("timePicker").value;
    const selectedPlace = document.querySelector('input[name="place"]:checked');
    const customActivity = document.getElementById("customActivity").value.trim();

    if (!date) {
        alert("Zəhmət olmasa tarihi seçin!");
        return;
    }

    if (!time) {
        alert("Zəhmət olmasa saatı seçin!");
        return;
    }

    if (!selectedPlace) {
        alert("Zəhmət olmasa bir fəaliyyət seçin!");
        return;
    }

    let activityChoice;
    if (selectedPlace.value === "Other") {
        if (!customActivity) {
            alert("Zəhmət olmasa öz fəaliyyət ideyanızı qeyd edin!");
            return;
        }
        activityChoice = customActivity;
    } else {
        activityChoice = selectedPlace.value;
    }

    const finalNameEl = document.getElementById("finalName");
    const summaryDateEl = document.getElementById("summaryDate");
    const summaryTimeEl = document.getElementById("summaryTime");
    const summaryPlaceEl = document.getElementById("summaryPlace");

    if (finalNameEl) finalNameEl.textContent = name;
    if (summaryDateEl) summaryDateEl.textContent = date;
    if (summaryTimeEl) summaryTimeEl.textContent = time;
    if (summaryPlaceEl) summaryPlaceEl.textContent = activityChoice;

    const templateParams = {
        target_email: TARGET_EMAIL,
        user_name: name,
        date: date,
        time: time,
        location: activityChoice,
        activity: activityChoice
    };

    if (typeof emailjs !== "undefined") {
        submitBtn.disabled = true;
        submitBtn.textContent = "Göndərilir... 💌";

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );
            console.log(`Dəvət cavabı göndərildi: ${TARGET_EMAIL}`);
        } catch (error) {
            console.error("E-poçt göndərilmədi:", error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Seçimimi Təsdiqlə ❤️";
        }
    }

    nextStep(4);
    celebrate();
}

/* =========================================
   CONFETTI CELEBRATION
========================================= */
function celebrate() {
    const confettiFunc = window.confetti || (typeof confetti !== "undefined" ? confetti : null);

    if (!confettiFunc) {
        return;
    }

    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confettiFunc({
            particleCount: 6,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });

        confettiFunc({
            particleCount: 6,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

/* =========================================
   SEND FEEDBACK
========================================= */
async function sendFeedback(event) {
    if (event) event.preventDefault();

    const feedbackName = document.getElementById("feedbackName").value.trim();
    const feedbackMessage = document.getElementById("feedbackMessage").value.trim();
    const statusDiv = document.getElementById("feedbackStatus");

    if (!feedbackMessage) {
        alert("Zəhmət olmasa əvvəlcə qeydinizi yazın!");
        return;
    }

    const feedbackParams = {
        name: feedbackName || "Anonim",
        message: feedbackMessage
    };

    feedbackBtn.disabled = true;
    feedbackBtn.textContent = "Göndərilir... 💌";
    if (statusDiv) statusDiv.textContent = "";

    try {
        if (typeof emailjs !== "undefined") {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                FEEDBACK_TEMPLATE_ID,
                feedbackParams
            );

            if (statusDiv) {
                statusDiv.style.color = "#d63384";
                statusDiv.textContent = "Qeydiniz üçün təşəkkür edirəm! 💖";
            } else {
                alert("Qeydiniz üçün təşəkkür edirəm! 💖");
            }

            document.getElementById("feedbackName").value = "";
            document.getElementById("feedbackMessage").value = "";
        } else {
            alert("EmailJS düzgün yüklənməyib.");
        }
    } catch (error) {
        console.error("Feedback göndərilmədi:", error);
        if (statusDiv) {
            statusDiv.style.color = "red";
            statusDiv.textContent = "Qeyd göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";
        } else {
            alert("Qeyd göndərilərkən xəta baş verdi.");
        }
    } finally {
        feedbackBtn.disabled = false;
        feedbackBtn.textContent = "Qeydi Göndər 💌";
    }
}
