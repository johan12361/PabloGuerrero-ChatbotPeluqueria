import 'dotenv/config'
//TT MODULOS
import { ACTUALIZAR } from './textos.mjs'

export function APIREST(PROV) {
  // Ruta con parámetro de URL
  PROV.server.get('/actualizar/:clave', async (req, res) => {
    const clave = req.params.clave // Accede a los parámetros de la URL
    if (clave === process.env.REST_CLAVE_ACTUALIZAR) {
      console.log(`DATO RECIBIDO: actualizar con clave = ${clave}`)
      try {
        await ACTUALIZAR()
        console.log('la actualización se realizó con éxito.')
        res.end('la actualización se realizó con éxito.')
      } catch (error) {
        console.error('Error durante la actualización:', error)
        res.status(500).send('ocurrió un error durante la actualización.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      res.end(`la calve: ${clave} no es valida`)
    }
  })
}
