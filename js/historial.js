
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
            html+=createItemLisviewHistorial(his,j);
            j--;
        }
    }
    $('#history').html(html); 
}

function createItemLisviewHistorial(his,j){
    return '<li class="accordion-item"><a href="#" class="item-content item-link">'+
        '<div class="item-inner">'+
            '<div class="item-title-row">'+
                '<div class="item-title"><b>'+logo(his.cam.color)+his.cam.name+' ('+his.cam.parent+')</b></div>'+
                '<div class="item-after">'+j+'°</div>'+
            '</div>'+
            '<div class="item-footer">'+his.sub.name+'('+his.sub.parent+')</div>'+
        '</div></a>'+
        '<div class="accordion-item-content">'+
            '<div class="block">'+
                '<p>'+his.ter.name+'('+his.ter.parent+') - '+his.cuar.name+'('+his.cuar.parent+')</p>'+
            '</div>'+
        '</div>'+  
    '</li>';
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