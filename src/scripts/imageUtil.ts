type ImageUploadResponse = {
	id: string;
	url: string;
};

type ParsedMarkdown = {
	id: string;
	content: string;
};

export const processMarkdownImage = async (rawContent: string, type: "draft" | "post"): Promise<ParsedMarkdown> => {
	const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

	const matches = [...rawContent.matchAll(imageRegex)];

	const replacements = new Map<string, string>();

	let id: string = "";

	for (const match of matches) {
		const [fullMatch, altText, url] = match;

		if (url.startsWith("data:image") || url.startsWith("blob:")) {
			try {
				let file: File;

				if (url.startsWith("data:image")) {
					const base64Data = url.split(";")[0].split(",")[1];
					const filename = `image_${Date.now()}.png`;

					const fileType = url.split(";")[0].split(":")[1];
					const byteCharacters = atob(base64Data);
					let n = byteCharacters.length;
					const u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = byteCharacters.charCodeAt(n);
					}
					file = new File([u8arr], filename, { type: fileType });
				} else {
					const response = await fetch(url);
					const blob = await response.blob();
					const filename = `image_${Date.now()}.png`;
					file = new File([blob], filename, { type: blob.type });
				}

				const imageUploadResponse = await uploadImage(file, type, id || "");
				const newUrl = imageUploadResponse.url;
				id = imageUploadResponse.id;
				const newMarkdownImage = `![${altText}](${newUrl})`;
				replacements.set(fullMatch, newMarkdownImage);
			} catch (error) {
				console.error("Error processing image:", error);
			}
		}
	}

	let processedContent = rawContent;
	replacements.forEach((newMarkdownImage, oldMarkdownImage) => {
		processedContent = processedContent.replace(oldMarkdownImage, newMarkdownImage);
	});

	return {
		id,
		content: processedContent
	};
};

const uploadImage = async (file: File, type: "draft" | "post", id: string): Promise<ImageUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`/api/${type}s/images${id ? `/${id}` : ""}`, {
		method: "POST",
		body: formData
	});

	if (!response.ok) {
		throw new Error("Image upload failed");
	}

	const data = (await response.json()) as ImageUploadResponse;
	return data;
};
