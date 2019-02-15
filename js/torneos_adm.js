var torneo;
var fasesArray;
var teamsBaseArrayFase;
var loadteamsBaseArrayFase;

$( document ).ready(function() {
    torneo=JSON.parse(localStorage.getItem('torneo'));
    //executeFun.push("readTeams(1)");
    //executeFun.push("onloadAddTeam();readCompetenciaTeam('"+torneo.pk+"',2)");
    //executeFun.push("onloadTeamsCompetencia();");
    //executeFun.push("buildFixture()");
    setHtml('h1PageTorneoAdmon',torneo.competencia+" "+torneo.edicion);    
    onload_database('readTeams("readCompetenciaTeam(\''+torneo.pk+'\',\'onloadTeamsCompetencia()\')")');
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
        var comp_team={id_comp:torneo.pk,team:abre,fasep:0};
        addSimpleFuntion("competencia_team",comp_team,'readCompetenciaTeam("'+torneo.pk+'","onloadTeamsCompetencia()")');
    }
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
                '<a href="#" data-id="'+x.id+'" data-name="'+t.name+'" onclick="dialogEliminarTeam(this)" class="link icon-only"><i class="f7-icons">trash</i></a>'+
            '</div>'+
        ''+
    '</div>'+
    '</li>';
}

var teamEntity={}
function dialogEliminarTeam(element){
    teamEntity={id:element.dataset.id}
    confirmDialog('¿Esta seguro que desea eliminar a '+element.dataset.name+'?','eliminarTeam()');
}

function eliminarTeam(){
    deleteById("competencia_team",teamEntity.id,'readCompetenciaTeam("'+torneo.pk+'","onloadTeamsCompetencia()")');
}