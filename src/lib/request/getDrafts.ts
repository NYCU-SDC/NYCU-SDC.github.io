import type { Blog } from "@/types/blog.ts";
import { api } from "./api.ts";

export default function getDrafts(): Promise<Blog[]> {
	return api<Blog[]>(`/api/drafts`);
}
