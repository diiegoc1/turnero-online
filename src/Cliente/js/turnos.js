/* function guardarTurno(turno) {
  try {
    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    return turno;
  } catch (error) {
    console.error("error al guardar en localStorage", error);
    return turno;
  }
} */

/* function guardarTurno(turno) {
  try {
    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));

    // Preparar datos para la base de datos
    const datosParaBD = {
      servicio_id: turno.servicioId,
      cliente_nombre: turno.nombreCompleto,
      fecha: turno.turnoReserva,
      hora: turno.horaturno,
      estado: turno.estado,
      servicio: turno.tipoServicio,
      precio: turno.precio,
    };

    console.log("📤 Datos a enviar a BD:", datosParaBD); // ← AGREGA ESTA LÍNEA

    // ENVÍO A BASE DE DATOS - se ejecuta en segundo plano
    fetch("http://localhost:3000/turnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosParaBD),
    })
      .then((response) => response.json())
      .then((data) => console.log("✅ Turno guardado en BD:", data))
      .catch((error) => console.error("❌ Error al guardar en BD:", error));

    return turno;
  } catch (error) {
    console.error("error al guardar en localStorage", error);
    return turno;
  }
} */

function guardarTurno(turno) {
  try {
    // ENVÍO A BASE DE DATOS PRIMERO para obtener el ID real
    const datosParaBD = {
      servicio_id: turno.servicioId,
      cliente_nombre: turno.nombreCompleto,
      fecha: turno.turnoReserva,
      hora: turno.horaturno,
      estado: turno.estado,
      servicio: turno.tipoServicio,
      precio: turno.precio,
    };

    console.log("📤 Datos a enviar a BD:", datosParaBD);

    // PRIMERO guardar en BD para obtener el ID real
    fetch("http://localhost:3000/turnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosParaBD),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Turno guardado en BD:", data);

        // Ahora guardar en localStorage con el ID REAL de la BD
        const turnoConIdReal = {
          ...turno,
          id: data.id, // ← ID real de la base de datos
          bd_id: data.id, // ← por si quieres mantener ambos IDs
        };

        turnos.push(turnoConIdReal);
        localStorage.setItem("turnos", JSON.stringify(turnos));
      })
      .catch((error) => console.error("❌ Error al guardar en BD:", error));

    return turno;
  } catch (error) {
    console.error("error al guardar en localStorage", error);
    return turno;
  }
}

function mostrarModal(titulo, mensaje) {
  const modal = document.getElementById("modal");
  const modalTitulo = document.getElementById("modal-title");
  const modalMensaje = document.getElementById("modal-message");
  const modalBoton = document.getElementById("modal-button");

  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  modalBoton.onclick = function () {
    /* modalBoton.style.display = "none"; */
    modal.style.display = "none";
  };
}

function mostrarModalConfirmacion(titulo, mensaje) {
  const modal = document.getElementById("modal");
  const modalTitulo = document.getElementById("modal-title");
  const modalMensaje = document.getElementById("modal-message");
  const modalBoton = document.getElementById("modal-button");

  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  modal.style.display = "flex";

  modalBoton.onclick = function () {
    /* modalBoton.style.display = "none"; */
    modal.style.display = "none";
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  };
}

function cancelarTurno(turnoId) {
  // Primero, actualizar en la base de datos
  fetch(`http://localhost:3000/turnos/${turnoId}/cancelar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json();
    })
    .then((data) => {
      console.log("✅ Turno cancelado en BD:", data);

      // Luego eliminar del localStorage
      turnos = turnos.filter((turno) => turno.id !== turnoId);
      try {
        localStorage.setItem("turnos", JSON.stringify(turnos));
        console.log("✅ Turno eliminado de localStorage");
      } catch (error) {
        console.error("Error al actualizar LocalStorage", error);
        mostrarModal("Error", "No se pudo completar la cancelación localmente");
      }
    })
    .catch((error) => {
      console.error("❌ Error al cancelar turno en BD:", error);
      mostrarModal("Error", "No se pudo conectar con el servidor para cancelar el turno");
    });
}

/* function eliminarTurno(turnoId) {
  turnos = turnos.filter((turno) => turno.id !== turnoId);
  try {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  } catch (error) {
    console.error("Erro al actualizar LocalStorage", error);
  }
} */
