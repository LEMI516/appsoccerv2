var torneo;
var fasesArray;
var teamsBaseArrayFase=new Array();
var loadteamsBaseArrayFase=new Array();
var teamsCompetenciaArray=new Array();
var teamsCompFixtureArray=new Array();
var loadteamsBaseArrayFase=new Array();;

$( document ).ready(function() {
    torneo=JSON.parse(localStorage.getItem('torneo'));
    //executeFun.push("readTeams(1)");
    //executeFun.push("onloadAddTeam();readCompetenciaTeam('"+torneo.pk+"',2)");
    //executeFun.push("onloadTeamsCompetencia();");
    //executeFun.push("buildFixture()");
    setHtml('h1PageTorneoAdmon',torneo.competencia+" "+torneo.edicion);    
    formateFase();
    //onload_database('readTeams("readCompetenciaTeam(\''+torneo.pk+'\',\'onloadTeamsCompetencia()\')")');
    onload_database('readTeams("asignnTeamsCompetencia();onloadTeamsCompetencia();buildFixture()")');
});

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
    for(i=faseFinal.length-1;i>=0;i--) fasesArray.push({id:'F'+(parseInt(i)+1),pos:(parseInt(i)+1),name:'FASE '+(parseInt(i)+1),n:faseFinal[i],n2:0,type:'FE'}); 
        
    if(isFaseGrupo){
        fasesArray.push({id:'FG',pos:0,name:'FASE GRUPOS',n:torneo.plantilla.cantTeamxGru,n2:torneo.plantilla.cantGru,type:'FG'});
    }
    if(isFasePrevia){
        for(i=fasePrevia.length-1;i>=0;i--) fasesArray.push({id:'FP'+parseInt(i)+1,pos:(parseInt(i)+1),name:'FASE PREVIA '+(parseInt(i)+1),n:fasePrevia[i],n2:0,type:'FE'}); 
    }
}

function open_add_team(){
    item('txtypeTeam').value=torneo.plantilla.typeTeam;
    onloadAddTeam();
    open_popup('.popup-add-team');
}

function onloadAddTeam(){
    var txtypeTeam=val('txtypeTeam');
    if(txtypeTeam==='CLUB'){
        showItem('li-parent');
        var teamSel=findTeamsBy('type_conf',['SEL',torneo.plantilla.confederation],teamsArray);
        teamSel=filterTeamsSelectionisHaveClub(teamSel,teamsArray);
        var html='';
        var l=0;
        for(l in teamSel){
            var t=teamSel[l];
            html+=createOption(t.abre,t.name);
        }
        setHtml('parent',html);
        serachTeams(1);
    }else{
        hideItem('li-parent');
        serachTeams(2);
    }
}

function serachTeams(caso){
    var txtypeTeam=val('txtypeTeam'); 
    var parent=val('parent');
    var html='';
    for(i in teamsArray){
        var t=teamsArray[i];
        var name=t.name;
        var scl=scaleTxt(name);
        var cls='';
        if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px;"';        
        if(caso===1){
            if(t.type===txtypeTeam && t.parent===parent){
                html+='<li >'
                        +'<a onclick="agregar_equipo(\''+t.abre+'\')" href="#"><font '+cls+' >'+cptz(t.name)+'</font></a>'
                    +'</li>';                 
            }
        }else if(caso===2){
            if(t.type===txtypeTeam && (t.parent===torneo.plantilla.confederation || torneo.plantilla.confederation=='MUN')){
                html+='<li >'
                        +'<a onclick="agregar_equipo(\''+t.abre+'\')" href="#"><font '+cls+' >'+cptz(t.name)+'</font></a>'
                    +'</li>'; 
            }
        }
    }
    setHtml('teamsSearch',html);
}

function agregar_equipo(abre){
    if(isValidTeamAdd(abre)){
        var torneAux=torneo;
        var teamsList=torneo.teams;
        teamsList.push({ t:abre,f:asignnFases()})
        torneAux.teams=teamsList;
        updateStoreSimple('competencia',torneAux,'callReadTorneo()');
    }
}

function callReadTorneo(){
    readEntityforId('competencia',torneo.id,'updateVariableTorneo()');
}

function updateVariableTorneo(){
    torneo=entityAny;
    localStorage.setItem('torneo', JSON.stringify(torneo));
    asignnTeamsCompetencia();
    onloadTeamsCompetencia();
}

function asignnTeamsCompetencia(){
    teamsCompetenciaArray=getTeamsTorneo(torneo,teamsArray);
}

