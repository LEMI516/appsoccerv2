var app = new Framework7({
    root: '#app',
    name: 'Torneos y Competencias',
    id: 'com.app.soccer',
    panel: {
      swipe: 'left',
    },
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ],
});

var mainView = app.views.create('.view-main');

var $$ = Dom7;

var puntajesGeneral=[100,70,40,30];
var puntajesCP=[100,70,40,30];
var puntajesSC=[60,30,15,8];
var db=null;
var version=1;
var name_database='appsoccerdb';

function name_torneo(id){
    var name='';
    if(id=='LC') name='LIGA COLOMBIANA';
    else if(id=='CL') name='COPA LIBERTADORES';
    else if(id=='UCL') name='CHAMPIONS LEAGUE';
    else if(id=='CS') name='COPA SURAMERICANA';
    else if(id=='UEL') name='EUROPA LEAGUE';
    else if(id=='CM') name='COPA MUNDIAL';
    else if(id=='CMC') name='COPA MUNDIAL DE CLUBES';
    return name;
}

function name_type_torneo(id){
    var name='';
    if(id=='LG') name='LIGA';
    else if(id=='CE') name='COPA - ELIMINATORIA';
    else if(id=='CGI') name='COPA - GRUPOS (INI)';
    else if(id=='CGFP') name='COPA - GRUPOS (FP)';
    return name;
}

function name_type_match(id){
    var name='';
    if(id=='UNI') name='UNICO';
    else if(id=='LOCVIS') name='LOCAL - VISITANTE';
    return name;
}


function import_id_torneo(id){
    var name='';
    id=parseInt(id);
    if(id==1) name='LC';
    else if(id==2) name='CL';
    else if(id==4) name='UCL';
    else if(id==3) name='CS';
    else if(id==5) name='UEL';
    else if(id==7) name='CM';
    else if(id==6) name='CMC';
    else name=null;
    return name;
}

function colours(){
    var r=new Array("00","33","66","99","CC","FF");
    var g=new Array("00","33","66","99","CC","FF");
    var b=new Array("00","33","66","99","CC","FF");
    var result=new Array();
    for (i=0;i<r.length;i++) {
        for (j=0;j<g.length;j++) {
            for (k=0;k<b.length;k++) {
                var nuevoc = "#" + r[i] + g[j] + b[k];
                result.push(nuevoc);
            }
        }
    }
    result.push('#F3F3F3');
    return result;
}

function create_table_color(idTable,column,fun){
    var colorList=colours();
    var table=item(idTable);
    var html='';
    var c=0;
    for(var i=0;i<colorList.length;i++){
        if(c==0) html+='<tr>';
        if(c<column){
            html+='<td data-color="'+colorList[i]+'" data-fun="'+fun+'" onclick="onClickTableColorCell(this)" style="" bgcolor="'+colorList[i]+'"></td>'
            c++;
        }else{ 
            c=0;
            html+='</tr>';
        }
    }
    table.innerHTML=html;
}

function onClickTableColorCell(td){
    $(td).css({ 'border': '3px solid #FFF' });
    if(td.dataset.fun!= null && td.dataset.fun!= undefined && td.dataset.fun!= '') eval(td.dataset.fun+'("'+td.dataset.color+'")');
}

function logo(color,size){
    var html='';
    if(color.trim()=='') color='V;#C9C6BD';
    if(size==null || size==undefined || size=='' ) size='13'

    var confcolor=color.split(';');
    var clr=confcolor[1].split(':');
    var tam=clr.length;
    var p1,p2,p3;
    if(confcolor[0]=='h' || confcolor[0]=='H'){
        p1='left';p2='right';p3='1';
    }else{
        p1='top';p2='bottom';p3='0';
    }
    if(tam==1){
        html='<div '
        +'style="'
        +'height: '+size+'px;'
        +'width: '+size+'px;'
        +'border-radius: 50%;'
        +'background: '+clr[0]+';'
        +'border: solid 0.04em black;'
        +'display: inline-block;'
        +'margin: 0px 3px 0px 3px;'
        +'padding: 0;'
        +'" >'
        +'</div>';
    }else if(tam==2){
        html='<div '
        +'style="'
        +'height: '+size+'px;'
        +'width: '+size+'px;  '
        +'margin: 0px 3px 0px 3px ;'
        +'padding: 0;'
        +'display: inline-block;'      
        +'border-radius: 50%;'
        +'background: '+clr[0]+';' 
        +'border: solid 0.04em black;' 
        +'background: -moz-linear-gradient('+p1+', '+clr[0]+' 0%, '+clr[0]+' 50%, '+clr[1]+' 51%, '+clr[1]+' 100%); '
        +'background: -webkit-linear-gradient('+p1+', '+clr[0]+' 0%,'+clr[0]+' 50%,'+clr[1]+' 51%,'+clr[1]+' 100%); '
        +'background: linear-gradient(to '+p2+', '+clr[0]+' 0%,'+clr[0]+' 50%,'+clr[1]+' 51%,'+clr[1]+' 100%); '
        +'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+clr[0]+'\', endColorstr=\''+clr[1]+'\',GradientType='+p3+' ); '            
        +'" >'
        +'</div>';
    }else if(tam>2){
        html='<div '
        +'style="'
        +'height: '+size+'px;'
        +'width: '+size+'px;  '
        +'margin: 0px 3px 0px 3px ;'
        +'padding: 0;'
        +'display: inline-block;'      
        +'border-radius: 50%;'
        +'background: '+clr[0]+';' 
        +'border: solid 0.04em black;' 
        +'background: -moz-linear-gradient('+p1+', '+clr[0]+' 35%, '+clr[1]+' 36%, '+clr[1]+' 66%, '+clr[2]+' 67%);'
        +'background: -webkit-linear-gradient('+p1+', '+clr[0]+' 35%,'+clr[1]+' 36%,'+clr[1]+' 66%,'+clr[2]+' 67%); '
        +'background: linear-gradient(to '+p2+', '+clr[0]+' 35%,'+clr[1]+' 36%,'+clr[1]+' 66%,'+clr[2]+' 67%); '
        +'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+clr[0]+'\', endColorstr=\''+clr[2]+'\',GradientType='+p3+' );'             
        +'" >'
        +'</div>';
    }
    return html;
}

function depureArray(list){
    var newArray=new Array();
    for(i in list){
        var l=list[i];
        var existe=false;
        for(j in newArray){
            var n=newArray[j];
            if(parseInt(l.id)===parseInt(n.id)){
                existe=true;
                break;
            }
        } 
        if(!existe){
            newArray.push(l);
        }       
    }
    return newArray;
}


