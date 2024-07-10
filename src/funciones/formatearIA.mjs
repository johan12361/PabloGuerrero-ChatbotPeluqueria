import 'dotenv/config'
import { FormatoValido } from '../funciones/tiempo.mjs'
import { INFO } from '../sistema/textos.mjs'

//TT FORMATAER DATOS DE AGENDA PARA EVITAR DATOS VACIOS
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
export function CitasLibre(agd) {
  const agenda = AgendaApartirDeHoy(agd)
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
  return [txt, total]
}

//ss obtener fechas actuales
function AgendaApartirDeHoy(agenda) {
  //fechas
  const fechaMinima = new Date()
  const [hours, minutes] = INFO.RANGO_HORAS.split(':').map(Number)
  let fechaLimite = null

  if (INFO.RANGO_DIAS >= 0) {
    fechaLimite = new Date(fechaMinima)
    fechaLimite.setDate(fechaMinima.getDate() + INFO.RANGO_DIAS)
  } else {
    fechaLimite = new Date(fechaMinima)
    fechaLimite.setDate(fechaMinima.getDate() + 30)
  }
  fechaMinima.setHours(fechaMinima.getHours() + hours)
  fechaMinima.setMinutes(fechaMinima.getMinutes() + minutes)

  const _agenda = []
  for (let i = 0; i < agenda.length; i++) {
    //fecha
    const partesFecha = agenda[i].FECHA.split('/')
    const dia = parseInt(partesFecha[0], 10)
    const mes = parseInt(partesFecha[1], 10) - 1 // Meses en Date empiezan en 0
    const anio = parseInt(partesFecha[2], 10)
    const fechaObj = new Date(anio, mes, dia)
    const [hours, minutes] = agenda[i].HORA.split(':').map(Number)
    fechaObj.setHours(hours, minutes)
    //hora
    if (fechaObj >= fechaMinima && fechaObj <= fechaLimite) {
      _agenda.push(agenda[i])
    }
  }
  return _agenda
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

//FF LIMPIAR AGENDA**********revisar implementacion
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
