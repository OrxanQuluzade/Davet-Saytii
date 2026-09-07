/* =========================================
   FORMSPREE İLƏ MAİL GÖNDƏRMƏ
   (Mailin çatacağı ünvan: orxnquluzada@gmail.com)
========================================= */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/orxnquluzada@gmail.com";

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
let currentUserName = "";

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    
    const userNameInput = document.getElementById("userName");
    const nextNameBtn = document.getElementById("nextNameBtn");
    const displayGuestName = document.getElementById("displayGuestName");
    
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const aiSuggestBtn = document.getElementById("aiSuggestBtn");
    const finishPlanBtn = document.getElementById("finishPlanBtn");
    const restartBtn = document.getElementById("restartBtn");
    const restartBtn2 = document.getElementById("restartBtn2");

    // Səs oxutmaq üçün funksiya
    function playAudio() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().then(() => {
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
            }).catch(err => console.log("Audio icazə gözləyir:", err));
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

    // Addım 1 ➔ Addım 2
    if (nextNameBtn) {
        nextNameBtn.addEventListener("click", () => {
            const val = userNameInput ? userNameInput.value.trim() : "";
            if (!val) {
                alert("Zəhmət olmasa adınızı daxil edin!");
                return;
            }
            currentUserName = val;
            if (displayGuestName) displayGuestName.textContent = currentUserName;
            
            playAudio();
            showStep("step2");
        });
    }

    // Addım 2 (Bəli / Xeyr)
    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            playAudio();
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

    // AI Tövsiyəsi
    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener("click", () => {
            const aiBox = document.getElementById("aiSuggestionBox");
            const suggestions = [
                "💡 AI Tövsiyəsi: Rahat bir kofedə başlayıb, sonra parkda gəzintiyə çıxmaq əla olar!",
                "💡 AI Tövsiyəsi: Birlikdə Dadlı pizza yeyib ardınca maraqlı bir film izləyə bilərsiniz! 🍕🎬",
                "💡 AI Tövsiyəsi: Axşamüstü gəzinti və ardınca şirin desertlər günü unudulmaz edəcək! 🍰✨"
            ];
            const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
            if (aiBox) {
                aiBox.textContent = randomSuggest;
                aiBox.style.display = "block";
            }
        });
    }

    // Addım 3 ➔ Addım 4 (Tamamlama və Mail Göndərmə)
    if (finishPlanBtn) {
        finishPlanBtn.addEventListener("click", async () => {
            const summaryText = buildSummaryText();

            const finalSummary = document.getElementById("finalSummary");
            if (finalSummary) {
                finalSummary.innerHTML = `
                    <p>👤 <strong>Qonaq:</strong> ${currentUserName}</p>
                    ${summaryText}
                `;
            }

            const aiBoxContent = document.getElementById("aiSuggestionBox")?.textContent || "Tövsiyə seçilmədi";
            const finalAiBox = document.getElementById("finalAiBox");
            if (finalAiBox && aiBoxContent !== "Tövsiyə seçilmədi") {
                finalAiBox.textContent = aiBoxContent;
                finalAiBox.style.display = "block";
            }

            const sendStatus = document.getElementById("sendStatus");
            if (sendStatus) sendStatus.textContent = "Plan mailə göndərilir... ⏳";

            // Formspree Vasitəsilə Mail Göndərilməsi
            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "Qonaq": currentUserName,
                        "Seçilmiş Plan": getSummaryPlain(),
                        "AI Tövsiyəsi": aiBoxContent
                    })
                });

                if (response.ok) {
                    if (sendStatus) sendStatus.textContent = "Plan mailinə uğurla göndərildi! Səni səbirsizliklə gözləyirəm! 💘";
                } else {
                    if (sendStatus) sendStatus.textContent = "Plan qeydə alındı! (Mail göndərmədə kiçik ləngimə oldu)";
                }
            } catch (err) {
                console.error("Xəta:", err);
                if (sendStatus) sendStatus.textContent = "Plan qeydə alındı!";
            }

            showStep("step4");
            if (window.confetti) confetti();
        });
    }

    if (restartBtn) restartBtn.addEventListener("click", resetAll);
    if (restartBtn2) restartBtn2.addEventListener("click", resetAll);

    function resetAll() {
        selectedOptions = {};
        currentUserName = "";
        if (userNameInput) userNameInput.value = "";
        document.getElementById("liveSummary").innerHTML = "";
        document.getElementById("aiSuggestionBox").style.display = "none";
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
    box.innerHTML = buildSummaryText() || "<p>Hələ heç nə seçilməyib.</p>";
}

function buildSummaryText() {
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
