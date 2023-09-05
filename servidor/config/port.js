import net from 'node:net'
/** Se crea una funcion que busca un puerto disponible
 * Se retorna una promesa
 * se crea un servidor con el modulo net de node
 * se crea un servidor y si todo sale ok, se extrae la informacion del puerto con el
 * metodo address que no facilita la informacion del server y a la hora de cerrar el server
 * se devuelve la promesa aprobada
 * sino el servidor estara escuchando el evento de error y si es que ya se usa ese puerto
 * usa el puerto 0, que elige cualquer puerto libre en mi pc
 */
export const findAvailablePort = (desiredPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      // addres es un metodo que devuelve un objeto con la informacion del servidor
      // address().port devuelve el puerto en el que se esta ejecutando el servidor
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(0).then(port => resolve(port))
      } else {
        reject(err)
      }
    })
  })
}
