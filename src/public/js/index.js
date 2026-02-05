const socket = io();
let usuario;

Swal.fire({
  title: "Ingrese su Nombre de Usuario",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  showCancelButton: true,
  confirmButtonText: "Enviar",
  showLoaderOnConfirm: true,
}).then((result) => {
  if (result.isConfirmed) {
    usuario = result.value;
    socket.emit("nuevoUsuario", result.value);
  }
});

socket.on("nuevoUsuario", data => {
    Swal.fire({
        position: "top-end",
        title: data,
        showConfirmButton: false,
        timer: 2000
    });
})

// Recibo los Mensajes del Servidor
socket.on("mensajes", data => {
    let contenidoHTML = `<ul class="list-group">`;

    data.forEach(item => {
        contenidoHTML += `<li class="list-group-item"><b>${item.usuario}:</b> ${item.mensaje}</li>`;
    });

    contenidoHTML += `</ul>`;
    document.getElementById("mensajes").innerHTML = contenidoHTML;
})

// Envio un Mensaje al Servidor
const enviarMensaje = () => {
    const mensaje = document.getElementById("mensaje");
    socket.emit("mensajes", {usuario:usuario, mensaje:mensaje.value});
    mensaje.value = "";
}