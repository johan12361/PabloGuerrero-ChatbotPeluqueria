import 'dotenv/config'
import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { ObtenerDatos, AgendarCita, CancelarCita } from '../APIs/APIGoogleApp.mjs'
import { CitasLibre, ObjAgendar, CitasActuales, ObjCancelar } from '../funciones/formatearIA.mjs'
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
      //ss consultar agenda disponible
      if (respuesta.includes('#CITA-DISPONIBLE#')) {
        return gotoFlow(fluConsultarDisponibles)
      }
      //ss consultar citas actuales
      else if (respuesta.includes('#CITA-ACTUAL#')) {
        return gotoFlow(fluCitasActuales)
      }
      //ss conversacion IA
      else {
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
    //ss si la agenda carga
    if (agenda !== null) {
      console.log(agenda)
      const _libre = CitasLibre(agenda)
      //ss si hay espacios disponibles
      if (_libre !== null) {
        _libre[0] = `*_lISTA DE CITAS DISPONIBLES_*${_libre[0]}`
        await state.update({ agendaDisp: _libre[1], agendaTxt: _libre[0] })
        await flowDynamic(_libre[0])
      }
      //ss si no hay espacios disponibles
      else {
        return endFlow(MENSAJES.SIN_CITAS_DISP)
      }
    }
    //ss error al cargar la agenda
    else {
      return endFlow('Servicio no disponible, intenta más tarde')
    }
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
      const contexto = {
        estado: 'AGENDAR',
        agenda: state.get('agendaDisp')
      }
      let respuesta = await EnviarGemini(ctx.body, ctx.from, contexto)
      //ss error contactando IA
      if (respuesta === null) {
        return endFlow('Servicio no disponible, intenta mas tarde')
      }
      //ss Ia responde
      else {
        console.log(respuesta)
        const _cita = ObjAgendar(respuesta)
        //ss remplazar agenda
        if (respuesta.includes('#AGENDA#')) {
          respuesta = respuesta.replace('#AGENDA#', state.get('agendaTxt'))
        }
        //ss agendar cita
        else if (_cita !== null) {
          _cita.TELEFONO = ctx.from
          flowDynamic('⏱️ Agendando cita...')
          const _res = await AgendarCita(_cita)
          //ss si se logra agendar
          if (_res) {
            await flowDynamic('✅ Cita agendada con éxito')
            return endFlow(MENSAJES.ADIOS)
          }
          //ss error al agendar
          else {
            return endFlow('⚠️ Error al agendar cita')
          }
        }
        //ss conversacion IA
        return fallBack(respuesta)
      }
    }
  )

//TT FlUJO CITAS ACTUALES DEL CLIENTE
export const fluCitasActuales = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    flowDynamic('⏱️ Consultando Agenda...')
    const agenda = await ObtenerDatos(process.env.PAG_ACTUA)
    if (agenda !== null) {
      console.log(agenda)
      const _actuales = CitasActuales(agenda, ctx.from)
      //ss si existen citas
      if (_actuales !== null) {
        await state.update({ citasActuales: _actuales })
        const _msj = `🗓️ *Actualmente, tienes la siguiente cita:* \n\n${_actuales}`
        await flowDynamic(_msj)
        await flowDynamic('¿Te gustaría cancelar o modificar una cita existente?')
      }
      //ss no cuenta con citas
      else {
        await flowDynamic('🗓️ No cuentas con citas en este momento')
        return gotoFlow(fluIAEntrada)
      }
    }
    //ss no se puede cargar la agenda
    else {
      return endFlow('Servicio no disponible, intenta más tarde')
    }
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
      const contexto = {
        estado: 'MODIFICAR',
        agenda: state.get('citasActuales')
      }
      let respuesta = await EnviarGemini(ctx.body, ctx.from, contexto)
      //ss error contactando IA
      if (respuesta === null) {
        return endFlow('Servicio no disponible, intenta mas tarde')
      }
      //ss Ia responde
      else {
        const _cita = ObjCancelar(respuesta)
        console.log(respuesta)
        //ss remplazar agenda
        if (respuesta.includes('#AGENDA#')) {
          respuesta = respuesta.replace('#AGENDA#', state.get('citasActuales'))
        }
        //ss agendar cita
        else if (_cita !== null) {
          flowDynamic('⏱️ Cancelando cita...')
          const _res = await CancelarCita(_cita)
          //ss si se logra agendar
          if (_res) {
            await flowDynamic('✅ Cita cancelada con éxito')
            return endFlow(MENSAJES.ADIOS)
          }
          //ss error al agendar
          else {
            return endFlow('⚠️ Error al cancelar cita')
          }
        }
        //ss conversacion IA
        return fallBack(respuesta)
      }
    }
  )
