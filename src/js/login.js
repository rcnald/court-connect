const session = JSON.parse(window.localStorage.getItem('@court-connect:session'))

if (session) window.location.href = "home.html"

let isLoginFormValid = false

const loginForm = document.getElementById('login-form')

const loginEmail = document.getElementById('login-email')
const loginPassword = document.getElementById('login-password')

const loginEmailError = document.getElementById('login-email-error')
const loginPasswordError = document.getElementById('login-password-error')


loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (
        loginEmail.value === "" ||
        loginPassword.value === ""
    ) {
        isLoginFormValid = false
    } else {
        isLoginFormValid = true
    }



    if (loginPassword.value === "") {
        loginPasswordError.textContent = "Preencha o campo senha.";
        loginPassword.focus()
    } else {
        loginPasswordError.textContent = "";
    }


    if (loginEmail.value === "") {
        loginEmailError.textContent = "Preencha o campo email.";
        loginEmail.focus()
    } else {
        loginEmailError.textContent = "";
    }

    if (!isLoginFormValid) return

    const data = new FormData(e.currentTarget)

    const email = data.get('email')
    const password = data.get('password')

    let previousAccounts = JSON.parse(window.localStorage.getItem('@court-connect:accounts'))

    previousAccounts = previousAccounts ?? []

    const account = previousAccounts.find((account) => {
        return account.email === email
    })

    if (account) {
        if (account.password === password) {
            window.localStorage.setItem('@court-connect:session', JSON.stringify({ id: account.id }))


            return window.location.href = "/passou"
        }

        return alert("Credenciais invalidas!")
    }

    alert("Credenciais invalidas!")
})
