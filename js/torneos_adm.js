var torneo;
var fasesArray;
var fasesAsignn=new Array();
var teamsBaseArrayFase=new Array();
var loadteamsBaseArrayFase=new Array();
var teamsCompetenciaArray=new Array();
var teamsCompFixtureArray=new Array();
var loadteamsBaseArrayFase=new Array();;

$( document ).ready(function() {
    torneo=JSON.parse(localStorage.getItem('torneo'));
    setHtml('h1PageTorneoAdmon',torneo.competencia+" "+torneo.edicion);    
    formateFase();
    onload_database('readTeams("asignnTeamsCompetencia();onloadTeamsCompetencia();buildFixture()")');
});

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
        teamsList.push({ t:abre,f:fasesAsignn })
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

function onloadTeamsCompetencia(){
    var i=0;var html=''; var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        html+=createItemLisviewTeams((parseInt(i)+1),t,x);        
    }    
    $('#teams').html(html); 
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
            html+='<tr class="fix_divider" ><td colspan="3">Ronda Final '+(i+1)+' - '+(n/2)+' Encuentros</td><tr>';
            for(k=0;k<(n/2);k++){
                var fk='E'+(k+1);
                var fixComp=findTeamsByFaseFixture(torneo,pkfase,fk);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='',marcadorVuelta='',b1='',b2='',b1c='',b2c='';
                    var marcadorVuelta='';
                    var t1gl=parseInt(t1.f.gl);
                    var t1gv=parseInt(t1.f.gv);
                    var t2gl=parseInt(t2.f.gl);
                    var t2gv=parseInt(t2.f.gv);
                    var tt1=t1gl+t1gv;
                    var tt2=t2gl+t2gv;
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta=t2gl+'-'+t1gv;  
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }  
                    if(tt1>tt2){
                        b1='<b>';b1c='</b>';;
                    }else if(tt1<tt2){
                        b2='<b>';b2c='</b>';
                    }
                    html+='<tr class="fix_group_t" '+
                    'data-mar="IDA" data-n1="'+t1.t.name+'" data-gl="'+t1gl+'" data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t2.t.name+'" data-gv="'+t2gv+'" data-abre1="'+t1.t.abre+'" data-abre2="'+t2.t.abre+'" '+
                    'onclick="dialog_add_marcador(this)" >'+
                    '<td>'+logo(t1.t.color)+b1+namet(t1.t,torneo.competencia)+b1c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorIda+'</td>'+
                    '</tr>'+
                    '<tr class="fix_group_t fix_group_p fix_border" '+
                    ((!isUnico)?' data-mar="VUE" data-n1="'+t2.t.name+'" data-gl="'+t2gl+'"  data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t1.t.name+'" data-gv="'+t1gv+'" data-abre1="'+t2.t.abre+'" data-abre2="'+t1.t.abre+'" ':'')+
                    ((!isUnico)?' onclick="dialog_add_marcador(this)" ':'')+
                    '>'+
                    '<td>'+logo(t2.t.color)+b2+namet(t2.t,torneo.competencia)+b2c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorVuelta+'</td>'+
                    '</tr>';                                         
                }else{
                    html+='<tr class="fix_group_t " ><td colspan="3"> - - - </td><tr>';
                    html+='<tr class="fix_group_t fix_group_p fix_border" ><td colspan="3"> - - - </td><tr>';
                }
            }
        }
    }
    if(isFaseGrupo){
        html2+=createOption('FG','FASE GRUPOS');
        html+='<tr class="fix_divider" ><td colspan="3">Fase Grupos </td><tr>';
        for(i=1;i<=parseInt(torneo.plantilla.cantGru);i++){
            html+='<tr class="fix_group" ><td>Grupo '+i+' </td><td align="center" width="12%" >P</td><td align="center" width="12%">G</td><tr>';
            var fixComp=findTeamsByFaseFixture(torneo,'FG','G'+i);
            if(fixComp.length>0){
                fixComp=orderTeamsFixtureByPunGd(fixComp);
                for(var x=1;x<=fixComp.length;x++){
                    var t=fixComp[x-1];
                    html+='<tr data-name="'+cptz(t.t.name)+'" data-pts="'+t.f.pts+'" data-gls="'+t.f.gls+'" data-f="FG" data-abre="'+t.t.abre+'" '+
                    ' onclick="dialog_add_puntaje(this);" '+
                    ' class="fix_group_t '+((x%2==0)?'fix_group_p':'' )+'" >'+
                    '<td>'+x+'.'+logo(t.t.color)+namet(t.t,torneo.competencia)+'</td>'+
                    '<td align="center">'+t.f.pts+'</td>'+
                    '<td align="center">'+t.f.gls+'</td>'+
                    '</tr>';
                }
            }else{
                for(k=0;k<parseInt(torneo.plantilla.cantTeamxGru);k++){
                    html+='<tr class="fix_group_t '+((k%2!=0)?'fix_group_p':'' )+'" ><td colspan="3"> - - -</td><tr>';
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
            var n=parseInt(faseFinal[i]);
            html+='<tr class="fix_divider" ><td colspan="3">Ronda Previa '+(i+1)+' - '+(n/2)+' Encuentros</td><tr>';
            for(k=0;k<(n/2);k++){
                var fk='E'+(k+1);
                var fixComp=findTeamsByFaseFixture(torneo,pkfase,fk);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='',marcadorVuelta='',b1='',b2='',b1c='',b2c='';
                    var marcadorVuelta='';
                    var t1gl=parseInt(t1.f.gl);
                    var t1gv=parseInt(t1.f.gv);
                    var t2gl=parseInt(t2.f.gl);
                    var t2gv=parseInt(t2.f.gv);
                    var tt1=t1gl+t1gv;
                    var tt2=t2gl+t2gv;
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta=t2gl+'-'+t1gv;  
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }  
                    if(tt1>tt2){
                        b1='<b>';b1c='</b>';;
                    }else if(tt1<tt2){
                        b2='<b>';b2c='</b>';
                    }
                    html+='<tr class="fix_group_t" '+
                    'data-mar="IDA" data-n1="'+t1.t.name+'" data-gl="'+t1gl+'" data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t2.t.name+'" data-gv="'+t2gv+'" data-abre1="'+t1.t.abre+'" data-abre2="'+t2.t.abre+'" '+
                    'onclick="dialog_add_marcador(this)" >'+
                    '<td>'+logo(t1.t.color)+b1+namet(t1.t,torneo.competencia)+b1c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorIda+'</td>'+
                    '</tr>'+
                    '<tr class="fix_group_t fix_group_p fix_border" '+
                    ((!isUnico)?' data-mar="VUE" data-n1="'+t2.t.name+'" data-gl="'+t2gl+'"  data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t1.t.name+'" data-gv="'+t1gv+'" data-abre1="'+t2.t.abre+'" data-abre2="'+t1.t.abre+'" ':'')+
                    ((!isUnico)?' onclick="dialog_add_marcador(this)" ':'')+
                    '>'+
                    '<td>'+logo(t2.t.color)+b2+namet(t2.t,torneo.competencia)+b2c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorVuelta+'</td>'+
                    '</tr>';                                         
                }else{
                    html+='<tr class="fix_group_t " ><td colspan="3"> - - - </td><tr>';
                    html+='<tr class="fix_group_t fix_group_p fix_border" ><td colspan="3"> - - - </td><tr>';
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
                        +'</tr>';
                    }
                }
            }
        }else if(fase.type=='FF' || fase.type=='FP'){
            var n=parseInt(fase.n);
            html+='<tr class="fix_group" ><td colspan="2">Fase '+fase.pos+' -  '+(n/2)+' Encuentros </td><tr>';
            for(k=0;k<(n/2);k++){
                var ts=findTeamForFase(unionTeamsBaseArray(),fase.id,'E'+(k+1));
                if(ts.length>0){
                    for(var l=0;l<ts.length;l++){
                        var tm=findTeamByAbre(ts[l].team,teamsArray);
                        html+='<tr class="fix_group_t '+((l%2!=0)?'fix_group_p fix_border':'' )+' " >'+
                        '<td width="85%">'+logo(tm.color)+namet(tm,torneo.competencia)+'</td>'+
                        '<td width="15%" align="center"><a href="#" data-abre="'+tm.abre+'" onclick="deleteTeamforBase(this)" class="link icon-only"><i class="f7-icons">trash</i></a></td>'
                        +'</tr>';                    
                    }
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
    }else if(fase.type=='FF'){
        for(i=1;i<=parseInt(fase.n)/2;i++){
            html+=createOption(fase.id+'_E'+i,'Encuentro '+i);
        }
    }else if(fase.type=='FP'){
        for(i=1;i<=parseInt(fase.n)/2;i++){
            html+=createOption(fase.id+'_E'+i,'Encuentro '+i);
        }
    }
    setHtml('confCruce',html);
    tableTeamsFormate();
    open_popup('.popup-configure-fase');
}

function addTeamtoFase(obj){
    var cruce=val('confCruce');
    var ent=cruce.split('_');
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
    tableTeamsFormate();
    initFase('S');
}

function deleteTeamforBase(obj){
    var abre=obj.dataset.abre;
    var aux=teamsBaseArrayFase;
    teamsBaseArrayFase=new Array();
    var k=0;
    for(k in aux){
        if(abre!=aux[k].team) teamsBaseArrayFase.push(aux[k]);
    }
    initFase('S');
}

function saveConfigurationFase(){
    var k=0;
    for(k in teamsBaseArrayFase){
        var t=teamsBaseArrayFase[k];
        var a=findTeamByAbreinTeamsArray(t.team,teamsCompetenciaArray);
        var b=findFaseByIdinfasesArray(t.fase,fasesAsignn);
        var tms=torneo;
        tms.teams[parseInt(a.x)].f[parseInt(b.x)].prt=t.sfase;
        updateStoreSimple('competencia',tms,'callLastUpdateTorneo()');
    } 
    toast('Fase configurada exitosamente');   
    setHtml('contentFase',''); 
}


function callLastUpdateTorneo(){
    readEntityforId('competencia',torneo.id,'updateVariableTorneoforFixture()');
}

function updateVariableTorneoforFixture(){
    torneo=entityAny;
    localStorage.setItem('torneo', JSON.stringify(torneo));
    asignnTeamsCompetencia();
    buildFixture();
}

function dialog_add_puntaje(obj){
    var title=obj.dataset.name+' - '+obj.dataset.pts+'/'+obj.dataset.gls;
    app.dialog.prompt(title, function (value) {
        if(value.trim!=''){
            var v=value.split('-');
            var pts=parseInt(v[0]);
            var gls=(v.length>1)?parseInt(v[1]):parseInt(obj.dataset.gls);
            var a=findTeamByAbreinTeamsArray(obj.dataset.abre,teamsCompetenciaArray);
            var b=findFaseByIdinfasesArray(obj.dataset.f,fasesAsignn);
            var tms=torneo;
            tms.teams[parseInt(a.x)].f[parseInt(b.x)].pts=pts;
            tms.teams[parseInt(a.x)].f[parseInt(b.x)].gls=gls;
            updateStoreSimple('competencia',tms,'callLastUpdateTorneo()');            
        }
    });
}

function dialog_add_marcador(obj){
    var title=obj.dataset.n1+' - '+obj.dataset.gl+'</br>';
    title+=obj.dataset.n2+' - '+obj.dataset.gv+'</br>';
    app.dialog.prompt(title, function (value) {
        if(value.trim!=''){
            var v=value.split('-');
            var gl=parseInt(v[0]);
            var gv=parseInt(v[1]);
            var a1=findTeamByAbreinTeamsArray(obj.dataset.abre1,teamsCompetenciaArray);
            var a2=findTeamByAbreinTeamsArray(obj.dataset.abre2,teamsCompetenciaArray);
            var b=findFaseByIdinfasesArray(obj.dataset.pk,fasesAsignn);
            var tms=torneo;
            tms.teams[parseInt(a1.x)].f[parseInt(b.x)].gl=gl;
            tms.teams[parseInt(a2.x)].f[parseInt(b.x)].gv=gv;
            updateStoreSimple('competencia',tms,'callLastUpdateTorneo()');            
        }
    });
}
