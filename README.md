# 🆔 Telegram Chat ID Finder (Cloudflare Worker)

[English](#english) | [简体中文](#简体中文)

---

<h2 id="english">English</h2>

A lightweight, serverless tool deployed on Cloudflare Workers to easily retrieve **Telegram Chat IDs** (numeric) and **Usernames**.

### ✨ Features
- **Serverless**: Runs entirely on Cloudflare Workers. No server required.
- **Privacy First**: Your Bot Token is sent directly from the Worker to Telegram. No intermediate data storage.
- **Multi-language Support**: 🇨🇳 Simplified Chinese, 🇹🇼 Traditional Chinese, 🇺🇸 English, 🇯🇵 Japanese (Auto-detects & persists selection).
- **User Friendly**: 
  - One-click copy for IDs.
  - Friendly error messages (e.g., when a chat is not found).
  - Supports checking by `@username`.

### 🚀 Deployment Guide

1. **Get the Code**: Copy the content of [`worker.js`](./worker.js) from this repository.
2. **Cloudflare Dashboard**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - Go to **Workers & Pages** -> **Create Application** -> **Create Worker**.
   - Name it (e.g., `get-tg-id`) and click **Deploy**.
3. **Paste Code**:
   - Click **Edit code**.
   - Delete the existing code in `worker.js`.
   - Paste the code you copied in Step 1.
4. **Deploy**: Click **Deploy** on the top right.
5. **Done**: Access your Worker URL!

### 📖 Usage
1. Enter your **Bot Token** (Get it from [@BotFather](https://t.me/BotFather)).
2. Enter the **Chat ID** or **Channel Username** (e.g., `@my_channel`).
   - *Note: For channels, the bot must be an Admin. For private chats, you must have started a conversation with the bot.*
3. Click **Send & Get ID**.

---

<h2 id="简体中文">简体中文</h2>

一个运行在 Cloudflare Workers 上的轻量级工具，用于快速获取 Telegram 的 **数字 Chat ID** 和 **Username**。

### ✨ 功能特点
- **无服务器架构**：直接部署在 Cloudflare Worker，无需购买服务器，免费额度足够个人使用。
- **隐私安全**：代码开源，数据直接从 Worker 请求 Telegram API，不经过任何第三方数据库。
- **多语言支持**：内置 🇨🇳 简体中文、🇹🇼 繁体中文、🇺🇸 英语、🇯🇵 日语（自动记忆上次选择）。
- **体验友好**：
  - 支持一键复制 ID。
  - 智能错误提示（例如输入了错误的用户名或 Bot 未入群）。
  - 支持通过 `@频道用户名` 反查数字 ID。

### 🚀 部署教程 (保姆级)

#### 第一步：准备代码
打开本仓库的 [`worker.js`](./worker.js) 文件，复制里面的所有代码。

#### 第二步：创建 Worker
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 点击左侧菜单的 **Workers & Pages**。
3. 点击 **Create Application** (创建应用) -> **Create Worker** (创建 Worker)。
4. 给它起个名字（例如 `get-tg-id`），然后点击 **Deploy** (部署)。

#### 第三步：粘贴代码
1. 部署完成后，点击 **Edit code** (编辑代码) 按钮。
2. **清空** 左侧编辑区内默认生成的代码。
3. **粘贴** 你在第一步复制的所有代码。
4. 点击右上角的 **Deploy** (部署) 按钮保存。

#### 第四步：开始使用
点击界面上的链接（通常是 `https://你的名字.workers.dev`）即可访问工具！

### 📖 使用说明

1. **Bot Token**: 输入从 [@BotFather](https://t.me/BotFather) 申请的 Token。
2. **目标对象**:
   - **获取频道的 ID**: 输入 `@频道用户名`（例如 `@google`）。
     - *注意：必须先将你的 Bot 添加为该频道的管理员，否则无法查看。*
   - **获取个人的 ID**: 输入你的 `@用户名`。
     - *注意：你必须先给 Bot 发送过一条消息，Bot 才能通过 API 找到你。*
3. 点击 **发送并获取 ID** 按钮。
4. 在结果区域点击 **复制** 按钮即可获得纯数字 ID。

### ❓ 常见问题

**Q: 提示 "未找到该目标 (Chat not found)"？**
A: 请检查以下几点：
1. 拼写是否正确？
2. 如果是频道 (Channel)，请确保 Bot 已经被拉入频道并设置为**管理员**。
3. 如果是个人用户，请确保该用户已经点击过 Bot 的 **Start** 或给 Bot 发送过消息。

**Q: Token 安全吗？**
A: 本工具是纯前端+Worker转发。Token 仅用于在 Cloudflare Worker 中向 Telegram 发起请求，不会被保存或上传到其他地方。你可以自行检查源码。

### 📄 License
[MIT License](./LICENSE)
