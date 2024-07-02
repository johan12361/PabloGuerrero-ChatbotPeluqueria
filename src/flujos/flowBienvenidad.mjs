import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { start } from './idle.mjs'

// TT VARIABLES
const idleTime = 180
const txtBienvenidad = 'Hola!!!'

// TT FLUJO ENTRADA
export const flowBienvenidad = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    // ff Star IDLE
    start(ctx, gotoFlow, idleTime)
    await flowDynamic(txtBienvenidad)
  }
)
