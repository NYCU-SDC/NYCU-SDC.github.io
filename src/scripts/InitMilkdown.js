import { Crepe } from "@milkdown/crepe"
import "@milkdown/crepe/theme/common/style.css";

window.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('editor');
    if (!root) return;

    new Crepe({
        root,
        defaultValue: '# Hello Milkdown in Astro!',
    }).create();
});