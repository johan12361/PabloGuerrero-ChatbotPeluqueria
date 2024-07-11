import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
// TT MODULOS
import { APIREST } from './src/sistema/restAPI.mjs'
import { PROVEEDOR, ENUNPROV } from './src/sistema/proveedor.mjs'
import { ESTADO_CONEXION } from './src/sistema/estado_Conexion.mjs'
import { CRONO } from './src/funciones/notificar.mjs'
import { ACTUALIZAR } from './src/sistema/textos.mjs'
//TT FLUJOS
import { idleFlow } from './src/flujos/idle.mjs'
import { flowBienvenidad } from './src/flujos/flowBienvenidad.mjs'
import { fluIAEntrada, fluIASaludo } from './src/flujos/flowIA.mjs'
import { fluConsultarDisponibles } from './src/flujos/flowIAgendarCita.mjs'
import { fluCitasActuales } from './src/flujos/flowIACancelarCita.mjs'

//TT FLUJJOS
const FLUJOS_ENTRADA = [
  idleFlow,
  fluIAEntrada,
  fluConsultarDisponibles,
  fluCitasActuales,
  fluIASaludo,
  flowBienvenidad
]

const PORT = process.env.PORT ?? 3000

// TT INICIAR BOT
const main = async () => {
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow(FLUJOS_ENTRADA)
  const adapterProvider = createProvider(BaileysProvider) //limpiar memoria cada 12 horas

  //SS COMPROBAR ESTADO DE CONEXION CADA X SEGUNDOS
  ESTADO_CONEXION(adapterProvider, 20)

  //SS CARGAR DATOS DE TABLA
  await ACTUALIZAR()

  //SS EJECUTAR CRON DE NOTIFICACION
  CRONO(adapterProvider)

  //SS ASIGNAR PROVEEDOR PARA EJECUTAR FUNCIONES
  PROVEEDOR.name = ENUNPROV.BAILEYS
  PROVEEDOR.prov = adapterProvider

  //SS EJECUTAR BOT
  const { httpServer } = await createBot(
    {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB
    }
  )

  APIREST(adapterProvider)

  httpServer(+PORT)
}

main()
