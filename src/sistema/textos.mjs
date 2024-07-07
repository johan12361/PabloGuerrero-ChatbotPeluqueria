import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos } from '../APIs/APIGoogleApp.mjs'
//TT MENSAJES
export const MENSAJES = {
  SALUDO: '',
  ADIOS: '',
  RECORDATORIO: '',
  SIN_CITAS_DISP: '',
  AYUDA: '¿Necesitas algo más? Dime en qué más puedo ayudarte. 💡✨'
}
//TT INFO
export const INFO = {
  RANGO_DIAS: 0,
  NUMERO_CONTACTO: 'X',
  URL_DOC_INFO: '',
  NOTI_AGENDAR: false,
  NOTI_CANCELAR: false
}
//TT NOTIFICACION
export const NOTIFICACION = {
  NOTIFICAR: false,
  HORA: '',
  MINUTO: ''
}

//TT ACTUALIZAR
export async function ACTUALIZAR() {
  const msj = await ObtenerDatos(process.env.PAG_MSJ)
  if (msj !== null) {
    MENSAJES.SALUDO = msj[0].SALUDO
    MENSAJES.ADIOS = msj[0].ADIOS
    MENSAJES.RECORDATORIO = msj[0].RECORDATORIO
    MENSAJES.SIN_CITAS_DISP = msj[0].CITAS_NO_DISPONIBLES
    MENSAJES.AYUDA = msj[0].AYUDA
  }
  console.table(MENSAJES)
  const inf = await ObtenerDatos(process.env.PAG_INFO)
  if (msj !== null) {
    INFO.RANGO_DIAS = parseInt(inf[0].RANGO_DIAS, 10)
    INFO.NUMERO_CONTACTO = inf[0].NUMERO_CONTACTO
    INFO.URL_DOC_INFO = inf[0].URL_DOC_INFO
    if (inf[0].NOTI_AGENDAR === 'true') {
      INFO.NOTI_AGENDAR = true
    } else {
      INFO.NOTI_AGENDAR = false
    }
    if (inf[0].NOTI_CANCELAR === 'true') {
      INFO.NOTI_CANCELAR = true
    } else {
      INFO.NOTI_CANCELAR = false
    }
    //SS NOTIFICACION DE RECORDATORIO
    if (inf[0].NOTIFICAR === 'true') {
      NOTIFICACION.NOTIFICAR = true
    } else {
      NOTIFICACION.NOTIFICAR = false
    }
    const _hora = inf[0].HORA_NOTI.split(':')
    NOTIFICACION.HORA = parseInt(_hora[0], 10)
    NOTIFICACION.MINUTO = parseInt(_hora[1], 10)
  }
  console.table(INFO)
  console.table(NOTIFICACION)
}
