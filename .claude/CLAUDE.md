# 進行中專案紀錄 — CLAUDE.md

此檔案供 Claude Code 在每次 session 中快速掌握專案結構、規範與現況。

---

## 專案目的

公司內部工程進度文件系統。每份專案以 Word 草稿編寫，由 Claude Code 轉換為 HTML landing page，並以一份主頁（`index.html`）統整所有專案為目錄。

**使用對象：公司內部主管至總經理（年長使用者），字體可讀性為首要設計優先級。**

---

## 檔案結構

```
[進行中]專案紀錄/
├── index.html                  ← 主頁目錄（所有專案卡片列表）
├── assets/
│   └── logo.png                ← 毅豐 YU FENG logo（主頁與各內頁共用）
├── package.json                ← Node.js 依賴（playwright）
├── node_modules/               ← npm install 產生，勿手動修改
├── .claude/
│   └── CLAUDE.md               ← 本檔案
└── {專案名稱}/
    ├── index.html              ← 個別專案頁（月份Tab + 日期群組卡片格式，純網頁無列印 CSS）
    ├── project-info.js         ← 專案資料單一來源（階段、地點、時程、文件）← 必備
    ├── generate_pdf.js         ← PDF 輸出模組（獨立，與 index.html 分離）
    ├── 草稿/                   ← Word 草稿歸檔（生成 HTML 後移入）
    │   └── YYYYMMDD.docx
    ├── 照片/
    │   └── YYYYMMDD/
    │       └── *.jpg
    └── 專案文件/               ← 可瀏覽的 PDF / 圖檔文件（可依分類建子資料夾）
        └── {分類}/
            └── *.pdf
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

### 字體大小規範（年長使用者首要優先）

| 層級 | 最小值 | 說明 |
|------|--------|------|
| 主標題（卡片標題、專案名稱） | 22px（1.375rem） | |
| 工作項目標題 | 20px（1.25rem） | |
| 內文、標籤、導航 | 16px（1rem） | 所有一般文字的最低標準 |
| 次要輔助（索引、Lightbox 計數） | 14.4px（0.9rem） | 僅用於空間受限的 UI |
| 低對比色文字（輔助用） | `#7A6E63` 以上 | 禁用 `#A89E93` 作為文字色 |

---

## 主頁 index.html 規範

- Header：左側為 `assets/logo.png` 圖片（`<a href="index.html">` 包覆，點擊回主頁，height 44px），無文字標題
- 藍色統計列：專案總數 / 進行中 / 已完成
- 專案卡片 Grid（`minmax(320px, 1fr)`，gap 32px）
- 每張卡片顯示：專案名稱、當前階段標題（可點擊膠囊切換各階段）、階段專屬進度條、階段膠囊按鈕、最新更新日期
- 卡片底部：若 `project-info.js` 有 `documents` 欄位，顯示「📂 專案文件」全寬填色按鈕（取代原「查看詳情」）；點擊開啟底部抽屜；無 documents 欄位則無按鈕，點擊卡片本體仍可導向內頁
- 卡片為 `<div>`（非 `<a>`），由 `renderProject()` 動態生成，無需在 HTML 中手寫卡片結構
- 統計列（專案總數 / 進行中 / 已完成）由 JS 自動計算
- **進行中專案不顯示「進行中」badge**（階段膠囊已取代）；「已完成」/「暫停」專案保留 badge

### project-info.js 規範（每個專案必備）

```js
var {專案名稱} = {
  phases: [
    { name: '{階段名稱}', title: '{階段名稱} — {大分類}', start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' },
    // ... 其餘階段
  ],
  location: '{地點}',
  startDate: 'YYYY-MM-DD',   // 整體專案起始（供參考）
  endDate: 'YYYY-MM-DD',     // 整體專案結束（供參考）
  lastUpdate: 'YYYY/MM/DD',  // ← 新增 date-group 時必須同步更新
  documents: [               // ← 可選；有此欄位才顯示「專案文件」按鈕
    {
      category: '{分類名稱}',  // 顯示為抽屜內的區塊標題
      files: [
        { name: '{顯示名稱}', desc: '{1–2 句說明。}', file: '{相對於專案資料夾的路徑}', type: 'pdf' }
        // type: 'pdf' | 'image'
      ]
    }
  ]
};
```

**phases 欄位說明：**
- `name`：短名，顯示於階段膠囊按鈕（主頁卡片）
- `title`：長標題，格式 `{階段名稱} — {大分類}`，顯示於主頁卡片進度標題列
- `start` / `end`：該階段起迄日期，用於自動偵測當前階段與計算進度百分比

**當前階段自動偵測：** 主頁依今日日期自動判斷落在哪個 phase 的 start～end 範圍內，無需手動維護 `currentPhase`。延誤或提早時只需修改對應 phase 的 `end` 或 `start` 日期。

### 新增專案（僅需兩行）

