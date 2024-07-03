import 'dotenv/config'
import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { ObtenerDatos, AgendarCita } from '../APIs/APIGoogleApp.mjs'
import { CitasLibre, ObjAgendar } from '../funciones/formatearIA.mjs'
import { reset } from './idle.mjs'
import { EnviarGemini } from '../APIs/APIgeminiIA.mjs'
import { MENSAJES } from '../sistema/textos.mjs'

const time = 240

//TT FLUJO ENTRADA
export const fluIAEntrada = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow, provider }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
    const respuesta = await EnviarGemini(ctx.body, ctx.from, { estado: 'WELCOME' })
    if (respuesta === null) {
      return endFlow('Servicio no disponible, intenta mas tarde')
    } else {
      if (respuesta.includes('#CITA-DISPONIBLE#')) {
        return gotoFlow(fluConsultarDisponibles)
      } else {
        return fallBack(respuesta)
      }
    }
  }
)
//TT FLUJO CONSULTA AGENDA DISPONIBLE
export const fluConsultarDisponibles = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    flowDynamic('⏱️ Consultando Agenda...')
    const agenda = await ObtenerDatos(process.env.PAG_ACTUA)
    if (agenda !== null) {
      console.log(agenda)
      const _libre = CitasLibre(agenda)
      await flowDynamic(_libre[0])
      await state.update({ agendaDisp: _libre[1], agendaTxt: _libre[0] })
    } else {
      return endFlow('Servicio no disponible, intenta mas tarde')
    }
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
      const myState = state.getMyState()
      const contexto = {
        estado: 'AGENDAR',
        agenda: myState.agendaDisp
      }
      let respuesta = await EnviarGemini(ctx.body, ctx.from, contexto)
      if (respuesta === null) {
        return endFlow('Servicio no disponible, intenta mas tarde')
      } else {
        console.log(respuesta)
        const _cita = ObjAgendar(respuesta)
        if (respuesta.includes('#AGENDA#')) {
          respuesta = respuesta.replace('#AGENDA#', myState.agendaTxt)
        } else if (_cita !== null) {
          _cita.TELEFONO = ctx.from
          flowDynamic('⏱️ Agendando cita...')
          const _res = await AgendarCita(_cita)
          if (_res) {
            await flowDynamic('✅ Cita agendada con éxito')
            return endFlow(MENSAJES.ADIOS)
          } else {
            return endFlow('⚠️ Error al agendar cita')
          }
        }
        return fallBack(respuesta)
      }
    }
  )
