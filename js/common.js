
document.querySelectorAll("[data-link]").forEach(item => {
    item.addEventListener("click", () => {
        window.open(item.getAttribute("data-link"), item.hasAttribute("data-link-newtab") ? "_blank" : "_self");
    });
});