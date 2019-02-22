$$('.panel-left').on('panel:open', function () {
  console.log('Panel left: open');
});
$$('.panel-left').on('panel:opened', function () {
  console.log('Panel left: opened');
});

$(document).ready(function() {
  database_onload('onload_database("readTorneos(\'listViewTorneos()\');")');
});

function listViewTorneos(){
  var html="";
  var i=0;
  var list=torneosArray;
  var html='';
  var i=0;
  for(i in list){
      var t=list[i];
      var pk=parseInt(t.id);
      html+=createItemLisviewTorneo(pk,t);
      if(i>=20){
        break;
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

function onclickTorneoAdm(obj){
  var t=findById(torneosArray,obj.dataset.pk);
  localStorage.setItem('torneo', JSON.stringify(t));
  var uri="pages/torneo_adm.html?";
  location.href=uri; 
}