import 'dotenv/config'
import { FormatearAgenda } from '../funciones/formatearIA.mjs'

//TT URL API
const urlApp = process.env.GOOGLE_APP_URL + '?'

//TT PETICIONES
const DATOS = {
  functionName: 'ObtenerDatos',
  urlSheet: process.env.SHEET_URL
}

//TT Realizar la petición GET
export async function ObtenerDatos(pag = process.env.PAG_ACTUA) {
  try {
    const data = JSON.parse(JSON.stringify(DATOS))
    data.pagina = pag
    const queryString = Object.keys(data)
      .map((key) => key + '=' + encodeURIComponent(data[key]))
      .join('&')
    const response = await fetch(urlApp + queryString)
    let res = await response.json()
    console.info(`Datos cargados: ${pag}`)
    //ss si es agenda formatear valores
    if (pag === process.env.PAG_ACTUA) {
      res = FormatearAgenda(res)
    }
    return res
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
//FF Pruebas
//await ObtenerDatos(process.env.PAG_ACTUA)

//TT AGENDAR CITA
export async function AgendarCita(obj) {
  try {
    const data = JSON.parse(JSON.stringify(DATOS))
    data.functionName = 'AgendarCita'
    data.pagina = process.env.PAG_ACTUA
    //objeto
    data.fecha = obj.FECHA
    data.hora = obj.HORA
    data.nombre = obj.NOMBRE
    data.telefono = obj.TELEFONO
    const queryString = Object.keys(data)
      .map((key) => key + '=' + encodeURIComponent(data[key]))
      .join('&')
    const response = await fetch(urlApp + queryString)
    const res = await response.text()

    if (res === 'OK') {
      console.info(`llama de agendar cita correta: ${res}`)
      return true
    } else {
      console.error(`llama de agendar cita error: ${res}`)
      return false
    }
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

//TT CANCELAR CITA
export async function CancelarCita(obj) {
  try {
    const data = JSON.parse(JSON.stringify(DATOS))
    data.functionName = 'CancelarCita'
    data.pagina = process.env.PAG_ACTUA
    //objeto
    data.fecha = obj.FECHA
    data.hora = obj.HORA
    console.log('envia', data)
    const queryString = Object.keys(data)
      .map((key) => key + '=' + encodeURIComponent(data[key]))
      .join('&')
    const response = await fetch(urlApp + queryString)
    const res = await response.text()

    if (res === 'OK') {
      console.info(`llamada de cancelar cita correta: ${res}`)
      return true
    } else {
      console.error(`llama de cancelar cita error: ${res}`)
      return false
    }
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}
