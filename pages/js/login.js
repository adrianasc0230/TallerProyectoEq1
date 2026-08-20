document.addEventListener("DOMContentLoaded", () => {
    
                                                                 // datos simulada de usuarios registrados
    const usuariosRegistrados = [
        { email: "ejemplo@agro.com", password: "123" },
        { email: "usuario@agroanima.com", password: "mypassword" }
    ];

                                                                                                 // constantes 
    const loginForm = document.querySelector("form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const button = document.getElementById('button');
    const forgotPasswordLink = document.querySelector("#olvidar a");
                                                                                                   //"Olvidaste tu contraseña"
    forgotPasswordLink.addEventListener("click", (event) => {
        event.preventDefault();                                                                    // Evitar navegación del enlace #

        const emailRecuperacion = prompt("Ingresa tu correo electrónico para recuperar tu contraseña:");

        if (emailRecuperacion) {
            const correoLimpio = emailRecuperacion.trim().toLowerCase();
            const usuarioEncontrado = usuariosRegistrados.find(
                user => user.email.toLowerCase() === correoLimpio
            );

            if (usuarioEncontrado) {
                alert(`Se ha enviado un correo con las instrucciones de recuperación a: ${correoLimpio}`);
            } else {
                alert("El correo ingresado no se encuentra registrado.");
            }
        }
    });
});

button.addEventListener('click', (e) =>{
    e.preventDefault()                                           //no nos sale el letrero de complete el campo al dar clik en iniciar sesion
    const data = {
        email: email.value,
        password: password.value,
    }
    console.log(data)
})



