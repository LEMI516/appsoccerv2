function arrayRemove(array, value) {
    var arrayResul=new Array();
    for(var i=0; i<array.length;i++){ 
        if (array[i].t!=value) {
            arrayResul.push(array[i]);
        }
    }
    return arrayResul;
}

function asignnTeamsCompetencia(){
    teamsCompetenciaArray=getTeamsTorneo(torneo,teamsArray);
}

function isValidTeamAdd(abre){
    for(i in teamsCompetenciaArray) if(teamsCompetenciaArray[i].team.abre===abre) return false;
    return true;   
}

function formateFase(){
    fasesArray=new Array();
    var isFasePrevia=false,isFaseGrupo=false,isFaseFinal=false,isUnico=true;
    var fasePrevia='',faseFinal=torneo.plantilla.cff.split(':');    
    if(torneo.plantilla.typeTorneo=='CGI'){
        isFaseGrupo=true;
    }else if(torneo.plantilla.typeTorneo=='CGFP') {
        fasePrevia=torneo.plantilla.cfp.split(':');
        isFaseGrupo=true;isFasePrevia=true;
    } 
    for(i=faseFinal.length-1;i>=0;i--) fasesArray.push({id:'F'+(parseInt(i)+1),pos:(parseInt(i)+1),name:'FASE '+(parseInt(i)+1),n:faseFinal[i],n2:0,type:'FF'}); 
        
    if(isFaseGrupo){
        fasesArray.push({id:'FG',pos:0,name:'FASE GRUPOS',n:torneo.plantilla.cantTeamxGru,n2:torneo.plantilla.cantGru,type:'FG'});
    }
    if(isFasePrevia){
        for(i=fasePrevia.length-1;i>=0;i--) fasesArray.push({id:'FP'+(parseInt(i)+1),pos:(parseInt(i)+1),name:'FASE PREVIA '+(parseInt(i)+1),n:fasePrevia[i],n2:0,type:'FP'}); 
    }
    for(var i=0;i<fasesArray.length;i++){
        var fase=fasesArray[i];
        fasesAsignn.push({ IDF:fase.id,gl:0,gv:0,pts:0,gls:0,prt:'N',x:i });
    }    
}

function tableTeamsFormate(){
    var teamsList=teamsCompetenciaforFase();
    var i=0;
    if(val('selFases')=='FG') teamsList=orderTeamsByNameByParen(teamsList);
    create_table_teams('teamsCompetenciatable',teamsList)     
}

function teamsCompetenciaforFase(){
    var tms=torneo;
    var fase=findEntityBy(val('selFases'),fasesArray);
    var faseAnt=faseAnterior(fase.id);
    var teamsforFase=new Array();
    var teamsParticipiedFaseAnt=new Array();
    for(var i=0;i<tms.teams.length;i++){
        for(var j=0;j<tms.teams[i].f.length;j++){
            if(tms.teams[i].f[j].IDF==fase.id){
                if(fase.type=='FG' && faseAnt==null){
                    if(tms.teams[i].f[j].prt=='N'){
                        teamsforFase.push(tms.teams[i].t);
                    }                    
                }else if(fase.type=='FG' && faseAnt!=null){
                    var isFP=false;
                    for(var k=0;k<tms.teams[i].f.length;k++){
                        if(tms.teams[i].f[k].IDF.indexOf('FP')!=-1){
                            if(tms.teams[i].f[k].prt!='N'){
                                isFP=true;
                                break; 
                            }
                        }
                    }
                    if(!isFP){
                        teamsforFase.push(tms.teams[i].t);
                    }
                }else if(fase.type=='FF' && torneo.plantilla.typeTorneo=='CE'){
                    var isFP=false;
                    for(var k=0;k<tms.teams[i].f.length;k++){
                        if(tms.teams[i].f[k].IDF.indexOf('FG')==-1 && tms.teams[i].f[k].IDF.indexOf('FP')==-1){
                            if(tms.teams[i].f[k].prt!='N'){
                                isFP=true;
                                break; 
                            }
                        }
                    }
                    if(!isFP){
                        teamsforFase.push(tms.teams[i].t);
                    }                    
                }else if(fase.type=='FP'){
                    var isFP=false;
                    for(var k=0;k<tms.teams[i].f.length;k++){
                        if(tms.teams[i].f[k].IDF.indexOf('FP')!=-1){
                            if(tms.teams[i].f[k].prt!='N'){
                                isFP=true;
                                break; 
                            }
                        }
                    }
                    if(!isFP){
                        teamsforFase.push(tms.teams[i].t);
                    }
                }
                ////////////////////////
                if(fase.type=='FF' && (faseAnt!=null && faseAnt.type=='FF')){
                    var isFP=false;
                    for(var k=0;k<tms.teams[i].f.length;k++){
                        if(tms.teams[i].f[k].IDF.indexOf('FG')==-1 && tms.teams[i].f[k].IDF.indexOf('FP')==-1){
                            if(tms.teams[i].f[k].prt!='N'){
                                isFP=true;
                                break; 
                            }
                        }
                    }
                    if(!isFP){
                        teamsParticipiedFaseAnt.push(tms.teams[i].t);
                    }
                }                

            }
        }  
    } 
    teamsforFase = Array.from(new Set(teamsforFase));
    teamsParticipiedFaseAnt = Array.from(new Set(teamsParticipiedFaseAnt));
    if(faseAnt!=null){
        var clasifiedTeams=teamsClasifiedByIdFase(faseAnt.id);
        for(var x=0;x<clasifiedTeams.length;x++){
            teamsforFase.push(clasifiedTeams[x].t.abre);
        }
        var faseAntAnt=faseAnterior(faseAnt.id);
        if(faseAntAnt!=null){
            var aux=new Array();
            clasifiedTeams=teamsClasifiedByIdFase(faseAntAnt.id);
            for(var x=0;x<clasifiedTeams.length;x++){
                aux.push(clasifiedTeams[x].t.abre);
            }
            for(var l=0;l<aux.length;l++){
                var isExiste=false;
                for(var m=0;m<teamsParticipiedFaseAnt.length;m++){
                    if(aux[l]==teamsParticipiedFaseAnt[m]){
                        isExiste=true;
                        break;
                    }
                }
                if(isExiste) teamsforFase.push(aux[l]);
            }
        }
    }
    teamsforFase = Array.from(new Set(teamsforFase));
    var teams=new Array();
    var isExiste=false;
    var i=0;
    for(i in teamsforFase){
        var t=findTeamByAbre2(teamsforFase[i],teamsArray);
        k=0;
        isExiste=false;
        var tl=unionTeamsBaseArray();
        for(k in tl){
            var tm=tl[k].team;
            if(t.abre==tm){
                isExiste=true;
                break; 
            }
        }
        if(!isExiste){
            teams.push(t);
        }
    } 
    return teams;
}

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
            if(c>=column) c=0;
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