function asignnFases(){
    var f=new Array();
    for(var i=0;i<fasesArray.length;i++){
        var fase=fasesArray[i];
        f.push({ IDF:fase.id,gl:0,gv:0,pts:0,gls:0,prt:'N' });
    }
    return f;
}

function isValidTeamAdd(abre){
    for(i in teamsCompetenciaArray) if(teamsCompetenciaArray[i].team.abre===abre) return false;
    return true;   
}

function onloadTeamsCompetencia(){
    var i=0;var html=''; var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        html+=createItemLisviewTeams((parseInt(i)+1),t,x);        
    }    
    $('#teams').html(html); 
    //readCompetenciaFixture(torneo.pk,3);
}

function createItemLisviewTeams(i,t,x){
    return '<li>'+
    '<div class="item-content">'+
        '<div class="item-inner">'+
            '<div class="item-title" >'+
            ''+i+'. '+logo(t.color)+cptz(t.name)+
            '<div class="item-footer">'+t.parent+'</div></div>'+
            '<div class="item-after">'+
                '<a href="#" data-abre="'+t.abre+'" data-name="'+t.name+'" onclick="dialogEliminarTeam(this)" class="link icon-only"><i class="f7-icons">trash</i></a>'+
            '</div>'+
        ''+
    '</div>'+
    '</li>';
}

var teamEntity={}
function dialogEliminarTeam(element){
    teamEntity={id:element.dataset.abre}
    confirmDialog('¿Esta seguro que desea eliminar a '+element.dataset.name+'?','eliminarTeam()');
}

function eliminarTeam(){
    var t=torneo.teams;
    var t=arrayRemove(t, teamEntity.id);
    var torneAux=torneo;
    torneAux.teams=t;
    updateStoreSimple('competencia',torneAux,'callReadTorneo()');
}

function arrayRemove(array, value) {
    var arrayResul=new Array();
    for(var i=0; i<array.length;i++){ 
        if (array[i].t!=value) {
            arrayResul.push(array[i]);
        }
    }
    return arrayResul;
}

