//TT URL API
const urlSheet =
  'https://script.google.com/macros/s/AKfycbw3tspy76LhTA3nAC83-TPvhkxuUFzbhuYdEh77c2i62owOiKlXPS6GXenY3i-oG5Yt/exec?'

//TT PETICIONES
const ObtenerAgenda = {
  functionName: 'ObtenerAgenda',
  urlSheet:
    'https://docs.google.com/spreadsheets/d/1S281Ikj5DEFWEltXx6W3Q5NMUbpwJ3lAbYH8nI2RQJw/edit?usp=sharing',
  pagina: 'ACTUAL'
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
//await ObtenerHorario()
