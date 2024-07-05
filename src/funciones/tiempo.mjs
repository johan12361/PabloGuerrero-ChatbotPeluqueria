import 'dotenv/config'

export function Esperar(sg) {
  return new Promise((resolve) => setTimeout(resolve, sg * 1000))
}

//TT OBTENER FECHA ACTUAL
export function ObtenerFechaActual() {
  const fecha = new Date()

  // Obteniendo día, mes y año
  let dia = fecha.getDate().toString().padStart(2, '0') // Dos dígitos con cero a la izquierda si es necesario
  let mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Meses van de 0 a 11, sumamos 1 para obtener el mes actual
  const año = fecha.getFullYear()

  dia = parseInt(dia, 10)
  mes = parseInt(mes, 10)

  // Construyendo la fecha en formato DD/MM/AAAA
  const fechaFormateada = `${dia}/${mes}/${año}`

  return fechaFormateada
}
//TT OBTENER HORA ACTUAL
export function ObtenerHoraActual() {
  const fecha = new Date()

  // Obteniendo horas, minutos y segundos
  const horas = fecha.getHours().toString().padStart(2, '0') // Dos dígitos con cero a la izquierda si es necesario
  const minutos = fecha.getMinutes().toString().padStart(2, '0')
  const segundos = fecha.getSeconds().toString().padStart(2, '0')

  // Construyendo la hora en formato HH:MM:SS
  const horaFormateada = `${horas}:${minutos}:${segundos}`

  return horaFormateada
}
//TT COMPARA FECHAS
export function CompararFechas(fechaString1, fechaString2) {
  // Convertir los strings a objetos Date
  const fecha1 = convertirStringADate(fechaString1)
  const fecha2 = convertirStringADate(fechaString2)

  // Comparar las fechas
  if (fecha1 && fecha2) {
    return fecha1.getTime() === fecha2.getTime()
  } else {
    return false // Si alguna fecha no es válida
  }
}

function convertirStringADate(fechaString) {
  // Separar el string en día, mes y año
  const partes = fechaString.split('/')
  if (partes.length === 3) {
    const dia = parseInt(partes[0], 10)
    const mes = parseInt(partes[1], 10) - 1 // Restar 1 porque los meses van de 0 a 11 en JavaScript
    const año = parseInt(partes[2], 10)

    // Crear objeto Date
    const fecha = new Date(año, mes, dia)

    // Validar la fecha
    if (isValidDate(fecha)) {
      return fecha
    } else {
      console.error('Fecha inválida:', fechaString)
      return null
    }
  } else {
    console.error('Formato de fecha incorrecto:', fechaString)
    return null
  }
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

export function FormatoValido(dateString) {
  // Expresión regular para validar el formato DD/MM/AAAA o D/M/AAAA
  const regex = /^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

  // Si el string no coincide con el formato, retorna false
  if (!regex.test(dateString)) {
    return false
  }

  // Divide el string en partes (día, mes, año)
  const parts = dateString.split('/')
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  // Crea una nueva fecha con los valores obtenidos
  const date = new Date(year, month - 1, day)

  // Comprueba si la fecha es válida
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
