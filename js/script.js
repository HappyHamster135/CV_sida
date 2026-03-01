//------------------------------------------------------------//
// GLOBAL LADDNING OCH LOGIK FÖR ATT TONA IN SIDAN
//------------------------------------------------------------//

window.addEventListener('load', () => {
    const logo = document.getElementById('site-logo');
    const loaderBg = document.getElementById('loader-bg');
    
    // Rensa minnet så att animationen alltid tillåts köras vid ny laddning
    sessionStorage.clear();

    // Förbered logotypen genom att nollställa alla tidigare klasser
    if (logo) {
        logo.classList.remove('run-anim', 'no-anim');
        // Tvinga webbläsaren att rita om elementet för att nollställa animationen
        void logo.offsetWidth; 
    }

    // Steg ett börja tona in själva webbplatsen direkt
    setTimeout(() => {
        document.body.style.transition = "opacity 0.6s ease-in-out";
        document.body.style.opacity = "1";
        document.body.classList.add("page-loaded");
    }, 100);

    // Steg ett börja tona in själva webbplatsen direkt
    if (loaderBg) {
        setTimeout(() => {
            loaderBg.classList.add('loader-finished');
        }, 500);
    }

    // Steg tre starta animationen för namnet när sidan är helt synlig
    if (logo) {
        setTimeout(() => {
            logo.classList.add('run-anim');
        }, 1200); 
    }
});

//------------------------------------------------------------//
// HANTERING AV UTTONING NÄR ANVÄNDAREN KLICKAR PÅ LÄNKAR
//------------------------------------------------------------//

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetUrl = link.href;
            
            // Kontrollera att länken går till en intern sida i samma domän
            if (link.hostname === window.location.hostname && targetUrl.includes(".html")) {
                e.preventDefault();
                document.body.style.transition = "opacity 0.5s ease-in-out";
                document.body.style.opacity = "0";

                // Vänta tills uttoningen är klar innan den nya sidan laddas
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });
});

//------------------------------------------------------------//
// HANTERING AV POPUP RUTAN FÖR PROJEKTVISNING
//------------------------------------------------------------//

