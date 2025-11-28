import type { Blog } from "@/types/blog.ts";
import { api } from "./api.ts";

export default function getDraft(id: string): Promise<Blog> {
	return api<Blog>(`/api/drafts/${id}`);
}
