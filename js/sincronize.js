$( document ).ready(function() {
    hideItem('div-progressbar-infinite');
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