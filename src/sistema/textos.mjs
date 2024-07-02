import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos } from '../APIs/APIGoogleApp.mjs'
//TT MENSAJES
export const MENSAJES = {
  SALUDO: 'xxx',
  ADIOS: '',
  RECORDATORIO: ''
}
//TT INFO
export const INFO = {
  SHOP: '',
  CHATBOT: ''
}

//TT ACTUALIZAR
export async function ACTUALIZAR() {
  const msj = await ObtenerDatos(process.env.PAG_MSJ)
  if (msj !== null) {
    MENSAJES.SALUDO = msj[0].SALUDO
    MENSAJES.ADIOS = msj[0].ADIOS
    MENSAJES.RECORDATORIO = msj[0].RECORDATORIO
  }
  const info = await ObtenerDatos(process.env.PAG_INFO)
  if (info !== null) {
    INFO.SHOP = info[0].SHOP
    INFO.CHATBOT = info[0].CHATBOT
  }
  Refactorizar()
}

function Refactorizar() {
  MENSAJES.SALUDO = reemplazarMensaje('#SHOP', INFO.SHOP, MENSAJES.SALUDO)
  MENSAJES.SALUDO = reemplazarMensaje('#CHATBOT', INFO.CHATBOT, MENSAJES.SALUDO)
  MENSAJES.ADIOS = reemplazarMensaje('#SHOP', INFO.SHOP, MENSAJES.ADIOS)
  MENSAJES.ADIOS = reemplazarMensaje('#CHATBOT', INFO.CHATBOT, MENSAJES.ADIOS)
  MENSAJES.RECORDATORIO = reemplazarMensaje('#SHOP', INFO.SHOP, MENSAJES.RECORDATORIO)
  MENSAJES.RECORDATORIO = reemplazarMensaje('#CHATBOT', INFO.CHATBOT, MENSAJES.RECORDATORIO)
}

function reemplazarMensaje(tag, valor, mensaje) {
  if (mensaje.includes(tag)) {
    return mensaje.replace(tag, valor)
  } else {
    return mensaje
  }
}
