/* 层序数组跳过空节点的孩子。按中序分配横坐标，单侧子树也能看出左右方向。 */
function paintStructure(example) {
  var structure = document.getElementById('structure');
  if (structure.dataset.example === example.name) return;
  structure.dataset.example = example.name;
  var values = example.tree;
  if (!values.length) {
    structure.textContent = '输入树为空';
    return;
  }
  var nodes = [{ value: values[0], depth: 0 }];
  var cursor = 1;
  for (var i = 0; cursor < values.length; i++) {
    var parent = nodes[i];
    for (var side of ['left', 'right']) {
      var value = values[cursor++];
      if (value == null) continue;
      var child = { value: value, depth: parent.depth + 1 };
      parent[side] = child;
      nodes.push(child);
    }
  }
  var col = 0;
  function position(node) {
    if (!node) return;
    position(node.left);
    node.x = 22 + col++ * 36;
    node.y = 21 + node.depth * 47;
    position(node.right);
  }
  position(nodes[0]);

  function element(tag, attributes) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
    return el;
  }
  var width = col * 36 + 8, height = nodes[nodes.length - 1].y + 21;
  var svg = element('svg', { width: width, height: height, viewBox: '0 0 ' + width + ' ' + height,
    role: 'img', 'aria-label': '输入树，层序 ' + JSON.stringify(values) });
  nodes.forEach(function (node) {
    for (var child of [node.left, node.right]) {
      if (child) svg.appendChild(element('line', { x1: node.x, y1: node.y, x2: child.x, y2: child.y, class: 'tree-edge' }));
    }
  });
  nodes.forEach(function (node) {
    svg.appendChild(element('circle', { cx: node.x, cy: node.y, r: 16, class: 'tree-node' }));
    var label = element('text', { x: node.x, y: node.y, dy: '0.35em', 'text-anchor': 'middle', class: 'tree-value' });
    label.textContent = node.value;
    svg.appendChild(label);
  });
  structure.replaceChildren(svg);
}
