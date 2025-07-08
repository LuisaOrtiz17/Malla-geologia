
let estadoUsuario = JSON.parse(localStorage.getItem("estado_malla") || "{}");

function filtrar(estado) {
  document.querySelectorAll(".asignatura").forEach(div => {
    div.style.display = (estado === 'todos' || div.dataset.estado === estado) ? "block" : "none";
  });
}

fetch("malla_geologia.json")
  .then(r => r.json())
  .then(data => {
    const contenedor = document.getElementById("malla-container");
    let total = data.asignaturas.length;
    let aprobados = 0;

    data.asignaturas.forEach(ramo => {
      const div = document.createElement("div");
      const estado = estadoUsuario[ramo.codigo] || ramo.estado;
      div.className = `asignatura ${estado} ${ramo.area}`;
      div.dataset.estado = estado;
      div.innerHTML = `<strong>${ramo.nombre}</strong><br>${ramo.creditos} créditos`;

      if (estado === "aprobado") aprobados++;
      div.onclick = () => {
        const estados = ["pendiente", "cursando", "aprobado"];
        let index = estados.indexOf(div.dataset.estado);
        index = (index + 1) % 3;
        div.dataset.estado = estados[index];
        estadoUsuario[ramo.codigo] = estados[index];
        localStorage.setItem("estado_malla", JSON.stringify(estadoUsuario));
        div.className = `asignatura ${estados[index]} ${ramo.area}`;
        actualizarProgreso();
      };

      contenedor.appendChild(div);
    });

    function actualizarProgreso() {
      const total = data.asignaturas.length;
      const aprobados = Object.values(estadoUsuario).filter(e => e === "aprobado").length;
      document.getElementById("progreso").style.width = `${(aprobados / total) * 100}%`;
    }

    actualizarProgreso();
  });
