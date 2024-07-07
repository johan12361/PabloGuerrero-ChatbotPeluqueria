import 'dotenv/config'
import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { reset, stop } from './idle.mjs'
import { EnviarGemini, LimpiarHistorial } from '../APIs/APIgeminiIA.mjs'
import { MENSAJES } from '../sistema/textos.mjs'
//TT FLUJOS
import { fluConsultarDisponibles } from './flowIAgendarCita.mjs'
import { fluCitasActuales } from './flowIACancelarCita.mjs'

const time = 300

//TT FLUJO SALUDO
export const fluIASaludo = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { flowDynamic, gotoFlow, endFlow, provider }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    const respuesta = await EnviarGemini(ctx.body, ctx.from, { estado: 'WELCOME' })
    if (respuesta === null) {
      return endFlow('Servicio no disponible, intenta mas tarde')
    } else {
      console.log(respuesta)
      //ss consultar agenda disponible
      if (respuesta.includes('#CITA-DISPONIBLE#')) {
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluConsultarDisponibles)
      }
      //ss consultar citas actuales
      else if (respuesta.includes('#CITA-ACTUAL#')) {
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluCitasActuales)
      }
      //ss Adios
      else if (respuesta.includes('#ADIOS#')) {
        LimpiarHistorial(ctx.from)
        stop(ctx)
        return endFlow(MENSAJES.ADIOS)
      }
      //ss conversacion IA
      else {
        await flowDynamic(respuesta)
        return gotoFlow(fluIAEntrada)
      }
    }
  }
)

//TT FLUJO ENTRADA
export const fluIAEntrada = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, provider }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    const respuesta = await EnviarGemini(ctx.body, ctx.from, { estado: 'WELCOME' })
    if (respuesta === null) {
      return endFlow('Servicio no disponible, intenta mas tarde')
    } else {
      console.log(respuesta)
      //ss consultar agenda disponible
      if (respuesta.includes('#CITA-DISPONIBLE#')) {
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluConsultarDisponibles)
      }
      //ss consultar citas actuales
      else if (respuesta.includes('#CITA-ACTUAL#')) {
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluCitasActuales)
      }
      //ss Adios
      else if (respuesta.includes('#ADIOS#')) {
        LimpiarHistorial(ctx.from)
        stop(ctx)
        return endFlow(MENSAJES.ADIOS)
      }
      //ss conversacion IA
      else {
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return fallBack(respuesta)
      }
    }
  }
)