const modal = document.getElementById("projectModal");
if (modal) {
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalLinkDetails = document.getElementById("modal-readmore"); 
    const modalLinkProject = document.getElementById("modal-github"); 
    const closeBtn = document.querySelector(".modal .close");

    // Gå igenom alla projekt och lägg till klickfunktion
    document.querySelectorAll(".portfolio-scroll .project").forEach(project => {
        project.addEventListener("click", () => {
            
            modalImg.style.display = "block";
            const modalLinks = document.querySelector(".modal-links");
            if (modalLinks) modalLinks.style.display = "flex";
            
            const modalContentBox = document.querySelector(".modal-content");
            if (modalContentBox) {
                modalContentBox.style.maxWidth = "800px";
                modalContentBox.style.textAlign = "left";
            }

            // Återställ textfärgen till mörk ifall nattläget är aktivt
            modalTitle.style.color = "var(--color-slate)";
            modalDesc.style.color = "var(--color-charcoal)";

            // Hämta projektets bild från data attributet eller bildtaggen
            if (project.dataset.img) {
                modalImg.src = project.dataset.img;
            } else {
                const innerImg = project.querySelector("img");
                modalImg.src = innerImg ? innerImg.src : "";
            }

            // Uppdatera texterna i popup rutan med information från projektet
            modalTitle.textContent = project.dataset.title || "Projekttitel saknas";
            modalDesc.textContent = project.dataset.desc || "Ingen beskrivning tillgänglig.";
            
            // Uppdatera länken för att läsa mer om projektet
            if (project.dataset.page) {
                modalLinkDetails.href = project.dataset.page;
                modalLinkDetails.style.display = "inline-block";
            } else {
                modalLinkDetails.style.display = "none";
            }

            // Uppdatera länken till projektets kod på github
            if (project.dataset.github) {
                modalLinkProject.href = project.dataset.github;
                modalLinkProject.style.display = "inline-block";
            } else {
                modalLinkProject.style.display = "none";
            }

            modal.style.display = "flex";
        });
    });

    // Stäng rutan när man klickar på krysset
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Stäng rutan om användaren klickar utanför innehållet
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

//------------------------------------------------------------//
// LOGIK FÖR HORISONTELL SCROLLNING OCH FRAMSTEGSMÄTARE
//------------------------------------------------------------//

const scrollContainer = document.querySelector(".portfolio-scroll");
const scrollBar = document.getElementById('scrollBar');
const scrollHint = document.getElementById('scrollHint');
const scrollText = document.querySelector('.scroll-text');
const siteLogo = document.getElementById('site-logo');

if (scrollContainer) {
    let targetScrollLeft = 0;
    let currentScrollLeft = 0;
    const speed = 0.02; // Hastigheten för den mjuka inbromsningen
    
    // Hantera scrollhjulet för stationära datorer
    scrollContainer.addEventListener("wheel", (e) => {
        // Avbryt funktionen om skärmen är liten som en mobil eller surfplatta
        if (window.innerWidth <= 1024) return;
        
        if (e.deltaX !== 0) return;
        
        e.preventDefault();
        targetScrollLeft += e.deltaY;
        
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));
    }, { passive: false });


    // Loop för att skapa mjuk rörelse och visuella effekter vid scroll
    function update() {
        if (window.innerWidth > 1024) {
            const velocity = targetScrollLeft - currentScrollLeft;
            const skew = velocity * 0.008;
            scrollContainer.style.transform = `skewX(${skew}deg)`;

            currentScrollLeft += (targetScrollLeft - currentScrollLeft) * speed;
            scrollContainer.scrollLeft = currentScrollLeft;

            // Dölj instruktionstext och logotyp när användaren börjar scrolla
            if (currentScrollLeft > 10) {
                if (scrollHint) scrollHint.classList.add('hidden');
                if (scrollText) scrollText.classList.add('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '0';
                    siteLogo.style.pointerEvents = 'none';
                }
            } else {
                if (scrollHint) scrollHint.classList.remove('hidden');
                if (scrollText) scrollText.classList.remove('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '1';
                    siteLogo.style.pointerEvents = 'auto';
                }
            }

            // Uppdatera den vertikala mätaren för framsteg på datorer
            if (scrollBar) {
                const maxScrollDesktop = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                if (maxScrollDesktop > 0) {
                    const scrollPercentageDesktop = (scrollContainer.scrollLeft / maxScrollDesktop) * 100;
                    scrollBar.style.height = scrollPercentageDesktop + '%';
                }
            }
        } else {
            // Återställ eventuell lutning om fönstret ändrar storlek till mobil
            scrollContainer.style.transform = 'none';
        }
        
        requestAnimationFrame(update);
    }
    update();

    // Hantering av vanlig vertikal scroll för mobila enheter
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 1024) {
            // Läs av hur långt ner användaren har scrollat på sidan
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;

            // Dölj texter och logotyp vid scrollning nedåt
            if (currentScrollY > 10) {
                if (scrollHint) scrollHint.classList.add('hidden');
                if (scrollText) scrollText.classList.add('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '0';
                    siteLogo.style.pointerEvents = 'none';
                }
            } else {
                if (scrollHint) scrollHint.classList.remove('hidden');
                if (scrollText) scrollText.classList.remove('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '1';
                    siteLogo.style.pointerEvents = 'auto';
                }
            }

            // Uppdatera mätaren baserat på den totala höjden av dokumentet
            if (scrollBar) {
                const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                const maxScrollHeight = docHeight - window.innerHeight;
                
                if (maxScrollHeight > 0) {
                    const scrollPercentage = (currentScrollY / maxScrollHeight) * 100;
                    scrollBar.style.height = scrollPercentage + '%';
                }
            }
        }
    });
}

//------------------------------------------------------------//
// HANTERING AV KONTAKTFORMULÄRET OCH LOGOTYP VID SCROLL
//------------------------------------------------------------//

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {

        // Förhindra att sidan laddas om vid inskickning
        e.preventDefault(); 
        e.stopImmediatePropagation(); 

        const data = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Visa ett tackmeddelande om allt gick bra
                contactForm.innerHTML = "<h3>Tack för ditt meddelande!</h3><p>Jag återkommer så snart jag kan.</p>";
            } else {
                alert("Något gick fel. Försök igen!");
            }
        } catch (error) {
            console.error("Fel vid inskick:", error);
        }
    });
}


