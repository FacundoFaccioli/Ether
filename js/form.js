document.getElementById("form-contact").addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    formData.append('_subject', 'ALERTA DE CONTACTO.')

    fetch("https://formspree.io/f/mbjvwbve", {
        method: 'POST',
        body: formularioAJSON(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .catch(() => {
            Swal.fire('Hubo un error al mandar el formulario', '', 'info')
        })
        .then(r => r.json())
        .then(response => {
            Swal.fire('Se mandó el mail correctamente :)', '', 'success')
        })
})

function formularioAJSON(formData) {
    const entradas = formData.entries()

    const objeto = Array.from(entradas).reduce( (data, [key, value]) => {
        data[key] = value
        return data
    }, {})

    return JSON.stringify(objeto)
}