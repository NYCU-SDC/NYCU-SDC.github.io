import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://sdc.nycu.club",
	base: "/",
	output: "static",
	trailingSlash: "ignore",
	build: {
		format: "directory"
	},
	integrations: [sitemap({})],
	markdown: {
    shikiConfig: {
      theme: 'nord'
    }
  }
});
