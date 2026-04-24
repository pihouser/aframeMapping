// js/semantic.js

AFRAME.registerComponent('semantic-trigger', {
  init: function () {
    this.el.addEventListener('click', evt => {
      const uri = this.el.getAttribute('data-uri');
      console.log('POI clicked:', this.el.id, uri);

      // Example SPARQL query
      const query = `
        PREFIX www: <http://www.semanticweb.org/pear/ontologies/2026/0/11-gis#>
        SELECT DISTINCT ?x
        WHERE {
          <${uri}> www:hasFeature ?x .
        }
      `;

      fetch('https://69.48.163.69:3030/dnd/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/sparql-query' },
        body: query
      })
      .then(res => res.json())
      .then(data => {
        console.log('Fuseki response:', data);
      })
      .catch(err => console.error('Fuseki fetch error:', err));
    });
  }
});
