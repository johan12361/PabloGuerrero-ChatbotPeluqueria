import 'dotenv/config'

//TT URL API
const urlSheet = process.env.GOOGLE_APP_URL + '?'

//TT PETICIONES
const DATOS = {
  functionName: 'ObtenerAgenda',
  urlSheet: process.env.SHEET_URL
}

//TT Realizar la petición GET
export async function ObtenerDatos(pag = process.env.PAG_ACTUA) {
  try {
    DATOS.pagina = pag
    const queryString = Object.keys(DATOS)
      .map((key) => key + '=' + encodeURIComponent(DATOS[key]))
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
//await ObtenerDatos(process.env.PAG_MSJ)
