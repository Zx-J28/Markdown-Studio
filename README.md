# Markdown Studio Local

一个在自己电脑上运行的 Markdown 编辑站。项目使用 React、TypeScript 与 Vite，不依赖远程服务，也不是 GitHub Pages 静态展示页。

![React](https://img.shields.io/badge/React-19-151713)
![Vite](https://img.shields.io/badge/Vite-Local-ff5c35)
[![License](https://img.shields.io/badge/license-MIT-d6ff3f)](https://github.com/Zx-J28/Markdown-Studio?tab=MIT-1-ov-file)

## 功能

- 在页面中直接新建空白 Markdown 文件
- 导入或拖入 `.md`、`.markdown` 和纯文本文件
- 新建或导入前弹窗提醒，防止意外覆盖当前内容
- 实时编辑与 Markdown 预览
- 标题、粗体、斜体、链接、引用、列表和代码快捷输入
- 支持代码块、表格、任务列表与分隔线
- 修改文件名并导出 `.md` 文件
- 自动将当前草稿保存在本机浏览器中，刷新页面后仍可恢复
- 所有文档仅在本机浏览器中处理，不会上传到服务器

## 环境要求

- Node.js 22.13 或更高版本
- npm 10 或更高版本

## 本地启动

下载或克隆项目后，在项目目录运行：

Windows CMD：

```bat
cd /d E:\markdown-studio-source-clean\Local-App
npm install
npm run dev
```

macOS、Linux 或已进入项目目录的终端：

```bash
npm install
npm run dev
```

终端会显示本地地址，默认是：

```text
http://127.0.0.1:5173
```

使用结束后，在终端按 `Ctrl + C` 停止本地服务。

## 构建本地版本

```bash
npm run build
npm run preview
```

构建结果位于 `dist` 目录。该目录属于生成文件，不需要提交到 GitHub。

## 上传到 GitHub

GitHub 仅用于保存和分享本项目源码，不负责直接运行编辑器：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Zx-J28/Markdown-Studio.git
git push -u origin main
```

请使用 Git 命令提交项目。`node_modules`、`dist` 和本地缓存已写入 `.gitignore`，不应上传到仓库。

其他用户克隆仓库后，同样运行 `npm install` 和 `npm run dev` 即可在本机使用。

## 项目结构

```text
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## License

[点击查看 MIT License](https://github.com/Zx-J28/Markdown-Studio?tab=MIT-1-ov-file)
