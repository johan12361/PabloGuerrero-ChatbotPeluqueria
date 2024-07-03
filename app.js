import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
// TT MODULOS
import { ESTADO_CONEXION } from './src/sistema/estado_Conexion.mjs'
//import { CRONO } from './src/funciones/notificar.mjs'
import { ACTUALIZAR } from './src/sistema/textos.mjs'
import { idleFlow } from './src/flujos/idle.mjs'
import { flowBienvenidad } from './src/flujos/flowBienvenidad.mjs'
import { fluIAEntrada, fluConsultarDisponibles, fluCitasActuales } from './src/flujos/flowIA.mjs'

const FLUJOS_ENTRADA = [flowBienvenidad, idleFlow, fluIAEntrada, fluConsultarDisponibles, fluCitasActuales]

const PORT = process.env.PORT ?? 3000

// TT INICIAR BOT
const main = async () => {
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow(FLUJOS_ENTRADA)
  const adapterProvider = createProvider(BaileysProvider, { timeRelease: 43200000 }) //limpiar memoria cada 12 horas

  //SS DEBUGS
  ESTADO_CONEXION(adapterProvider)
  //CRONO(adapterProvider)
  ACTUALIZAR()

  const { httpServer } = await createBot(
    {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB
    },
    {
      //control de frecuncia
      queue: {
        timeout: 20000,
        concurrencyLimit: 50
      }
    }
  )

  httpServer(+PORT)
}

main()
