const SPARQL_ENDPOINT = "http://69.48.163.69:3030/dnd/query";

AFRAME.registerComponent('semantic-trigger', {
  schema: {
    label: { type: 'string', default: 'POI' }
  },

  init: function () {
    const el = this.el;

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

    const show = () => {
      el.setAttribute('color', '#FF0000');
      label.setAttribute('visible', true);
    };

    const hide = () => {
      el.setAttribute('color', '#4CC3D9');
      label.setAttribute('visible', false);
    };

    const setOutputMessage = (output, title, message) => {
      output.replaceChildren();

      const heading = document.createElement('b');
      heading.textContent = title;
      output.appendChild(heading);
      output.appendChild(document.createElement('br'));

      const body = document.createElement('span');
      body.textContent = message;
      output.appendChild(body);
    };

    const renderResults = (output, uri, bindings) => {
      output.replaceChildren();

      const heading = document.createElement('b');
      heading.textContent = 'Semantic Data';
      output.appendChild(heading);
      output.appendChild(document.createElement('br'));

      const uriCode = document.createElement('code');
      uriCode.textContent = uri;
      output.appendChild(uriCode);

      const section = document.createElement('div');
      section.style.marginTop = '8px';
      section.style.maxHeight = '200px';
      section.style.overflow = 'auto';

      const predicateLabels = {
        hasRegion: 'Region',
        hasFaction: 'Faction',
        connectedTo: 'Connected To'
      };

      const ignoredNamespaces = ['rdf-syntax-ns#', '/owl#'];
      const ignoredPredicates = new Set(['type', 'label', 'comment', 'seeAlso', 'sameAs']);

      const getLocalName = (iri) => {
        if (!iri) return '';
        const hash = iri.lastIndexOf('#');
        const slash = iri.lastIndexOf('/');
        const idx = Math.max(hash, slash);
        return idx >= 0 ? iri.slice(idx + 1) : iri;
      };

      const grouped = {
        Region: [],
        Faction: [],
        'Connected To': []
      };

      bindings.forEach((binding) => {
        const predicate = binding.p?.value || '';
        const localName = getLocalName(predicate);

        const isIgnoredNamespace = ignoredNamespaces.some((ns) => predicate.includes(ns));
        if (isIgnoredNamespace || ignoredPredicates.has(localName)) {
          return;
        }

        const label = predicateLabels[localName];
        if (!label) {
          return;
        }

        const objectValue = binding.o?.value || '(no object)';
        const labelValue = binding.label?.value;
        const displayValue = labelValue ? `${objectValue} (${labelValue})` : objectValue;
        grouped[label].push(displayValue);
      });

      const categoryOrder = ['Region', 'Faction', 'Connected To'];
      let hasAny = false;

      categoryOrder.forEach((category) => {
        grouped[category].forEach((value) => {
          hasAny = true;
          const row = document.createElement('div');
          row.style.margin = '4px 0';

          const labelEl = document.createElement('b');
          labelEl.textContent = `${category}: `;
          row.appendChild(labelEl);

          const valueEl = document.createElement('span');
          valueEl.textContent = value;
          row.appendChild(valueEl);

          section.appendChild(row);
        });
      });

      if (!hasAny) {
        const none = document.createElement('span');
        none.textContent = 'No categorized semantic fields found.';
        section.appendChild(none);
      }

      output.appendChild(section);
    };

    el.addEventListener('mouseover', show);
    el.addEventListener('mouseout', hide);
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);

    el.addEventListener('click', async () => {
      const uri = el.getAttribute('data-uri');
      const output = document.getElementById('semantic-output');

      if (!output) {
        console.warn('Semantic output panel not found');
        return;
      }

      if (!uri) {
        setOutputMessage(output, 'Semantic Data', 'No data-uri found on this POI.');
        return;
      }

      setOutputMessage(output, 'Semantic Data', `Loading for: ${uri}`);

      const query = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?p ?o ?label
        WHERE {
          <${uri}> ?p ?o .
          OPTIONAL { ?o rdfs:label ?label . }
        }
        LIMIT 25
      `;

      try {
        const res = await fetch(SPARQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
          },
          body: query
        });

        if (!res.ok) {
          throw new Error(`SPARQL request failed: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        const bindings = json?.results?.bindings || [];

        if (!bindings.length) {
          setOutputMessage(output, 'Semantic Data', `No results for ${uri}.`);
          el.setAttribute('color', '#BD24FF');
          return;
        }

        renderResults(output, uri, bindings);
        el.setAttribute('color', '#BD24FF');
      } catch (err) {
        console.error('SPARQL error:', err);
        setOutputMessage(output, 'Semantic Data', `Error for ${uri}: ${err.message}`);
        el.setAttribute('color', '#FB24FF');
      }
    });
  }
});
