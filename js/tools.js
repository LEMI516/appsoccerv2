function item(id){return document.getElementById(id);}

function Items(name){return document.getElementsByName(name);}

function val(id){return document.getElementById(id).value.trim();}

function setVal(id,value){ item(id).value=value; }

function setHtml(id,value){ item(id).innerHTML=value; }

function innerSelectColors(id,array,default_value){
    var html='';
    html='<option value="" >'+default_value+'</option>';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i]+'" style="background-color:'+array[i]+';color:'+array[i]+'" >'+array[i]+'</option>';
    }
    item(id).innerHTML=html; 
}

function innerSelectSimple(id,array,default_value){
    var html='';
    html='<option value="" >'+default_value+'</option>';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i]+'" >'+array[i]+'</option>';
    }
    item(id).innerHTML=html; 
}

function cleanFields(elements){
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
       $('#'+elemts[i]).val('');
    }
}

function showItem(ids){
    var elements=ids.split('|');
    for(var i=0;i<elements.length;i++){
        $('#'+elements[i]).show();
    }
}

function hideItem(ids){
    var elements=ids.split('|');
    for(var i=0;i<elements.length;i++){
        $('#'+elements[i]).hide();
    }
}

function toast(message){
    var toastTop = app.toast.show({
        text: message,
        closeTimeout: 2000,
    });
}

function isValidValues(elements){
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        var val=$('#'+elemts[i]).val();
        val=val.trim();
        if(val===""){
            return false;
        }
    }
    return true;
}

function values(elements){
    var array=new Array();
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        array.push($('#'+elemts[i]).val());
    }
    return array;
}

function createOption(value,text){ return '<option value="'+value+'" >'+text+'</option>'}

function confirmDialog(message,name_funcion){
    app.dialog.confirm(message, function () {
        if(name_funcion!='') eval(name_funcion);
    });
}

function open_popup(selector){
    app.popup.open(selector, true);
}

function closed_popup(selector){
    app.popup.close(selector, true);
}

function scaleTxt(texto){
    var is=false;
    var scale=0;
    if(texto.length>=24){
        scale=-2;
        is=true;
    }else if(texto.length>20){
        scale=-1;
        is=true;
    }
    return {is:is,scl:scale};
}


