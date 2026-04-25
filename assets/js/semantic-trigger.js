AFRAME.registerComponent('semantic-trigger', {
  init: function () {
    const el = this.el;

    // 🔥 A-Frame native interaction event (THIS is the correct one)
    el.addEventListener('raycaster-intersected', (evt) => {
      el.addState('hovered');
    });

    el.addEventListener('raycaster-intersected-cleared', (evt) => {
      el.removeState('hovered');
    });

    // 🔥 TRUE CLICK via cursor (this is the reliable trigger)
    el.addEventListener('click', (evt) => {
      console.log("🔥 AFRAME CLICK EVENT");
      this.handleClick(el);
    });

    // 🔥 FALLBACK (guaranteed)
    el.addEventListener('mousedown', (evt) => {
      console.log("🔥 MOUSEDOWN FALLBACK");
      this.handleClick(el);
    });
  },

  handleClick: async function (el) {
    const uri = el.getAttribute('data-uri');

    console.log("🚀 POI CLICKED:", uri);

    try {
      const query = `
        SELECT ?p ?o WHERE {
          <${uri}> ?p ?o .
        }
        LIMIT 25
      `;

      const response = await fetch("https://sparql.pihouser.com/dnd/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/sparql-query",
          "Accept": "application/sparql-results+json"
        },
        body: query
      });

      const data = await response.json();
      const bindings = data.results.bindings;

      console.log("SPARQL RESULT:", bindings);

      // HUD
      const output = document.getElementById("semantic-output");
      if (output) {
        output.innerHTML = `<b>Semantic Data</b><br>${uri}<br>`;
        bindings.forEach(b => {
          output.innerHTML += `${b.p.value.split('#').pop()} → ${b.o.value}<br>`;
        });
      }

      // GRAPH
      const graph = document.querySelector('[semantic-graph]');
      if (graph && graph.components['semantic-graph']) {
        console.log("🎯 RENDER GRAPH");
        graph.components['semantic-graph'].renderGraph(el, bindings);
      } else {
        console.warn("Graph component missing");
      }

    } catch (err) {
      console.error("SPARQL ERROR:", err);
    }
  }
});
