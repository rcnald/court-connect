import { Router } from "./js/route.js"

const router = new Router

router.add('/','index.html')
router.add('/login','src/pages/login.html')
router.add('/register','src/pages/cadastro.html')

const links = Array.from(document.getElementsByTagName('a'))

links.forEach(link => {
  link.addEventListener('click', (e) => {
    router.route(e)
  })
})



window.onpopstate = router.handle() 