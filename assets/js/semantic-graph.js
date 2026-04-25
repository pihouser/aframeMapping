// 🔥 FORCE RE-REGISTER COMPONENT
if (AFRAME.components['semantic-graph']) {
  delete AFRAME.components['semantic-graph'];
}

AFRAME.registerComponent('semantic-graph', {
  init: function () {
    console.log("✅ semantic-graph INIT (NEW VERSION)");
    this.scene = this.el;
  },

  clearGraph: function () {
    document.querySelectorAll('.semantic-node, .semantic-edge')
      .forEach(el => el.remove());
  },

  renderGraph: function (originEl, bindings) {
    console.log("🔥 renderGraph CALLED");

    this.clearGraph();

    const origin = originEl.getAttribute('position');

    let i = 0;
    const radius = 1.5;

    bindings.forEach((b) => {
      const label = b.o.value.split('#').pop();

      const angle = (i * 2 * Math.PI) / bindings.length;

      const x = origin.x + radius * Math.cos(angle);
      const z = origin.z + radius * Math.sin(angle);
      const y = origin.y + 0.3;

      i++;

      const node = document.createElement('a-sphere');
      node.setAttribute('position', `${x} ${y} ${z}`);
      node.setAttribute('radius', '0.1');
      node.setAttribute('color', '#00FFFF');
      node.classList.add('semantic-node');

      const text = document.createElement('a-entity');
      text.setAttribute('text', {
        value: label,
        align: 'center',
        width: 3,
        color: '#FFF'
      });
      text.setAttribute('position', '0 0.2 0');
      text.setAttribute('look-at', '[camera]');
      node.appendChild(text);

      this.scene.appendChild(node);

      const line = document.createElement('a-entity');
      line.setAttribute('line', {
        start: `${origin.x} ${origin.y} ${origin.z}`,
        end: `${x} ${y} ${z}`,
        color: '#888'
      });
      line.classList.add('semantic-edge');

      this.scene.appendChild(line);
    });

    console.log("🎯 GRAPH RENDERED:", i);
  }
});
