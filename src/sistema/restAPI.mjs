import 'dotenv/config'
//TT MODULOS
import { ActuaInfo, ActuaMsj, ActuaTxt } from './textos.mjs'

export function APIREST(PROV) {
  //TT ACTUALIZAR INFO
  PROV.server.get('/actualizar/info/:clave', async (req, res) => {
    const clave = req.params.clave // Accede a los parámetros de la URL
    if (clave === process.env.REST_CLAVE_ACTUALIZAR) {
      console.log(`DATO RECIBIDO: actualizar INFO con clave = ${clave}`)
      try {
        await ActuaInfo()
        console.log('la actualización de INFO se realizó con éxito.')
        res.end('la actualización se realizó con éxito.')
      } catch (error) {
        console.error('Error durante la actualización:', error)
        res.status(500).end('ocurrió un error durante la actualización.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      res.end(`la calve: ${clave} no es valida`)
    }
  })

  //TT ACTUALIZAR MENSAJES
  PROV.server.get('/actualizar/msj/:clave', async (req, res) => {
    const clave = req.params.clave // Accede a los parámetros de la URL
    if (clave === process.env.REST_CLAVE_ACTUALIZAR) {
      console.log(`DATO RECIBIDO: actualizar MENSAJES con clave = ${clave}`)
      try {
        await ActuaMsj()
        console.log('la actualización de MENSAJES se realizó con éxito.')
        res.end('la actualización se realizó con éxito.')
      } catch (error) {
        console.error('Error durante la actualización:', error)
        res.status(500).end('ocurrió un error durante la actualización.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      res.end(`la calve: ${clave} no es valida`)
    }
  })

  //TT ACTUALIZAR INFO DE REFERENCIA
  PROV.server.get('/actualizar/txt/:clave', async (req, res) => {
    const clave = req.params.clave // Accede a los parámetros de la URL
    if (clave === process.env.REST_CLAVE_ACTUALIZAR) {
      console.log(`DATO RECIBIDO: actualizar INFOREF con clave = ${clave}`)
      try {
        await ActuaTxt()
        console.log('la actualización de INFOREF se realizó con éxito.')
        res.end('la actualización se realizó con éxito.')
      } catch (error) {
        console.error('Error durante la actualización:', error)
        res.status(500).end('ocurrió un error durante la actualización.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      res.end(`la calve: ${clave} no es valida`)
    }
  })
}
