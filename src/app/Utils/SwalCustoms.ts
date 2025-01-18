import Swal from 'sweetalert2';

const nyanAlert = (message: string) => {
    return (
        Swal.fire({
            title: message,
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
            backdrop: `rgba(0,0,123,0.4) url("https://sweetalert2.github.io/images/nyan-cat.gif") left top no-repeat`,
            allowOutsideClick: false, // No permitir hacer clic fuera del cuadro para cerrar
            allowEscapeKey: false,    // No permitir cerrar la alerta presionando la tecla Escape
            allowEnterKey: false      // No permitir cerrar la alerta presionando la tecla Enter
        })
    );
};

const error = (message: string) => {
    Swal.fire({
        icon: "error",
        title: "¡ Error !",
        text: message,
    });
}

const info = (message: string) => {
    Swal.fire({
        icon: "info",
        title: "Resultado del registro",
        text: message,
    });
}

const confirm = async (title: string, text: string) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "No, cancelar",
    });
    return result.isConfirmed;
}

export const SwalCustoms = {
    nyanAlert,
    error,
    info,
    confirm,
};