function buildFixture(){
    var html='',html2='';
    var isFasePrevia=false,isFaseGrupo=false,isFaseFinal=false,isUnico=true;
    var fasePrevia='',faseFinal;
    var i=0,j=0,k=0;
    html2+=createOption('','FASE...');
    if(torneo.plantilla.typeTorneo=='CGI'){
        faseFinal=torneo.plantilla.cff.split(':');
        isFaseGrupo=true;isFaseFinal=true;
    }else if(torneo.plantilla.typeTorneo=='CE') {
        faseFinal=torneo.plantilla.cff.split(':');
        isFaseFinal=true;
    }else if(torneo.plantilla.typeTorneo=='CGFP') {
        faseFinal=torneo.plantilla.cff.split(':');
        fasePrevia=torneo.plantilla.cfp.split(':');
        isFaseFinal=true;isFaseGrupo=true;isFasePrevia=true;
    }
    if(torneo.plantilla.typeMatch=='LOCVIS') isUnico=false;
    if(isFaseFinal){
        for(i=faseFinal.length-1;i>=0;i--){
            var id=parseInt(i)+1;
            var pkfase='F'+id;
            html2+=createOption('F'+id,'FASE '+id);
            
            j++;
            var n=parseInt(faseFinal[i]);
            html+='<tr class="fix_divider" ><td>Ronda Final '+(i+1)+' - '+(n/2)+' Encuentros</td><tr>';
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+pkfase+(k+1);
                var fixComp=new Array();//findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='';
                    var marcadorVuelta='';
                    var marcadorFinal='';        
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta='<br>'+t2gl+'-'+t1gv;  
                        marcadorFinal=(t1gl+t1gv)+'-'+(t2gl+t2gv);
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }        
                    var ind=(isUnico)?1:0;                        
                    html+='<li><a onclick="dialog_add_marcador(\''+t1.team.abre+'\',\''+t2.team.abre+'\',\''+t1.fix.id+'\',\''+t2.fix.id+'\','+ind+')">'
                    +'<h2>'+logo(t1.team.color)+t1.team.name+'('+t1.team.parent+')</h2><span class="ui-li-count">'+marcadorIda+marcadorVuelta+'</span>'
                    +'<h2>'+logo(t2.team.color)+t2.team.name+'('+t2.team.parent+')</h2>'
                    +((!isUnico)?'<p class="ui-li-aside"><strong>'+marcadorFinal+'</strong></p>':'')
                +'</a></li>';
                }else{
                    html+='<tr class="fix_group_t " ><td> - - - </td><tr>';
                    html+='<tr class="fix_group_t fix_group_p fix_border" ><td> - - - </td><tr>';
                }
            }
        }
    }
    if(isFaseGrupo){
        html2+=createOption('FG','FASE GRUPOS');
        html+='<tr class="fix_divider" ><td>Fase Grupos </td><tr>';
        for(i=1;i<=parseInt(torneo.plantilla.cantGru);i++){
            html+='<tr class="fix_group" ><td>Grupo '+i+' </td><tr>';
            var n=parseInt(torneo.plantilla.cantTeamxGru);
            var fixComp=new Array();//findTeamForFixtureGen(teamsCompFixtureArray,'G'+i);
            if(fixComp.length>0){
                fixComp=orderTeamsFixtureByPunGd(fixComp);
                for(var x=1;x<=fixComp.length;x++){
                    var t=fixComp[x-1];
                    html+='<li><a onclick="dialog_add_puntaje(\''+t.team.abre+'\',\''+t.fix.id+'\');" >'
                        +'<h2>'+(x)+'.'+logo(t.team.color)+t.team.name+'('+t.team.parent+')</h2><span class="ui-li-count">'+t.fix.pun+'</span>'
                        +((parseInt(t.fix.gd)>0)?'<p class="ui-li-aside"><strong>'+t.fix.gd+'<br></strong></p>':'')
                    +'</a></li>';
                }
            }else{
                for(k=0;k<parseInt(torneo.plantilla.cantTeamxGru);k++){
                    html+='<tr class="fix_group_t '+((k%2!=0)?'fix_group_p':'' )+'" ><td> - - -</td><tr>';
                }                
            }
        }
    }
    if(isFasePrevia){
        for(i=fasePrevia.length-1;i>=0;i--){
            var id=parseInt(i)+1;
            var pkfase='FP'+id;
            html2+=createOption('FP'+id,'FASE PREVIA '+id);
            j++;
            var n=parseInt(fasePrevia[i]);
            html+='<tr class="fix_divider" ><td>Ronda Final '+(i+1)+' - '+(n/2)+' Encuentros</td><tr>';
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+pkfase+(k+1);
                var fixComp=new Array();//findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='';
                    var marcadorVuelta='';
                    var marcadorFinal='';        
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta='<br>'+t2gl+'-'+t1gv;  
                        marcadorFinal=(t1gl+t1gv)+'-'+(t2gl+t2gv);
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }        
                    var ind=(isUnico)?1:0;                        
                    html+='<li><a onclick="dialog_add_marcador(\''+t1.team.abre+'\',\''+t2.team.abre+'\',\''+t1.fix.id+'\',\''+t2.fix.id+'\','+ind+')">'
                    +'<h2>'+logo(t1.team.color)+t1.team.name+'('+t1.team.parent+')</h2><span class="ui-li-count">'+marcadorIda+marcadorVuelta+'</span>'
                    +'<h2>'+logo(t1.team.color)+t2.team.name+'('+t2.team.parent+')</h2>'
                    +((!isUnico)?'<p class="ui-li-aside"><strong>'+marcadorFinal+'</strong></p>':'')
                +'</a></li>';
                }else{
                    html+='<tr class="fix_group_t " ><td> - - - </td><tr>';
                    html+='<tr class="fix_group_t fix_group_p fix_border" ><td> - - - </td><tr>';
                }
            }
        }
    }    
    setHtml('fixture',html); 
    setHtml('selFases',html2);
}

