const submit = document.getElementById('login-form')



submit.addEventListener('submit', (event) => {
  event.preventDefault()

  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  if (email === '') return alert('O campo email é obrigatorio!')
  if (password === '') return alert('O campo senha é obrigatorio!')

  if (email === 'admin@admin.com' && password === 'adminadmin') {
    alert('autenticado com sucesso!')

    window.location.href = "http://localhost:5500/index";

  } F
})