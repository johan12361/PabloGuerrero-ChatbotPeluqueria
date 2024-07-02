import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { start } from './idle.mjs'
import { Esperar } from '../funciones/tiempo.mjs'
import { MENSAJES } from '../sistema/textos.mjs'

// TT VARIABLES
const idleTime = 180

// TT FLUJO ENTRADA
export const flowBienvenidad = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    // ff Star IDLE
    start(ctx, gotoFlow, idleTime)
    await Esperar(1)
    await flowDynamic(MENSAJES.SALUDO)
  }
)
