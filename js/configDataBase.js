

function database_onload(){
    var db;
    var request = window.indexedDB.open(name_database, version);
    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        console.log("success: "+ db);
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        //Table teams
        var objectStore = db.createObjectStore("teams", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });    
        objectStore.createIndex("abre", "abre", { unique: true });
        objectStore.createIndex("id_parent", "id_parent", { unique: false });
        //Table historial
        objectStore = db.createObjectStore("history", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("torn", "torn", { unique: false });
        //Table plantilla
        objectStore = db.createObjectStore("plantilla", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });         
        //Table competencia
        objectStore = db.createObjectStore("competencia", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        //Table competencia equipo
        objectStore = db.createObjectStore("competencia_team", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("id_comp", "id_comp", { unique: false });
        //Table competencia fixture
        objectStore = db.createObjectStore("competencia_fixture", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("id_comp", "id_comp", { unique: false });              
        console.log("tablas creadas exitosamente");
        //alert("tablas creadas exitosamente");
    }
}