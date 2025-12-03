document.addEventListener("DOMContentLoaded", function () {
  cargarTurnos();

  const roomTypeSelect = document.getElementById("room-type");
  const form = document.getElementById("reservation-form");
  const fecha = document.getElementById("fecha");
  const horaTurno = document.getElementById("hora-turno");
  const nombre = document.getElementById("name");
  const detalle = document.getElementById("reservation-details");
  const precio = document.getElementById("total-price");

  servicios.forEach((servicio) => {
    const option = document.createElement("option");
    option.value = servicio.id;
    option.textContent = `${servicio.tipo}`;
    roomTypeSelect.appendChild(option);
  });

  roomTypeSelect.addEventListener("change", actualizaDetalle);
  fecha.addEventListener("change", actualizaDetalle);
  horaTurno.addEventListener("change", actualizaDetalle);
  nombre.addEventListener("change", actualizaDetalle);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Iniciando proceso de reserva...");
    const servicioId = parseInt(roomTypeSelect.value);
    const servicio = servicios.find((h) => h.id == servicioId);

    if (!servicio) {
      mostrarModal("EROR: ", "Por favor selecciona un servicio valido");
      return;
    }

    if (!fecha.value) {
      mostrarModal("ERROR: ", 
        "Por favor seleccione una fecha");
      return;
    }

    const fechaSeleccionada = new Date(fecha.value);
    const diaSemana = fechaSeleccionada.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

    if (diaSemana == 6 || diaSemana == 0) {
      mostrarModal(
        "ERROR: Día no laboral",
        "Lo sentimos, no trabajamos los domingos ni los lunes. Por favor seleccione otro día."
      );
      return;
    }

    if (!horaTurno.value) {
      mostrarModal(
        "ERROR: ",
        "Por favor seleccione un horario"
      )
      return;
    }

    const nuevoTurno = {
      id: Date.now(),
      servicioId: servicio.id,
      tipoServicio: servicio.tipo,
      horaturno: document.getElementById("hora-turno").value,
      precio: servicio.precio,
      nombreCompleto: document.getElementById("name").value,
      estado: "confirmado",
      turnoReserva: new Date().toISOString().split("T")[0],
    };

    const horaSeleccionada = document.getElementById("hora-turno").value;
    const turnoExistente = turnos.find(
      (turno) => turno.turnoReserva == fecha.value && turno.horaturno == horaSeleccionada
    );
    if (turnoExistente) {
      mostrarModal(
        "ERROR: Hora no disponible",
        `El horario ${horaSeleccionada} ya esta reservado. Por favor seleccione otro horario.`
      );
      return;
    }

    console.log("Creando el nuevo turno..", nuevoTurno);
    guardarTurno(nuevoTurno);
    console.log("Turno guardado", "Turnos hechos: ", turnos);

    form.reset();
    precio.textContent = "$0";
    detalle.innerHTML = "<p>Selecciona un servicio para ver los detalles</p>";

    mostrarModalConfirmacion(
      "Turno confirmado",
      `Tu turno para "${servicio.tipo}" el dia "${nuevoTurno.turnoReserva}" ha sido confirmado con exito. `
    );
  });

  function actualizaDetalle() {
    const servicioId = roomTypeSelect.value;
    const servicio = servicios.find((h) => h.id == servicioId);

    if (!servicio || !fecha.value || !horaTurno.value) {
      return;
    }
    console.log("sali de la condicion");
    detalle.innerHTML = `
      <p style="color: #342e37">Tipo de servicio: ${servicio.tipo}</p>
      <br>
      <p style="color: #342e37">Fecha: ${fecha.value}</p>
      <br>
      <p style="color: #342e37">Hora: ${horaTurno.value}</p>
      <br>
      <p style="color: #342e37">Nombre: ${nombre.value}</p>
    `;
    console.log(horaTurno.value);

    precio.innerHTML = `<span> $${servicio.precio} </span>`;
  }

  function cargarTurnos() {
    
    const detallesContainer = document.getElementById("reservationdetails");

    const noTurnoMensaje = document.getElementById("noturno");

    if (!noTurnoMensaje) {
      console.error("Elemento no turno no encontrado");
      return;
    }

    if (turnos.length == 0) {
      noTurnoMensaje.style.display = "block";
      detallesContainer.innerHTML = "";
      return;
    }

    noTurnoMensaje.style.display = "none";
    detallesContainer.innerHTML = "";

    turnos.forEach((turno) => {
      if (!turno.horaturno) {
        return;
      }

      const turnoElement = document.createElement("div");
      turnoElement.className = "turno-info";

      turnoElement.innerHTML = `
      <div class="turno-info">
        <h4 style="color: #342e37">Servicio: ${turno.tipoServicio}</h4>
        <br>
        <h4 style="color: #342e37">Fecha: ${turno.turnoReserva} </h4>
        <br>
        <h4 style="color: #342e37">Hora: ${turno.horaturno} </h4>
        <br>
        <h4 style="color: #342e37">Nombre: ${turno.nombreCompleto}</h4>
        <br>
        <span style="color: #0CF25D">${turno.estado} </span>
      </div>
      <div class="price-summary" style="border-top: 1px solid rgba(214, 214, 214, 0.6); ">
          <p>Total: <span id="total-price">$${turno.precio}</span></p>
          <button class="cancel-btn" data-id="${turno.id}">Cancelar turno</button>
      </div>
    `;

      console.log(document.getElementById("hora-turno").value);
      detallesContainer.appendChild(turnoElement);
    });
    document.querySelectorAll(".cancel-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const turnoId = parseInt(this.getAttribute("data-id"));
        if (confirm("¿Estas seguro que deseas cancelar este turno?")) {
          cancelarTurno(turnoId);
          cargarTurnos();
          mostrarModalConfirmacion("Turno cancelado", "Tu turno ha sido cancelado correctamente");
        }
      });
    });
  }
});
