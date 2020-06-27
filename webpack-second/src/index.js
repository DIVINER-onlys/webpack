import './css/main/index.css'

document.getElementById('btn').onclick = function () {
  import('./handle').then(fn => fn.default())
}

export default function login() {
  console.log('index')
}