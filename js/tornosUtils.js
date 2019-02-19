function create_table_teams(idTable,teams){
    var table=item(idTable);
    var html='';
    var c=0,column=4;
    for(var i=0;i<teams.length;i++){
        var t=teams[i];
        if(c==0) html+='<tr>';
        if(c<column){
            html+='<td width="25%" data-abre="'+t.abre+'" onclick="addTeamtoFase(this)" >'+
                logo(t.color)+t.abre+
                '<h1>'+t.name+'('+t.parent+')</h1>'
            +'</td>'
            c++;
        }else{ 
            c=0;
            html+='</tr>';
        }
    }
    table.innerHTML=html;
}

function orderTeamsByNameByParen(listTeams){
    listTeams.sort(function(a, b) {
        var n1=a.name
        var n2=b.name
        var p1=a.parent;
        var p2=b.parent;        
        if(p1>p2) return 1;
        else if(p2>p1) return -1;
        else{
            if(n1>n2) return 1;
            else if(n2>n1) return -1;            
            return 0;
        }
    });
    return  listTeams;
}

function faseAnterior(idfase){
    var i=0;
    var tam=fasesArray.length;
    for(i in fasesArray){
        var f=fasesArray[i].id;
        if(idfase==f){
            var j=parseInt(i)+1;
            if(j==tam){
                return null;
            }else{
                return fasesArray[j];
            }
        }
    }
    return null;
}

function unionTeamsBaseArray(){
    var t=new Array();
    var i=0,j=0;
    for(i in teamsBaseArrayFase) t.push(teamsBaseArrayFase[i])
    for(j in loadteamsBaseArrayFase) t.push(loadteamsBaseArrayFase[j]) 
    return t;
}

function clasificadosArrayMethodByIdFase(idfase){
    var fase=findEntityBy(idfase,fasesArray);
    var clasificadosArray=new Array();
    var clasificadosArrayTerceros=new Array();
    var faseAnt=faseAnterior(fase.id);
    if(faseAnt!=null){
        if(faseAnt.id=='FG'){
            var cantClaxGru=torneo.plantilla.cantClaxGru;
            var cantGru=torneo.plantilla.cantGru;
            var cantMejTerceros=torneo.plantilla.cantMejTerceros;
            cantClaxGru=parseInt(cantClaxGru);
            cantGru=parseInt(cantGru);
            cantMejTerceros=parseInt((cantMejTerceros=='')?0:cantMejTerceros);
            var comp_fix=findCompetenciFixtureByIdFaseAux(faseAnt.id,teamsCompFixtureArray);
            comp_fix=orderTeamsFixtureByPunGd(comp_fix); 
            var isMejTer=(cantMejTerceros>0)?1:0;
            for(var x=1;x<=parseInt(torneo.plantilla.cantGru);x++){
                var count=0;
                for(j in comp_fix){
                    var fix=comp_fix[j].fix;
                    if(fix.fk==='G'+x){
                        count++;
                        if(count<=cantClaxGru){
                            clasificadosArray.push({c:comp_fix[j],pos:count});
                        }else if(count<=(cantClaxGru+isMejTer)){
                            clasificadosArrayTerceros.push({c:comp_fix[j],pos:count});
                        }
                    }else{
                        count=0;
                    }
                }                
            }
            var arrayMejoresTerceros=orderTeamsFixtureByPosPunGd(clasificadosArrayTerceros); 
            if(isMejTer==1){
                j=0;
                for(j in arrayMejoresTerceros){
                    if(parseInt(j)<cantMejTerceros){
                        clasificadosArray.push(arrayMejoresTerceros[j]);
                    }
                }
            } 
            clasificadosArray=orderTeamsFixtureByPosPunGd(clasificadosArray);
        }else if(faseAnt.type=='FE'){
            var n=parseInt(faseAnt.n);
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+faseAnt.id+(k+1);
                var fixComp=findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    var tt1=(t1gl+t1gv);
                    var tt2=(t2gl+t2gv);
                    if(tt2>tt1){
                        clasificadosArray.push({c:t2,pos:0});
                    }else{
                        clasificadosArray.push({c:t1,pos:0});
                    }       
                }
            }
        }   
    }
    return clasificadosArray;
}