
fetch("malla_geologia_completa.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("malla-container");
    const estadosGuardados = JSON.parse(localStorage.getItem("estados_malla") || "{}");

    const porSemestre = {};

    data.asignaturas.forEach(asig => {
      const estado = estadosGuardados[asig.codigo] || asig.estado;
      if (!porSemestre[asig.semestre]) porSemestre[asig.semestre] = [];
      porSemestre[asig.semestre].push({...asig, estado});
    });

    let total = 0, aprobados = 0;

    Object.keys(porSemestre).sort((a, b) => a - b).forEach(sem => {
      const col = document.createElement("div");
      col.className = "semestre";
      col.innerHTML = `<h2>Semestre ${sem}</h2>`;

      porSemestre[sem].forEach(asig => {
        total++;
        if (asig.estado === "aprobado") aprobados++;

        const div = document.createElement("div");
        div.className = "asignatura " + asig.estado;
        div.innerText = asig.nombre;
        div.title = `Código: ${asig.codigo}\nSemestre: ${asig.semestre}\nPrerrequisitos: ${asig.prerrequisitos.join(", ") || "Ninguno"}`;

        div.onclick = () => {
          const estados = ["pendiente", "cursando", "aprobado"];
          let idx = estados.indexOf(div.classList[1]);
          idx = (idx + 1) % estados.length;
          div.className = "asignatura " + estados[idx];
          estadosGuardados[asig.codigo] = estados[idx];
          localStorage.setItem("estados_malla", JSON.stringify(estadosGuardados));
          updateProgress();
        };

        col.appendChild(div);
      });

      container.appendChild(col);
    });

    function updateProgress() {
      let aprobados = 0;
      data.asignaturas.forEach(asig => {
        const estado = estadosGuardados[asig.codigo] || asig.estado;
        if (estado === "aprobado") aprobados++;
      });
      const porcentaje = (aprobados / data.asignaturas.length) * 100;
      document.getElementById("progreso").style.width = porcentaje + "%";
    }

    updateProgress();
  });