function initFase(state){
    var idfase=val('selFases');
    if(state=='I') teamsBaseArrayFase=new Array();
    //if(state=='I') loadTeamBaseArray();
    var html='';
    setHtml('contentFase',''); 
    if(idfase!=''){
        var fase=findEntityBy(idfase,fasesArray);
        if(fase.id=='FG'){
            for(var x=1;x<=parseInt(fase.n2);x++){
                html+='<tr class="fix_group" ><td colspan="2">Grupo '+x+' </td><tr>';
                var fk2='G'+x;
                var ts=findTeamForFase(unionTeamsBaseArray(),'FG',fk2);
                if(ts.length>0){
                    for(k=0;k<ts.length;k++){
                        var tm=findTeamByAbre(ts[k].team,teamsArray);
                        html+='<tr class="fix_group_t '+((k%2!=0)?'fix_group_p':'' )+'" >'+
                        '<td width="85%">'+logo(tm.color)+namet(tm,torneo.competencia)+'</td>'+
                        '<td width="15%" align="center"><a href="#" data-abre="'+tm.abre+'" onclick="deleteTeamforBase(this)" class="link icon-only"><i class="f7-icons">trash</i></a></td>'
                        +'<tr>';
                    }
                }
            }
        }else if(fase.type=='FE'){
            var n=parseInt(fase.n);
            html+='<li data-role="list-divider">FASE '+fase.pos+'<span class="ui-li-count">'+(n/2)+'</span></li>';
            label.innerHTML=shuffle(n);
            for(k=0;k<(n/2);k++){
                var fk='FE'+fase.id+(k+1);
                var ts=findTeamForFase(unionTeamsBaseArray(),fk);
                if(ts.length>0){
                    var t1=' - - - ',t2=' - - - ',fun='',abre1='',abre2='';
                    if(ts.length==1 || ts.length>1){ t1=ts[0].name+'('+ts[0].parent+')';abre1=ts[0].abre; }
                    if(ts.length>1){ t2=ts[1].name+'('+ts[1].parent+')'; abre2=ts[1].abre}
                    if(ts.length<=1) fun='agregar_equipo_fase(\''+fk+'\',\''+fase.id+'\')';
                    html+='<li><a onclick="'+fun+'">'
                        +'<h2>'+t1+'</h2><h2>'+t2+'</h2>'
                        +'</a>'
                        +'<a data-icon="delete" onclick="deleteTeamforBaseTwo(\''+abre1+'\',\''+abre2+'\')" href="#"></a>'
                    +'</li>';
                }else{
                    html+='<li><a onclick="agregar_equipo_fase(\''+fk+'\',\''+fase.id+'\')">'
                        +'<h2> - - - </h2>'
                        +'<h2> - - - </h2>'
                        +'</a>'
                        +'<a data-icon="delete" onclick="" href="#"></a>'
                    +'</li>';
                }

            }
        }
        setHtml('contentFase',html); 
    }else{
        setHtml('contentFase',''); 
    }
}

function agregar_equipo_fase(){
    var idfase=val('selFases');
    if(idfase===''){
        toast('Debe seleccionar una fase');
    }
    var fase=findEntityBy(idfase,fasesArray);
    var i=0;var html='';
    if(fase.type=='FG'){
        for(i=1;i<=parseInt(fase.n2);i++){
            html+=createOption('FG_G'+i,'Grupo '+i);
        }
        setHtml('confCruce',html);
    }
    tableTeamsFormate();
    open_popup('.popup-configure-fase');
}

function tableTeamsFormate(){
    var teamArray=new Array();
    var teamsList=teamsCompetenciaforFase();
    var i=0;
    for(i in teamsList){
        teamArray.push(teamsList[i].team);
    } 
    teamArray=orderTeamsByNameByParen(teamArray); 
    create_table_teams('teamsCompetenciatable',teamArray)     
}

function teamsCompetenciaforFase(){
    var teams=new Array();
    var isExiste=false;
    var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
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
            teams.push(x);
        }
    }    
    /*var faseAnt=faseAnterior(val('selFases'));
    if(faseAnt!=null){
        if(faseAnt.type=='FE'){
            var i=0;
            var lclasi=clasificadosArrayMethodByIdFase(faseAnt.id);
            for(i in lclasi){
                var x=lclasi[i];
                var t=x.c.team;
                var entity={fase:faseAnt,team:t,pk:faseAnt.id,pk2:faseAnt.type};
                var k=0;
                var count=0;
                isExiste=false
                var tl=unionTeamsBaseArray();
                for(k in tl){
                    var tm=tl[k].team;
                    var fs=tl[k].fase;
                    if(fs.id==faseAnt.id || fs.id==val('selFases')){
                        count++;
                        if(t.abre==tm.abre){
                            isExiste=true;
                            break; 
                        }
                    }
                }
                if(!isExiste && count>0){
                    teams.push(entity);
                }
            }
        }
    }*/
    return teams;
}

function addTeamtoFase(obj){
    var cruce=val('confCruce');
    var ent=cruce.split('_');
    if(ent[0]=='FG'){
        var tms=torneo;
        for(var i=0;i<tms.teams.length;i++){
            if(tms.teams[i].t==obj.dataset.abre){
                for(var j=0;j<tms.teams[i].f.length;j++){
                    if(tms.teams[i].f[j].IDF==ent[0]){
                        tms.teams[i].f[j].prt=ent[1];
                    }
                }  
                teamsBaseArrayFase.push({team:tms.teams[i].t,fase:ent[0],sfase:ent[1]});   
                break;
            }
        }
    }
    tableTeamsFormate();
    initFase('S');
}

function deleteTeamforBase(obj){
    var abre=obj.dataset.abre;
    var aux=teamsBaseArrayFase;
    teamsBaseArrayFase=new Array();
    var k=0;
    for(k in aux){
        var tm=aux[k].team;
        if(abre!=tm){
            teamsBaseArrayFase.push(aux[k]);
        }
    }
    initFase('S');
}
