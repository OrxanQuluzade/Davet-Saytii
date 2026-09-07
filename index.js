document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       KATEQORİYALAR VƏ SEÇİMLƏR
       Yeni kateqoriya əlavə etmək üçün bu massivə bir obyekt
       əlavə etmək kifayətdir - hər şey avtomatik render olunur.
    ========================================================= */
    const categories = [
        {
            id: "yemek",
            icon: "🍔",
            title: "Yemək yemək",
            options: [
                "Fast Food 🍟",
                "Azərbaycan mətbəxi 🥘",
                "İtalyan mətbəxi 🍝",
                "Yapon mətbəxi (Sushi) 🍣",
                "Dənizməhsulları 🦐",
                "Şirniyyat / Desert 🍰"
            ]
        },
        {
            id: "sinema",
            icon: "🎬",
            title: "Sinema",
            options: [
                "Aksiyon 💥",
                "Qorxu 👻",
                "Komediya 😂",
                "Romantik 💕",
                "Fantastika 🚀",
                "Animasiya 🎨"
            ]
        },
        {
            id: "eylence",
            icon: "🎡",
            title: "Əylənmə",
            options: [
                "Luna park 🎠",
                "Maraqlı challenge-lər 🔐",
                "Bovlinq 🎳",
                "Karting 🏎️",
                "Canlı konsert 🎤",
                "Gecə gəzintisi 🌙"
            ]
        },
        {
            id: "sakit",
            icon: "☕",
            title: "Sakit vaxt",
            options: [
                "Kafedə oturmaq ☕",
                "Sahildə gəzinti 🌊",
                "Parkda gəzinti 🌳",
                "Ulduzları izləmək ✨"
            ]
        },
        {
            id: "yaradici",
            icon: "🎨",
            title: "Yaradıcı fəaliyyət",
            options: [
                "Rəssamlıq studiyası 🖌️",
                "Keramika dərsi 🏺",
                "Fotoşut 📸",
                "Birgə aşpazlıq 👩‍🍳"
            ]
        }
    ];

    const selections = {}; // { categoryId: "seçilən variant" }

    /* ---------- ELEMENTLƏR ---------- */
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");

    const steps = {
        step1: document.getElementById("step1"),
        step2: document.getElementById("step2"),
        step3: document.getElementById("step3"),
        step4: document.getElementById("step4"),
        stepDecline: document.getElementById("stepDecline"),
    };

    const nextNameBtn = document.getElementById("nextNameBtn");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const btnContainer = noBtn.closest(".btn-container");
    const restartBtn = document.getElementById("restartBtn");
    const restartBtn2 = document.getElementById("restartBtn2");

    const categoriesContainer = document.getElementById("categoriesContainer");
    const liveSummary = document.getElementById("liveSummary");
    const aiSuggestBtn = document.getElementById("aiSuggestBtn");
    const aiSuggestionBox = document.getElementById("aiSuggestionBox");
    const finishPlanBtn = document.getElementById("finishPlanBtn");
    const finalSummary = document.getElementById("finalSummary");
    const finalAiBox = document.getElementById("finalAiBox");

    /* ---------- MUSİQİ ---------- */
    function playAudio() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().then(() => {
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
            }).catch(err => {
                console.log("Səs avtomatik başlatıla bilmədi:", err);
                if (musicToggleBtn) musicToggleBtn.textContent = "🔇";
            });
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

    /* ---------- ADDIM KEÇİDİ ---------- */
    function goToStep(stepId) {
        Object.values(steps).forEach(step => step.classList.remove("active"));
        steps[stepId].classList.add("active");
    }

    /* ADDIM 1 -> ADDIM 2 */
    if (nextNameBtn) {
        nextNameBtn.addEventListener("click", () => {
            playAudio();
            goToStep("step2");
        });
    }

    /* ADDIM 2: Bəli -> Planlayıcı */
    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            goToStep("step3");
        });
    }

    /* ADDIM 2: Xeyr düyməsi - siçandan/barmaqdan qaçır */
    function dodgeNoButton() {
        if (!btnContainer) return;

        const containerRect = btnContainer.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        const maxX = Math.max(containerRect.width - btnRect.width, 0);
        const maxY = Math.max(containerRect.height - btnRect.height, 0);

        const randX = Math.random() * maxX;
        const randY = Math.random() * maxY;

        noBtn.classList.add("dodging");
        noBtn.style.left = randX + "px";
        noBtn.style.top = randY + "px";

        noBtn.classList.remove("dodge-pulse");
        void noBtn.offsetWidth; // reflow - animasiya təkrar işə düşsün
        noBtn.classList.add("dodge-pulse");
    }

    if (noBtn) {
        noBtn.addEventListener("mouseenter", dodgeNoButton);
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            dodgeNoButton();
        }, { passive: false });
    }

    /* =========================================================
       KATEQORİYA AKKORDEONUNUN RENDER OLUNMASI
    ========================================================= */
    function renderCategories() {
        categoriesContainer.innerHTML = "";

        categories.forEach(cat => {
            const card = document.createElement("div");
            card.className = "category-card";
            card.dataset.catId = cat.id;

            const header = document.createElement("div");
            header.className = "category-header";
            header.innerHTML = `
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-title">${cat.title}</span>
                <span class="category-selected-tag" id="tag-${cat.id}" style="display:none;"></span>
                <span class="category-arrow">▾</span>
            `;
            header.addEventListener("click", () => toggleCategory(cat.id));

            const body = document.createElement("div");
            body.className = "category-body";

            const grid = document.createElement("div");
            grid.className = "option-grid";

            cat.options.forEach(opt => {
                const pill = document.createElement("button");
                pill.type = "button";
                pill.className = "option-pill";
                pill.textContent = opt;
                pill.addEventListener("click", (e) => {
                    e.stopPropagation();
                    selectOption(cat.id, opt);
                });
                grid.appendChild(pill);
            });

            body.appendChild(grid);
            card.appendChild(header);
            card.appendChild(body);
            categoriesContainer.appendChild(card);
        });
    }

    function toggleCategory(catId) {
        const card = categoriesContainer.querySelector(`[data-cat-id="${catId}"]`);
        if (card) card.classList.toggle("open");
    }

    function selectOption(catId, option) {
        // Eyni variana yenidən basılırsa - seçimi ləğv et
        if (selections[catId] === option) {
            delete selections[catId];
        } else {
            selections[catId] = option;
        }
        updateSelectionUI();
    }

    function updateSelectionUI() {
        categories.forEach(cat => {
            const card = categoriesContainer.querySelector(`[data-cat-id="${cat.id}"]`);
            const tag = document.getElementById(`tag-${cat.id}`);
            const pills = card.querySelectorAll(".option-pill");

            pills.forEach(pill => {
                pill.classList.toggle("selected", pill.textContent === selections[cat.id]);
            });

            if (selections[cat.id]) {
                card.classList.add("has-selection");
                tag.textContent = selections[cat.id];
                tag.style.display = "inline-block";
            } else {
                card.classList.remove("has-selection");
                tag.style.display = "none";
            }
        });

        renderLiveSummary();
    }

    function renderLiveSummary() {
        const chosen = Object.entries(selections);

        if (chosen.length === 0) {
            liveSummary.innerHTML = `<p class="small-text">Hələ heç nə seçilməyib. Yuxarıdakı kateqoriyalardan seçim et 👆</p>`;
            return;
        }

        liveSummary.innerHTML = chosen.map(([catId, value]) => {
            const cat = categories.find(c => c.id === catId);
            return `<p><strong>${cat.icon} ${cat.title}:</strong> ${escapeHtml(value)}</p>`;
        }).join("");
    }

    /* =========================================================
       AI TÖVSİYƏ MOTORU
       (Real AI API çağırışı deyil - statik saytda təhlükəsiz
       işləmək üçün seçimlərə əsaslanan ağıllı yerli məntiq)
    ========================================================= */
    function generateAISuggestion() {
        const chosen = Object.entries(selections);

        if (chosen.length === 0) {
            return "🤖 Hələ seçim etməmisən — yuxarıdan bir neçə fəaliyyət seç, sənə əla bir plan hazırlayım!";
        }

        const openers = [
            "Necə səslənir?",
            "Bax bunu təklif edirəm:",
            "Fikrimcə bu gözəl olardı:",
            "Mükəmməl plan hazırladım:"
        ];
        const closers = [
            "Mükəmməl bir date olacaq! 💘",
            "Bundan gözəl nə ola bilər? 😍",
            "Unudulmaz olacağına əminəm! ✨",
            "Bu, ikinizin də xoşuna gələcək! 🎉"
        ];

        const phraseParts = [];
        const order = ["yemek", "sinema", "eylence", "sakit", "yaradici"];
        const connectors = ["əvvəlcə", "sonra", "daha sonra", "bir də", "axırda isə"];
        let connectorIndex = 0;

        order.forEach(catId => {
            if (selections[catId]) {
                const cat = categories.find(c => c.id === catId);
                const connector = connectorIndex === 0 ? "Əvvəlcə" : connectors[Math.min(connectorIndex, connectors.length - 1)];
                phraseParts.push(`${connector} ${selections[catId]} (${cat.title.toLowerCase()})`);
                connectorIndex++;
            }
        });

        const opener = openers[Math.floor(Math.random() * openers.length)];
        const closer = closers[Math.floor(Math.random() * closers.length)];

        return `🤖 ${opener} ${phraseParts.join(", ")}. ${closer}`;
    }

    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener("click", () => {
            aiSuggestionBox.textContent = generateAISuggestion();
            aiSuggestionBox.classList.add("visible");
        });
    }

    /* ADDIM 3 -> ADDIM 4 */
    if (finishPlanBtn) {
        finishPlanBtn.addEventListener("click", () => {
            finalSummary.innerHTML = liveSummary.innerHTML;
            finalAiBox.textContent = generateAISuggestion();
            finalAiBox.classList.add("visible");
            goToStep("step4");
        });
    }

    /* Sadə HTML-injection qarşısını almaq üçün */
    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    /* Yenidən başlat düymələri */
    function resetAll() {
        Object.keys(selections).forEach(key => delete selections[key]);
        updateSelectionUI();
        aiSuggestionBox.classList.remove("visible");
        aiSuggestionBox.textContent = "";
        categoriesContainer.querySelectorAll(".category-card.open").forEach(c => c.classList.remove("open"));
        goToStep("step1");
    }

    if (restartBtn) restartBtn.addEventListener("click", resetAll);
    if (restartBtn2) restartBtn2.addEventListener("click", () => goToStep("step1"));

    /* ---------- BAŞLANĞIC ---------- */
    renderCategories();
    updateSelectionUI();

});
