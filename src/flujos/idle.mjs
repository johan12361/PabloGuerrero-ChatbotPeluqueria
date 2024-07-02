import { addKeyword, EVENTS } from '@builderbot/bot'

// TT Objeto para almacenar temporizadores para cada usuario
const timers = {}

// TT Flujo para manejar la inactividad
export const idleFlow = addKeyword(EVENTS.ACTION).addAction(async (ctx, { gotoFlow, flowDynamic, endFlow }) => {
  console.log(`Sesion Cerrada para ${ctx.name} con el numero: ${ctx.from}`)
  return endFlow()
})

// TT Función para iniciar el temporizador de inactividad para un usuario
export const start = (ctx, gotoFlow, sgs) => {
  timers[ctx.from] = setTimeout(() => {
    return gotoFlow(idleFlow)
  }, sgs * 1000)
}

// TT Función para reiniciar el temporizador de inactividad para un usuario
export const reset = (ctx, gotoFlow, sgs) => {
  stop(ctx)
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from])
  }
  start(ctx, gotoFlow, sgs)
}

// TT Función para detener el temporizador de inactividad para un usuario
export const stop = (ctx) => {
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from])
  }
}
