var db;
var teamsArray=new Array();
var plantillasArray=new Array();
var HistoricoTeamsArray=new Array();
var torneosArray=new Array();
var entityAny={};

function onload_database(name_fun){
    var request = window.indexedDB.open(name_database, version);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        console.log("sucess");
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

function addSimple(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onerror = function(event) {
        console.log('Ocurrio un error en la base de datos')
    }
}

function addSimpleFuntion(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
        if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };    
    request.onerror = function(event) {
        console.log('Ocurrio un error en la base de datos')
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

function updateStoreSimple(nameobjectStore,object,name_funcion) {
    var objectStore = db.transaction([nameobjectStore],"readwrite").objectStore(nameobjectStore);
        var index =  objectStore.index('id').openCursor(IDBKeyRange.only(parseInt(object.id)));
        index.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var res = cursor.update(object);
                cursor.continue();
            }else{
                if(name_funcion!='') eval(name_funcion); 
            }
        };
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

function readPlantillas(name_fun) {
    var objectStore = db.transaction(["plantilla"]).objectStore("plantilla");
    plantillasArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            plantillasArray.push(cursor.value);
            cursor.continue();
        }else{
            plantillasArray=depureArray(plantillasArray);
            if(name_fun!='') eval(name_fun);
        }
    };    
}

function readHistoricoTeams(name_fun) {
    var objectStore = db.transaction(["history"]).objectStore("history");
    HistoricoTeamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var val=cursor.value;
            var tgan=findTeamByAbre(val.cam,teamsArray);
            var tsub=findTeamByAbre(val.sub,teamsArray);
            var tter=findTeamByAbre(val.ter,teamsArray);
            var tcuar=findTeamByAbre(val.cuar,teamsArray);
            var history={id:val.id,tor:val.torn,cam:tgan,sub:tsub,ter:tter,cuar:tcuar};
            HistoricoTeamsArray.push(history);
            cursor.continue();
        }else{
            if(name_fun!='') eval(name_fun);
        }
    };
}

function readHistoricoTeamsByTorneo(index,value,name_fun) {
    var objectStore = db.transaction(["history"]).objectStore("history");
    var index =  objectStore.index(index).openCursor(IDBKeyRange.only(value));
    HistoricoTeamsArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var val=cursor.value;
            var tgan=findTeamByAbre(val.cam,teamsArray);
            var tsub=findTeamByAbre(val.sub,teamsArray);
            var tter=findTeamByAbre(val.ter,teamsArray);
            var tcuar=findTeamByAbre(val.cuar,teamsArray);
            var history={id:val.id,tor:val.torn,cam:tgan,sub:tsub,ter:tter,cuar:tcuar};
            HistoricoTeamsArray.push(history);
            cursor.continue();
        }else{
            if(name_fun!='') eval(name_fun);
        }
    };
}

function readTorneos(name_fun) {
    var objectStore = db.transaction(["competencia"]).objectStore("competencia");
    torneosArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            torneosArray.push(cursor.value);
            cursor.continue();
        }else{
            torneosArray=depureArray(torneosArray);
            if(name_fun!='') eval(name_fun);
        }
    };
}

function readEntityforId(nameObjectStore,id,name_fun) {
    var objectStore = db.transaction([nameObjectStore]).objectStore(nameObjectStore);
    var index=objectStore.index('id').openCursor(IDBKeyRange.only(parseInt(id)));
    teamsCompetenciaArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            entityAny=cursor.value;
            cursor.continue();
        }else{
            if(name_fun!='') eval(name_fun);
        }
    };
}

function teamsByHistorialComp(list){
    var teamsHistorial=new Array();
    var i=0;
    for(i in list){
        var h=list[i];
        if(!findTeamHistoriaList(h.cam.abre,teamsHistorial) && h.cam.abre!='FIFA') teamsHistorial.push({t:h.cam,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.sub.abre,teamsHistorial) && h.sub.abre!='FIFA') teamsHistorial.push({t:h.sub,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.ter.abre,teamsHistorial) && h.ter.abre!='FIFA') teamsHistorial.push({t:h.ter,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.cuar.abre,teamsHistorial) && h.cuar.abre!='FIFA') teamsHistorial.push({t:h.cuar,pun:0,p:0,s:0,tr:0,c:0});
    }
    return teamsHistorial;
}

function findTeamHistoriaList(abre,list){
    var i=0;
    for(i in list){
        var t=list[i];
        if(t.t.abre===abre){
            return true;
        }
    }
    return false;
}

function orderTeamsHistorialByCompetencia(listTeams){
    listTeams.sort(function(a, b) {
        var puna=parseInt(a.pun);
        var punb=parseInt(b.pun);
        return punb-puna;
    });
    return  listTeams;
}

