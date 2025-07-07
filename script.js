
const container = document.getElementById("malla-container");

fetch("malla_geologia_completa.json")
  .then(response => response.json())
  .then(data => {
    const asignaturas = data.asignaturas;

    // Restaurar estados guardados
    const savedStates = JSON.parse(localStorage.getItem("estados_malla") || "{}");

    asignaturas.forEach(asig => {
      const div = document.createElement("div");
      const estadoActual = savedStates[asig.codigo] || asig.estado;
      div.className = "asignatura " + estadoActual;
      div.innerText = asig.nombre;
      div.title = `Código: ${asig.codigo}\nSemestre: ${asig.semestre}\nPrerrequisitos: ${asig.prerrequisitos.join(", ") || "Ninguno"}`;

      div.onclick = () => {
        const estados = ["pendiente", "cursando", "aprobado"];
        let index = estados.indexOf(div.classList[1]);
        index = (index + 1) % estados.length;
        div.className = "asignatura " + estados[index];
        savedStates[asig.codigo] = estados[index];
        localStorage.setItem("estados_malla", JSON.stringify(savedStates));
      };

      container.appendChild(div);
    });
  });
