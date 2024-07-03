import { FormatoValido } from '../funciones/tiempo.mjs'

//TT LISATCRUDA DE DISPONIBLES
export function CitasLibre(agenda) {
  let txt = '*_lISTA DE CITAS DISPONIBLES_*'
  let cabeza = 'FECHA'
  let total = ''

  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].FECHA !== cabeza) {
      txt = `${txt}\n\n 🗓️ *Para: ${agenda[i].FECHA}*`
      cabeza = agenda[i].FECHA
    }
    if (agenda[i].ESTADO === 'disponible') {
      txt = `${txt}\n ✅ *${agenda[i].HORA}*  ${agenda[i].ESTADO}`
      total = `${total}\n Fecha: ${agenda[i].FECHA} Hora: ${agenda[i].HORA} Estado: ${agenda[i].ESTADO}`
    }
  }
  console.log(total)
  return [txt, total]
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
