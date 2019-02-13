var db;
var teamsArray;

function onload_database(name_fun){
    var request = window.indexedDB.open(name_database, version);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        if(name_fun!='') eval(name_fun);
    };
}

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
        toast('Operación realizada exitosamente');
        if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        toast('Ocurrio un error en la base de datos')
    }
}

function deleteById(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(parseInt(id));
    request.onsuccess = function(event) {
        toast('Operación realizada exitosamente');
        if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        toast('Ocurrio un error en la base de datos');
    }
}

function readTeams(name_fun) {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }else{
            if(name_fun!='') eval(name_fun);
        }
    };
}

function updateStore(nameobjectStore,object,name_funcion) {
    var objectStore = db.transaction([nameobjectStore],"readwrite").objectStore(nameobjectStore);
        var index =  objectStore.index('id').openCursor(IDBKeyRange.only(parseInt(object.id)));
        index.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var res = cursor.update(object);
                cursor.continue();
            }else{
                toast('Registro Actualizado'); 
                if(name_funcion!='') eval(name_funcion); 
            }
        };
}

