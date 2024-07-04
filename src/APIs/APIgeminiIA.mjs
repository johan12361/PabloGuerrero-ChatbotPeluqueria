import 'dotenv/config'
import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'
//TT MODULOS
import { BorrarSaltos } from '../funciones/formatearIA.mjs'
import { MENSAJES } from '../sistema/textos.mjs'
//TT Credenciales
const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

// TT sesiones
const HistorialConv = {}
const HistBienv = {}
const HistAgendar = {}
const HistModificar = {}

//TT Ruta de guion
const GUIONES = {
  WELCOME: fs.readFileSync('./src/guiones/bienvenida.txt', 'utf8'),
  AGENDAR: fs.readFileSync('./src/guiones/agendarCita.txt', 'utf8'),
  MODIFICAR: fs.readFileSync('./src/guiones/modificarCita.txt', 'utf8')
}
//TT Guiones
function GernerarConfig(guion) {
  let config = null
  if (guion.estado === 'WELCOME') {
    config = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: GUIONES.WELCOME.replace('#SALUDO#', MENSAJES.SALUDO)
    })
  } else if (guion.estado === 'AGENDAR') {
    const _txt = GUIONES.AGENDAR.replace('#AGENDA#', guion.agenda)
    config = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: _txt
    })
  } else if (guion.estado === 'MODIFICAR') {
    const _txt = GUIONES.MODIFICAR.replace('#AGENDA#', guion.agenda)
    config = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: _txt
    })
  }

  return config
}
//TT Configuracion
const generationConfig = {
  temperature: 0.9,
  topP: 0.9,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain'
}
// SS obtener id
function getSession(userId, guion) {
  if (!HistorialConv[userId]) {
    HistorialConv[userId] = []
  }
  return HistorialConv[userId]
  /*
  if (guion.estado === 'WELCOME') {
    if (!HistBienv[userId]) {
      HistBienv[userId] = []
    }
    return HistBienv[userId]
  } else if (guion.estado === 'AGENDAR') {
    if (!HistAgendar[userId]) {
      HistAgendar[userId] = []
    }
    return HistAgendar[userId]
  } else if (guion.estado === 'MODIFICAR') {
    if (!HistModificar[userId]) {
      HistModificar[userId] = []
    }
    return HistModificar[userId]
  }
    */
}

// TT ENVIAR MESAJE
export async function EnviarGemini(promp, userId, guion) {
  try {
    const historial = getSession(userId, guion)
    const modelo = GernerarConfig(guion)
    const chatSession = modelo.startChat({
      generationConfig,
      history: historial
    })
    const result = await chatSession.sendMessage(promp)

    // SS Guardar la pregunta y la respuesta en el historial
    historial.push({ role: 'user', parts: [{ text: promp }] })
    historial.push({ role: 'model', parts: [{ text: result.response.text() }] })

    return BorrarSaltos(result.response.text())
  } catch (error) {
    return null
  }
}

//TT LIMPIAR MEMORIA
export function LimpiarHistorial(userId) {
  console.info(`Se limpia historial para: ${userId}`)
  if (HistBienv[userId]) {
    HistBienv[userId] = null
  }
  if (HistAgendar[userId]) {
    HistAgendar[userId] = null
  }
  if (HistModificar[userId]) {
    HistModificar[userId] = null
  }
  if (HistorialConv[userId]) {
    HistorialConv[userId] = null
  }
}
