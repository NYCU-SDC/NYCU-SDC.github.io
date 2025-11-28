import { useEffect, useRef, useState } from "react";
import "./BlogEditor.css";
import type { Blog } from "@/types/blog.ts";
import getDrafts from "@/lib/request/getDrafts.ts";
import createDraft from "@/lib/request/createDraft.ts";
import getDraft from "@/lib/request/getDraft.ts";
import { initEditor } from "@/scripts/initEditor.ts";
import { Crepe } from "@milkdown/crepe";

export default function BlogEditor() {
	const [drafts, setDrafts] = useState<Blog[]>([]);
	const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
	const [crepe, setCrepe] = useState<Crepe | null>(null);
	const editorRef = useRef<HTMLDivElement | null>(null);

	const handleLogin = () => {
		window.location.href = `${import.meta.env.PUBLIC_BACKEND_BASE_URL}/auth/login?r=${window.location.href}`;
	};

	const handleCreateDraft = async () => {
		createDraft()
			.then(newDraft => {
				setDrafts(prevDrafts => [newDraft, ...prevDrafts]);
			})
			.catch(e => {
				console.error("Error creating draft:", e);
			});
	};

	const handleGetDraft = async (id: string) => {
		console.log("Fetching draft with id:", id);
		getDraft(id)
			.then(draft => {
				setCurrentBlog(draft);
			})
			.catch(e => {
				console.error("Error fetching draft:", e);
			});
	};

	useEffect(() => {
		if (currentBlog && editorRef.current) {
			if (crepe) {
				crepe.destroy();
			}
			initEditor(editorRef.current!, currentBlog.content).then(newCrepe => {
				setCrepe(newCrepe);
			});
		}
	}, [editorRef, currentBlog]);

	useEffect(() => {
		console.log("Fetching drafts...");
		getDrafts()
			.then(d => {
				setDrafts(d);
			})
			.catch(e => {
				console.error("Error fetching drafts:", e);
				throw Error("Failed to fetch drafts");
			});
	}, []);

	return (
		<>
			<div className="editor-sidebar">
				<div className="editor-blog-list editor-block">
					<p className="editor-list-title">SDC Blog Editor</p>
					<div className="editor-blog-selector">
						<label className="editor-radio-label">
							<input className="editor-radio" type="radio" name="editor-type" id="editor-type-draft" defaultChecked={true} />
							<span>草稿</span>
						</label>
						<label className="editor-radio-label">
							<input className="editor-radio" type="radio" name="editor-type" id="editor-type-post" />
							<span>已發布</span>
						</label>
					</div>
					<div className="editor-blog-button-list">
						{drafts.map(draft => (
							<div key={draft.id} className="post-button" onClick={() => handleGetDraft(draft.id)}>
								<p>{draft.title}</p>
							</div>
						))}
						<button className="post-button" onClick={handleCreateDraft}>
							新增草稿
						</button>
					</div>
				</div>
				<div className="editor-image editor-block">
					<img className="post-image" />
					<input className="post-image-upload" type="file" accept="image/*" hidden={true} />
					<button className="editor-button secondary">上傳縮圖</button>
				</div>
			</div>
			<div className="editor-content">
				<div className="editor-title editor-block">
					<p>正在編輯:</p>
					<input className="editor-title-input" value={currentBlog?.title || ""} onChange={e => setCurrentBlog(prev => (prev ? { ...prev, title: e.target.value } : null))} />
					<button className="editor-button">刪除</button>
					<button className="editor-button">儲存</button>
					<button className="editor-button">發布</button>
					<button className="editor-button" onClick={handleLogin}>
						登入
					</button>
				</div>
				{currentBlog === null ? <div className="editor-post editor-block">請選擇或建立一個草稿以開始編輯。</div> : <div className="editor-post editor-block" ref={editorRef}></div>}
			</div>
		</>
	);
}
