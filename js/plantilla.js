
$( document ).ready(function() {
    onload_database('readPlantillas("listViewPlantillas()")');
});

function open_add_plantilla(){
    onchangeCreatePlantillas();
    open_popup('.popup-addplantilla');
}

function onchangeCreatePlantillas(){
    var typeTorneo=val('typeTorneo');
    var idsS='',idsH='';
    if(typeTorneo!=''){
        if(typeTorneo=='CE'){
            idsH='licantGru|licantTeamxGru|licantClaxGru|licantMejTerceros|libtnCfp';
        }else if(typeTorneo=='CGI'){
            idsS='licantGru|licantTeamxGru|licantClaxGru|licantMejTerceros';
            idsH='libtnCfp';
        }else if(typeTorneo=='CGFP'){
            idsS='licantGru|licantTeamxGru|licantClaxGru|licantMejTerceros|libtnCfp';
        }
    }else{
        idsH='licantGru|licantTeamxGruli|licantClaxGru|licantMejTerceros|libtnCfp';
    }
    if(idsS!='') showItem(idsS);
    if(idsH!='') hideItem(idsH);    
}

function openConfigurePhase(btn){
    var valor=btn.dataset.value;
    var text='';
    if(valor===''){
        text='Fase #1';
    }else{
        var f=valor.split(':');
        text='Fase #'+(f.length+1)+'</br>';
        for(var i=0;i<f.length;i++){
            text+='Fase '+(i+1)+': '+f[i]+' Equipos <br>';
        }
    }

    app.dialog.prompt(text, function (name) {
        if(name=='0'){
            btn.dataset.value='';
        }else{        
            btn.dataset.value=(valor!='')? valor+':'+name:name;
        }
    });
}

function addPlantilla(){
    var confederation=val('confederation');
    var typeTeam=val('typeTeam');
    var typeTorneo=val('typeTorneo');
    var typeMatch=val('typeMatch');
    var cantTeam=val('cantTeam');
    var cantGru=val('cantGru');
    var cantTeamxGru=val('cantTeamxGru');
    var cantClaxGru=val('cantClaxGru');
    var cantMejTerceros=val('cantMejTerceros');
    var namePlanti=val('namePlanti').toUpperCase();
    var cff=item('btnCff').dataset.value;
    var cfp=item('btnCfp').dataset.value;

    var elements='confederation|typeTeam|typeTorneo|typeMatch|cantTeam|namePlanti';
    if(typeTorneo=='CGI') elements+='|cantGru|cantTeamxGru|cantClaxGru';
    else if(typeTorneo=='CGFP') elements+='|cantGru|cantTeamxGru|cantClaxGru';
    
    var isValid=isValidValues(elements);
    if(isValid){
        if((cff==undefined || cff=='') && (typeTorneo=='CGI' || typeTorneo=='CE' || typeTorneo=='CGFP')){
            toast('Debe configurar la fase final');
            return;
        }
        if((cfp==undefined || cfp=='') && (typeTorneo=='CGFP')){
            toast('Debe configurar la fase previa');
            return;
        }            
        var plantilla={ 
            name:namePlanti,
            confederation:confederation,
            typeTeam:typeTeam,
            typeTorneo:typeTorneo,
            typeMatch:typeMatch,
            cantTeam:cantTeam, 
            cantGru:cantGru,
            cantTeamxGru:cantTeamxGru,
            cantClaxGru:cantClaxGru,
            cantMejTerceros:cantMejTerceros,
            cff:cff,cfp:cfp
        };
        add("plantilla",plantilla,'cleanValues();readPlantillas("listViewPlantillas()")');        
    }else{
        toast('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('cantTeam|cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|namePlanti');
    item('btnCff').dataset.value='';
    item('btnCfp').dataset.value='';    
}

function listViewPlantillas(){
    var list=plantillasArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        html+=createItemLisviewPlantilla(t.id,t.name);
    }    
    $('#plantillasList').html(html); 
}

function createItemLisviewPlantilla(pk,name){
    return '<li>'+
    '<div class="item-content">'+
        '<div class="item-inner">'+
            '<div class="item-title" data-pk="'+pk+'" onclick="showPlantilla(this)">'+
            name+
            '</div>'+
            '<div class="item-after">'+
                '<a href="#" data-id="'+pk+'" data-name="'+name+'" onclick="dialogEliminarPlantilla(this)" class="link icon-only"><i class="f7-icons">trash</i></a>'+
            '</div>'+
        ''+
    '</div>'+
    '</li>';
}

var plantillaEntity={};
function dialogEliminarPlantilla(element){
    plantillaEntity={id:element.dataset.id}
    confirmDialog('¿Esta seguro que desea eliminar la plantilla '+element.dataset.name+' ?','eliminarPlantilla()');
}

function eliminarPlantilla(){
    deleteById('plantilla',plantillaEntity.id,'readPlantillas("listViewPlantillas()")');
}

function showPlantilla(p){
    var p=findById(plantillasArray,p.dataset.pk);
    var text='Nombre: '+p.name+'</br>'
            +'CONF/ON: '+p.confederation+'</br>'
            +'EQUIPOS: '+p.typeTeam+'</br>'
            +'TIPO:'+name_type_torneo(p.typeTorneo)+'</br>'
            +'PARTIDOS:'+name_type_match(p.typeMatch)+'</br>'
            +'N° EQUIPOS: '+p.cantTeam+'</br>'
            +'N° GRUPOS: '+p.cantGru+'</br>'
            +'N° EQUIxGRU: '+p.cantTeamxGru+'</br>'
            +'N° CLAxGRU: '+p.cantClaxGru+'</br>'
            +'N° MEJTER: '+p.cantMejTerceros+'</br>'
            +'FASE FINAL:'+p.cff+'</br>'
            +'FASE PREVIA: '+p.cfp+'</br>'
        +'</table>'; 
    app.dialog.alert(text);
}