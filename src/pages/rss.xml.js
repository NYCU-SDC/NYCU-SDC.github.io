import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET() {
	const posts = await getCollection("blog");
	return rss({
		title: "NYCU SDC",
		description: "National Yang Ming Chiao Tung University Software Development Club",
		site: "https://sdc.nycu.edu.tw",
		items: posts.map(post => ({
			...post.data,
			link: `/blog/${post.id}/`
		}))
	});
}
