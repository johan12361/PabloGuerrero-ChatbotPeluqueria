import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
// TT MODULOS
import { CRONO } from './src/funciones/notificar.mjs'
import { flowBienvenidad } from './src/flujos/flowBienvenidad.mjs'

const FLUJOS_ENTRADA = [flowBienvenidad]

const PORT = process.env.PORT ?? 3000

// TT INICIAR BOT
const main = async () => {
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow(FLUJOS_ENTRADA)
  const adapterProvider = createProvider(BaileysProvider)

  //SS DEBUGS
  //EXTADO_CONEXION(adapterProvider)
  CRONO(adapterProvider)

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  httpServer(+PORT)
}

main()
