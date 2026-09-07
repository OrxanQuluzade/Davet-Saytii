let guestName = "keci";

const categories = [
    {
        id: "food",
        title: "🍕 Yemək / Məkan",
        options: ["Qəhvə & Desert", "Pizza & Burger", "Romantik Şam Yeməyi", "Şərq Mətbəxi", "Piknik"]
    },
    {
        id: "activity",
        title: "🎬 Əyləncə & Fəaliyyət",
        options: ["Kino / Teatr", "Parkda Gəzinti", "Bouling / Kartinq", "Muzey / Sərgi", "Karaoke"]
    },
    {
        id: "time",
        title: "⏰ Vaxt Seçimi",
        options: ["Səhər (10:00 - 13:00)", "Günorta (14:00 - 17:00)", "Axşam (18:00 - 21:00)"]
    }
];

let selectedOptions = {};

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const startBtn = document.getElementById("startBtn");
    const nameInput = document.getElementById("nameInput");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const aiSuggestBtn = document.getElementById("aiSuggestBtn");
    const finishPlanBtn = document.getElementById("finishPlanBtn");
    const restartBtn2 = document.getElementById("restartBtn2");

    function playAudio() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().then(() => {
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
            }).catch(err => console.log("Audio gözləyir:", err));
        }
    }

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

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            playAudio();
            const val = nameInput.value.trim();
            if (val) guestName = val;
            
            const greetingTitle = document.getElementById("greetingTitle");
            if (greetingTitle) {
                greetingTitle.textContent = `Salam ${guestName}! 😍`;
            }
            showStep("step2");
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            renderCategories();
            showStep("step3");
        });
    }

    if (noBtn) {
        noBtn.addEventListener("mouseover", () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 40);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 40);
            noBtn.style.position = "fixed";
            noBtn.style.left = `${Math.max(10, x)}px`;
            noBtn.style.top = `${Math.max(10, y)}px`;
        });

        noBtn.addEventListener("click", () => {
            showStep("stepDecline");
        });
    }

    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener("click", () => {
            const aiBox = document.getElementById("aiSuggestionBox");
            const suggestions = [
                "💡 AI Tövsiyəsi: Rahat bir kofedə başlayıb, sonra parkda gəzintiyə çıxmaq əla olar!",
                "💡 AI Tövsiyəsi: Birlikdə dadlı pizza yeyib ardınca maraqlı bir film izləyə bilərsiniz! 🍕🎬",
                "💡 AI Tövsiyəsi: Axşamüstü gəzinti və ardınca şirin desertlər günü unudulmaz edəcək! 🍰✨"
            ];
            const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
            if (aiBox) {
                aiBox.textContent = randomSuggest;
                aiBox.style.display = "block";
            }
        });
    }

    // Planı tamamlayanda gizli inputları doldururuq ki, Formspree birbaşa mailə göndərsin
    const dateForm = document.getElementById("dateForm");
    if (dateForm) {
        dateForm.addEventListener("submit", (e) => {
            document.getElementById("inputGuestName").value = guestName;
            document.getElementById("inputPlanSummary").value = getSummaryPlain();
            document.getElementById("inputAiSuggestion").value = document.getElementById("aiSuggestionBox")?.textContent || "Seçilmədi";
            if (window.confetti) confetti();
        });
    }

    if (restartBtn2) restartBtn2.addEventListener("click", resetAll);

    function resetAll() {
        selectedOptions = {};
        document.getElementById("liveSummary").innerHTML = "";
        document.getElementById("aiSuggestionBox").style.display = "none";
        document.getElementById("nameInput").value = "";
        guestName = "Qonaq";
        showStep("step1");
    }
});

function showStep(stepId) {
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(stepId);
    if (target) target.classList.add("active");
}

function renderCategories() {
    const container = document.getElementById("categoriesContainer");
    if (!container) return;
    container.innerHTML = "";

    categories.forEach(cat => {
        const catDiv = document.createElement("div");
        catDiv.className = "category-block";

        const title = document.createElement("h3");
        title.textContent = cat.title;
        catDiv.appendChild(title);

        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options-grid";

        cat.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "option-btn";
            btn.textContent = opt;

            if (selectedOptions[cat.id] === opt) {
                btn.classList.add("selected");
            }

            btn.addEventListener("click", () => {
                if (selectedOptions[cat.id] === opt) {
                    delete selectedOptions[cat.id];
                } else {
                    selectedOptions[cat.id] = opt;
                }
                renderCategories();
                updateLiveSummary();
            });

            optionsDiv.appendChild(btn);
        });

        catDiv.appendChild(optionsDiv);
        container.appendChild(catDiv);
    });
}

function updateLiveSummary() {
    const box = document.getElementById("liveSummary");
    if (!box) return;
    box.innerHTML = buildSummaryHtml() || "<p>Hələ heç nə seçilməyib.</p>";
}

function buildSummaryHtml() {
    let html = "";
    categories.forEach(cat => {
        if (selectedOptions[cat.id]) {
            html += `<p><strong>${cat.title}:</strong> ${selectedOptions[cat.id]}</p>`;
        }
    });
    return html;
}

function getSummaryPlain() {
    let text = "";
    categories.forEach(cat => {
        if (selectedOptions[cat.id]) {
            text += `${cat.title}: ${selectedOptions[cat.id]} | `;
        }
    });
    return text || "Heç nə seçilməyib";
}
