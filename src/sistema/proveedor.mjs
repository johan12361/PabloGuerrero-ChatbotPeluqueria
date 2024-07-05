export const ENUNPROV = {
  BAILEYS: 'Baileys'
}
//TT PROVEEDOR
export const PROVEEDOR = {
  name: '',
  prov: null
}
//TT ENVIAR MENSAJE
export async function EnviarMensaje(num, msj) {
  //ss si es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    const _num = num + '@s.whatsapp.net'
    try {
      await PROVEEDOR.prov.sendText(_num, msj)
      return 'OK'
    } catch (error) {
      console.warn(`no se pudo enviar a: ${num} el mensaje: ${msj}`, error)
      return null
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}
