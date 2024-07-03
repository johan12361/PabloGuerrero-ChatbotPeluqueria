import 'dotenv/config'
import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'
//TT MODULOS
import { BorrarSaltos } from '../funciones/formatearIA.mjs'
//TT Credenciales
const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

//TT Ruta de guion
const GUIONES = {
  WELCOME: fs.readFileSync('./src/guiones/bienvenida.txt', 'utf8'),
  AGENDAR: fs.readFileSync('./src/guiones/agendarCita.txt', 'utf8')
}
//TT Guiones
function GernerarConfig(guion) {
  let config = null
  if (guion.estado === 'WELCOME') {
    config = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: GUIONES.WELCOME
    })
  } else if (guion.estado === 'AGENDAR') {
    const _txt = GUIONES.AGENDAR.replace('#AGENDA#', guion.agenda)
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
// TT sesiones
const HistBienv = {}
const HistAgendar = {}
// SS obtener id
function getSession(userId, guion) {
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
  }
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
