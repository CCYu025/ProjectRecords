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
├── package.json                ← Node.js 依賴（playwright）
├── node_modules/               ← npm install 產生，勿手動修改
├── .claude/
│   └── CLAUDE.md               ← 本檔案
└── {專案名稱}/
    ├── index.html              ← 個別專案頁（月份Tab + 日期群組卡片格式，純網頁無列印 CSS）
    ├── generate_pdf.js         ← PDF 輸出模組（獨立，與 index.html 分離）
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
| 強調藍（按鈕、連結、active 導航） | `#2563EB` |
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

- Sticky Header：SVG chevron 返回連結 + 專案名稱 + 狀態 badge 靠右（`position: sticky; top: 0; z-index: 100`）
- 月份 Tab 列：底線 active 樣式，JS 切換月份顯示（sticky header 第二層）
- 橫向日期膠囊列：< 1080px 時取代側邊索引，`overflow-x: auto`（sticky header 內）
- 側邊日期索引：`position: fixed`，> 1080px 時顯示，捲動自動 highlight
- 內容：以 `.date-group` 為單位，日期標題在上，task-item 卡片堆疊於下
- 照片支援 Lightbox（點擊圖片或背景關閉、Esc 關閉、← → 切換、底部顯示工作項目名稱）

### 用詞規範

| 項目 | 正確用詞 | 避免 |
|------|----------|------|
| 手臂設備 | 機械手臂 | 機器手臂 |
| 電控設備 | 配電箱 | 電控箱 |
| 底座結構 | 底架 | 底座、基架 |

### task-item 標題與描述規範

- 標題：精簡名詞式，英文縮寫與中文之間加空格（如 `RB-1 底架初步裝配`）
- 描述：一句話，動詞開頭，句末含句號（如 `完成 RB-1 機械手臂底架的初步裝配作業。`）
- 使用 `.task-desc` 元素，置於 `.task-title` 下方、`.task-images` 上方

```html
<div class="task-item">
  <div class="task-title">{精簡標題}</div>
  <div class="task-desc">{一句描述，句末含句號}</div>
  <div class="task-images">...</div>
</div>
```

### 新增日期紀錄範本

**① 側邊索引 + 膠囊列各加一行（`data-month` 對應所屬月份）：**
```html
<!-- 側邊索引（.date-index 內） -->
<a class="date-index-item" data-month="2026-04" href="#d20260412">04/12</a>

<!-- 橫向膠囊列（.date-chips 內） -->
<a class="date-chip" data-month="2026-04" href="#d20260412">04/12</a>
```

**② 對應月份的 `.month-section` 內加 `.date-group`：**
```html
<div class="date-group" id="d20260412">
  <div class="date-heading">2026 / 04 / 12</div>

  <div class="task-item">
    <div class="task-title">{精簡標題}</div>
    <div class="task-desc">{一句描述，句末含句號}</div>
    <div class="task-images">
      <div class="img-wrapper">
        <img src="照片/20260412/{檔名}.jpg" alt="{工作項目名稱}">
      </div>
    </div>
  </div>

</div>
```

**錨點 ID 規則：** `d` + 日期數字，例如 `2026/04/12` → `id="d20260412"`

### 新增月份範本

```html
<!-- sticky-header 月份 Tab 列加一顆按鈕 -->
<button class="month-tab" data-month="2026-05">2026 / 05</button>

<!-- 側邊索引加該月日期項目 -->
<a class="date-index-item" data-month="2026-05" href="#d20260503">05/03</a>

<!-- 橫向膠囊列加該月日期項目 -->
<a class="date-chip" data-month="2026-05" href="#d20260503">05/03</a>

<!-- main 內加新的 month-section（預設不顯示） -->
<div class="month-section" data-month="2026-05" style="display:none">
  <div class="date-group" id="d20260503">
    <div class="date-heading">2026 / 05 / 03</div>
    ...
  </div>
</div>
```

---

## 現有專案清單

| 專案名稱 | 狀態 | 地點 | 最新更新 |
|----------|------|------|----------|
| 大陸蘇州機械手臂 | 進行中 | 毅豐橡膠 | 2026/04/12 |

---

## 工作流程

1. 取得 Word 草稿（含照片）
2. 在專案資料夾建立 `index.html`（依上方規範）
3. 將 Word 草稿移入 `草稿/` 子資料夾
4. 更新主頁 `index.html` 的卡片（新增或修改摘要/日期/狀態）

### PDF 輸出

每個專案資料夾內有獨立的 `generate_pdf.js`，依賴 playwright（需先執行 `npm install`）。

```bash
node {專案名稱}/generate_pdf.js
```

輸出格式：A4 橫向，每張 task-item 一頁，左欄標題 35% / 右欄圖片 65%。
