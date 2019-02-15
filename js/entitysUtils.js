
function findTeamByAbre(abre,list){
    for(i in list){
        var t=list[i];
        if(t.abre==abre){
            return t;
        }
    }
    return null;
}

function findById(list,id){
    for(i in list){
        var l=list[i];
        if(parseInt(l.id)===parseInt(id))
            return l;
    }
    return null;
}

function findTeamByName(name,list){
    for(i in list){
        var t=list[i];
        if(t.name.toLowerCase()==name.toLowerCase()){
            return t;
        }
    }
    return null;
}

function findSelectionById(aux,list){
    for(i in list){
        var t=list[i];
        if(parseInt(t.aux)==parseInt(aux)){
            return t;
        }
    }
    return null;   
}

function filterHistoricoTeamsByTorneo(list,torn){
    var i=0;
    var rList=new Array();
    for(i=0;i<list.length;i++){
        var h=list[i];
        if(h.tor==torn) rList.push(h);
    }
    return rList;
}