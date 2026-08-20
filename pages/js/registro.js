document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('form');

    // Manejar el evento de envío (submit)
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();                                                          // Evita que la página se recargue

                                                                                        // constantes con el value para que no tengan conflicto
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const password = document.getElementById('password').value;
        const confirmar = document.getElementById('confirmar').value;

                                                                                        // Validaciones de los datos
        if (!nombre || !correo || !telefono || !password || !confirmar) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (password !== confirmar) {
            alert('Las contraseñas no coinciden. Inténtalo de nuevo.');
            return;
        }

                                                                                        // Estructura de los datos capturados
        const datosUsuario = {
            nombre,
            correo,
            telefono,
            password
        };
        const usuarioAlmacenados = JSON.stringify(datosUsuario);
        localStorage.setItem('nuevoUsuario', usuarioAlmacenados);

        console.log('Datos listos para enviar:', datosUsuario);
        
                                                                                      //  confirmación al hacer clic en "Crear Cuenta"
        alert('¡Registro correcto! Bienvenido a Agroanima Colombia.');

                                                                                        // nos limpia despues de dar click en registrar 
        formulario.reset();
    });
});

                                                                                       // aca tenemos funcion del ojito
function mostrarPassword(idCampo, boton) {
    const input = document.getElementById(idCampo);
    if (input.type === 'password') {
        input.type = 'text';
        boton.textContent = '👁';                                                     // Cambia el icono cuando es visible
    } else {
        input.type = 'password';
        boton.textContent = '◉';                                                      // Vuelve al icono original
    }
}