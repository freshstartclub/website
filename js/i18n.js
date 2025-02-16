const translations = {
    en: {
        title: "Fresh Start Club",
        subtitle: "How can we help save the environment?",
        takeAction: "Take Action Now",
        ourMission: "Our Mission",
        futureClean: "Is a future, where our environment is clean, possible?",
        missionDescription: "Since the creation of Fresh Start (formerly Fresh Faces), in 2024, we've been on a mission to clean the environment, where people live. This includes schools, offices, playgrounds, beaches and all of the other places we adore."
    },
    es: {
        title: "Fresh Start Club",
        subtitle: "¿Cómo podemos ayudar a salvar el medio ambiente?",
        takeAction: "Actúa Ahora",
        ourMission: "Nuestra Misión",
        futureClean: "¿Es posible un futuro donde nuestro entorno esté limpio?",
        missionDescription: "Desde la creación de Fresh Start (anteriormente Fresh Faces), en 2024, hemos estado en una misión para limpiar el medio ambiente donde la gente vive. Esto incluye escuelas, oficinas, parques infantiles, playas y todos los demás lugares que adoramos."
    }
};

const i18n = {
    currentLanguage: "en",
    
    setContext: function (key, lang) {
        if (translations[lang]) {
            this.currentLanguage = lang;
            this.translatePage();
        }
    },

    translatePage: function () {
        document.querySelector(".main-content-title").textContent = translations[this.currentLanguage].title;
        document.querySelector(".main-content-subtitle").textContent = translations[this.currentLanguage].subtitle;
        document.querySelector(".button-row .button:nth-child(1)").textContent = translations[this.currentLanguage].takeAction;
        document.querySelector(".button-row .button:nth-child(2)").textContent = translations[this.currentLanguage].ourMission;
        document.querySelector(".our-mission-content .main-content-title").textContent = translations[this.currentLanguage].futureClean;
        document.querySelector(".our-mission-content span").textContent = translations[this.currentLanguage].missionDescription;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    i18n.translatePage();
});

window.i18n = i18n;
