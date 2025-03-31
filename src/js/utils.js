export function formatToCPF(value) {

  const valueRaw = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11)

  return valueRaw
    .padStart(11, '0')
    .replace(/^(\d{3})(\d)/, '$1.$2') 
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') 
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}