// Se till att sidan blir synlig om användaren backar i webbläsaren
window.addEventListener("pageshow", (event) => {
    
    // Kontrollera om sidan laddades från webbläsarens cache minne
    if (event.persisted) {
        document.body.style.opacity = "1";
        document.body.classList.add("page-loaded");
    }
});

// Funktion för att dölja logotypen vid vanlig vertikal scrollning på undersidor
window.addEventListener('scroll', () => {
    const siteLogo = document.getElementById('site-logo');
    
    // Utför endast om logotypen finns på den aktuella sidan
    if (siteLogo) {
        // Kontrollera om användaren scrollat ner mer än femtio pixlar
        if (window.scrollY > 50) {
            siteLogo.style.opacity = '0';
            siteLogo.style.pointerEvents = 'none'; 
        } else {
            // Visa logotypen igen när man är högst upp på sidan
            siteLogo.style.opacity = '1';
            siteLogo.style.pointerEvents = 'auto';
        }
    }
});

//------------------------------------------------------------//
// PÅSKÄGG NUMMER ETT KLICKA PÅ TEXTEN SCROLL
//------------------------------------------------------------//

const oddElement = document.querySelector('.scroll-text');
if (oddElement) {
    oddElement.addEventListener('click', () => {
        document.documentElement.style.setProperty('--color-light', '#354F52'); 
        document.body.style.color = '#CAD2C5'; 
        alert("Påskägg 1 hittat! Dark Mode aktiverat!");
    });
}

//------------------------------------------------------------//
// PÅSKÄGG NUMMER TVÅ SKRIV NAMNET JONATHAN WENELL
//------------------------------------------------------------//

let typedCode = '';
const secretName = 'jonathan wenell'; 

window.addEventListener('keydown', (e) => {
    typedCode += e.key.toLowerCase();
    
    // Håll endast koll på de senaste tecknen för att matcha det hemliga namnet
    if (typedCode.length > secretName.length) {
        typedCode = typedCode.slice(-secretName.length);
    }
    
    if (typedCode === secretName) {
        triggerJonathanBackground();
        
        const modal = document.getElementById("projectModal");
        if (modal) {
            const mTitle = document.getElementById("modal-title");
            const mDesc = document.getElementById("modal-desc");

            mTitle.textContent = "JONATHAN MODE";
            mDesc.textContent = "Du hittade det hemliga påskägget";
            
            mTitle.style.setProperty('color', '#354F52', 'important');
            mDesc.style.setProperty('color', '#2F3E46', 'important');
            
            document.getElementById("modal-img").style.display = "none";
            const mLinks = document.querySelector(".modal-links");
            if(mLinks) mLinks.style.display = "none";
            
            const modalContentBox = document.querySelector(".modal-content");
            if (modalContentBox) {
                modalContentBox.style.maxWidth = "450px";
                modalContentBox.style.textAlign = "center";
            }
            
            modal.style.display = "flex";
        }
        
        typedCode = ''; 
    }
});

function triggerJonathanBackground() {
    if (document.getElementById('jonathan-grid')) return;

    const grid = document.createElement('div');
    grid.id = 'jonathan-grid';
    Object.assign(grid.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '-1', 
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)', 
        gridTemplateRows: 'repeat(10, 1fr)',    
        backgroundColor: '#000' 
    });
    document.body.appendChild(grid);

    const img1 = 'url("images/Jag.jpg")'; 
    const img2 = 'url("images/Jag1.jpg")';

    let delay = 0;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const box = document.createElement('div');
            box.style.backgroundImage = (row + col) % 2 === 0 ? img1 : img2;
            box.style.backgroundSize = 'cover';
            box.style.backgroundPosition = 'center';
            box.style.opacity = '0'; 
            box.style.transition = 'opacity 0.4s ease'; 

            grid.appendChild(box);
            setTimeout(() => { box.style.opacity = '1'; }, delay);
            delay += 25; 
        }
    }
    
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';

    const textSelectors = 'h1, h2, h3, p, li, nav a, .scroll-text, .scroll-hint, .top-left-name span';
    
    document.querySelectorAll(textSelectors).forEach(el => {
        // Se till att popup rutan inte påverkas av de nya textfärgerna
        if (!el.closest('.modal')) {
            el.style.setProperty('color', '#ffffff', 'important');
        }
    });

    const expandText = document.querySelectorAll('.expand');
    expandText.forEach(el => {
        el.style.setProperty('color', '#ffffff', 'important');
    });
}

