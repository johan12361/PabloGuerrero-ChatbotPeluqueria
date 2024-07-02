import cron from 'node-cron'
import 'dotenv/config'
//TT MODULOS
import { ObtenerHorario } from '../APIs/APIGoogleApp.mjs'
import { ObtenerFechaActual, ObtenerHoraActual, CompararFechas, Esperar } from '../funciones/tiempo.mjs'

//TT VARIABLES
let AGENDA = []
const intMensajes = 10
const numero = '573013523033' + '@s.whatsapp.net'

//TT EVENTO CRONO
export async function CRONO(proveedor) {
  cron.schedule('* * * * *', async () => {
    //SS Si esta conectado
    if (proveedor.store?.state?.connection === 'open') {
      const agenda = await ObtenerHorario()
      if (agenda !== null) {
        //SS Guardar agenda
        AGENDA = agenda
        EnviarMensajes(proveedor)
      } else {
        //Si hay error al cargar base de datos
        await proveedor.sendText(numero, 'error al cargar base de datos')
      }
    } else {
      //
      console.log('sin conectar a proveedor')
    }
  })
}

//TT ENVIAR MENSAJES
async function EnviarMensajes(proveedor) {
  const fecha = ObtenerFechaActual()
  const hora = ObtenerHoraActual()
  console.info(fecha)
  console.info(hora)
  //SS Si la fecha es la actual
  for (let i = 0; i < AGENDA.length; i++) {
    if (CompararFechas(fecha, AGENDA[i].FECHA)) {
      const valido = ComprobarEstructura(AGENDA[i])
      //SS Si el objeto es valido
      if (valido) {
        await Esperar(intMensajes)
        const dest = AGENDA[i].TELEFONO + '@s.whatsapp.net'
        try {
          //SS Enviar mensaje
          await proveedor.sendText(dest, 'recuerda tu cita')
          AGENDA[i].ESTADO = 'Notificado'
          console.info(`mensaje enviado a: ${AGENDA[i].NOMBRE} Tel: ${AGENDA[i].TELEFONO}`)
        } catch (error) {
          //SS No se logra enviar mensaje
          console.warn('no se pudo enviar mensaje a: ', JSON.stringify(AGENDA[i]))
          AGENDA[i].ESTADO = 'Error al enviar'
        }
      } else {
        //No es un formato valido
        console.warn(`el objeto: ${JSON.stringify(AGENDA[i])} no es valido`)
      }
    } else {
      //No es la Fecha actual
      console.info('no es fecha actual')
    }
  }
  //SS Fin de envio de mensajes
  console.info('Fin de envio de mensajes')
}

//TT COMPROBAR ESTRUCTURA DE DATOS
function ComprobarEstructura(objeto) {
  const propiedadesNecesarias = ['FECHA', 'HORA', 'NOMBRE', 'TELEFONO', 'ESTADO']
  return propiedadesNecesarias.every((propiedad) => propiedad in objeto && objeto[propiedad] !== '')
}