卡片 HTML 由 `renderProject()` 動態生成，主頁 HTML 無需手寫卡片結構。新增專案只需：

**1. 在主頁 `</body>` 前加入 script 引用：**
```html
<script src="{專案名稱}/project-info.js"></script>
```

**2. 在 `renderProject` 呼叫列表加入（進行中省略第三參數）：**
```js
renderProject('{專案名稱}', {專案名稱});               // 進行中
renderProject('{專案名稱}', {專案名稱}, 'badge-done');  // 已完成
renderProject('{專案名稱}', {專案名稱}, 'badge-paused');// 暫停
```

統計列（專案總數 / 進行中 / 已完成）自動更新，無需手動修改。

---

## 個別專案頁規範

- Sticky Header：左側為 `../assets/logo.png` 圖片（`<a href="../index.html">` 包覆，height 44px），無返回文字、無分隔線、無專案名稱標題、無階段膠囊
- 月份 Tab 列：底線 active 樣式，JS 切換月份顯示（sticky header 第二層）
- 橫向日期膠囊列：< 1080px 時取代側邊索引，`overflow-x: auto`（sticky header 內）
- 側邊日期索引：`position: fixed`，> 1080px 時顯示，捲動自動 highlight
- 內容：以 `.date-group` 為單位，日期標題在上，task-item 卡片堆疊於下
- 照片支援 Lightbox（點擊圖片或背景關閉、Esc 關閉、← → 切換、底部顯示工作項目名稱）

### 內頁 header 範本

```html
<header>
  <a href="../index.html"><img src="../assets/logo.png" alt="毅豐專案紀錄" class="site-logo"></a>
</header>
```

CSS（各內頁獨立加入）：
```css
.site-logo { height: 44px; width: auto; display: block; }
```

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

**一個工作項目含多段描述（各有對應照片）：** 同一張卡片內，依序重複 `.task-desc` + `.task-images` 組合，無需額外 CSS。

```html
<div class="task-item">
  <div class="task-title">{精簡標題}</div>

  <div class="task-desc">{描述1，句末含句號}</div>
  <div class="task-images">...</div>

  <div class="task-desc">{描述2，句末含句號}</div>
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
| 大陸蘇州機械手臂 | 進行中 | 毅豐橡膠 | 2026/04/13 |

---

## 專案文件功能

主頁卡片底部的「📂 專案文件」按鈕，點擊後從畫面下方滑出底部抽屜（90% 高，不完全覆蓋主頁），顯示該專案的文件卡片。點擊文件卡片在全螢幕覆層中開啟 PDF 或圖片，關閉後回到抽屜。

### 新增文件至專案

在 `project-info.js` 的 `documents` 陣列中新增項目（可新增分類或在現有分類下加 files）。`file` 欄位填寫相對於**專案資料夾**的路徑，例如：

```js
{ name: '2026/03/19 專案進度檢討', desc: '大陸機械手臂專案進度檢討會議記錄。',
  file: '專案文件/會議記錄/會議記錄_20260319_大陸機械手臂專案進度檢討.pdf', type: 'pdf' }
```

實際檔案須放在對應路徑（`{專案名稱}/專案文件/{分類}/`）。

### 按鈕設計規範（年長使用者）

- 全寬填色藍（`#2563EB`）膠囊按鈕，高度 ~48px，font-size 1rem
- 位於 card-footer 獨立一行（日期在上、按鈕在下）
- 無文件時不顯示按鈕；卡片本體點擊仍可導向施工紀錄內頁

---

## 工作流程

1. 取得 Word 草稿（含照片）
2. 在專案資料夾建立 `index.html`（依上方規範）
3. 建立 `project-info.js`（填入 phases 物件陣列、地點、時程）
4. 將 Word 草稿移入 `草稿/` 子資料夾
5. 更新主頁 `index.html`：加入 script 引用 + `renderProject()` 呼叫（無需寫卡片 HTML）

### 調整階段時程（延誤 / 提早）

直接修改 `project-info.js` 中對應 phase 的 `start` / `end` 日期，主頁與內頁自動重新計算。**無需手動指定當前階段。**

### 新增施工紀錄（必須同步更新 lastUpdate）

新增 date-group 到內頁時，**必須同步更新 `project-info.js` 的 `lastUpdate` 為該施工日期**。
主頁卡片「最新更新」日期以此為唯一來源，無法自動跨檔案讀取，故此為強制規範。

> Claude Code 執行新增紀錄任務時，應自動完成 `lastUpdate` 的同步更新，不需使用者另行交代。

### PDF 輸出

每個專案資料夾內有獨立的 `generate_pdf.js`，依賴 playwright（需先執行 `npm install`）。

```bash
node {專案名稱}/generate_pdf.js
```

輸出格式：A4 橫向，每張 task-item 一頁，左欄標題 35% / 右欄圖片 65%。
