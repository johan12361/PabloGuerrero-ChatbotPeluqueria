import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos, ObtenerTxtDoc } from '../APIs/APIGoogleApp.mjs'
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
  RANGO_HORAS: '02:25',
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
//TT INFORMACION DE REFERENCIA
export const TXTREF = {
  INFOBUSS: ''
}

//TT ACTUALIZAR
export async function ACTUALIZAR() {
  //ss obtener mensajes
  const msj = await ObtenerDatos(process.env.PAG_MSJ)
  if (msj !== null) {
    MENSAJES.SALUDO = msj[0].SALUDO
    MENSAJES.ADIOS = msj[0].ADIOS
    MENSAJES.RECORDATORIO = msj[0].RECORDATORIO
    MENSAJES.SIN_CITAS_DISP = msj[0].CITAS_NO_DISPONIBLES
    MENSAJES.AYUDA = msj[0].AYUDA
  }
  //ss obtener info
  console.table(MENSAJES)
  const inf = await ObtenerDatos(process.env.PAG_INFO)
  if (inf !== null) {
    INFO.RANGO_DIAS = parseInt(inf[0].RANGO_DIAS, 10)
    INFO.RANGO_HORAS = inf[0].RANGO_HORAS
    INFO.NUMERO_CONTACTO = inf[0].NUMERO_CONTACTO
    //transformar datos
    INFO.NOTI_AGENDAR = inf[0].NOTI_AGENDAR === 'true'
    INFO.NOTI_CANCELAR = inf[0].NOTI_CANCELAR === 'true'
    NOTIFICACION.NOTIFICAR = inf[0].NOTIFICAR === 'true'
    //asignar hora
    const _hora = inf[0].HORA_NOTI.split(':')
    NOTIFICACION.HORA = parseInt(_hora[0], 10)
    NOTIFICACION.MINUTO = parseInt(_hora[1], 10)
  }
  //ss obtener info business
  const txtInfo = await ObtenerTxtDoc(process.env.DOC_INFO_BUSS)
  if (txtInfo !== null) {
    TXTREF.INFOBUSS = `\n\nUSA SOLAMENTE LA SIGUIENTE INFORMACION PARA RESPONDER A LAS PREGUNTAS DEL CLIENTE, SE CONCISO Y NO INVENTES NADA FUERA EL TEXTO:\n\n ${txtInfo}`
    console.info('TXTREF.INFOBUSS CARGADO')
  } else {
    TXTREF.INFOBUSS = ''
  }

  //SS IMPRIMIR
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
    INFO.RANGO_HORAS = inf[0].RANGO_HORAS
    INFO.NUMERO_CONTACTO = inf[0].NUMERO_CONTACTO
    //transformar datos
    INFO.NOTI_AGENDAR = inf[0].NOTI_AGENDAR === 'true'
    INFO.NOTI_CANCELAR = inf[0].NOTI_CANCELAR === 'true'
    NOTIFICACION.NOTIFICAR = inf[0].NOTIFICAR === 'true'
    //asignar hora
    const _hora = inf[0].HORA_NOTI.split(':')
    NOTIFICACION.HORA = parseInt(_hora[0], 10)
    NOTIFICACION.MINUTO = parseInt(_hora[1], 10)
  }
  console.table(INFO)
  console.table(NOTIFICACION)

  //SS REINICIAR CRON
  ReiniciarCron()
}

//TT ACTUALIZAR GUION
export async function ActuaTxt() {
  //ss obtener info business
  const txtInfo = await ObtenerTxtDoc(process.env.DOC_INFO_BUSS)
  if (txtInfo !== null) {
    TXTREF.INFOBUSS = `\n\nUSA SOLAMENTE LA SIGUIENTE INFORMACION PARA RESPONDER A LAS PREGUNTAS DEL CLIENTE, SE CONCISO Y NO INVENTES NADA FUERA EL TEXTO:\n\n ${txtInfo}`
    console.info('TXTREF.INFOBUSS CARGADO:')
    console.info(TXTREF.INFOBUSS)
  } else {
    TXTREF.INFOBUSS = ''
  }
}
