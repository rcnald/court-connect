import { formatToCPF } from './js/utils.js'

let userTypeCounter = 0

const registerForm = document.getElementById('register-form')

const registerCpf = document.getElementById('register-cpf')
const registerEmail = document.getElementById('register-email')
const registerPassword = document.getElementById('register-password')
const registerConfirmPassword = document.getElementById('register-confirm-password')

registerCpf.addEventListener('keydown', (e) => {
  if (userTypeCounter >= 11 && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
    e.preventDefault()
  }

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
    if(userTypeCounter < 11) userTypeCounter++
  }

  if (e.key === 'Backspace' && userTypeCounter > 0) userTypeCounter--
})

registerCpf.addEventListener('input', (e) => {
  if (userTypeCounter <= 11) {
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

  const data = new FormData(e.currentTarget)

  const email = data.get('email')
  const cpf = data.get('cpf')
  const password = data.get('password')

  let previousAccounts = JSON.parse(window.localStorage.getItem('@court-connect:accounts'))

  previousAccounts = previousAccounts ?? []

  window.localStorage.setItem('@court-connect:accounts', JSON.stringify([...previousAccounts, { email, cpf, password }]))
})

const loginForm = document.getElementById('login-form')
