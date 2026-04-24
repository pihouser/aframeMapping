AFRAME.registerComponent('poi-label', {
  schema: {
    name: { type: 'string', default: 'Unknown City' }
  },

  init: function () {
    const el = this.el;
    const name = this.data.name;

    // Create label entity
    const label = document.createElement('a-entity');

    label.setAttribute('text', {
      value: name,
      align: 'center',
      width: 4,
      color: '#111'
    });

    label.setAttribute('position', '0 1.2 0');
    label.setAttribute('visible', 'false');

    // Optional background plane
    const bg = document.createElement('a-plane');
    bg.setAttribute('width', 2.5);
    bg.setAttribute('height', 0.6);
    bg.setAttribute('color', '#ffffff');
    bg.setAttribute('opacity', '0.8');
    bg.setAttribute('position', '0 0 0');
    bg.setAttribute('material', 'side: double');

    label.appendChild(bg);
    el.appendChild(label);

    // Simple marker (optional)
    el.setAttribute('geometry', 'primitive: sphere; radius: 0.1');
    el.setAttribute('material', 'color: red');

    // Events
    el.addEventListener('mouseenter', () => {
      label.setAttribute('visible', 'true');
    });

    el.addEventListener('mouseleave', () => {
      label.setAttribute('visible', 'false');
    });
  }
});
