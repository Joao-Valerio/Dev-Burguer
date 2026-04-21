const storageKey = "devburguer_user"
const sessionKey = "devburguer_session"

function showToast(text, bg = "#16a34a") {
    Toastify({
        text,
        duration: 2500,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: { background: bg },
    }).showToast()
}

function getUser() {
    return JSON.parse(localStorage.getItem(storageKey))
}

function setUser(user) {
    localStorage.setItem(storageKey, JSON.stringify(user))
}

function setSession(email) {
    localStorage.setItem(sessionKey, email)
}

function getSession() {
    return localStorage.getItem(sessionKey)
}

const registerForm = document.getElementById("register-form")
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault()
        const name = document.getElementById("register-name").value.trim()
        const phone = document.getElementById("register-phone").value.trim()
        const email = document.getElementById("register-email").value.trim()
        const password = document.getElementById("register-password").value.trim()
        const address = document.getElementById("register-address").value.trim()

        if (!name || !phone || !email || !password) {
            showToast("Preencha os campos obrigatórios", "#ef4444")
            return
        }

        setUser({ name, phone, email, password, address })
        setSession(email)
        showToast("Conta criada com sucesso")
        window.location.href = "perfil.html"
    })
}

const loginForm = document.getElementById("login-form")
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault()
        const email = document.getElementById("login-email").value.trim()
        const password = document.getElementById("login-password").value.trim()
        const user = getUser()

        if (!user) {
            showToast("Nenhuma conta encontrada. Crie sua conta.", "#ef4444")
            return
        }

        if (user.email !== email || user.password !== password) {
            showToast("E-mail ou senha inválidos", "#ef4444")
            return
        }

        setSession(email)
        showToast("Login realizado com sucesso")
        window.location.href = "perfil.html"
    })
}

const profileForm = document.getElementById("profile-form")
if (profileForm) {
    const user = getUser()
    const session = getSession()

    if (!user || !session || user.email !== session) {
        showToast("Faça login para acessar seu perfil", "#ef4444")
        window.location.href = "login.html"
    } else {
        document.getElementById("profile-name").value = user.name || ""
        document.getElementById("profile-phone").value = user.phone || ""
        document.getElementById("profile-email").value = user.email || ""
        document.getElementById("profile-address").value = user.address || ""
    }

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault()
        const current = getUser()
        if (!current) return

        const updated = {
            ...current,
            name: document.getElementById("profile-name").value.trim(),
            phone: document.getElementById("profile-phone").value.trim(),
            address: document.getElementById("profile-address").value.trim(),
        }
        setUser(updated)
        showToast("Perfil atualizado")
    })
}

const logoutBtn = document.getElementById("logout-btn")
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(sessionKey)
        showToast("Sessão encerrada", "#ef4444")
        window.location.href = "login.html"
    })
}
