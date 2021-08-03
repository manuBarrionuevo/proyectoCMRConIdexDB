
(function () {

    let DB

    document.addEventListener('DOMContentLoaded', () => {
        crearDB()

        if (window.indexedDB.open('crm', 3)) {
            obtenerClientes()
        }

    })

    // Código de IndexedDB
    function crearDB() {
        // crear base de datos con la versión 3
        const crearDB = window.indexedDB.open('crm', 7);

        // si hay un error, lanzarlo
        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        // si todo esta bien, asignar a database el resultado
        crearDB.onsuccess = function () {
            // guardamos el resultado
            DB = crearDB.result;
        };

        // este método solo corre una vez
        crearDB.onupgradeneeded = function (e) {
            // el evento que se va a correr tomamos la base de datos
            const db = e.target.result;


            // definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
            // keypath es de donde se van a obtener los indices
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            //createindex, nombre y keypath, 3ro los parametros
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });


            console.log('Database creada y lista');
        };

    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 7)

        abrirConexion.onerror = function () {
            console.log('hubo un error')
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result

            const objectStore = DB.transaction('crm').objectStore('crm')

            objectStore.openCursor().onsuccess = function (e) {

                const cursor = e.target.result

                if (cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value

                    const listadoCliente = document.querySelector('#listado-clientes')

                    listadoCliente.innerHTML +=
                        ` <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
          </td>
      </tr>
  `;

                    cursor.continue()
                } else {
                    console.log('no hay mas registro')
                }
            }
        }
    }
})()