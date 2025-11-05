import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/` directory.
	// Each folder represents a post (e.g., postID/index.md)
	loader: glob({ base: "./src/content", pattern: "**/index.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			author: z.string().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date().optional(),
			date: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional()
		})
});

export const collections = { blog };
