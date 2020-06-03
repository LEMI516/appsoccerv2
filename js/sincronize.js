$( document ).ready(function() {
    hideItem('div-progressbar-infinite');
    hideItem('div-progressbar-infinite-inter');
    onload_database('readTeams()');
});

function cleanDatos(){
    setVal('container_json_import','');
}

function loadDataBase(){
    var tabla=val('tabla');
    if(tabla==='team'){
        loadTeamDataBase();
    }else if(tabla==='history'){
        loadHistoryDataBase();
    }
}

function loadTeamDataBase(){
    var json_txt=val('container_json_import'); 
    if(json_txt!=''){
        var list=JSON.parse(json_txt);
        showItem('div-progressbar-infinite');
        var tam=list.length;
        var count=0;
        for(var i=0;i<list.length;i++){
            var t=list[i];
            count++;
            addSimple("teams",t,'');
        }
        toast('Total procesados '+count+'/'+tam);
        hideItem('div-progressbar-infinite');
        setVal('container_json_import','');
        readTeams();
    }
}

 /* PROCESO DE CARGUE MASIVO DE HISTORIAL ATRAVES DE UN JSON */
 function loadHistoryDataBase(){
    var json_txt=val('container_json_import'); 
    if(json_txt!=''){
        var list=JSON.parse(json_txt);
        hideItem('div-progressbar-infinite');
        var tam=list.length;
        var count=0,noencontrados=0;
        for(var i=list.length-1;i>=0;i--){
            var h=list[i];
            var torneo=import_id_torneo(h.id_torneo);
            if(torneo==null) continue;
            var Tcam=findTeamByName(h.campeon,teamsArray);
            var Tsub=findTeamByName(h.subcampeon,teamsArray);
            var Tter=findTeamByName(h.tercero,teamsArray);
            var Tcuar=findTeamByName(h.cuarto,teamsArray);
            if(Tcam==null || Tsub==null || Tter==null || Tcuar==null){
                noencontrados++;
                continue;
            }
            count++;
            cam=Tcam.abre;
            sub=Tsub.abre;
            ter=Tter.abre;
            cuar=Tcuar.abre;
            var historico={ torn:torneo,cam:cam,sub:sub,ter:ter,cuar:cuar,comp:'' };
            addSimple("history",historico,'','');
        }
        toast('Total procesados '+count+'/'+tam);
        setVal('container_json_import','');
    }
}

function isAbreviatura(abre,list){
    var array=new Array();
    var i=0;
    for(i=0;i<list.length;i++){
        var t=list[i];
        if(t.abreviatura===abre){
            array.push(t);
        }
    }
    return array.length;    
}

function sincronizarData(){
    var table=val('tablaExport');
    var ope=val('operacion');
    var uri;
    
    if(ope==='POST'){
        if(table=='teams') uri='teams/';
        else if(table=='history') uri='historys/';
        else if(table=='plantilla') uri='plantillas/';
        else if(table=='competencia') uri='competencias/';
        else{
            toast('Operación no valida'); 
            return;
        }
        readData(table,uri);
    }else{
        if(table=='teams') uri='allteams/';
        else if(table=='history') uri='allhistorys/';
        else if(table=='plantilla') uri='allplantillas/';
        else{
            toast('Operación no valida'); 
            return;
        }
        receivedData(uri,table);
    }
}

function readData(table,uri) {
    var objectStore = db.transaction([table]).objectStore(table);
    var dataArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            dataArray.push(cursor.value);
            cursor.continue();
        }else{
            sendDataExport(dataArray,uri); 
        }
    };
}

function sendDataExport(dataArray,uri){
    var ip=val('ipServer');
    if(ip!=''){
        var json=JSON.stringify(dataArray);
        var url=ip+'/apisoccerhistory/'+uri;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'false');
        headers.append('Access-Control-Allow-Methods','POST');

        try {
            $.ajax({
                type: 'POST',
                headers: headers,
                dataType: 'json',
                contentType : "application/json",
                data: json,
                url: url,
                beforeSend: function () {
                    showItem('div-progressbar-infinite-inter');
                },
                success: function (data) {
                    hideItem('div-progressbar-infinite-inter');
                    if(data.result){
                        toast('Proceso realizado exitosamente');
                    }else{
                        toast('Error al enviar datos, causa:'+data.msg);
                    }
                },
                error : function(data) { 
                    hideItem('div-progressbar-infinite-inter');
                    toast('Ocurrio un error al sincronizar datos');
                    toast(data.responseText);
                } 
            });            
        } catch (error) {
            toast('Ocurrio un error al sincronizar datos, causa:'+error);
            hideItem('div-progressbar-infinite-inter');
        }
    }
}

function receivedData(uri,type){
    var ip=val('ipServer');
    if(ip!=''){
        var url=ip+'/apisoccerhistory/'+uri;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'false');
        headers.append('Access-Control-Allow-Methods','GET');

        try {
            $.ajax({
                type: 'GET',
                headers: headers,
                dataType: 'json',
                url: url,
                beforeSend: function () {  
                    showItem('div-progressbar-infinite-inter');
                },
                success: function (data) {
                    if(data.result){
                        onloadEntityDataBase(type,data)
                    }else{
                        toast('Error al enviar datos, causa:'+data.msg);
                    }
                    hideItem('div-progressbar-infinite-inter');
                },
                error : function(data) { 
                    hideItem('div-progressbar-infinite-inter');
                    console.log(data);
                    toast('Ocurrio un error al sincronizar datos');
                } 
            });            
        } catch (error) {
            toast('Ocurrio un error al sincronizar datos, causa:'+error);
            hideItem('div-progressbar-infinite-inter');
        }
    }
}

function onloadEntityDataBase(objStore,data){
    if(data.object!=null && data.object!=undefined && data.object.length>0){
        var objectStore = db.transaction([objStore], "readwrite").objectStore(objStore);
        var result = objectStore.clear();
        result.onsuccess = function(event) {
            var i=0,count=0;
            for(i in data.object){
                db.transaction([objStore], "readwrite").objectStore(objStore).add(data[i]);
                count++;
            }
            toast(count+' registros procesados');
        };
    }else{
        toast('No se encontraron datos que procesar');
    }
}