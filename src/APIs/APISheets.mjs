import 'dotenv/config'
//TT Credenciales
const pag = '?sheet=' + process.env.PAGINA
const urlSheet = process.env.SHEET_BEST_URL + pag

// Realizar la petición GET
export async function ObtenerHorario() {
  try {
    const response = await fetch(urlSheet)

    if (!response.ok) {
      throw new Error('No se pudo obtener los datos')
    }
    const data = await response.json()
    // Puedes hacer algo con los datos aquí si lo necesitas
    // console.log('Respuesta de la API:', data);
    return data
  } catch (error) {
    console.error('Error al realizar la petición:', error)
    return null
  }
}

//ff pruebas
/*
const horario = await ObtenerHorario()
if (horario === null) {
  console.error('Error al cargar base de datos')
} else {
  console.log('Respuesta de la API:', horario)
}
*/
