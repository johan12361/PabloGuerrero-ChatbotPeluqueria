import 'dotenv/config'
import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { ObtenerDatos, AgendarCita, CancelarCita } from '../APIs/APIGoogleApp.mjs'
import { CitasLibre, ObjAgendar, CitasActuales, ObjCancelar } from '../funciones/formatearIA.mjs'
import { reset, stop } from './idle.mjs'
import { EnviarGemini, LimpiarHistorial } from '../APIs/APIgeminiIA.mjs'
import { MENSAJES, INFO } from '../sistema/textos.mjs'
import { EnviarMensaje } from '../sistema/proveedor.mjs'

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

//TT FLUJO CONSULTA AGENDA DISPONIBLE
export const fluConsultarDisponibles = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    reset(ctx, gotoFlow, time) //FF IDLE RESET
    flowDynamic('⏱️ Consultando Agenda...')
    const agenda = await ObtenerDatos(process.env.PAG_ACTUA)
    //ss si la agenda carga
    if (agenda !== null) {
      const _libre = CitasLibre(agenda)
      //ss si hay espacios disponibles
      if (_libre !== null) {
        _libre[0] = `*_lISTA DE CITAS DISPONIBLES_*${_libre[0]}`
        await state.update({ agendaDisp: _libre[1], agendaTxt: _libre[0] })
        await flowDynamic(_libre[0])
        await flowDynamic('Dime en que fecha y hora deseas agendar')
      }
      //ss si no hay espacios disponibles
      else {
        await flowDynamic(MENSAJES.SIN_CITAS_DISP)
        await flowDynamic(MENSAJES.AYUDA)
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluIAEntrada)
      }
    }
    //ss error al cargar la agenda
    else {
      await flowDynamic('Servicio no disponible, intenta más tarde')
      await flowDynamic(MENSAJES.AYUDA)
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      return gotoFlow(fluIAEntrada)
    }
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      const contexto = {
        estado: 'AGENDAR',
        agenda: state.get('agendaDisp')
      }
      let respuesta = await EnviarGemini(ctx.body, ctx.from, contexto)
      //ss error contactando IA
      if (respuesta === null) {
        await flowDynamic('Servicio no disponible, intenta más tarde')
        await flowDynamic(MENSAJES.AYUDA)
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluIAEntrada)
      }
      //ss Ia responde
      else {
        console.log(respuesta)
        const _cita = ObjAgendar(respuesta)
        //ss remplazar agenda
        if (respuesta.includes('#AGENDA#')) {
          respuesta = respuesta.replace('#AGENDA#', state.get('agendaTxt'))
        }
        //ss ver citas actuales
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
        //ss agendar cita
        else if (_cita !== null) {
          _cita.TELEFONO = ctx.from
          flowDynamic('⏱️ Agendando cita...')
          const _res = await AgendarCita(_cita)
          //ss si se logra agendar
          if (_res) {
            //noticar agendar
            if (INFO.NOTI_AGENDAR) {
              const _msjCan = `Se acaba de agendar cita para el día *${_cita.FECHA}* a la  hora ${_cita.HORA}\n Desde el número de teléfono: *${ctx.from}*\n a Nombre de: *${_cita.NOMBRE}*`
              const msj = await EnviarMensaje(INFO.NUMERO_CONTACTO, _msjCan)
              if (msj !== 'OK') {
                console.warn(
                  'No se pudo enviar mensaje de notificación de cancelación a:' + INFO.NUMERO_CONTACTO
                )
              }
            }
            await flowDynamic('✅ Cita agendada con éxito')
            reset(ctx, gotoFlow, time) //FF IDLE RESET
            await flowDynamic(MENSAJES.AYUDA)
            return gotoFlow(fluIAEntrada)
          }
          //ss error al agendar
          else {
            //error al agendar
            if (INFO.NOTI_AGENDAR) {
              const _msjCan = `NO SE LOGRO agendar cita para el día *${_cita.FECHA}* a la  hora ${_cita.HORA}\n Desde el número de teléfono: *${ctx.from}*\n a Nombre de: *${_cita.NOMBRE}*`
              const msj = await EnviarMensaje(INFO.NUMERO_CONTACTO, _msjCan)
              if (msj !== 'OK') {
                console.warn(
                  'No se pudo enviar mensaje de notificación de cancelación a:' + INFO.NUMERO_CONTACTO
                )
              }
            }
            await flowDynamic('⚠️ Error al agendar cita')
            await flowDynamic(MENSAJES.AYUDA)
            return gotoFlow(fluIAEntrada)
          }
        }
        //ss conversacion IA
        reset(ctx, gotoFlow, time) //FF IDLE RESET
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
      const _actuales = CitasActuales(agenda, ctx.from)
      //ss si existen citas
      if (_actuales !== null) {
        await state.update({ citasActuales: _actuales })
        const _msj = `🗓️ *Actualmente, tienes la siguiente cita:* \n\n${_actuales}`
        await flowDynamic(_msj)
        await flowDynamic('¿Te gustaría cancelar una cita existente?')
      }
      //ss no cuenta con citas
      else {
        await flowDynamic('🗓️ No cuentas con citas en este momento')
        await flowDynamic(MENSAJES.AYUDA)
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluIAEntrada)
      }
    }
    //ss no se puede cargar la agenda
    else {
      await flowDynamic('Servicio no disponible, intenta más tarde')
      await flowDynamic(MENSAJES.AYUDA)
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      return gotoFlow(fluIAEntrada)
    }
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      reset(ctx, gotoFlow, time) //FF IDLE RESET
      const contexto = {
        estado: 'MODIFICAR',
        agenda: state.get('citasActuales')
      }
      let respuesta = await EnviarGemini(ctx.body, ctx.from, contexto)
      //ss error contactando IA
      if (respuesta === null) {
        await flowDynamic('Servicio no disponible, intenta más tarde')
        await flowDynamic(MENSAJES.AYUDA)
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return gotoFlow(fluIAEntrada)
      }
      //ss Ia responde
      else {
        console.log(respuesta)
        const _cita = ObjCancelar(respuesta)
        //ss remplazar agenda
        if (respuesta.includes('#AGENDA#')) {
          respuesta = respuesta.replace('#AGENDA#', state.get('citasActuales'))
        }
        //ss ver citas actuales
        else if (respuesta.includes('#CITA-DISPONIBLE#')) {
          reset(ctx, gotoFlow, time) //FF IDLE RESET
          return gotoFlow(fluConsultarDisponibles)
        }
        //ss Adios
        else if (respuesta.includes('#ADIOS#')) {
          LimpiarHistorial(ctx.from)
          stop(ctx)
          return endFlow(MENSAJES.ADIOS)
        }
        //ss agendar cita
        else if (_cita !== null) {
          flowDynamic('⏱️ Cancelando cita...')
          const _res = await CancelarCita(_cita)
          //ss si se logra agendar
          if (_res) {
            await flowDynamic('✅ Cita cancelada con éxito')
            await flowDynamic(MENSAJES.AYUDA)
            reset(ctx, gotoFlow, time) //FF IDLE RESET
            //noticar cancelar
            if (INFO.NOTI_CANCELAR) {
              const _msjCan = `Se acaba de cancelar cita del día *${_cita.FECHA}* de la  hora ${_cita.HORA}\n Desde el número de teléfono: *${ctx.from}*`
              const msj = await EnviarMensaje(INFO.NUMERO_CONTACTO, _msjCan)
              if (msj !== 'OK') {
                console.warn(
                  'No se pudo enviar mensaje de notificación de cancelación a:' + INFO.NUMERO_CONTACTO
                )
              }
            }
            return gotoFlow(fluIAEntrada)
          }
          //ss error al agendar
          else {
            await flowDynamic('⚠️ Error al cancelar cita')
            await flowDynamic(MENSAJES.AYUDA)
            reset(ctx, gotoFlow, time) //FF IDLE RESET
            //noticar error
            if (INFO.NOTI_CANCELAR) {
              const _msjCan = `NO SE PUDO -  cancelar cita del día *${_cita.FECHA}* de la  hora *${_cita.HORA}*\n Desde el número de teléfono: *${ctx.from}*`
              const msj = await EnviarMensaje(INFO.NUMERO_CONTACTO, _msjCan)
              if (msj !== 'OK') {
                console.warn(
                  'No se pudo enviar mensaje de notificación de cancelación a:' + INFO.NUMERO_CONTACTO
                )
              }
            }
            return gotoFlow(fluIAEntrada)
          }
        }
        //ss conversacion IA
        reset(ctx, gotoFlow, time) //FF IDLE RESET
        return fallBack(respuesta)
      }
    }
  )
