
var torneo={},historyObject={};
$( document ).ready(function() {
    init_autocompletes();
    onload_database('readTeams("readHistoricoTeams(\'onload_listview_init()\')")')
});

function open_add_historial(){
    open_popup('.popup-addhistorial');
}

function onload_listview_init(){
    listViewHistory();
    readTorneos('innerComboTorneos()');
}

function addHistorico(){
    torneo=val('txtypeTorneo'); 
    var cam=val('txCam');
    var sub=val('txSub');
    var ter=val('txTer');
    var cuar=val('txCuar');
    var isValid=isValidValues('txCam|txSub|txTer|txCuar');
    if(isValid){
        var tcam=findTeamByName(cam,teamsArray);
        var tsub=findTeamByName(sub,teamsArray);
        var tter=findTeamByName(ter,teamsArray);
        var tcuar=findTeamByName(cuar,teamsArray);
        if(tcam==null || tsub==null || tter==null || tcuar==null){
            toast('Uno o varios de los equipos ingresados no fue encontrado');
        }else{
            var historico={ torn:torneo,cam:tcam.abre,sub:tsub.abre,ter:tter.abre,cuar:tcuar.abre,comp:'' };
            add("history",historico,'cleanValues();readHistoricoTeams("listViewHistory()")');
        }
    }else{
        toast('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('txCam|txSub|txTer|txCuar');
}

function listViewHistory(){
    var tor=val('txtTorneoHistory');
    var html='';
    var j=HistoricoTeamsArray.length;
    if(tor!=''){
        var auxHistoricoTeamsArray=new Array();
        for(var i=HistoricoTeamsArray.length-1;i>=0;i--){
            var his=HistoricoTeamsArray[i];
            if(his.tor===tor){
                auxHistoricoTeamsArray.push(his);
            }
        }
        var j=auxHistoricoTeamsArray.length;
        for(var i=0;i<auxHistoricoTeamsArray.length;i++){
            var his=auxHistoricoTeamsArray[i];
            html+=createItemLisviewHistorial(his,j,tor);
            j--;
        }
    }
    $('#history').html(html); 
}

function createItemLisviewHistorial(his,j,tor){
    var isShowParen=!(his.cam.type=='SEL' || tor=='LC');
    var txtCam=nameTxt(his.cam,isShowParen);
    var txtSub=nameTxt(his.sub,isShowParen);
    var txtTer=nameTxt(his.ter,isShowParen);
    var txtCuar=nameTxt(his.cuar,isShowParen);
    return  '<tr  class="tr_edicion"  >'+
                '<td colspan="3" >Edición '+j+'</td>'+
            +'</tr>'+
            '<tr data-id="'+his.id+'" onclick="open_competencia_historial(this)" class="tr_firts" >'+
                '<td>'+logo(his.cam.color)+'<font '+txtCam.cls+' ><b>'+txtCam.n+'</b></font></td>'+
                '<td>-</td>'+
                '<td><font '+txtSub.cls+' >'+txtSub.n+logo(his.sub.color)+'</font></td>'+
            '</tr>'+
            ((his.ter.name!='FIFA' && his.cuar.name!='FIFA')?
            '<tr class="tr_second">'+
                '<td><font '+txtTer.cls+' >'+txtTer.n+'</font></td>'+
                '<td>-</td>'+
                '<td><font '+txtCuar.cls+' >'+txtCuar.n+'</font></td>'+
            +'</tr>':'');    
}

function nameTxt(team,isShowParen){
    var parent=(isShowParen)?'('+team.parent+')':'';
    var name=cptz(team.name)+parent;    
    var scl=sclTxt(name);
    var cls='';
    if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px ;"';
    return {n:name,cls:cls};
}


function init_autocompletes(){
    app.autocomplete.create({
        inputEl: '#txCam',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Intenta "A"',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          for (var i = 0; i < teamsArray.length; i++) {
            var t = teamsArray[i];  
            if (t.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(t.name);
          }
          render(results);
        }
    });
    app.autocomplete.create({
        inputEl: '#txCam',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Intenta "A"',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          for (var i = 0; i < teamsArray.length; i++) {
            var t = teamsArray[i];  
            if (t.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(t.name);
          }
          render(results);
        }
    });
    app.autocomplete.create({
        inputEl: '#txSub',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Intenta "A"',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          for (var i = 0; i < teamsArray.length; i++) {
            var t = teamsArray[i];  
            if (t.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(t.name);
          }
          render(results);
        }
    });
    app.autocomplete.create({
        inputEl: '#txTer',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Intenta "A"',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          for (var i = 0; i < teamsArray.length; i++) {
            var t = teamsArray[i];  
            if (t.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(t.name);
          }
          render(results);
        }
    });   
    app.autocomplete.create({
        inputEl: '#txCuar',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Intenta "A"',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          for (var i = 0; i < teamsArray.length; i++) {
            var t = teamsArray[i];  
            if (t.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(t.name);
          }
          render(results);
        }
    });             
}

