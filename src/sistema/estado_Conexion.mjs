import { ACTUALIZAR } from './textos.mjs'

//TT ESTADO CONEXION
export function ESTADO_CONEXION(data, seg = 60) {
  let escuchar = false
  setInterval(() => {
    // SS sin conexion
    if (data.store?.state?.connection !== 'open') {
      escuchar = true
      console.log(`Estado Conexion: ${data.store?.state?.connection}`)
    }
    // SS Se conecta
    else if (data.store?.state?.connection === 'open' && escuchar === true) {
      const num = data.globalVendorArgs?.host?.phone
      const name = data.globalVendorArgs?.host?.name
      console.log(`Conectado a: ${name} con numero: ${num}`)
      ACTUALIZAR()
      escuchar = false
    }
  }, seg * 1000)
}
