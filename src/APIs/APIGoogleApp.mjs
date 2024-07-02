import 'dotenv/config'

//TT URL API
const urlSheet = process.env.GOOGLE_APP_URL + '?'

//TT PETICIONES
const ObtenerAgenda = {
  functionName: 'ObtenerAgenda',
  urlSheet: process.env.SHEET_URL,
  pagina: process.env.PAGINA_AGENDA
}

//TT Realizar la petición GET
export async function ObtenerHorario() {
  try {
    const queryString = Object.keys(ObtenerAgenda)
      .map((key) => key + '=' + encodeURIComponent(ObtenerAgenda[key]))
      .join('&')
    const response = await fetch(urlSheet + queryString)
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
//FF Pruebas
await ObtenerHorario()
