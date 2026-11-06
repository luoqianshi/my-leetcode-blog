// 已按题解顺序记录的快照。只读，前进和回退都由同一帧重新绘制。
var scenarios = /*__SCENARIOS__*/;
var selected = 0;
var FRAME_MS = 2200;
var steps = framesFor(scenarios[0]);
var caseBar = document.getElementById('case-options');
var stateRows = document.getElementById('state-rows');
var stage = document.getElementById('stage');

function framesFor(example) {
  return example.steps.map(function (step, i) {
    return { caption: step[0], rows: step[1], previous: i ? example.steps[i - 1][1] : null,
      phase: i === example.steps.length - 1 ? 'result' : 'step' };
  });
}

function showExample() {
  document.getElementById('case-input').textContent = scenarios[selected].input;
  Array.from(caseBar.childNodes).forEach(function (button, i) {
    button.setAttribute('aria-pressed', String(i === selected));
  });
}

scenarios.forEach(function (scenario, i) {
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'case-option';
  button.textContent = (i === 0 ? '典型示例 · ' : '边界示例 · ') + scenario.name;
  button.addEventListener('click', function () {
    if (selected === i) return;
    reset();  // 先停掉旧用例的定时器
    selected = i;
    steps = framesFor(scenario);
    el.scrub.max = String(lastIdx());
    stage.scrollLeft = 0;
    showExample();
    go(0);
  });
  caseBar.appendChild(button);
});
showExample();

function updatePanHint() {
  document.getElementById('pan-hint').hidden = stage.scrollWidth <= stage.clientWidth + 1;
}
if ('ResizeObserver' in window) new ResizeObserver(updatePanHint).observe(stage);

function paint(frame) {
  if (typeof paintStructure === 'function') paintStructure(scenarios[selected], frame.rows);
  var rows = [];
  Object.entries(frame.rows).forEach(function (entry) {
    var label = entry[0], values = entry[1];
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.scope = 'row';
    th.textContent = label;
    tr.appendChild(th);
    var before = frame.previous && frame.previous[label];
    (values.length ? values : ['∅']).forEach(function (value, col) {
      var td = document.createElement('td');
      var cell = document.createElement('span');
      cell.className = 'state-cell';
      cell.textContent = value;
      if (frame.previous && (!before || before[col] !== value)) cell.classList.add('changed');
      td.appendChild(cell);
      tr.appendChild(td);
    });
    rows.push(tr);
  });
  stateRows.replaceChildren(...rows);
  var atEnd = frame.phase === 'result';
  document.getElementById('case-output').hidden = !atEnd;
  document.getElementById('case-result').textContent = atEnd ? scenarios[selected].result : '';
  updatePanHint();
}
