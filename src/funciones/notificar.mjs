import cron from 'node-cron'
import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos } from '../APIs/APIGoogleApp.mjs'
import { ObtenerFechaActual, CompararFechas, Esperar } from '../funciones/tiempo.mjs'
import { EnviarMensaje } from '../sistema/proveedor.mjs'
import { NOTIFICACION, MENSAJES } from '../sistema/textos.mjs'

//TT VARIABLES
const intMensajes = 60 //FF MOCIDIFICAR****************************************
export let TEREANOTI = null
let PROV = null
//const numero = '573013523033' + '@s.whatsapp.net'

//TT EVENTO CRONO
export async function CRONO(proveedor) {
  PROV = proveedor
  //SS Comprobar que haya un tiempo valido
  if (NOTIFICACION.NOTIFICAR) {
    TEREANOTI = cron.schedule(`${NOTIFICACION.MINUTO} ${NOTIFICACION.HORA} * * *`, async () => {
      //SS Si esta conectado
      if (proveedor.store?.state?.connection === 'open') {
        const agenda = await ObtenerDatos()
        if (agenda !== null) {
          //SS Guardar agenda
          EnviarNotificacion(agenda)
        } else {
          console.error('Error al conectar con API')
        }
      } else {
        console.log('sin conectar a proveedor')
      }
    })
  }
}

//TT ENVIAR NOTIFICACION
async function EnviarNotificacion(AGENDA) {
  const fecha = ObtenerFechaActual()
  console.info(`Enviando recordatorios del dia: ${fecha}`)
  let contar = 0
  let posibles = 0
  //SS Si la fecha es la actual
  for (let i = 0; i < AGENDA.length; i++) {
    if (CompararFechas(fecha, AGENDA[i].FECHA)) {
      const valido = ComprobarEstructura(AGENDA[i])
      //SS Si el objeto es valido
      if (valido && AGENDA[i].ESTADO !== 'disponible' && AGENDA[i].NOTIFICADO === 'NO') {
        posibles++
        await Esperar(intMensajes)
        if (NOTIFICACION.NOTIFICAR) {
          console.info(
            `enviando recordatorio a: ${AGENDA[i].NOMBRE} con numero: ${AGENDA[i].TELEFONO} la cita es a las: ${AGENDA[i].HORA}`
          )
          //ss enviar recordatorio
          const _res = await EnviarMensaje(AGENDA[i].TELEFONO, MENSAJES.RECORDATORIO)
          if (_res === 'OK') {
            console.info(`recordatorio enviado correctamente a: ${AGENDA[i].TELEFONO}`)
            contar++
          } else {
            console.warn(`no se logro enviar recordatorio a:  ${AGENDA[i].TELEFONO}`)
          }
        } else {
          console.warn('se cancelo envio de recordarorios')
        }
      }
    }
  }
  //SS Fin de envio de mensajes
  console.info(`Fin de envio de recordatorios, Total enviados: ${contar} de ${posibles}`)
}

//TT COMPROBAR ESTRUCTURA DE DATOS
function ComprobarEstructura(objeto) {
  const propiedadesNecesarias = ['FECHA', 'HORA', 'NOMBRE', 'TELEFONO', 'ESTADO', 'NOTIFICADO']
  return propiedadesNecesarias.every((propiedad) => propiedad in objeto && objeto[propiedad] !== '')
}

//TT ACTUALIZAR CRONO
export function ReiniciarCron() {
  if (TEREANOTI !== null && PROV !== null) {
    try {
      TEREANOTI.stop()
      CRONO(PROV)
    } catch (error) {
      console.error('no se pudo reiniciar CRON', error)
    }
  }
}