function open_competencia_historial(obj){
    var h=findById(HistoricoTeamsArray,obj.dataset.id);
    historyObject=h;
    if(historyObject.comp!=null && historyObject.comp!=undefined && historyObject.comp!=""){
        hideItem('form_asignn_comp')
        torneo=findTorneosByPk(historyObject.comp,torneosArray);
        buildFixture();
    }else{
        showItem('form_asignn_comp')
    }
    open_popup('.popup-competencia');
}

function innerComboTorneos(){
    var list=torneosArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        html+=createOption(t.pk,t.name+' '+t.edicion);
    }    
    $('#competencia').html(html); 
    torneo=findTorneosByPk(val('competencia'),torneosArray);
    buildFixture();
}

function formateFixture(){
    torneo=findTorneosByPk(val('competencia'),torneosArray);
    buildFixture();
}

function buildFixture(){
    var html='';
    var isFasePrevia=false,isFaseGrupo=false,isFaseFinal=false,isUnico=true;
    var fasePrevia='',faseFinal;
    var i=0,j=0,k=0;
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
                    '>'+
                    '<td>'+logo(t1.t.color)+b1+namet(t1.t,torneo.competencia)+b1c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorIda+'</td>'+
                    '</tr>'+
                    '<tr class="fix_group_t fix_group_p fix_border" '+
                    ((!isUnico)?' data-mar="VUE" data-n1="'+t2.t.name+'" data-gl="'+t2gl+'"  data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t1.t.name+'" data-gv="'+t1gv+'" data-abre1="'+t2.t.abre+'" data-abre2="'+t1.t.abre+'" ':'')+
                    ((!isUnico)?'  ':'')+
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
        html+='<tr class="fix_divider" ><td colspan="3">Fase Grupos </td><tr>';
        for(i=1;i<=parseInt(torneo.plantilla.cantGru);i++){
            html+='<tr class="fix_group" ><td>Grupo '+i+' </td><td align="center" width="12%" >P</td><td align="center" width="12%">G</td><tr>';
            var fixComp=findTeamsByFaseFixture(torneo,'FG','G'+i);
            if(fixComp.length>0){
                fixComp=orderTeamsFixtureByPunGd(fixComp);
                for(var x=1;x<=fixComp.length;x++){
                    var t=fixComp[x-1];
                    html+='<tr data-name="'+cptz(t.t.name)+'" data-pts="'+t.f.pts+'" data-gls="'+t.f.gls+'" data-f="FG" data-abre="'+t.t.abre+'" '+
                    '  '+
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
                    ' >'+
                    '<td>'+logo(t1.t.color)+b1+namet(t1.t,torneo.competencia)+b1c+'</td>'+
                    '<td colspan="2" align="center">'+marcadorIda+'</td>'+
                    '</tr>'+
                    '<tr class="fix_group_t fix_group_p fix_border" '+
                    ((!isUnico)?' data-mar="VUE" data-n1="'+t2.t.name+'" data-gl="'+t2gl+'"  data-pk="'+pkfase+'" data-f="'+fk+'" data-n2="'+t1.t.name+'" data-gv="'+t1gv+'" data-abre1="'+t2.t.abre+'" data-abre2="'+t1.t.abre+'" ':'')+
                    ((!isUnico)?' ':'')+
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

var historyEntity={};

function findHistoryEnt(){
    readEntityforId('history',historyObject.id,'asignn_competencia_history()')
}

function asignn_competencia_history(){
    historyEntity=entityAny;
    if(historyEntity.comp!=null && historyEntity.comp!=undefined && historyEntity.comp!=""){
        historyEntity.comp="";  
    }else{
        historyEntity.comp=torneo.pk;
    }
    updateStore('history',historyEntity,'readHistoricoTeams("listViewHistory();");closed_popup(".popup-competencia")');
}

