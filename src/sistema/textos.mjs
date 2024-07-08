import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos } from '../APIs/APIGoogleApp.mjs'
import { ReiniciarCron } from '../funciones/notificar.mjs'
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
  NOTI_AGENDAR: false,
  NOTI_CANCELAR: false
}
//TT NOTIFICACION
export const NOTIFICACION = {
  NOTIFICAR: false,
  HORA: '8',
  MINUTO: '0'
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
  if (inf !== null) {
    INFO.RANGO_DIAS = parseInt(inf[0].RANGO_DIAS, 10)
    INFO.NUMERO_CONTACTO = inf[0].NUMERO_CONTACTO
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

  //SS REINICIAR CRON
  ReiniciarCron()
}

//TT ACTUALIZAR MENSAJES
export async function ActuaMsj() {
  const msj = await ObtenerDatos(process.env.PAG_MSJ)
  if (msj !== null) {
    MENSAJES.SALUDO = msj[0].SALUDO
    MENSAJES.ADIOS = msj[0].ADIOS
    MENSAJES.RECORDATORIO = msj[0].RECORDATORIO
    MENSAJES.SIN_CITAS_DISP = msj[0].CITAS_NO_DISPONIBLES
    MENSAJES.AYUDA = msj[0].AYUDA
  }
  console.table(MENSAJES)
}

//TT ACTUALIZAR INFO
export async function ActuaInfo() {
  const inf = await ObtenerDatos(process.env.PAG_INFO)
  if (inf !== null) {
    INFO.RANGO_DIAS = parseInt(inf[0].RANGO_DIAS, 10)
    INFO.NUMERO_CONTACTO = inf[0].NUMERO_CONTACTO
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

  //SS REINICIAR CRON
  ReiniciarCron()
}
