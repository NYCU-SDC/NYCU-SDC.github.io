import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";

export async function initEditor(root: HTMLElement, content: string) {
	const crepe = new Crepe({
		root,
		defaultValue: content
	});

	await crepe.create();

	return crepe;
}
