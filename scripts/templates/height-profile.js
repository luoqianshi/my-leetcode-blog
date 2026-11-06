function paintStructure(example, rows) {
  var chart = document.createElement('div');
  chart.className = 'height-chart';
  chart.setAttribute('role', 'img');
  chart.setAttribute('aria-label', '高度为 ' + example.heights.join('、') +
    (rows['各处积水'] ? '，各处积水 ' + rows['各处积水'].join('、') : ''));
  var max = Math.max(1, ...example.heights);
  // 柱状图最大矩形在原数组末尾追加 0；其栈下标也可能指向这根哨兵柱。
  var heights = rows['栈下标'] ? example.heights.concat(0) : example.heights;
  heights.forEach(function (h, i) {
    var column = document.createElement('div');
    column.className = 'height-column';
    var marker = rows['指针'] ? rows['指针'][i] : '';
    if (rows['栈下标'] && rows['栈下标'].includes(i)) marker = '栈内';
    var pointer = document.createElement('span');
    pointer.textContent = (i === example.heights.length ? '哨兵 0' : String(h)) + (marker ? ' · ' + marker : '');
    var bar = document.createElement('span');
    bar.className = 'height-bar';
    bar.style.height = (h * 58 / max) + 'px';
    var water = rows['各处积水'] && rows['各处积水'][i];
    if (water) {
      var fill = document.createElement('span');
      fill.className = 'water-bar';
      fill.style.height = (water * 58 / max) + 'px';
      column.appendChild(fill);
    }
    column.appendChild(bar);
    column.appendChild(pointer);
    chart.appendChild(column);
  });
  document.getElementById('structure').replaceChildren(chart);
}
