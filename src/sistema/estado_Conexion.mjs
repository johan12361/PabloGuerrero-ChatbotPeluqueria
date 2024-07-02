//TT ESTADO CONEXION
export function EXTADO_CONEXION(data) {
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
      escuchar = false
    } else {
      console.log('asdasd')
    }
  }, 60 * 1000)
}