//------------------------------------------------------------//
// LOGIK FÖR NATTLÄGE OCH LJUST LÄGE SAMT TEMAKNAPP
//------------------------------------------------------------//

// Skapa knappen för att återställa temat dynamiskt via javascript
const themeResetBtn = document.createElement('button');
themeResetBtn.innerHTML = '☀️ Ljust läge';
Object.assign(themeResetBtn.style, {
    position: 'fixed',
    top: '30px',
    right: '5vw',
    padding: '10px 20px',
    backgroundColor: '#CAD2C5',
    color: '#2F3E46',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: '1001',
    display: 'none', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease'
});

// Lägg till visuell effekt när man håller muspekaren över knappen
themeResetBtn.addEventListener('mouseenter', () => themeResetBtn.style.transform = 'scale(1.05)');
themeResetBtn.addEventListener('mouseleave', () => themeResetBtn.style.transform = 'scale(1)');
document.body.appendChild(themeResetBtn);

// Funktion för att stänga av nattläget när man klickar på knappen
themeResetBtn.addEventListener('click', () => {
    toggleEasterEggTheme(false); 
});

// Funktion som hanterar växlingen av färger för nattläge
function toggleEasterEggTheme(showPopup = false) {
    const isDark = localStorage.getItem('easterEggDarkMode') === 'true';

    if (isDark) {
        // Återställ till ljust läge och spara valet lokalt
        localStorage.setItem('easterEggDarkMode', 'false');
        document.documentElement.style.setProperty('--color-light', '#CAD2C5'); 
        
        // Återställ alla textfärger till sitt ursprungliga tillstånd
        document.querySelectorAll('h1, h2, h3, p, span, a, li').forEach(el => {
            if (!el.closest('.modal')) { 
                el.style.color = ''; 
            }
        });
        
        themeResetBtn.style.display = 'none'; 
        
    } else {
        // Aktivera nattläge och ändra bakgrundsfärgen
        localStorage.setItem('easterEggDarkMode', 'true');
        document.documentElement.style.setProperty('--color-light', '#1A202C'); 
        
        // Uppdatera alla texter till en ljusare nyans för bättre kontrast
        document.querySelectorAll('h1, h2, h3, p, span, a, li').forEach(el => {
            if (!el.closest('.modal')) {
                el.style.setProperty('color', '#CAD2C5', 'important');
            }
        });
        
        themeResetBtn.style.display = 'block'; 
    }
}

// Kontrollera om användaren har sparat nattläge sedan tidigare besök
if (localStorage.getItem('easterEggDarkMode') === 'true') {
    localStorage.setItem('easterEggDarkMode', 'false'); 
    toggleEasterEggTheme(false); 
}

// Lägg till klicklyssnare på scroll mätaren för att byta tema
const scrollArea = document.querySelector('.scroll-indicator-wrap');
if (scrollArea) {
    scrollArea.style.cursor = 'pointer';
    
    let isClicking = false;

    scrollArea.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        // Förhindra flera klick i snabb följd
        if (isClicking) return; 
        isClicking = true;

        const isCurrentlyDark = localStorage.getItem('easterEggDarkMode') === 'true';
        
        // Växla tema baserat på nuvarande tillstånd
        toggleEasterEggTheme(!isCurrentlyDark); 

        // Tillåt klick igen efter en sekund
        setTimeout(() => {
            isClicking = false;
        }, 1000);
    });
}