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

## Release 便携版

不想安装开发环境的用户，可以从 [GitHub Releases](https://github.com/Zx-J28/Markdown-Studio/releases) 下载对应平台的便携包：

| 平台 | Release 附件 | 启动方式 | 额外要求 |
| --- | --- | --- | --- |
| Windows 10/11 | `Markdown-Studio-v1.0.0-Windows-Portable.zip` | 解压后双击 `Start-Markdown-Studio.bat` | 无 |
| macOS 11+ | `Markdown-Studio-v1.0.0-macOS-Portable.zip` | 解压后双击 `Start-Markdown-Studio.command` | Python 3 |
| Linux x64 | `Markdown-Studio-v1.0.0-Linux-Portable.tar.gz` | 解压后运行 `./Start-Markdown-Studio.sh` | Python 3 |

Windows 便携版不需要安装 Node.js、npm 或其他依赖。macOS 和 Linux 版本使用系统中的 Python 3 启动本地服务；Apple Silicon 与 Intel Mac 均可使用同一个包。

所有便携版都会在本机 `127.0.0.1` 上启动服务并自动打开默认浏览器。关闭启动终端或按 `Control+C` 即可停止应用。

### macOS 首次运行

如果 macOS 阻止启动，请按住 `Control` 点击 `Start-Markdown-Studio.command`，选择“打开”并确认一次。

### Linux 首次运行

如果启动脚本没有执行权限，请运行：

```bash
chmod +x Start-Markdown-Studio.sh
./Start-Markdown-Studio.sh
```

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
