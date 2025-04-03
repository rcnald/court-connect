import { formatToCPF, formatToNumeric, randomUUID } from './utils.js'

let userTypeCounterOnCpfInputOnCpfInput = 0
let isRegisterFormValid = false

const registerForm = document.getElementById('register-form')

const registerCpf = document.getElementById('register-cpf')
const registerEmail = document.getElementById('register-email')
const registerName = document.getElementById('register-name')
const registerPassword = document.getElementById('register-password')
const registerConfirmPassword = document.getElementById('register-confirm-password')

const registerCpfError = document.getElementById('register-cpf-error')
const registerEmailError = document.getElementById('register-email-error')
const registerNameError = document.getElementById('register-name-error')
const registerPasswordError = document.getElementById('register-password-error')
const registerConfirmPasswordError = document.getElementById('register-confirm-password-error')

registerCpf.addEventListener('keydown', (e) => {
  if (userTypeCounterOnCpfInputOnCpfInput >= 11 && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
    e.preventDefault()
  }

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
    if (userTypeCounterOnCpfInputOnCpfInput < 11) userTypeCounterOnCpfInputOnCpfInput++
  }

  if (e.key === 'Backspace' && userTypeCounterOnCpfInputOnCpfInput > 0) userTypeCounterOnCpfInputOnCpfInput--
})

registerCpf.addEventListener('input', (e) => {
  if (userTypeCounterOnCpfInputOnCpfInput <= 11) {
    e.currentTarget.value = formatToCPF(e.currentTarget.value);
  }
})

registerCpf.addEventListener('click', (e) => {
  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = e.currentTarget.value.length;
})

registerCpf.addEventListener('select', (e) => {
  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = e.currentTarget.value.length;
})

registerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (
    registerCpf.value === "" ||
    registerEmail.value === "" ||
    registerName.value === "" ||
    registerPassword.value === "" ||
    registerConfirmPassword.value === "" ||
    userTypeCounterOnCpfInputOnCpfInput !== 11 ||
    registerPassword.value !== registerConfirmPassword.value
  ) {
    isRegisterFormValid = false
  } else {
    isRegisterFormValid = true
  }


  if (registerConfirmPassword.value === "") {
    registerConfirmPasswordError.textContent = "Confirme sua senha.";
    registerConfirmPassword.focus()
  } else if (registerPassword.value !== registerConfirmPassword.value) {
    registerConfirmPasswordError.textContent = "As senha não coincidem!";
    registerConfirmPassword.focus()
  }

  else {
    registerConfirmPasswordError.textContent = "";
  }

  if (registerPassword.value === "") {
    registerPasswordError.textContent = "Preencha o campo senha.";
    registerPassword.focus()
  } else {
    registerPasswordError.textContent = "";
  }

  if (registerCpf.value === "") {
    registerCpfError.textContent = "Preencha o campo CPF.";
    registerCpf.focus()
  } else if (userTypeCounterOnCpfInputOnCpfInput !== 11) {
    registerCpfError.textContent = "Preencha o campo CPF corretamente."
    registerCpf.focus()
  } else {
    registerCpfError.textContent = "";
  }

  if (registerEmail.value === "") {
    registerEmailError.textContent = "Preencha o campo email.";
    registerEmail.focus()
  } else {
    registerEmailError.textContent = "";
  }

  if (registerName.value === "") {
    registerNameError.textContent = "Preencha o campo nome.";
    registerName.focus()
  } else {
    registerNameError.textContent = "";
  }

  if (!isRegisterFormValid) return

  const data = new FormData(e.currentTarget)

  const email = data.get('email')
  const name = data.get('name')
  const cpf = formatToNumeric(data.get('cpf'))
  const password = data.get('password')

  let previousAccounts = JSON.parse(window.localStorage.getItem('@court-connect:accounts'))

  previousAccounts = previousAccounts ?? []

  const accountExists = previousAccounts.find((account) => {
    return account.email === email
  })

  if (accountExists) {
    return alert("Uma conta com esse email ja foi cadastrada!")
  }

  const accountId = randomUUID()

  window.localStorage.setItem('@court-connect:accounts', JSON.stringify([...previousAccounts, { id: accountId, name, email, cpf, password }]))

  window.location.href = ""
})
