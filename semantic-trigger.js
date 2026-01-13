AFRAME.registerComponent('semantic-trigger', {
  schema: {
    label: { type: 'string', default: 'POI' }
  },

  init: function () {
    const el = this.el;

    /* ---------- LABEL ---------- */
    const label = document.createElement('a-entity');
    label.setAttribute('text', {
      value: this.data.label,
      color: '#FFFFFF',
      align: 'center',
      width: 4
    });
    label.setAttribute('position', '0 0.25 0');
    label.setAttribute('look-at', '[camera]');
    label.setAttribute('visible', false);
    label.classList.add('no-ray');

    el.appendChild(label);

    /* ---------- VISUAL HELPERS ---------- */
    const show = () => {
      el.setAttribute('color', '#FF0000');
      label.setAttribute('visible', true);
    };

    const hide = () => {
      el.setAttribute('color', '#4CC3D9');
      label.setAttribute('visible', false);
    };

    /* ---------- HOVER EVENTS ---------- */
    // Mouse ray
    el.addEventListener('mouseover', show);
    el.addEventListener('mouseout', hide);

    // VR / gaze ray
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);

    /* ---------- CLICK ---------- */
    el.addEventListener('click', async () => {
      const uri = el.getAttribute('data-uri');
      console.log('POI clicked:', uri);

      const query = `
        PREFIX www: <http://www.semanticweb.org/pear/ontologies/2026/0/11-gis>
        SELECT DISTINCT ?x
        WHERE {
          <${uri}> www:hasFeature ?x .
        }
      `;

      try {
        const res = await fetch('https://sparql.pihouser.com/dnd/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
          },
          body: query
        });

        const json = await res.json();
        console.log('Fuseki response:', json);

        el.setAttribute('color', '#BD24FF');
      } catch (err) {
        console.error('Fuseki error:', err);
        el.setAttribute('color', '#FB24FF');
      }
    });
  }
});
