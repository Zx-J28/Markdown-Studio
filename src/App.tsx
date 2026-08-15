"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

const STARTER = `# 把想法写成作品

一个专注、轻盈的 **Markdown 工作台**。在左侧写作，在右侧看见最终效果。

## 现在就开始

- [x] 导入本地 Markdown 文件
- [x] 实时编辑与预览
- [ ] 写下你的下一个好想法

> 好的工具应该退到内容之后，让写作本身成为主角。

### 代码也很漂亮

\`\`\`javascript
const idea = "从一句话开始";
console.log(idea);
\`\`\`

| 功能 | 状态 |
| --- | --- |
| 实时预览 | 已就绪 |
| 本地导入 | 已就绪 |
| 导出文件 | 已就绪 |

---

试着修改这段文字，预览会立即更新。`;

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function inlineMarkdown(value: string) {
  const code: string[] = [];
  let html = escapeHtml(value).replace(/`([^`]+)`/g, (_, content: string) => {
    const token = `%%INLINE_CODE_${code.length}%%`;
    code.push(`<code>${content}</code>`);
    return token;
  });

  html = html
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>");

  code.forEach((item, index) => { html = html.replace(`%%INLINE_CODE_${index}%%`, item); });
  return html;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (/^```/.test(line.trim())) {
      const language = line.trim().slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) { code.push(lines[index]); index += 1; }
      output.push(`<div class="code-block"><span>${escapeHtml(language || "code")}</span><pre><code>${escapeHtml(code.join("\n"))}</code></pre></div>`);
      index += 1;
      continue;
    }

    const next = lines[index + 1] ?? "";
    if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(next)) {
      const rows: string[][] = [];
      const parseRow = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const headers = parseRow(line);
      index += 2;
      while (index < lines.length && lines[index].includes("|")) { rows.push(parseRow(lines[index])); index += 1; }
      output.push(`<div class="table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { const level = heading[1].length; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); index += 1; continue; }
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) { output.push("<hr />"); index += 1; continue; }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) { quote.push(lines[index].replace(/^>\s?/, "")); index += 1; }
      output.push(`<blockquote>${quote.map(inlineMarkdown).join("<br />")}</blockquote>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
        const item = lines[index].replace(/^\s*[-*+]\s+/, "");
        const task = item.match(/^\[([ xX])\]\s*(.*)$/);
        items.push(task ? `<li class="task"><input type="checkbox" ${task[1].toLowerCase() === "x" ? "checked" : ""} disabled /><span>${inlineMarkdown(task[2])}</span></li>` : `<li>${inlineMarkdown(item)}</li>`);
        index += 1;
      }
      output.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) { items.push(`<li>${inlineMarkdown(lines[index].replace(/^\s*\d+\.\s+/, ""))}</li>`); index += 1; }
      output.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (!line.trim()) { index += 1; continue; }
    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s+|^```|^>|^\s*[-*+]\s+|^\s*\d+\.\s+|^\s*(---+|\*\*\*+)\s*$/.test(lines[index])) { paragraph.push(lines[index].trim()); index += 1; }
    output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }
  return output.join("");
}

type InsertAction = { label: string; title: string; before: string; after?: string; placeholder?: string };
const ACTIONS: InsertAction[] = [
  { label: "H1", title: "一级标题", before: "# ", placeholder: "标题" },
  { label: "B", title: "粗体", before: "**", after: "**", placeholder: "粗体文字" },
  { label: "I", title: "斜体", before: "*", after: "*", placeholder: "斜体文字" },
  { label: "↗", title: "链接", before: "[", after: "](https://)", placeholder: "链接文字" },
  { label: "</>", title: "行内代码", before: "`", after: "`", placeholder: "code" },
  { label: "❝", title: "引用", before: "> ", placeholder: "引用内容" },
  { label: "•", title: "无序列表", before: "- ", placeholder: "列表项" },
  { label: "☑", title: "任务列表", before: "- [ ] ", placeholder: "待办事项" },
];

export default function Home() {
  const [markdown, setMarkdown] = useState(() => localStorage.getItem("md-studio-content") ?? STARTER);
  const [fileName, setFileName] = useState(() => localStorage.getItem("md-studio-file-name") ?? "未命名文档.md");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | { type: "new" | "pick" | "file"; file?: File }>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const lines = markdown.split("\n").length;

  useEffect(() => {
    localStorage.setItem("md-studio-content", markdown);
    localStorage.setItem("md-studio-file-name", fileName);
  }, [markdown, fileName]);

  const loadFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setMarkdown(String(reader.result ?? "")); setFileName(file.name); };
    reader.readAsText(file);
  };
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => { loadFile(event.target.files?.[0]); event.target.value = ""; };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setPendingAction({ type: "file", file });
  };

  const confirmReplace = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "new") {
      setMarkdown("");
      setFileName("未命名文档.md");
      requestAnimationFrame(() => editor.current?.focus());
    } else if (pendingAction.type === "pick") {
      fileInput.current?.click();
    } else {
      loadFile(pendingAction.file);
    }
    setPendingAction(null);
  };
  const insert = (action: InsertAction) => {
    const target = editor.current;
    if (!target) return;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const selected = markdown.slice(start, end) || action.placeholder || "";
    const addition = `${action.before}${selected}${action.after ?? ""}`;
    setMarkdown(markdown.slice(0, start) + addition + markdown.slice(end));
    requestAnimationFrame(() => { target.focus(); target.setSelectionRange(start + action.before.length, start + action.before.length + selected.length); });
  };
  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => { await navigator.clipboard.writeText(markdown); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };

  return (
    <main className={`app-shell ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
      <div className="drag-layer"><strong>释放以导入文档</strong><span>支持 .md 与纯文本文件</span></div>
      <header className="topbar">
        <div className="brand" aria-label="Markdown Studio"><span className="brand-mark">M<span>↓</span></span><div><strong>MARKDOWN</strong><small>STUDIO</small></div></div>
        <div className="document-name"><span className="status-dot" /><input aria-label="文档名称" value={fileName.replace(/\.md$/i, "")} onChange={(event) => setFileName(`${event.target.value}.md`)} /><span className="extension">.md</span></div>
        <div className="top-actions">
          <input ref={fileInput} hidden type="file" accept=".md,.markdown,text/markdown,text/plain" onChange={handleInput} />
          <button className="button secondary" onClick={() => setPendingAction({ type: "new" })}><span>＋</span> 新建文档</button>
          <button className="button secondary" onClick={() => setPendingAction({ type: "pick" })}><span>↑</span> 导入文件</button>
          <button className="button primary" onClick={download}>导出 <span>↓</span></button>
        </div>
      </header>

      <section className="intro-row">
        <div><p className="eyebrow">LOCAL-FIRST WRITING SPACE</p><h1>写作与预览<br /><em>同时发生。</em></h1></div>
        <p className="intro-copy">无需上传，所有内容仅在你的浏览器中处理。<br />导入、编辑，然后带走你的作品。</p>
      </section>

      <div className="mobile-switch" role="tablist" aria-label="视图切换"><button className={view === "edit" ? "active" : ""} onClick={() => setView("edit")}>编辑器</button><button className={view === "preview" ? "active" : ""} onClick={() => setView("preview")}>预览</button></div>

      <section className="workspace">
        <div className={`panel editor-panel ${view === "edit" ? "mobile-active" : ""}`}>
          <div className="panel-head"><div><span className="panel-index">01</span><strong>编辑器</strong></div><span className="live-label"><i /> AUTO SAVED</span></div>
          <div className="toolbar" aria-label="Markdown 格式工具">{ACTIONS.map((action) => <button key={action.title} title={action.title} onClick={() => insert(action)}>{action.label}</button>)}<span className="toolbar-space" /><button title="复制 Markdown" onClick={copy}>{copied ? "✓" : "⧉"}</button></div>
          <textarea ref={editor} aria-label="Markdown 编辑器" spellCheck="false" value={markdown} onChange={(event) => setMarkdown(event.target.value)} />
          <div className="panel-foot"><span>{lines} 行</span><span>{words} 词 · {markdown.length} 字符</span></div>
        </div>
        <div className={`panel preview-panel ${view === "preview" ? "mobile-active" : ""}`}>
          <div className="panel-head"><div><span className="panel-index">02</span><strong>实时预览</strong></div><span className="render-status"><i /> 已渲染</span></div>
          <article className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="panel-foot"><span>MARKDOWN / GFM</span><span>实时同步</span></div>
        </div>
      </section>
      <footer><span>MD STUDIO · BROWSER EDITION</span><span>你的文字，始终属于你。</span></footer>

      {pendingAction && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingAction(null); }}>
          <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <div className="modal-number">IMPORTANT / LOCAL</div>
            <div className="modal-icon">!</div>
            <h2 id="confirm-title">{pendingAction.type === "new" ? "新建空白文档？" : "导入新的文档？"}</h2>
            <p id="confirm-message">{pendingAction.type === "new" ? "新建文档会清空当前编辑器中的全部内容。请先导出需要保留的文件。" : "导入新文件会覆盖当前编辑器中的全部内容。请先导出需要保留的文件。"}</p>
            <div className="modal-actions">
              <button className="button secondary" onClick={() => setPendingAction(null)}>返回编辑</button>
              <button className="button danger" onClick={confirmReplace}>{pendingAction.type === "new" ? "确认新建" : "确认导入"}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
