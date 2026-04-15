/* ──────────────────────────────────────────────────────
   大陸蘇州機械手臂 — 施工紀錄資料模組
   新增紀錄：在此陣列末尾加入日期物件，並更新 project-info.js 的 lastUpdate
   ────────────────────────────────────────────────────── */

var 大陸蘇州機械手臂Records = [
  {
    month: '2026-04',
    date:  '2026-04-10',
    label: '2026 / 04 / 10',
    tasks: [
      {
        title: '機械手臂進廠抵位',
        sections: [
          {
            desc: '設備運抵毅豐橡膠廠內並確認擺放定位。',
            images: [
              { src: '照片/20260410/S__25829379.jpg', alt: '機械手臂設備抵達廠內' }
            ]
          }
        ]
      }
    ]
  },
  {
    month: '2026-04',
    date:  '2026-04-11',
    label: '2026 / 04 / 11',
    tasks: [
      {
        title: '2號、3號配電箱初步裝配',
        sections: [
          {
            desc: '完成2號與3號配電箱的初步裝配作業。',
            images: [
              { src: '照片/20260411/S__25878531_0.jpg', alt: '2號、3號配電箱初步裝配' }
            ]
          }
        ]
      },
      {
        title: 'RB-1 底架初步裝配',
        sections: [
          {
            desc: '完成 RB-1 機械手臂底架的初步裝配作業。',
            images: [
              { src: '照片/20260411/S__25878532_0.jpg', alt: 'RB-1底架初步裝配' }
            ]
          }
        ]
      },
      {
        title: 'RB-2 底架初步組立',
        sections: [
          {
            desc: '完成 RB-2 機械手臂與軌道台座的初步組立作業。',
            images: [
              { src: '照片/20260411/S__25911300_0.jpg', alt: 'RB-2 底架初步組立' }
            ]
          }
        ]
      }
    ]
  },
  {
    month: '2026-04',
    date:  '2026-04-13',
    label: '2026 / 04 / 13',
    tasks: [
      {
        title: '標記作業完成',
        sections: [
          {
            desc: '完成各設備安裝定位基準地線的標記 (Marking) 作業。',
            images: [
              { src: '照片/20260413/S__25952272_0.jpg', alt: '標記作業完成' },
              { src: '照片/20260413/S__25952264_0.jpg', alt: '標記作業完成' },
              { src: '照片/20260413/S__25952294_0.jpg', alt: '標記作業完成' }
            ]
          },
          {
            desc: '完成 C1、C2 加硫設備的地線與高度基準線標記，待磐石加硫設備進廠後定位。',
            images: [
              { src: '照片/20260413/S__25952300_0.jpg', alt: '標記作業完成' },
              { src: '照片/20260413/S__25952295_0.jpg', alt: '標記作業完成' },
              { src: '照片/20260413/S__25952299_0.jpg', alt: '標記作業完成' },
              { src: '照片/20260413/S__25952302_0.jpg', alt: '標記作業完成' }
            ]
          }
        ]
      }
    ]
  }
  /* ← 新增日期時在此加物件，格式如上 */
];

/* ──────────────────────────────────────────────────────
   renderRecordsInto(records, basePath, containers)
   共用渲染函式，內頁與主頁抽屜共用。

   containers = {
     tabsEl:  目標月份 Tab 容器 (.month-tabs 或 .rec-month-tabs)
     chipsEl: 目標日期膠囊容器 (.date-chips 或 .rec-date-chips)
     indexEl: 目標側邊索引容器 (.date-index) — 傳 null 時略過
     mainEl:  目標內容容器 (main 或 .rec-main)
   }
   basePath: 圖片路徑前綴，內頁傳 ''，主頁抽屜傳 '大陸蘇州機械手臂/'
   ────────────────────────────────────────────────────── */
function renderRecordsInto(records, basePath, containers) {
  var tabsEl  = containers.tabsEl;
  var chipsEl = containers.chipsEl;
  var indexEl = containers.indexEl;
  var mainEl  = containers.mainEl;

  /* 月份去重（保持順序）*/
  var months = [];
  records.forEach(function(r) {
    if (months.indexOf(r.month) === -1) months.push(r.month);
  });

  /* ── 月份 Tab ── */
  months.forEach(function(m, mi) {
    var btn = document.createElement('button');
    btn.className = 'month-tab' + (mi === 0 ? ' active' : '');
    btn.dataset.month = m;
    btn.textContent = m.replace('-', ' / ');
    tabsEl.appendChild(btn);
  });

  /* ── 日期膠囊 + 側邊索引 ── */
  records.forEach(function(r, i) {
    var dateId    = 'd' + r.date.replace(/-/g, '');
    var shortLabel = r.label.slice(7); /* "04 / 10" */

    var chip = document.createElement('a');
    chip.className = 'date-chip' + (i === 0 ? ' active' : '');
    chip.dataset.month = r.month;
    chip.href = '#' + dateId;
    chip.textContent = shortLabel;
    chipsEl.appendChild(chip);

    if (indexEl) {
      var idx = document.createElement('a');
      idx.className = 'date-index-item' + (i === 0 ? ' active' : '');
      idx.dataset.month = r.month;
      idx.href = '#' + dateId;
      idx.textContent = shortLabel;
      indexEl.appendChild(idx);
    }
  });

  /* ── 主內容（month-section > date-group > task-item）── */
  months.forEach(function(m, mi) {
    var section = document.createElement('div');
    section.className = 'month-section';
    section.dataset.month = m;
    if (mi > 0) section.style.display = 'none';

    records.filter(function(r) { return r.month === m; }).forEach(function(r) {
      var dateId = 'd' + r.date.replace(/-/g, '');
      var group  = document.createElement('div');
      group.className = 'date-group';
      group.id = dateId;

      var heading = document.createElement('div');
      heading.className = 'date-heading';
      heading.textContent = r.label;
      group.appendChild(heading);

      r.tasks.forEach(function(task) {
        var item = document.createElement('div');
        item.className = 'task-item';

        var title = document.createElement('div');
        title.className = 'task-title';
        title.textContent = task.title;
        item.appendChild(title);

        task.sections.forEach(function(sec) {
          var desc = document.createElement('div');
          desc.className = 'task-desc';
          desc.textContent = sec.desc;
          item.appendChild(desc);

          if (sec.images && sec.images.length) {
            var imgsEl = document.createElement('div');
            imgsEl.className = 'task-images';
            sec.images.forEach(function(imgData) {
              var wrapper = document.createElement('div');
              wrapper.className = 'img-wrapper';
              var img = document.createElement('img');
              img.src = basePath + imgData.src;
              img.alt = imgData.alt;
              wrapper.appendChild(img);
              imgsEl.appendChild(wrapper);
            });
            item.appendChild(imgsEl);
          }
        });

        group.appendChild(item);
      });
      section.appendChild(group);
    });
    mainEl.appendChild(section);
  });
}
