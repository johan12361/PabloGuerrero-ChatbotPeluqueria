import 'dotenv/config'
import express from 'express'
//TT MODULOS
import { ACTUALIZAR } from './textos.mjs'

const app = express()
const PORT = 3001

// Ruta con parámetro de URL
app.get('/actualizar/:clave', async (req, res) => {
  const clave = req.params.clave // Accede a los parámetros de la URL
  if (clave === process.env.REST_CLAVE_ACTUALIZAR) {
    console.log(`DATO RECIBIDO: actualizar con clave = ${clave}`)
    try {
      await ACTUALIZAR()
      console.log('la actualización se realizó con éxito.')
      res.send({
        data: 'la actualización se realizó con éxito.'
      })
    } catch (error) {
      console.error('Error durante la actualización:', error)
      res.status(500).send({
        data: 'ocurrió un error durante la actualización.'
      })
    }
  } else {
    res.send({
      data: `la calve: ${clave} no es valida`
    })
  }
})

app.listen(PORT, () => {
  console.log('APIREST ESCUCHANDO')
})
