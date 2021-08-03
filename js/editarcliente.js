(function () {
    let DB

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search)
        const idCliente = parametrosURL.get('id')
        console.log(idCliente)
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 1000)

        }


        function conectarDB() {
            // ABRIR CONEXIÓN EN LA BD:
    
            let abrirConexion = window.indexedDB.open('crm', 7);
    
            // si hay un error, lanzarlo
            abrirConexion.onerror = function() {
                console.log('Hubo un error');
            };
         
            // si todo esta bien, asignar a database el resultado
            abrirConexion.onsuccess = function() {
                // guardamos el resultado
                DB = abrirConexion.result;
            };
        }
        function obtenerCliente(id) {
  
            const transaction = DB.transaction(['crm'], 'readwrite');
            const objectStore = transaction.objectStore('crm');
    
            console.log(objectStore);
    
            var request = objectStore.openCursor();
            request.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if(cursor.value.id  == id ) {
                        // pasar el que estamos editando...
                        llenarFormulario(cursor.value);
                    }
                    cursor.continue();          
                }
            };
    
        }
    
    })
})()