# Pixel Vocab Game 👾

一個 8-bit Pixel Art 風格的詞彙學習與測驗 Web APP。

## 🛠 Tech Stack (技術堆疊)

- **前端框架：** React (Vite) + TypeScript
- **樣式與動畫：** Tailwind CSS v4 + Framer Motion
- **路由管理：** React Router v7
- **後端與資料庫：** Supabase (PostgreSQL + Auth)
- **視覺風格：** 8-bit Pixel Art (NES 風格，使用 Google Fonts: `DotGothic16`, `Press Start 2P`)

## ✅ 目前進度 (Current Progress)

- [x] **專案初始化**：使用 Vite 建立 React + TypeScript 專案 (`pixel-vocab-game`)。
- [x] **套件安裝**：完成 `@supabase/supabase-js`, `framer-motion`, `react-router-dom`, `@tailwindcss/vite` 等依賴安裝。
- [x] **基礎樣式設定**：
  - 於 `index.html` 引入 Pixel 字型 (`DotGothic16` 與 `Press Start 2P`)。
  - 於 `src/index.css` 完成 Tailwind v4 配置，定義 NES 經典色票與 `.pixel-border` 預設外框。
- [x] **系統架構設計**：
  - [確立了 Feature-based 資料夾結構](#資料夾架構-folder-structure)
  - [確立了 Supabase 資料庫 Schema 與 RLS 權限設計](#資料庫架構-supabase-schema)

## 📂 資料夾架構 (Folder Structure)

```text
src/
├── main.tsx
├── App.tsx
├── index.css            # Tailwind 引入與全域 CSS (NES 風格變數)
├── lib/                 # 外部資源設定 (如 Supabase Client)
├── components/          # 全域共用組件 (UI, Layout)
├── features/            # 核心功能模組 (Auth, Word-Bank, Flashcards, Quiz)
├── hooks/               # 全域共用 Hooks
└── types/               # TypeScript 型別定義
```

## 🗄 資料庫架構 (Supabase Schema)

目前設計了三個 Table 並啟用 Row Level Security (RLS) 保護資料：
1. **`words`**: 詞彙庫，包含單字、定義、詞性、例句及是否加入測驗的標籤 (`is_in_quiz`)。
2. **`card_sets`**: 卡片集/標籤，用於分類單字。
3. **`word_card_sets`**: 多對多關聯表，用於將單字加入至多個卡片集。

*(詳細建立語法存放於初始對話紀錄中，待部署至 Supabase 後台介面。)*

## 🚀 下一步 (Next Steps)

- [x] 設定 `Supabase` 客戶端與環境變數。
- [x] 實作全域佈局 (Navbar) 與路由 (頁面框架)。
- [ ] 實作核心 `UI` 元件庫 (`PixelButton`, `PixelInput`, `PixelCard`)。
- [x] 介接 Google OAuth 登入功能。
- [x] 開發詞彙庫 CRUD (新增、讀取、更新、刪除單字)。
- [x] 開發單字卡 (Flashcards) 刷卡介面。
- [x] 開發遊戲化測驗引擎 (Type A, Type B, Type C)。
