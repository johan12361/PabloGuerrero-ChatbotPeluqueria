import 'dotenv/config'
import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'

//TT Credenciales

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

//TT Ruta de guion
const GUIONES = {
  WELCOME: fs.readFileSync('./src/guiones/bienvenida.txt', 'utf8')
}
//TT Guiones
function GernerarConfig(guion) {
  let config = null
  if (guion === 'WELCOME') {
    config = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: GUIONES.DEMO
    })
  }
  return config
}
//TT Configuracion
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain'
}
// TT sesiones
const sessions = {}
// SS obtener id
function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = []
  }
  return sessions[userId]
}

// TT ENVIAR MESAJE
export async function EnviarGemini(promp, userId, guion) {
  try {
    const historial = getSession(userId)
    const modelo = GernerarConfig(guion)
    const chatSession = modelo.startChat({
      generationConfig,
      history: historial
    })
    const result = await chatSession.sendMessage(promp)

    // SS Guardar la pregunta y la respuesta en el historial
    historial.push({ role: 'user', parts: [{ text: promp }] })
    historial.push({ role: 'model', parts: [{ text: result.response.text() }] })

    return result.response.text()
  } catch (error) {
    return 'Servicio no disponible, intenta mas tarde'
  }
}
