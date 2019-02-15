
$( document ).ready(function() {
    init_autocompletes();
    onload_database('readTeams("readHistoricoTeams(\'listViewHistory()\')")')
});

function open_add_historial(){
    open_popup('.popup-addhistorial');
}

function addHistorico(){
    var torneo=val('txtypeTorneo'); 
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
    return  '<tr class="tr_edicion">'+
                '<td colspan="3" >Edición '+j+'</td>'+
            +'</tr>'+
            '<tr class="tr_firts" >'+
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