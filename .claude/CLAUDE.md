# 進行中專案紀錄 — CLAUDE.md

此檔案供 Claude Code 在每次 session 中快速掌握專案結構、規範與現況。

---

## 專案目的

公司內部工程進度文件系統。每份專案以 Word 草稿編寫，由 Claude Code 轉換為 HTML landing page，並以一份主頁（`index.html`）統整所有專案為目錄。

---

## 檔案結構

```
[進行中]專案紀錄/
├── index.html                  ← 主頁目錄（所有專案卡片列表）
├── .claude/
│   └── CLAUDE.md               ← 本檔案
└── {專案名稱}/
    ├── index.html              ← 個別專案頁（時間軸格式）
    ├── 草稿/                   ← Word 草稿歸檔（生成 HTML 後移入）
    │   └── YYYYMMDD.docx
    └── 照片/
        └── YYYYMMDD/
            └── *.jpg
```

---

## 設計規範

### 配色（暖底藍調，參考 Anthropic 官網風格）

| 元素 | 色碼 |
|------|------|
| 頁面背景 | `#F5F0E8` |
| 卡片 / Header 背景 | `#FDFAF6` |
| 邊框 / 分隔線 | `#E8E0D4` |
| 主文字 | `#1A1A1A` |
| 輔助文字 | `#7A6E63` |
| 摘要 / 次要文字 | `#5C4E43` |
| 強調藍（按鈕、連結、時間軸點） | `#2563EB` |
| 進行中標籤 | bg `#FEF3C7` / text `#92400E` |
| 完成標籤 | bg `#D1FAE5` / text `#065F46` |
| 暫停標籤 | bg `#FEE2E2` / text `#991B1B` |

### 字型
```css
font-family: system-ui, 'Microsoft JhengHei', '微軟正黑體', sans-serif;
```

---

## 主頁 index.html 規範

- Header：「進行中專案紀錄」+ 今日日期（JS 自動顯示）
- 藍色統計列：專案總數 / 進行中 / 已完成
- 專案卡片 Grid（`minmax(320px, 1fr)`）
- 每張卡片顯示：專案名稱、狀態標籤、摘要說明、最新更新日期、查看詳情連結

### 新增專案卡片範本

```html
<a class="project-card" href="{資料夾名稱}/index.html">
  <div class="card-top">
    <span class="card-title">{專案名稱}</span>
    <span class="badge badge-active">進行中</span>
  </div>
  <p class="card-summary">{一行摘要}</p>
  <div class="card-footer">
    <span class="card-meta">最新更新：{YYYY/MM/DD}</span>
    <span class="card-arrow">查看詳情 →</span>
  </div>
</a>
```

狀態標籤 class：`badge-active`（進行中）／`badge-done`（已完成）／`badge-paused`（暫停）

---

## 個別專案頁規範

- Header：返回目錄連結 `../index.html` + 專案名稱
- Info bar：狀態標籤、開始日期、地點
- 時間軸：垂直線 + 左側日期 + 右側 task-item 卡片
- 照片支援 Lightbox（點擊放大、Esc 關閉、← → 切換、底部顯示工作項目名稱）

### 新增時間軸節點範本

```html
<div class="timeline-entry">
  <div class="entry-date">
    <span class="date-text">YYYY<br>MM/DD</span>
  </div>
  <div class="entry-dot"></div>
  <div class="entry-content">

    <div class="task-item">
      <div class="task-title">{工作項目名稱}</div>
      <div class="task-images">
        <div class="img-wrapper">
          <img src="照片/YYYYMMDD/{檔名}.jpg" alt="{工作項目名稱}">
        </div>
      </div>
    </div>

  </div>
</div>
```

---

## 現有專案清單

| 專案名稱 | 狀態 | 地點 | 最新更新 |
|----------|------|------|----------|
| 大陸蘇州機械手臂 | 進行中 | 毅豐橡膠 | 2026/04/11 |

---

## 工作流程

1. 取得 Word 草稿（含照片）
2. 在專案資料夾建立 `index.html`（依上方規範）
3. 將 Word 草稿移入 `草稿/` 子資料夾
4. 更新主頁 `index.html` 的卡片（新增或修改摘要/日期/狀態）

---

## Session 變更紀錄

### 2026/04/10
- 建立整體 HTML 系統架構（主頁 + 第一個專案頁）
- 套用暖底藍調配色風格（參考 Anthropic 官網）
- 加入照片 Lightbox 彈窗功能（純 JS，離線可用）
- 建立 `草稿/` 資料夾規範，將 `20260410.docx` 歸檔
- 大陸蘇州機械手臂：地點更新為「毅豐橡膠」，摘要更新為當前組裝進度

### 2026/04/11
- 新增 04/11 時間軸節點：2號、3號配電箱初步裝配、RB-1底架初步裝配
- 04/10 描述修飾：卸貨定位、配電箱初步裝配作業
- 全站「電控箱」統一更名為「配電箱」
- 區塊標題「工程進度紀錄」改為「專案進度紀錄」
- CLAUDE.md 移至 `.claude/` 資料夾
- 推送至 GitHub：CCYu025/ProjectRecords，啟用 GitHub Pages
- GitHub Pages 網址：https://ccyu025.github.io/ProjectRecords/
- 字體無障礙優化（針對年長主管閱覽）：
  - 全站行高 1.6 → 1.8
  - 最小字體提升至 14px 以上，多數元素放大至 16–18px
  - 狀態標籤圓點 6px → 8px
  - 卡片 padding 24px → 28px，間距 20px → 24px
  - 時間軸日期欄加粗、欄寬 118px → 130px
  - 加入 `@media print` 列印樣式（橫向兩欄、隱藏 Lightbox）
