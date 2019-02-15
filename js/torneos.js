$( document ).ready(function() {
    onload_database('readPlantillas("innerSelectPlantillas()")')
});

function open_add_torneo(){
    open_popup('.popup-addtorneo');
}

function innerSelectPlantillas(){
    var array=new Array();
    for(i in plantillasArray){
        var p=plantillasArray[i];
        array.push({id:p.id,value:p.name});
    }    
    innerSelect('plantilla',array);
    readTorneos('listViewTorneos()');
}

function addTorneo(){
    var elements='competencia|plantilla';
    var isValid=isValidValues(elements);
    if(isValid){
        var v=values(elements);
        var p=findById(plantillasArray,v[1]);
        var torneo={pk:v[0]+(torneosArray.length+1),competencia:v[0],edicion:torneosArray.length+1,name:name_torneo(v[0]),plantilla:p };
        add("competencia",torneo,'readTorneos("listViewTorneos()")');
    }else{
        toast('Debe ingresar todos los datos');
    }
}

function listViewTorneos(){
    var html="";
    var i=0;
    var type=val('txtypeTorneo');
    var list=torneosArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        var pk=parseInt(t.id);
        if(t.competencia===type || type==='ALL'){
            html+=createItemLisviewTorneo(pk,t);
        }
    }    
    $('#torneos').html(html); 
}

function createItemLisviewTorneo(pk,t){
    return '<li>'+
    '<div class="item-content">'+
        '<div class="item-inner">'+
            '<div class="item-title" data-pk="'+pk+'" onclick="onclickTorneoAdm(this)">'+
            t.name+' '+t.edicion+'°'+
            '</div>'+
            '<div class="item-after">'+
                '<a href="#" data-id="'+t.id+'" data-name="'+t.name+'" onclick="dialogEliminarTorneo(this)" class="link icon-only"><i class="f7-icons">trash</i></a>'+
            '</div>'+
        ''+
    '</div>'+
    '</li>';
}

var torneoEntity={}
function dialogEliminarTorneo(element){
    torneoEntity={id:element.dataset.id}
    confirmDialog('¿Esta seguro que desea eliminar el torneo '+element.dataset.name+' ?','eliminarTorneo()');
}

function eliminarTorneo(){
    deleteById('competencia',torneoEntity.id,'readTorneos("listViewTorneos()")');
}

function onclickTorneoAdm(obj){
    var t=findById(torneosArray,obj.dataset.pk);
    localStorage.setItem('torneo', JSON.stringify(t));
    var uri="torneo_adm.html?";
    location.href=uri; 
}