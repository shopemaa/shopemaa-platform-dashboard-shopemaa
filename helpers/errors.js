import {toast, Slide} from 'react-toastify';

export const showErrorMessage = ({message, body}) => {
    let {error_message} = "";

    if (body && body.error) {
        error_message = body.error.error_message;
    }

    toast.error(message || error_message || "An unexpected error occurred.", {
        position: "top-center",
        autoClose: 5000,
        className: 'danger'
    });
}

export const showSuccessMessage = ({message}) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        className: 'success'
    });
}
