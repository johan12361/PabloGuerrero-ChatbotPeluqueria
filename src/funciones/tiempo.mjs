import 'dotenv/config'

export function Esperar(sg) {
  return new Promise((resolve) => setTimeout(resolve, sg * 1000))
}

//TT OBTENER FECHA ACTUAL
export function ObtenerFechaActual() {
  const fecha = new Date()

  // Obteniendo día, mes y año
  const dia = fecha.getDate().toString().padStart(2, '0') // Dos dígitos con cero a la izquierda si es necesario
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Meses van de 0 a 11, sumamos 1 para obtener el mes actual
  const año = fecha.getFullYear()

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
