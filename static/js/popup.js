function showPopup(message, status, position, top) {
    Toastify({
        text: message,
        duration: 5000,
        gravity: "top",
        position: position ? position : "right",
        offset: {
            x: 0,
            y: top ? `${top}em`: "8em",
        },
        backgroundColor: status === "error" ? "#ad1840" : status === "success" ? "#2baf0d" : "#ffc107",
    }).showToast();
}

export default showPopup;