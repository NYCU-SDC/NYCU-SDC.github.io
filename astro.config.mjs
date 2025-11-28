import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
    site: "https://sdc.nycu.club",
    base: "/",
    output: "static",
    trailingSlash: "ignore",
    build: {
        format: "directory"
    },
    integrations: [sitemap({}), react()]
});