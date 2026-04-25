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
├── package.json                ← Node.js 依賴（playwright、sharp）
├── node_modules/               ← npm install 產生，勿手動修改
├── .claude/
│   └── CLAUDE.md               ← 本檔案
└── {專案名稱}/
    ├── index.html              ← 個別專案頁（月份Tab + 日期群組，由 records.js 動態渲染）
    ├── project-info.js         ← 專案資料單一來源（階段、地點、時程、文件）← 必備
    ├── records.js              ← 施工紀錄資料模組（新增紀錄唯一需要修改的檔案）← 必備
    ├── generate_pdf.js         ← PDF 輸出模組（獨立，與 index.html 分離）
    ├── convert_webp.js         ← JPG → WebP 批次轉換腳本（node convert_webp.js）
    ├── 草稿/                   ← Word 草稿歸檔（生成 HTML 後移入）
    │   └── YYYYMMDD.docx
    ├── 照片/
    │   └── YYYYMMDD/
    │       ├── *.webp          ← 網頁使用（git 追蹤）
    │       └── *.jpg           ← 原始檔，本地保留，.gitignore 排除
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
- 卡片底部按鈕列：`hasRecords: true` 顯示「📋 專案紀錄」；`documents` 欄位顯示「📂 專案文件」；兩顆均為外框樣式（`#2563EB` 邊框，透明底），並排於 `.card-footer-btns`
- **卡片本體不可點擊**，僅透過底部按鈕操作
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
  hasRecords: true,          // ← 有 records.js 時加此欄位，顯示「專案紀錄」按鈕
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

- **無 Header**：內頁頂部不含 logo 或返回連結（主頁透過「專案紀錄」按鈕以 iframe 抽屜開啟）
- **捲動行為**：`html { scroll-behavior: smooth; }` — 統一所有 anchor 日期跳轉為平滑捲動，與月份切換 `smooth` 行為一致；在 `<style>` 最上方宣告
- 月份 Tab 列：底線 active 樣式，JS 切換月份顯示（sticky header 第一層，也是頂部）
- 橫向日期膠囊列：< 1080px 時取代側邊索引，`overflow-x: auto`（sticky header 內）
- 側邊日期索引：`position: fixed`，> 1080px 時顯示，捲動自動 highlight
- 內容：以 `.date-group` 為單位，日期標題在上，task-item 卡片堆疊於下
- 照片支援 Lightbox（點擊圖片或背景關閉、Esc 關閉、← → 切換、底部顯示工作項目名稱）
- **不需引入 `project-info.js`**：內頁不做階段顯示，僅靠 `records.js` 渲染

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

### 新增日期紀錄

**只需在 `records.js` 新增物件**，月份 Tab、側邊索引、日期膠囊、內容全部自動生成，無需手寫任何 HTML。格式見「新增施工紀錄」章節。

---

## 現有專案清單

| 專案名稱 | 狀態 | 地點 | 最新更新 |
|----------|------|------|----------|
| 大陸蘇州機械手臂 | 進行中 | 毅豐橡膠 | 2026/04/24 |

---

## 卡片底部按鈕功能

主頁卡片底部最多有兩顆按鈕並排（`.card-footer-btns`），均為外框樣式（`#2563EB` 邊框，`height: 48px`，膠囊圓角）：

| 按鈕 | 觸發條件 | 行為 |
|------|----------|------|
| 📋 專案紀錄 | `hasRecords: true` | 底部抽屜 iframe 載入 `{專案名稱}/index.html` |
| 📂 專案文件 | `documents` 欄位存在 | 底部抽屜顯示文件卡片，點擊開啟全螢幕覆層 |

### 專案紀錄抽屜（方案 B — iframe）

點擊「📋 專案紀錄」→ 93vh 底部抽屜滑出，內部以 `<iframe>` 直接載入內頁。
所有月份 Tab、日期導覽、Lightbox 功能由**內頁自帶**，主頁無需額外渲染邏輯。
支援拖曳關閉（向下拖 > 120px）與 ESC 關閉。

### 專案文件抽屜

點擊「📂 專案文件」→ 底部抽屜顯示文件卡片。在 `project-info.js` 的 `documents` 陣列中新增項目。`file` 欄位填寫相對於**專案資料夾**的路徑，例如：

```js
{ name: '2026/03/19 專案進度檢討', desc: '大陸機械手臂專案進度檢討會議記錄。',
  file: '專案文件/會議記錄/會議記錄_20260319_大陸機械手臂專案進度檢討.pdf', type: 'pdf' }
```

實際檔案須放在對應路徑（`{專案名稱}/專案文件/{分類}/`）。行動裝置 PDF 自動以新分頁開啟。

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

**施工紀錄以 `records.js` 為唯一來源，不需修改內頁 `index.html`。**

1. 在 `{專案名稱}/records.js` 陣列末尾新增日期物件（格式如下）
2. 同步更新 `project-info.js` 的 `lastUpdate` 為該施工日期

月份 Tab、日期膠囊、側邊索引、主頁抽屜全部自動生成，無需手動維護任何 HTML。

#### records.js 新增日期格式

```js
{
  month: 'YYYY-MM',          // 月份分組（如 '2026-05'）
  date:  'YYYY-MM-DD',       // 完整日期（如 '2026-05-03'）
  label: 'YYYY / MM / DD',   // 顯示用（如 '2026 / 05 / 03'）
  tasks: [
    {
      title: '{精簡標題}',
      sections: [
        {
          desc: '{一句描述，句末含句號}',
          images: [
            { src: '照片/YYYYMMDD/{檔名}.webp', alt: '{工作項目名稱}' }
          ]
        }
        // 一個 task 含多段描述時重複此物件
      ]
    }
    // 同一日期多個工作項目時重複此物件
  ]
}
```