function teamsClasifiedByIdFase(idfase){
    var fase=findEntityBy(idfase,fasesArray);
    var clasificadosArray=new Array();
    var clasificadosArrayTerceros=new Array();
    if(fase!=null){
        if(fase.type=='FG'){
            var cantClaxGru=parseInt(torneo.plantilla.cantClaxGru);
            var cantMejTerceros=parseInt((torneo.plantilla.cantMejTerceros=='')?0:torneo.plantilla.cantMejTerceros);
            var isMejTer=(cantMejTerceros>0)?1:0;
            for(var x=1;x<=parseInt(torneo.plantilla.cantGru);x++){
                var fixComp=findTeamsByFaseFixture(torneo,'FG','G'+x);
                fixComp=orderTeamsFixtureByPunGd(fixComp);
                var count=0;
                for(var y=0;y<fixComp.length;y++){
                    count++;
                    if(count<=cantClaxGru){
                        clasificadosArray.push({t:fixComp[y].t,f:fixComp[y].f,pos:count}); 
                    }else if(count<=(cantClaxGru+isMejTer)){
                        clasificadosArrayTerceros.push({t:fixComp[y].t,f:fixComp[y].f,pos:count});
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
        }else if(fase.type=='FF' || fase.type=='FP'){
            var n=parseInt(fase.n);
            for(k=0;k<(n/2);k++){
                var fkfase='E'+(k+1);
                var fixComp=findTeamsByFaseFixture(torneo,fase.id,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var t1gl=parseInt(t1.f.gl);
                    var t1gv=parseInt(t1.f.gv);
                    var t2gl=parseInt(t2.f.gl);
                    var t2gv=parseInt(t2.f.gv);
                    var tt1=t1gl+t1gv;
                    var tt2=t2gl+t2gv;
                    if(tt2>tt1){
                        clasificadosArray.push({t:t2.t,f:t2.f,pos:0}); 
                    }else{
                        clasificadosArray.push({t:t1.t,f:t1.f,pos:0});
                    }       
                }
            }
        }   
    }
    return clasificadosArray;
}

function findTeamsByFaseFixture(torneo,fase,sfase){
    var arrayResul=new Array();
    var teams=torneo.teams;
    for(var i=0;i<teams.length;i++){
        var fases=teams[i].f;
        for(var j=0;j<fases.length;j++){
            if(fases[j].IDF==fase){
                if(fases[j].prt==sfase){
                    var tm=findTeamByAbre2(teams[i].t,teamsArray);
                    var fs=fases[j];
                    arrayResul.push({t:tm,f:fs});
                }
            }
        }
    }
    return arrayResul;
}

function orderTeamsFixtureByPunGd(listTeams){
    listTeams.sort(function(a, b) {
        var fixa = a.f
        var fixb = b.f
        if (fixa.IDF == fixb.IDF) {
            var puna=parseInt(fixa.pts);
            var gda=parseInt(fixa.gls);
            var punb=parseInt(fixb.pts);
            var gdb=parseInt(fixb.gls);            
            if(puna==punb){
                if(gda>gdb) return -1;
                else if (gda<gdb) return 1;
                else return 0;
            }else if(puna > punb){
                return -1;
            }else{
                return 1;
            }
        }
    });
    return  listTeams;
}

function orderTeamsFixtureByPosPunGd(listTeams){
    listTeams.sort(function(a, b) {
        var posa=parseInt(a.pos);
        var posb=parseInt(b.pos);
        var fixa = a.f
        var fixb = b.f
        var puna=parseInt(fixa.pts);
        var gda=parseInt(fixa.gls);
        var punb=parseInt(fixb.pts);
        var gdb=parseInt(fixb.gls);            
        if(posa == posb){
            if(puna==punb){
                if(gda>gdb) return -1;
                else if (gda<gdb) return 1;
                else return 0;
            }else if(puna > punb){
                return -1;
            }else{
                return 1;
            }
        }else{
            return posa-posb;
        }

        
    });
    return  listTeams;
}