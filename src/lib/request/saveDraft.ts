export const saveDraft = async (id: string, title: string, content: string): Promise<void> => {
	try {
		const response = await fetch(`${import.meta.env.BACKEND_BASE_URL}/api/drafts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id, title, content })
		});

		if (!response.ok) {
			throw new Error(`Error saving draft: ${response.statusText}`);
		}
	} catch (error) {
		console.error("Failed to save draft:", error);
	}
};
