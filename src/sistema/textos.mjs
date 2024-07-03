import 'dotenv/config'
//TT MODULOS
import { ObtenerDatos } from '../APIs/APIGoogleApp.mjs'
//TT MENSAJES
export const MENSAJES = {
  SALUDO: '',
  ADIOS: '',
  RECORDATORIO: '',
  SIN_CITAS_DISP: ''
}
//TT INFO
export const INFO = {
  SHOP: '',
  CHATBOT: ''
}

//TT ACTUALIZAR
export async function ACTUALIZAR() {
  const msj = await ObtenerDatos(process.env.PAG_MSJ)
  if (msj !== null) {
    MENSAJES.SALUDO = msj[0].SALUDO
    MENSAJES.ADIOS = msj[0].ADIOS
    MENSAJES.RECORDATORIO = msj[0].RECORDATORIO
    MENSAJES.SIN_CITAS_DISP = msj[0].CITAS_NO_DISPONIBLES
  }
  console.log(MENSAJES)
}
