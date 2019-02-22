
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

function findTorneosByPk(pk,list){
    for(i in list){
        var t=list[i];
        if(t.pk==pk){
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

function findTeamsBy(param,value,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(param==='conf' && t.conf==value[0]){
            newArray.push(t);
        }else if(param==='type' && t.type==value[0]){
            newArray.push(t);
        }else if(param==="parent" && t.parent==value[0]){
            newArray.push(t);
        }else if(param==='type_conf' && t.type==value[0] && (t.conf==value[1] || value[1]=='MUN')){
            newArray.push(t);
        }else if(param==='aux' && parseInt(t.aux)==parseInt(value[0])){
            newArray.push(t);
        }
    }
    return newArray;
}

function filterTeamsSelectionisHaveClub(listBase,teamsArray){
    var aux=new Array();
    var i=0;
    for(i in listBase){
        var t=listBase[i];
        var list=findTeamsBy('parent',[t.abre],teamsArray);
        if(list.length>0){
            aux.push(t);
        }
    }
    return aux;
}

function getTeamsTorneo(torneo,teamsArray) {
    var teams=torneo.teams;
    var teamsCompetenciaArray=new Array();
    for(var i=0;i<teams.length;i++){
        var team=findTeamByAbre(teams[i].t,teamsArray);
        var teamComp={team:team,x:i};
        teamsCompetenciaArray.push(teamComp);        
    }
    return teamsCompetenciaArray;
}

function findEntityBy(id,list){
    for(i in list){
        var t=list[i];
        if(t.id==id){
            return t;
        }
    }
    return null;
}

function findTeamByAbreinTeamsArray(abre,array){
    return  array.find( ent => ent.team.abre === abre );
}

function findFaseByIdinfasesArray(id,array){
    return  array.find( ent => ent.IDF === id );
}

function findTeamByAbre2(abre,list){
    return  list.find( ent => ent.abre === abre );
}