> Claude Code 執行新增紀錄任務時，應自動完成 `lastUpdate` 的同步更新，不需使用者另行交代。

> **注意：** 插入新日期物件前，必須在**前一筆物件的結尾 `}` 後加上逗號**（`,`），否則 JS 陣列語法錯誤。新增完成後須以 `node -e "require('./records.js')"` 驗證語法。

### 新增照片（JPG → WebP 轉換）

收到 JPG 照片後的完整流程：

1. 將 JPG 放入 `{專案名稱}/照片/YYYYMMDD/`
2. 執行轉換（自動掃描所有子資料夾，包含新日期）：
   ```bash
   node {專案名稱}/convert_webp.js
   ```
3. `records.js` 的圖片路徑填 `.webp`（如 `照片/20260510/IMG_001.webp`）
4. commit 時 JPG 自動被 `.gitignore` 排除，只推送 `.webp`

**注意：** `.gitignore` 已設定 `**/照片/**/*.jpg`，JPG 永不進入 git。原始 JPG 保留於本地，確認顯示正常後可手動刪除。

### PDF 輸出

每個專案資料夾內有獨立的 `generate_pdf.js`，依賴 playwright（需先執行 `npm install`）。

```bash
node {專案名稱}/generate_pdf.js
```

輸出格式：A4 橫向，每張 task-item 一頁，左欄標題 35% / 右欄圖片 65%。

---

## 行動端觸控規範（已修正的已知問題）

### 主頁抽屜拖曳關閉（`index.html`）

- **body + html overflow 鎖定**：抽屜開啟時同時設 `document.documentElement.style.overflow = 'hidden'` 與 `document.body.style.overflow = 'hidden'`，關閉時恢復 `''`。`overscrollBehavior: none` 只防 rubber-band，不阻止 body 正常捲動；iOS Safari 需同時鎖 `html` 才有效。
- **backdrop `touch-action: none`**：`.doc-backdrop.open` / `.rec-backdrop.open` 加 `touch-action: none`，防止拖曳深色遮罩區域時 body 被捲動。
- **handle（拖曳條）**：`touchstart` 使用 `{ passive: false }` + `e.preventDefault()`。handle 無子互動元素，可安全阻止 overscroll 接管手勢。
- **header（標題列，含關閉按鈕）**：`touchstart` 使用 `{ passive: false }` **不呼叫** `e.preventDefault()`。若呼叫 `preventDefault`，`touchstart` 事件冒泡至 header 時會取消子元素（關閉按鈕）的後續 `click` 事件，導致按鈕失效。

```js
handle.addEventListener('touchstart', function(e) { e.preventDefault(); dragStart(e.touches[0].clientY); }, { passive: false });
hdr.addEventListener('touchstart', function(e) { dragStart(e.touches[0].clientY); }, { passive: false });
```

### 個別專案頁日期膠囊導航（`{專案名稱}/index.html`）

- **開啟預設最新日期**：頁面載入完成後，自動切換到最後一個月份 tab，並以 `instant` scroll 跳轉至該月最後一個 date-group（即最新施工紀錄）。`currentNavHref` 同步設定，防止 IntersectionObserver 覆蓋初始 active 狀態。
- **`e.preventDefault()` on chip/index click**：日期膠囊與側邊索引為 `<a>` 元素，搭配 `html { scroll-behavior: smooth }` 每次點擊會發起原生 anchor smooth scroll。快速連點會堆積多個動畫佇列，導致 iOS Safari 凍結 touch 事件。加 `e.preventDefault()` 後由 JS 統一控制捲動。
- **中斷並重導向**：`lockNav` 不設點擊守衛。每次點擊先呼叫 `window.scrollTo({ top: window.scrollY, behavior: 'instant' })` 取消進行中的動畫，再執行新的 `scrollIntoView({ behavior: 'smooth' })`，實現即時響應。
- **同目標忽略**：`currentNavHref` 追蹤當前導航目標。捲動進行中再次點擊相同目標直接 `return`，讓動畫繼續執行到終點。在同一 JS 幀內對同目標連發 instant + smooth 兩個指令，iOS Safari 會靜默丟棄 smooth，導致頁面停在半路。
- **`isNavigating` 旗標**：僅用於擋住 IntersectionObserver（防止捲動中 observer 覆蓋 active highlight），不再阻擋使用者點擊。搭配 `clearTimeout(navTimer)` 避免計時器累積；600ms 後同時清除 `isNavigating` 與 `currentNavHref`。
- **月份 Tab 點擊**：呼叫 `window.scrollTo` 前先設 `isNavigating = true`，防止 observer 在捲動回頂部過程中反覆觸發 `scrollIntoView`。
- **`.doc-sheet-body` `overscroll-behavior: contain`**：捲到邊界時阻斷捲動鏈傳，防止繼續傳至 body。
- **日期膠囊水平置中（`scrollChipToCenter`）**：active chip 切換時（頁面開啟、點擊膠囊、IntersectionObserver 觸發），呼叫 `scrollChipToCenter(chip)` 將 active chip 平滑捲動至 `.date-chips` 容器水平中央。計算公式：`chip.offsetLeft - container.offsetWidth/2 + chip.offsetWidth/2`。**不使用 `scrollIntoView({ inline: 'center' })`**，因為該方法以 viewport 為基準置中，而非容器，在 sticky header 內會產生錯位。桌機（> 1080px）chip 容器為 `display: none`，函式取不到容器直接 return，無副作用。
