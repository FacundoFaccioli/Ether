const productosEstaticos = [
    {
        id: 1,
        nombre: "Remera con estampa chica al frente",
        precio: 3200,
        stock: 20,
        imagen: './img/remerauno.png'
    },
    {
        id: 2,
        nombre: "Remera con estampa grande al dorso",
        precio: 3800,
        stock: 15,
        imagen: './img/remerados.png',
    },
    {
        id: 3,
        nombre: "Remera lisa color celeste entallada",
        precio: 2800,
        stock: 25,
        imagen: './img/remeratres.png',
    },
    {
        id: 4,
        nombre: "Remera estampada al frente",
        precio: 3900,
        stock: 10,
        imagen: './img/remeracinco.png',
    }
]
function Producto(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;

    this.obtenerElementoHtml = function () {
        const card = document.createElement('div')
        card.className = 'card'
        card.style.width = '18rem'
        card.innerHTML = `
            <img src="${this.imagen}" class="card-img-top" alt="${this.nombre}">
            <div class="card-body">
                <h3 class="card-title titulo-prod">${this.nombre}</h3>
                <p class="card-text parrafo-prod">$${this.precio.toFixed(2)}</p>
                <button class="btn btn-dark boton-prod" onclick="agregarAlCarrito(${this.id})">Agregar al carrito</button>
            </div>
        `
        return card;
    }
}

const productos = productosEstaticos.map((producto) => new Producto(producto.id, producto.nombre, producto.precio, producto.stock, producto.imagen))

const carrito = []

function mostrarProductos() {
    const productosContainer = document.querySelector('.prod-flex')
    const nuevoContenedor = document.createElement('div')
    const busqueda = document.getElementById('buscador-input').value

    productos
        .filter(producto => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .forEach((producto) => nuevoContenedor.appendChild(producto.obtenerElementoHtml()))

    productosContainer.innerHTML = nuevoContenedor.innerHTML
}

function buscarProductoPorNombre() {
    mostrarProductos()
}

function agregarProductoAlLocalStorage(producto) {
    const carrito = localStorage.getItem("carrito")
    if (carrito) {
        localStorage.setItem("carrito", JSON.stringify([...JSON.parse(carrito), producto]))
    } else {
        localStorage.setItem("carrito", JSON.stringify([producto]))
    }
}

function agregarCantidadAlProducto(producto) {
    const carrito = localStorage.getItem("carrito")
    if (carrito) {
        const carritoViejo = JSON.parse(carrito)
        const productoViejo = carritoViejo.find(productoEnCarrito => productoEnCarrito.id == producto.id)
        productoViejo.cantidad++
        localStorage.setItem('carrito', JSON.stringify(carritoViejo))
    }
}

function restarCantidadAlProducto(producto) {
    const carrito = localStorage.getItem("carrito")
    if (carrito) {
        const carritoViejo = JSON.parse(carrito)
        const productoViejo = carritoViejo.find(productoEnCarrito => productoEnCarrito.id == producto.id)
        productoViejo.cantidad--
        if (productoViejo.cantidad > 0) {
            localStorage.setItem('carrito', JSON.stringify(carritoViejo))
        } else {
            localStorage.setItem('carrito', JSON.stringify(carritoViejo.filter(productoEnCarrito => productoEnCarrito.id != producto.id)))
        }

    }
}


function agregarAlCarrito(productoId) {
    const producto = productos.find((p) => p.id === productoId)

    if (producto && producto.stock > 0) {

        const productoEnCarrito = getCarrito().find((p) => p.id === producto.id)
        if (productoEnCarrito) {

            agregarCantidadAlProducto(productoEnCarrito)
        } else {

            producto.cantidad = 1
            agregarProductoAlLocalStorage(producto)
        }

        producto.stock--


        actualizarCarritoEnDOM()
    } else {
        alert('No hay suficiente stock de este producto.')
    }
}


function getCarrito() {
    const carritoDesdeLocalStorage = localStorage.getItem('carrito')
    if (carritoDesdeLocalStorage) {
        return JSON.parse(carritoDesdeLocalStorage)
    } else {
        return []
    }
}


function actualizarCarritoEnDOM() {
    const carritoContainer = document.querySelector('#shop-list tbody')
    carritoContainer.innerHTML = ''

    getCarrito().forEach((producto) => {
        const fila = document.createElement('tr')
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-imagen"></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.cantidad}</td>
            <td>
                <button onclick="sumarCantidad(${producto.id})"><i data-feather="plus"></i></button>
                <button onclick="restarCantidad(${producto.id})"><i data-feather="minus"></i></button>
                <button onclick="borrarProducto(${producto.id})"><i data-feather="x"></i></button>
            </td>
        `
        carritoContainer.appendChild(fila)
    })
    feather.replace()

    const totalCarrito = calcularTotalCarrito()
    const totalCarritoElement = document.querySelector('#total-carrito')
    totalCarritoElement.textContent = `$${totalCarrito.toFixed(2)}`
}

addEventListener("load", (event) => {
    actualizarCarritoEnDOM()
})



function calcularTotalCarrito() {
    return getCarrito().reduce((total, producto) => total + (producto.precio * producto.cantidad), 0)
}


function vaciarCarritoConConfirmacion() {
    Swal.fire({
        title: '¿Estás seguro de que deseas vaciar el carrito?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Carrito vaciado', '', 'success')


            localStorage.removeItem('carrito')


            productos.forEach((producto) => {
                producto.stock = 10
            })


            actualizarCarritoEnDOM()
        } else {
            Swal.fire('Seguí comprando tranca', '', 'info')
        }
    })
}

function sumarCantidad(productoId) {
    const productoEnCarrito = getCarrito().find((p) => p.id === productoId)

    if (productoEnCarrito) {
        agregarCantidadAlProducto(productoEnCarrito)
        actualizarCarritoEnDOM()
    }
}
function borrarProducto(productoId) {
    const producto = getCarrito().find((p) => p.id === productoId)

    if (producto) {
        localStorage.setItem('carrito', JSON.stringify(getCarrito().filter(productoEnCarrito => productoEnCarrito.id != producto.id)))
        actualizarCarritoEnDOM()
    }
}


function restarCantidad(productoId) {
    const productoEnCarrito = getCarrito().find((p) => p.id === productoId)

    if (productoEnCarrito && productoEnCarrito.cantidad > 0) {
        restarCantidadAlProducto(productoEnCarrito)
        actualizarCarritoEnDOM()
    }
}


function eliminarProducto(productoId) {
    const index = carrito.findIndex((p) => p.id === productoId)

    if (index !== -1) {
        const producto = carrito[index]

        if (producto.cantidad > 1) {
            producto.cantidad--
        } else {
            carrito.splice(index, 1)
        }

        actualizarCarritoEnDOM()
    }
}

window.addEventListener('load', mostrarProductos)