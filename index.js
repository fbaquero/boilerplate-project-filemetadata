var express = require('express');
var cors = require('cors');
var fileUpload = require('express-fileupload'); // Importa el middleware de manejo de archivos
require('dotenv').config();

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(fileUpload()); // Usa el middleware de manejo de archivos

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

/**
 * Microservicio de metadatos de archivo
 * 
 * 
 * Requisitos:
 *  Enviar un formulario que incluya una carga de archivo.
 *  Se espera:  El campo de entrada del archivo de formulario tiene el atributo name establecido en upfile.
 *  Se espera:  Cuando se envíe un archivo, se recibirá el name, type y size del archivo en bytes dentro de la respuesta JSON.
 * 
 * 
 * Salida esperada:
 * {
 *  "name": "Diseño Seguro.txt",
 *  "type": "text/plain",
 *  "size": 3543
 * }
 */

app.post('/api/fileanalyse', function (req, res) {
  // Verificamos que archivo se haya seleccionado y que no sea de 0kb
  if (!req.files || !req.files.upfile) {
    return res.status(400).send('No files uploaded.');
  }

  // Obtenemos el archivo
  const file = req.files.upfile;

  // Formateamos el nombre del archivo a utf-8
  const decodedFileName = Buffer.from(file.name, 'binary').toString('utf-8');

  //Obtenemos los metadatos del archivo
  const metadata = {
    name: decodedFileName,
    type: file.mimetype,
    size: file.size
  };

  console.log("Datos del archivo: ", metadata);

  // Respondemos con los metadatos
  res.json(metadata);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
