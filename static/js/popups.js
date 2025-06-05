function showPopup(message, status, position) {
    // Toastify popup message
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: position ? position : "right",
        offset: {
            x: 0,
            y: "8em",
        },
        backgroundColor: status === "error" ? "#ad1840" : status === "success" ? "#2baf0d" : "#ffc107",
    }).showToast();
}

export default showPopup;