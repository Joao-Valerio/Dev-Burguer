const menu = document.getElementById("menu-container")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const clearCartBtn = document.getElementById("clear-cart-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = JSON.parse(localStorage.getItem("devburguer_cart")) || []

function saveCart() {
    localStorage.setItem("devburguer_cart", JSON.stringify(cart))
}

// Abrir Modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
    updateCartModal()
})

// Fechar o Modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function (event) {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1
    }
    else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
    saveCart()
    Toastify({
        text: `${name} adicionado ao carrinho`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#16a34a",
        },
    }).showToast()
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0
    cart.forEach(item => {
        const subtotal = item.price * item.quantity
        const cartItemsElement = document.createElement("div")
        cartItemsElement.classList.add("mb-4", "border-b", "border-zinc-200", "pb-4", "last:border-b-0")
        cartItemsElement.innerHTML = `
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                    <p class="font-medium break-words">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">Unit: ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    <p class="font-medium">Subtotal: ${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
                <div>
                    <button class="remove-from-cart-btn text-red-500 font-semibold" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `
        total += subtotal

        cartItemsContainer.appendChild(cartItemsElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

// Remover do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if (index != -1) {
        const item = cart[index]
        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            saveCart()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
        saveCart()
    }
}

clearCartBtn.addEventListener("click", function () {
    cart = []
    updateCartModal()
    saveCart()
    Toastify({
        text: "Carrinho limpo com sucesso",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#ef4444",
        },
    }).showToast()
})

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: "O restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast()
        return
    }
    else if (cart.length === 0) return
    else if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //Enviar para o whats
    const cartItems = cart.map((item) => {
        return (`
            ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}
            `)
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "" //Colocar o numero

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
    saveCart()
})

// Verificar o horario
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}
else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
updateCartModal()