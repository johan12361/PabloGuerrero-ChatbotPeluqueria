import { FormatoValido } from '../funciones/tiempo.mjs'

//TT FORMATAER DATOS DE AGENDA
export function FormatearAgenda(agenda) {
  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].FECHA !== '') {
      // Dividir la fecha en partes (DD/MM/AAAA)
      const partes = agenda[i].FECHA.split('/')
      const dia = parseInt(partes[0], 10)
      const mes = parseInt(partes[1], 10)
      const anio = parseInt(partes[2], 10)
      agenda[i].FECHA = dia + '/' + mes + '/' + anio
    }
    if (agenda[i].HORA !== '') {
      // Dividir la fecha en partes (DD/MM/AAAA)
      const partesHora = agenda[i].HORA.split(':')
      let hora = partesHora[0]
      const minutos = partesHora[1]
      hora = hora.padStart(2, '0')
      agenda[i].HORA = hora + ':' + minutos
    }
  }
  return agenda
}

//TT FILTRAR LISTA DE CITAS DISPONIBLES
export function CitasLibre(agenda) {
  let txt = ''
  let cabeza = 'FECHA'
  let total = ''
  let cont = 0

  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].FECHA !== cabeza) {
      txt = `${txt}\n\n 🗓️ *Para: ${agenda[i].FECHA}*`
      cabeza = agenda[i].FECHA
    }
    if (agenda[i].ESTADO === 'disponible') {
      txt = `${txt}\n ✅ *${agenda[i].HORA}*  ${agenda[i].ESTADO}`
      total = `${total}\n Fecha: ${agenda[i].FECHA} Hora: ${agenda[i].HORA} Estado: ${agenda[i].ESTADO}`
      cont++
    }
  }
  if (cont === 0) {
    return null
  }
  console.log('Citas disponibles: ', total)
  return [txt, total]
}
//TT FILTAR CITAS ACTUALES
export function CitasActuales(agenda, num) {
  let citas = ''
  let cont = 0
  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].TELEFONO.includes(num)) {
      citas = `${citas}cita el Dia: ${agenda[i].FECHA} Hora: ${agenda[i].HORA}\n`
      cont++
    }
  }
  if (cont === 0) {
    return null
  }
  console.log(`citas actuales de: ${num}`, citas)
  return citas
}

//TT LIMPIAR AGENDA
export function LimpiarAgenda(agenda) {
  const data = []
  for (let i = 0; i < agenda.length; i++) {
    if (FormatoValido(agenda[i].FECHA)) {
      data.push(agenda[i])
    }
  }
  if (data.length === 0) {
    return null
  } else {
    return data
  }
}

//TT QUITAR SALTOS DE LINEA
export function BorrarSaltos(str) {
  return str.replace(/(\r\n|\n|\r)+$/gm, '')
}

//TT VALIDAR OBJETO PARA AGENDAR
export function ObjAgendar(str) {
  // Expresión regular para extraer las partes del string
  const regex = /^(\d{1,2}\/\d{1,2}\/\d{4})-(\d{1,2}:\d{1,2})-(.+)$/
  // Verificar si el string coincide con el formato
  const match = str.match(regex)
  if (!match) {
    return null
  }
  // Extraer las partes del string
  const fecha = match[1]
  const hora = match[2]
  const nombre = match[3]
  // Construir el objeto
  const objeto = {
    FECHA: fecha,
    HORA: hora,
    NOMBRE: nombre
  }
  return objeto
}

//TT VALIDAR OBJETO PARA CANCELAR AGANEDA
export function ObjCancelar(str) {
  // Expresión regular para extraer las partes del string
  const regex = /(\d{1,2}\/\d{1,2}\/\d{4})-(\d{1,2}:\d{1,2})/
  // Verificar si el string coincide con el formato
  const match = str.match(regex)
  if (!match) {
    return null
  }
  // Extraer las partes del string
  const fecha = match[1]
  const hora = match[2]
  // Construir el objeto
  const objeto = {
    FECHA: fecha,
    HORA: hora
  }
  console.log('OK', objeto)
  return objeto
}
