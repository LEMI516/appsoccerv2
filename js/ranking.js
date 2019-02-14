
$( document ).ready(function() {
    onload_database('readTeams("cargarRanking()")')
});

function cargarRanking(){
    var tor=val('tiposRanking');
    if(tor=='SUB'){
        readHistoricoTeams(3);
    }else if(tor=='EUR'){
        readHistoricoTeams(4);
    }else{
        readHistoricoTeamsByTorneo('torn',tor,'calcularRankingHistorialSimple()');
    }
}

function calcularRankingHistorialSimple(){
    var teamsHistorial=teamsByHistorialComp(HistoricoTeamsArray);
    var teamsHistorialResul=new Array();
    var i=0,j=0;
    for(i=0;i<teamsHistorial.length;i++){
        var t=teamsHistorial[i];
        for(j=0;j<HistoricoTeamsArray.length;j++){
            var h=HistoricoTeamsArray[j];
            if(t.t.name===h.cam.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[0];
                t.p=parseInt(t.p)+1;
            }else if(t.t.name===h.sub.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[1];
                t.s=parseInt(t.s)+1;
            }else if(t.t.name===h.ter.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[2];
                t.tr=parseInt(t.tr)+1;
            }else if(t.t.name===h.cuar.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[3];
                t.c=parseInt(t.c)+1;
            } 
        }
        teamsHistorialResul.push(t);
    }
    var teamsOrderHistorial=orderTeamsHistorialByCompetencia(teamsHistorialResul);
    html='';
    for(var i=1;i<=teamsOrderHistorial.length;i++){
        var t=teamsOrderHistorial[i-1];
        var name=t.t.name+'('+t.t.parent+')';
        var scl=scaleTxt(name);
        var cls='';
        if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px important!;"';
        html+='<tr>'
              +'<td class="checkbox-cell"><label class="checkbox">'+logo(t.t.color,25)+'</label></td>'
              +'<td class="label-cell"><b>'+i+'</b>.<font '+cls+' >'+name+'</font></td>'
              +'<td class="numeric-cell">'+t.p+'</td>'
              +'<td class="numeric-cell">'+t.s+'</td>'
              +'<td class="numeric-cell">'+(parseInt(t.tr)+parseInt(t.c))+'</td>'
              +'<td class="numeric-cell">'+t.pun+'</td>'
            +'</tr>';
    }
    $('#ranking').html(html);     
}