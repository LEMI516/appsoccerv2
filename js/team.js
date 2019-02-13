
/*$$('.popup-addteam').on('popup:open', function (e, popup) {

});*/

var defaultSelected='';
var teamEntity={};

$( document ).ready(function() {
    innerSelectSimple('colorSelect',colours(),'Defecto...');
    showItem('li_seleccion');
    onload_database('readTeams("loadParents()")')
});

function createLogoColor(ele){
    var colorS=ele.value;
    var oriS=(item('ori_logo').checked)?'H':'V';
    var color=item('color');
    var div=item('preview_logo');
    if(colorS.trim()!=''){
        color.value=(color.value.trim()=='')?oriS+';'+colorS:color.value.trim()+':'+colorS
        div.innerHTML=logo(color.value,'20');
    }else{
        color.value='';
        div.innerHTML='';
    }    
}

function cleanValuesTeam(){
    cleanFields('name|abreviatura|colorSelect|color');
    item('preview_logo').innerHTML='';
}

function ontypeTeam(value){
    if(value=='CLUB') showItem('li_seleccion');
    else  hideItem('li_seleccion');
}

function loadParents(){
    var conf=val('confederationTeam');
    var selParent=item('parentTeam');
    var list=teamsArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        if(t.conf===conf && t.type==='SEL'){
            html+=createOption(t.abre,t.name);
        }
    }
    selParent.innerHTML=html; 
    selParent.value=defaultSelected;   
    listViewTeams();
}

function addTeam(){
    var type=val('typeTeam')
    var elements=(type==='CLUB')?'confederationTeam|typeTeam|parentTeam|name|abreviatura|color':'confederationTeam|typeTeam|name|abreviatura|color';
    var isValid=isValidValues(elements);
    if(isValid){
        var v=values(elements);
        var team;
        if(type==='CLUB') team={ conf:v[0],type:v[1],parent:v[2],name:v[3].toUpperCase(),abre:v[4].toUpperCase(),aux:0,color:v[5] };
        else team={ conf:v[0],type:v[1],parent:v[0],name:v[2].toUpperCase(),abre:v[3].toUpperCase(),aux:0,color:v[4] };
        if(val('hdd_id_team')!=''){
            var auxTeam={conf:team.conf,type:team.type,parent:team.parent,name:team.name,abre:team.abre,aux:parseInt(team.aux),color:team.color,id:parseInt(val('hdd_id_team')) };
            updateStore('teams',auxTeam,'closed_popup(".popup-addteam");readTeams("loadParents()")')
            return;
        }
        
        defaultSelected=v[2];
        add("teams",team,'cleanValuesTeam();readTeams("loadParents()")');
    }else{
        toast('Debe ingresar todos los datos');
    }
}

function listViewTeams(){
    var filtertypeTeam=val('typeTeamSearch');
    var filterName=val('nameSearch');
    var list=orderTeamsByName(teamsArray);
    var html='';
    var i=0,k=0;
    for(i in list){
        var t=list[i];
        var name=t.name.toLowerCase();
        var abre=t.abre.toLowerCase();    
        if(((name.indexOf(filterName.toLowerCase())>=0 || abre.indexOf(filterName.toLowerCase())>=0) || filterName=='') && (t.type===filtertypeTeam || filtertypeTeam==='ALL')){
            html+=createItemLisviewTeams((k+1),t.name,t.color,t.id,t.abre,t.parent);
            k++;
        }    
    }    
    $('#teams').html(html); 
}

function createItemLisviewTeams(pos,name,color,id,abre,parent){
    return '<li>'+
    '<div class="item-content">'+
        '<div class="item-inner">'+
            '<div class="item-title" data-abre="'+abre+'" onclick="open_update_team(this)">'+
            ''+pos+'. '+logo(color)+name+''+
            '<div class="item-footer">'+abre+' - '+parent+'</div></div>'+
            '<div class="item-after">'+
                '<a href="#" data-id="'+id+'" data-name="'+name+'" onclick="dialogEliminarTeam(this)" class="link icon-only"><i class="f7-icons">trash</i></a>'+
            '</div>'+
        ''+
    '</div>'+
    '</li>';
}

function dialogEliminarTeam(element){
    teamEntity={id:element.dataset.id}
    confirmDialog('¿Esta seguro que desea eliminar a '+element.dataset.name+'?','eliminarTeam()')
}

function eliminarTeam(){
    deleteById('teams',teamEntity.id,'readTeams("loadParents()")');
}

function open_add_team(){
    item('title-popup-addteam').innerHTML='AGREGAR EQUIPO';
    item('hdd_id_team').value='';
    cleanValuesTeam();
    loadParents();
    open_popup('.popup-addteam');
}

function open_update_team(obj){
    var t=findTeamByAbre(obj.dataset.abre,teamsArray);
    setHtml('title-popup-addteam','ACTUALIZAR EQUIPO');
    setVal('hdd_id_team',t.id);
    setVal('confederationTeam',t.conf);
    loadParents();
    setVal('typeTeam',t.type);
    setVal('name',t.name);
    setVal('abreviatura',t.abre);
    setVal('parentTeam',t.parent);
    setVal('color',t.color);
    setHtml('preview_logo',logo(t.color,'20'));
    ontypeTeam(t.type);
    open_popup('.popup-addteam');
}

function clean_logo(){
    setHtml('preview_logo','');
    setVal('color','');
}

function orderTeamsByName(listTeams){
    listTeams.sort(function(a, b) {
        var n1 = a.name
        var n2 = b.name
        if(n1>n2) return 1;
        else if(n2>n1) return -1;
        return 0;
    });
    return  listTeams;
}


