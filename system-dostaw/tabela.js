(function(){
  'use strict';
  var KEY='agroros-dostawy-v2';

  // konta pracowników: imię i nazwisko + skrót widoczny w tabeli
  var KONTA=[
    {n:'Jacek Rosiński',s:'Jacek'},
    {n:'Adam Rosiński',s:'Adam R'},
    {n:'Adam Osowiecki',s:'Adaśko'},
    {n:'Sylwia Drzewiecka',s:'Sylwia'},
    {n:'Małgorzata Tworos',s:'Gosia'}
  ];

  // kolumny jak w dotychczasowym arkuszu firmy
  var GATUNKI=['Pszenica','Pszenica GMP','Żyto','Pszenżyto','Jęczmień','Owies','Owies GMP','Kukurydza sucha','Kukurydza mokra','Kukurydza GMP','Rzepak','Soja','Słonecznik','Śruta sojowa','Śruta rzepakowa','Węgiel','Wapno','Sól'];
  var KAL={format:'DD.MM.YYYY',months:['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'],monthsFull:['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],weekdays:['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],weekdays_short:['Nd','Pn','Wt','Śr','Cz','Pt','So'],textDone:'Gotowe',textReset:'Wyczyść',textUpdate:'OK',startingDay:1};
  var NUM={type:'numeric',mask:'#.##0,00',decimal:','};
  function num(o){var c={};for(var k in NUM)c[k]=NUM[k];for(k in o)c[k]=o[k];return c}
  var KOLUMNY=[
    {name:'zal',title:'Data załadunku',type:'calendar',width:104,options:KAL},
    {name:'roz',title:'Data rozładunku',type:'calendar',width:104,options:KAL},
    {name:'rodzaj',title:'Rodzaj zboża',type:'dropdown',source:GATUNKI,autocomplete:true,width:130},
    {name:'odkogo',title:'Od kogo kupione',type:'text',width:160},
    {name:'umz',title:'Umowa zakupu',type:'dropdown',source:[],autocomplete:true,width:190},
    {name:'wet',title:'Nr weterynaryjny',type:'text',width:118},
    num({name:'ilz',title:'Ilość załadowana (t)',width:96}),
    num({name:'ilr',title:'Ilość rozładowana (t)',width:96}),
    num({name:'cz',title:'Cena zakupu netto (zł/t)',width:100}),
    num({name:'cs',title:'Cena sprzedaży (zł/t)',width:100}),
    num({name:'tr',title:'Koszt transportu (zł/t)',width:100}),
    {name:'przew',title:'Przewoźnik',type:'text',width:120},
    {name:'kier',title:'Kierowca, auto, telefon',type:'text',width:220},
    {name:'komu',title:'Komu sprzedane',type:'text',width:160},
    {name:'ums',title:'Umowa sprzedaży',type:'dropdown',source:[],autocomplete:true,width:190},
    {name:'fvz',title:'FV zakupu / dokument',type:'text',width:128},
    {name:'fv',title:'Nasz nr FV',type:'text',width:108},
    {name:'wplyw',title:'Data wpływu',type:'calendar',width:104,options:KAL},
    num({name:'zysk',title:'Zysk (zł)',width:104,readOnly:true}),
    {name:'cert',title:'Deklaracja / certyfikat',type:'text',width:120},
    {name:'uwagi',title:'Uwagi',type:'text',width:220},
    {name:'kto',title:'Kto zmienił',type:'text',width:84,readOnly:true}
  ];

  // rejestr umów
  var UMOWY_KOL=[
    {name:'nr',title:'Nr umowy',type:'text',width:110},
    {name:'typ',title:'Rodzaj',type:'dropdown',source:['Zakup','Sprzedaż'],width:108},
    {name:'kontr',title:'Kontrahent',type:'text',width:240},
    {name:'towar',title:'Towar',type:'dropdown',source:GATUNKI,autocomplete:true,width:130},
    num({name:'ilosc',title:'Ilość w umowie (t)',width:100}),
    num({name:'cena',title:'Cena (zł/t)',width:90}),
    {name:'do',title:'Termin realizacji',type:'calendar',width:104,options:KAL},
    num({name:'zreal',title:'Zrealizowano (t)',width:104,readOnly:true}),
    num({name:'zost',title:'Zostało (t)',width:100,readOnly:true}),
    {name:'proc',title:'Realizacja',type:'text',width:120,readOnly:true},
    {name:'status',title:'Status',type:'text',width:150,readOnly:true},
    {name:'uwagi',title:'Uwagi',type:'text',width:200},
    {name:'kto',title:'Kto zmienił',type:'text',width:84,readOnly:true}
  ];
  function u(nr,typ,kontr,towar,ilosc,cena,termin,uwagi,kto){return [nr,typ,kontr,towar,ilosc,cena,termin,'','','','',uwagi||'',kto||'']}
  var UMOWY=[
    u('Z/01/2026','Zakup','Gosp. rolne Nowak, Pokrzywnica','Pszenica',75,780,'2026-12-31','','Jacek'),
    u('Z/02/2026','Zakup','Gosp. rolne Wiśniewski, Somianka','Kukurydza sucha',80,690,'2026-12-15','','Adam R'),
    u('Z/03/2026','Zakup','Gosp. rolne Wiśniewski, Somianka','Rzepak',25,1870,'2026-10-31','','Adam R'),
    u('Z/04/2026','Zakup','Gosp. rolne Kowalczyk','Rzepak',50,1890,'2026-12-31','','Adaśko'),
    u('S/01/2026','Sprzedaż','Wytwórnia Pasz (przykład)','Kukurydza sucha',150,755,'2026-12-31','dostawy co tydzień','Jacek'),
    u('S/02/2026','Sprzedaż','Młyn Zbożowy (przykład)','Pszenica',50,845,'2026-11-30','','Sylwia'),
    u('S/03/2026','Sprzedaż','Tłocznia Oleju (przykład)','Rzepak',100,1975,'2027-01-31','','Gosia'),
    u('S/04/2026','Sprzedaż','Suszarnia (przykład)','Kukurydza mokra',55.9,575,'2026-11-30','','Gosia')
  ];

  // przykładowe wpisy (fikcyjne)
  function w(z,r,rodzaj,od,umz,wet,ilz,ilr,cz,cs,tr,przew,kier,komu,ums,fvz,fv,wplyw,cert,uwagi,kto){return [z,r,rodzaj,od,umz||'',wet,ilz,ilr,cz,cs,tr,przew,kier,komu,ums||'',fvz,fv,wplyw,'',cert||'',uwagi||'',kto||'']}
  var LISTOPAD=[
    w('2026-11-03','2026-11-03','Pszenica','Gosp. rolne Nowak, Pokrzywnica','Z/01/2026','PL1401011p',25.96,25.96,780,845,30,'Agro-Ros','Kierowca 1, WPU 1234A, 600 100 200','Młyn Zbożowy (przykład)','S/02/2026','VAT 12/11/2026','FV 101/11/2026','2026-11-17','tak','','Gosia'),
    w('2026-11-03','2026-11-04','Kukurydza sucha','Gosp. rolne Wiśniewski, Somianka','Z/02/2026','PL1435022p',26.40,26.36,690,742,35,'Agro-Ros','Kierowca 2, WWY 5521K, 600 100 201','Wytwórnia Pasz (przykład)','S/01/2026','RR 3/11/2026','FV 102/11/2026','','','','Adam R'),
    w('2026-11-05','2026-11-05','Rzepak','Gosp. rolne Kowalczyk','Z/04/2026','PL1430117p',24.10,24.06,1890,1975,40,'Trans-Bis (przykład)','Kierowca 3, WOR 7788C, 600 100 202','Tłocznia Oleju (przykład)','S/03/2026','VAT 7/11/2026','FV 103/11/2026','2026-11-19','tak','wilgotność 7,2%','Sylwia'),
    w('2026-11-06','2026-11-06','Kukurydza mokra','Gosp. rolne Zieliński','','PL1435140p',27.80,27.80,520,575,30,'Agro-Ros','Kierowca 1, WPU 1234A, 600 100 200','Suszarnia (przykład)','S/04/2026','RR 4/11/2026','FV 104/11/2026','','','cena bazowa przy wilg. 30%','Gosia'),
    w('2026-11-09','2026-11-10','Jęczmień','Plac Stare Płudy','','',26.26,26.20,700,770,55,'Trans-Bis (przykład)','Kierowca 4, WMA 3302E, 600 100 203','Słodownia (przykład)','','','FV 105/11/2026','2026-11-24','','','Adaśko'),
    w('2026-11-10','2026-11-10','Owies','Gosp. rolne Lewandowski','','PL1463019p',22.24,22.24,560,610,25,'Agro-Ros','Kierowca 2, WWY 5521K, 600 100 201','Zakład Zbożowy (przykład)','','RR 5/11/2026','FV 106/11/2026','','','','Adaśko'),
    w('2026-11-12','2026-11-13','Pszenica GMP','Gosp. rolne Dąbrowski','','PL1206206p',25.88,25.88,760,790,45,'Przewoźnik zewn. (przykład)','Kierowca 5, WGM 1524L, 600 100 204','Wytwórnia Pasz (przykład)','','VAT 9/11/2026','FV 107/11/2026','','','reklamacja: zanieczyszczenia','Jacek'),
    w('2026-11-16','2026-11-16','Śruta sojowa','Hurtownia Pasz (przykład)','','',24.00,24.00,1650,1720,0,'ich','odbiór własny klienta','Gosp. rolne Mazur','','FS 2/11/2026','FV 108/11/2026','2026-11-20','','','Sylwia'),
    w('2026-11-18','2026-11-18','Pszenżyto','Plac Stare Płudy','','',28.52,28.50,690,735,30,'Agro-Ros','Kierowca 1, WPU 1234A, 600 100 200','Mieszalnia Pasz (przykład)','','','FV 109/11/2026','','','','Gosia'),
    w('2026-11-19','2026-11-20','Kukurydza sucha','Gosp. rolne Wójcik','','PL1435022p',26.02,25.96,700,755,35,'Trans-Bis (przykład)','Kierowca 3, WOR 7788C, 600 100 202','Wytwórnia Pasz (przykład)','S/01/2026','RR 8/11/2026','FV 110/11/2026','','','','Adam R')
  ];
  var PAZDZIERNIK=[
    w('2026-10-07','2026-10-07','Kukurydza mokra','Gosp. rolne Nowak, Pokrzywnica','','PL1401011p',28.10,28.10,510,560,30,'Agro-Ros','Kierowca 1, WPU 1234A, 600 100 200','Suszarnia (przykład)','S/04/2026','RR 1/10/2026','FV 81/10/2026','2026-10-21','','','Gosia'),
    w('2026-10-15','2026-10-16','Pszenica','Gosp. rolne Kowalczyk','','PL1430117p',25.40,25.36,770,830,30,'Agro-Ros','Kierowca 2, WWY 5521K, 600 100 201','Młyn Zbożowy (przykład)','S/02/2026','VAT 4/10/2026','FV 82/10/2026','2026-10-30','','','Jacek'),
    w('2026-10-22','2026-10-22','Rzepak','Gosp. rolne Wiśniewski, Somianka','Z/03/2026','PL1435022p',24.60,24.60,1870,1940,40,'Trans-Bis (przykład)','Kierowca 3, WOR 7788C, 600 100 202','Tłocznia Oleju (przykład)','S/03/2026','VAT 6/10/2026','FV 83/10/2026','2026-11-05','tak','','Adam R')
  ];
  var STYL_LISTOPAD={'A5':'background-color:#FBEBC0','B5':'background-color:#FBEBC0','C5':'background-color:#FBEBC0;font-weight:bold','U7':'color:#A8432F;font-weight:bold','C3':'font-weight:bold'};

  function domyslne(){
    return {months:[
      {id:'2026-10',name:'Październik 2026',data:PAZDZIERNIK,style:{}},
      {id:'2026-11',name:'Listopad 2026',data:LISTOPAD,style:STYL_LISTOPAD},
      {id:'2026-12',name:'Grudzień 2026',data:[],style:{}}
    ],umowy:UMOWY,umowyStyle:{},hist:[],akt:'2026-11'};
  }
  function wczytaj(){try{var s=localStorage.getItem(KEY);if(s){var o=JSON.parse(s);if(o&&o.months&&o.months.length){if(!o.umowy)o.umowy=[];return o}}}catch(e){}return domyslne()}
  function zapiszLS(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

  var S=wczytaj(), grid=null, user='', wTrakcie=false, UM='umowy';
  var $=function(id){return document.getElementById(id)};
  var MIES=['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];

  function wUmowach(){return S.akt===UM}
  function biezacy(){for(var i=0;i<S.months.length;i++)if(S.months[i].id===S.akt)return S.months[i];return S.months[S.months.length-1]}
  function idx(name){var c=grid?grid.options.columns:(wUmowach()?UMOWY_KOL:KOLUMNY);for(var i=0;i<c.length;i++)if(c[i].name===name)return i;return -1}
  function idxW(cols,name){for(var i=0;i<cols.length;i++)if(cols[i].name===name)return i;return -1}
  function liczba(v){if(v===null||v===undefined||v==='')return NaN;if(typeof v==='number')return v;var s=String(v).replace(/\s/g,'').replace(/zł/g,'');if(s.indexOf(',')>-1)s=s.replace(/\./g,'').replace(',','.');return parseFloat(s)}
  function fmt(n,d){d=d===undefined?2:d;return n.toLocaleString('pl-PL',{minimumFractionDigits:d,maximumFractionDigits:d})}
  function r2(n){return Math.round(n*100)/100}
  function pelny(r){return r&&r.some(function(v){return v!==''&&v!==null&&v!==undefined})}
  function zyskWiersza(r){var f=liczba(r[idx('ilz')]),h=liczba(r[idx('cz')]),i=liczba(r[idx('cs')]),j=liczba(r[idx('tr')]);if(isNaN(f)||isNaN(h)||isNaN(i))return '';if(isNaN(j))j=0;return Math.round(f*(i-h-j)*100)/100}
  function data(v){if(!v)return '';var q=String(v).slice(0,10).split('-');return q.length===3?q[2]+'.'+q[1]+'.'+q[0]:v}
  function skrot(){return user}
  function konto(s){for(var i=0;i<KONTA.length;i++)if(KONTA[i].s===s)return KONTA[i];return {n:s,s:s}}

  // lista umów do wyboru w wierszu (osobno zakup i sprzedaż)
  function listaUmow(typ){
    var c=UMOWY_KOL,iN=idxW(c,'nr'),iT=idxW(c,'typ'),iK=idxW(c,'kontr'),iW=idxW(c,'towar'),out=[];
    (S.umowy||[]).forEach(function(r){if(r[iN]&&r[iT]===typ){var k=String(r[iK]||'').replace(/^Gosp\. rolne /,'').replace(/\s*\(przykład\)/,'').split(',')[0];out.push({id:r[iN],name:r[iN]+' · '+(k||r[iW]||'')})}});
    return out;
  }

  // realizacja umów ze wszystkich miesięcy: zakup z ilości załadowanej, sprzedaż z ilości rozładowanej
  function realizacja(){
    var R={};
    function dodaj(nr,ile,poz){if(!nr)return;if(!R[nr])R[nr]={t:0,poz:[]};if(!isNaN(ile))R[nr].t+=ile;R[nr].poz.push(poz)}
    S.months.forEach(function(m){
      var cols=kolumnyMiesiaca(m),d=m.data||[];
      var a={zal:idxW(cols,'zal'),roz:idxW(cols,'roz'),rodzaj:idxW(cols,'rodzaj'),od:idxW(cols,'odkogo'),komu:idxW(cols,'komu'),umz:idxW(cols,'umz'),ums:idxW(cols,'ums'),ilz:idxW(cols,'ilz'),ilr:idxW(cols,'ilr')};
      d.forEach(function(r,y){
        if(!pelny(r))return;
        var z=liczba(r[a.ilz]),o=liczba(r[a.ilr]);
        if(a.umz>-1&&r[a.umz]){var ile=!isNaN(z)?z:o;dodaj(r[a.umz],ile,{m:m,y:y,typ:'zakup',data:r[a.zal],towar:r[a.rodzaj],kto:r[a.od],ile:ile})}
        if(a.ums>-1&&r[a.ums]){var ile2=!isNaN(o)?o:z;dodaj(r[a.ums],ile2,{m:m,y:y,typ:'sprzedaż',data:r[a.roz]||r[a.zal],towar:r[a.rodzaj],kto:r[a.komu],ile:ile2})}
      });
    });
    return R;
  }

  function zapisz(){
    if(!grid)return;
    if(wUmowach()){
      S.umowy=grid.getData().filter(pelny);S.umowyStyle=grid.getStyle();zapiszLS();podsumujUmowy();return;
    }
    var m=biezacy();
    m.data=grid.getData();m.style=grid.getStyle();
    m.cols=grid.options.columns.map(function(c,i){return {name:c.name||'',title:grid.getHeader(i),width:grid.getWidth(i)}});
    zapiszLS();podsumuj();
  }

  function podsumuj(){
    var d=grid?grid.getData():[],n=0,tz=0,tr=0,kt=0,zy=0;
    var a=idx('ilz'),b=idx('ilr'),t=idx('tr'),z=idx('zysk');
    d.forEach(function(r){
      if(!pelny(r))return;n++;
      var f=liczba(r[a]),g=liczba(r[b]),j=liczba(r[t]),y=liczba(r[z]);
      if(!isNaN(f))tz+=f;if(!isNaN(g))tr+=g;if(!isNaN(f)&&!isNaN(j))kt+=f*j;if(!isNaN(y))zy+=y;
    });
    $('sum').innerHTML=
      '<div class="k"><b>'+n+'</b><span>pozycji w miesiącu</span></div>'+
      '<div class="k"><b>'+fmt(tz)+' t</b><span>załadowano</span></div>'+
      '<div class="k"><b>'+fmt(tr)+' t</b><span>rozładowano</span></div>'+
      '<div class="k"><b>'+fmt(kt)+' zł</b><span>koszt transportu</span></div>'+
      '<div class="k '+(zy<0?'minus':'zysk')+'"><b>'+fmt(zy)+' zł</b><span>zysk w miesiącu</span></div>';
  }

  function podsumujUmowy(){
    var d=grid?grid.getData():[],n=0,otw=0,prz=0,zl=0,zr=0,sl=0,sr=0;
    var iT=idx('typ'),iI=idx('ilosc'),iZ=idx('zreal');
    d.forEach(function(r){
      if(!pelny(r))return;n++;
      var il=liczba(r[iI]),re=liczba(r[iZ]);if(isNaN(re))re=0;
      if(!isNaN(il)){if(re<il-0.005)otw++;if(re>il+0.005)prz++}
      if(r[iT]==='Zakup'){if(!isNaN(il))zl+=il;zr+=re}else if(r[iT]==='Sprzedaż'){if(!isNaN(il))sl+=il;sr+=re}
    });
    $('sum').innerHTML=
      '<div class="k"><b>'+n+'</b><span>umów, w realizacji: '+otw+(prz?', <em class="przekr">przekroczone: '+prz+'</em>':'')+'</span></div>'+
      '<div class="k"><b>'+fmt(zr)+' t</b><span>zakup: zrealizowano z '+fmt(zl)+' t</span></div>'+
      '<div class="k zysk"><b>'+fmt(Math.max(0,zl-zr))+' t</b><span>zakup: zostało do odbioru</span></div>'+
      '<div class="k"><b>'+fmt(sr)+' t</b><span>sprzedaż: zrealizowano z '+fmt(sl)+' t</span></div>'+
      '<div class="k zysk"><b>'+fmt(Math.max(0,sl-sr))+' t</b><span>sprzedaż: zostało do dostarczenia</span></div>';
  }

  function nazwaWidoku(){return wUmowach()?'Umowy':biezacy().name}
  function dziennik(opis){S.hist.unshift({t:new Date().toISOString(),kto:user,m:nazwaWidoku(),o:opis});if(S.hist.length>500)S.hist.length=500}

  function pasekNarzedzi(){
    return [
      {type:'i',content:'undo',tooltip:'Cofnij',onclick:function(){grid.undo()}},
      {type:'i',content:'redo',tooltip:'Ponów',onclick:function(){grid.redo()}},
      {type:'select',k:'font-size',v:['12px','13px','14px','16px','18px','20px'],selectedValue:'14px',tooltip:'Rozmiar czcionki'},
      {type:'i',content:'format_bold',k:'font-weight',v:'bold',tooltip:'Pogrubienie'},
      {type:'i',content:'format_italic',k:'font-style',v:'italic',tooltip:'Kursywa'},
      {type:'i',content:'format_underlined',k:'text-decoration',v:'underline',tooltip:'Podkreślenie'},
      {type:'i',content:'format_align_left',k:'text-align',v:'left',tooltip:'Do lewej'},
      {type:'i',content:'format_align_center',k:'text-align',v:'center',tooltip:'Do środka'},
      {type:'i',content:'format_align_right',k:'text-align',v:'right',tooltip:'Do prawej'},
      {type:'color',content:'format_color_text',k:'color',tooltip:'Kolor tekstu'},
      {type:'color',content:'format_color_fill',k:'background-color',tooltip:'Kolor tła'},
      {type:'i',content:'format_clear',tooltip:'Usuń formatowanie',onclick:function(){
        var h=grid.highlighted||[],st={};
        h.forEach(function(td){var x=td.getAttribute('data-x'),y=td.getAttribute('data-y');if(x!==null)st[jspreadsheet.getColumnNameFromId([+x,+y])]='';});
        if(Object.keys(st).length){grid.resetStyle(st);dziennik('usunięto formatowanie');zapisz()}
      }}
    ];
  }

  var TEKSTY={noRecordsFound:'Brak wpisów',showingPage:'Strona {0} z {1}',show:'Pokaż ',search:'Szukaj',entries:' wpisów',columnName:'Nazwa kolumny',insertANewColumnBefore:'Wstaw kolumnę przed',insertANewColumnAfter:'Wstaw kolumnę za',deleteSelectedColumns:'Usuń zaznaczone kolumny',renameThisColumn:'Zmień nazwę kolumny',orderAscending:'Sortuj rosnąco',orderDescending:'Sortuj malejąco',insertANewRowBefore:'Wstaw wiersz powyżej',insertANewRowAfter:'Wstaw wiersz poniżej',deleteSelectedRows:'Usuń zaznaczone wiersze',editComments:'Edytuj komentarz',addComments:'Dodaj komentarz',comments:'Komentarz',clearComments:'Usuń komentarz',copy:'Kopiuj',paste:'Wklej',saveAs:'Zapisz jako plik CSV',about:'',areYouSureToDeleteTheSelectedRows:'Usunąć zaznaczone wiersze?',areYouSureToDeleteTheSelectedColumns:'Usunąć zaznaczone kolumny?',thisActionWillDestroyAnyExistingMergedCellsAreYouSure:'To usunie scalone komórki. Kontynuować?',thisActionWillClearYourSearchResultsAreYouSure:'To wyczyści wyniki wyszukiwania. Kontynuować?',thereIsAConflictWithAnotherMergedCell:'Konflikt ze scaloną komórką',invalidMergeProperties:'Nieprawidłowe scalenie',cellAlreadyMerged:'Komórka jest już scalona',noCellsSelected:'Nie zaznaczono komórek'};

  function kolumnyMiesiaca(m){
    var c=KOLUMNY.map(function(k){var o={};for(var p in k)o[p]=k[p];return o});
    if(m.cols&&m.cols.length){
      // zapisane nazwy, szerokości i dodane kolumny
      c=m.cols.map(function(s){var baza=null;for(var i=0;i<KOLUMNY.length;i++)if(KOLUMNY[i].name&&KOLUMNY[i].name===s.name)baza=KOLUMNY[i];var o={};if(baza)for(var p in baza)o[p]=baza[p];else o.type='text';o.title=s.title;o.width=s.width;if(s.name)o.name=s.name;return o});
    }
    c.forEach(function(k){if(k.name==='umz')k.source=listaUmow('Zakup');if(k.name==='ums')k.source=listaUmow('Sprzedaż')});
    return c;
  }

  function widok(){
    var um=wUmowach();
    document.body.classList.toggle('w-umowy',um);
    $('btnRowTx').textContent=um?'Dodaj umowę':'Dodaj wiersz';
    $('szukaj').placeholder=um?'Szukaj: nr umowy, kontrahent, towar':'Szukaj: zboże, kontrahent, nr FV';
    $('hintM').hidden=um;$('hintU').hidden=!um;$('poz').hidden=!um;
    $('sum').setAttribute('aria-label',um?'Podsumowanie umów':'Podsumowanie miesiąca');
  }

  function pokaz(id){
    if(grid){zapisz();jspreadsheet.destroy($('grid'),false);grid=null}
    S.akt=id;zapiszLS();
    zakladki();widok();
    if(id===UM){pokazUmowy();return}
    var m=biezacy();
    var cols=kolumnyMiesiaca(m);
    var dane=(m.data&&m.data.length?m.data:[]).map(function(r){return r.slice()});
    var cel=Math.max(25,dane.length+8);while(dane.length<cel)dane.push(cols.map(function(){return ''}));
    wTrakcie=true;
    grid=jspreadsheet($('grid'),{
      data:dane,columns:cols,style:m.style||{},
      toolbar:pasekNarzedzi(),search:false,filters:true,columnSorting:true,
      allowInsertColumn:true,allowDeleteColumn:true,allowRenameColumn:true,allowComments:true,
      wordWrap:false,minDimensions:[cols.length,25],defaultColWidth:110,
      tableOverflow:false,about:false,text:TEKSTY,
      onchange:function(el,cell,x,y,value,old){
        if(wTrakcie)return;
        x=+x;y=+y;var nm=grid.options.columns[x]&&grid.options.columns[x].name;
        if(String(value)!==String(old)){
          var head=grid.getHeader(x);
          dziennik('wiersz '+(y+1)+', „'+head+'”: '+(old===''||old==null?'(puste)':old)+' → '+(value===''?'(puste)':value));
          var k=idx('kto');if(k>-1&&nm!=='kto'&&nm!=='zysk'){wTrakcie=true;grid.setValueFromCoords(k,y,skrot(),true);wTrakcie=false}
        }
        if(['ilz','cz','cs','tr'].indexOf(nm)>-1){
          var z=idx('zysk');if(z>-1){var nowy=zyskWiersza(grid.options.data[y]);if(String(grid.options.data[y][z])!==String(nowy)){wTrakcie=true;grid.setValueFromCoords(z,y,nowy,true);wTrakcie=false}}
        }
      },
      onafterchanges:function(){if(!wTrakcie)zapisz()},
      onchangestyle:function(){if(!wTrakcie){dziennik('zmieniono formatowanie');zapisz()}},
      oninsertrow:function(){dziennik('dodano wiersz');zapisz()},
      ondeleterow:function(){dziennik('usunięto wiersz');zapisz()},
      oninsertcolumn:function(){dziennik('dodano kolumnę');zapisz()},
      ondeletecolumn:function(){dziennik('usunięto kolumnę');zapisz()},
      onchangeheader:function(el,col,o,n){dziennik('zmieniono nazwę kolumny: '+o+' → '+n);zapisz()},
      onresizecolumn:function(){zapisz()},
      onsort:function(){zapisz()},
      onmoverow:function(){zapisz()},
      onselection:function(el,x1,y1,x2,y2){zaznaczenie(x1,y1,x2,y2)},
      updateTable:function(inst,cell,col,row,val){
        var c=grid?grid.options.columns[col]:cols[col];
        if(c&&c.name==='zysk'){cell.classList.remove('zysk-plus','zysk-minus');var n=liczba(val);if(!isNaN(n))cell.classList.add(n<0?'zysk-minus':'zysk-plus')}
        if(c&&(c.name==='umz'||c.name==='ums'))cell.classList.toggle('um-kom',!!val);
        if(c&&c.name==='kto')cell.classList.add('kto-kom');
      }
    });
    var q=$('szukaj');if(q.value)grid.search(q.value);
    // zysk liczony z danych przy otwarciu miesiąca
    var z=idx('zysk');
    grid.options.data.forEach(function(r,y){var nowy=zyskWiersza(r);if(String(r[z])!==String(nowy))grid.setValueFromCoords(z,y,nowy,true)});
    wTrakcie=false;
    podsumuj();$('sel').innerHTML='Zaznacz komórki, a tu pojawi się ich suma.';
  }

  // zakładka Umowy
  function przeliczUmowy(){
    var R=realizacja(),d=grid.options.data;
    var iN=idx('nr'),iI=idx('ilosc'),iZ=idx('zreal'),iO=idx('zost'),iP=idx('proc'),iS=idx('status');
    wTrakcie=true;
    d.forEach(function(r,y){
      var v={};
      if(!r[iN]&&!pelny(r)){v.z='';v.o='';v.p='';v.s=''}
      else{
        var re=R[r[iN]]?r2(R[r[iN]].t):0,il=liczba(r[iI]);
        v.z=re;
        if(isNaN(il)){v.o='';v.p='';v.s='wpisz ilość'}
        else{
          var zo=r2(il-re);v.o=zo;v.p=il>0?Math.round(re/il*100)+'%':'';
          v.s=zo>0.005?(re>0?'w realizacji':'nierozpoczęta'):(zo<-0.005?'przekroczona o '+fmt(-zo)+' t':'zrealizowana');
        }
      }
      if(String(r[iZ])!==String(v.z))grid.setValueFromCoords(iZ,y,v.z,true);
      if(String(r[iO])!==String(v.o))grid.setValueFromCoords(iO,y,v.o,true);
      if(String(r[iP])!==String(v.p))grid.setValueFromCoords(iP,y,v.p,true);
      if(String(r[iS])!==String(v.s))grid.setValueFromCoords(iS,y,v.s,true);
    });
    wTrakcie=false;
  }

  function zmienNumer(stary,nowy){
    // umowa przemianowana: poprawiamy przypisania we wszystkich miesiącach
    var n=0;
    S.months.forEach(function(m){var cols=kolumnyMiesiaca(m),a=idxW(cols,'umz'),b=idxW(cols,'ums');(m.data||[]).forEach(function(r){if(a>-1&&r[a]===stary){r[a]=nowy;n++}if(b>-1&&r[b]===stary){r[b]=nowy;n++}})});
    if(n)dziennik('numer umowy '+stary+' → '+nowy+' (poprawiono '+n+' poz.)');
  }

  function pokazUmowy(){
    var cols=UMOWY_KOL.map(function(k){var o={};for(var p in k)o[p]=k[p];return o});
    var dane=(S.umowy||[]).map(function(r){return r.slice()});
    var cel=Math.max(15,dane.length+6);while(dane.length<cel)dane.push(cols.map(function(){return ''}));
    wTrakcie=true;
    grid=jspreadsheet($('grid'),{
      data:dane,columns:cols,style:S.umowyStyle||{},
      toolbar:pasekNarzedzi(),search:false,filters:true,columnSorting:true,
      allowInsertColumn:false,allowDeleteColumn:false,allowRenameColumn:false,allowComments:true,
      wordWrap:false,minDimensions:[cols.length,15],defaultColWidth:110,
      tableOverflow:false,about:false,text:TEKSTY,
      onchange:function(el,cell,x,y,value,old){
        if(wTrakcie)return;
        x=+x;y=+y;var nm=grid.options.columns[x]&&grid.options.columns[x].name;
        if(String(value)!==String(old)){
          dziennik('umowa '+(grid.options.data[y][idx('nr')]||('wiersz '+(y+1)))+', „'+grid.getHeader(x)+'”: '+(old===''||old==null?'(puste)':old)+' → '+(value===''?'(puste)':value));
          var k=idx('kto');wTrakcie=true;grid.setValueFromCoords(k,y,skrot(),true);wTrakcie=false;
          if(nm==='nr'&&old&&value)zmienNumer(String(old),String(value));
        }
      },
      onafterchanges:function(){if(!wTrakcie){przeliczUmowy();zapisz();pozycje()}},
      onchangestyle:function(){if(!wTrakcie){dziennik('zmieniono formatowanie');zapisz()}},
      oninsertrow:function(){dziennik('dodano wiersz umowy');zapisz()},
      ondeleterow:function(){dziennik('usunięto umowę');zapisz()},
      onsort:function(){zapisz()},
      onmoverow:function(){zapisz()},
      onselection:function(el,x1,y1,x2,y2){zaznaczenie(x1,y1,x2,y2);pozycje(Math.min(y1,y2))},
      updateTable:function(inst,cell,col,row,val){
        var c=cols[col];if(!c)return;
        if(c.name==='proc'){
          var p=parseFloat(val);
          if(isNaN(p)){cell.style.backgroundImage='';cell.classList.remove('pr-ok','pr-nad');return}
          var kol=p>100?'#F2C9BF':(p>=100?'#BFDCC6':'#DCEBDD');
          cell.style.backgroundImage='linear-gradient(90deg,'+kol+' '+Math.min(p,100)+'%,transparent '+Math.min(p,100)+'%)';
          cell.classList.toggle('pr-nad',p>100);cell.classList.toggle('pr-ok',p===100);
        }
        if(c.name==='status'){cell.classList.remove('st-ok','st-nad','st-w');var s=String(val||'');if(s==='zrealizowana')cell.classList.add('st-ok');else if(s.indexOf('przekroczona')===0)cell.classList.add('st-nad');else if(s)cell.classList.add('st-w')}
        if(c.name==='zost'){var n=liczba(val);cell.classList.toggle('zost-minus',!isNaN(n)&&n<0)}
        if(c.name==='kto')cell.classList.add('kto-kom');
        if(c.name==='nr')cell.classList.add('nr-kom');
      }
    });
    przeliczUmowy();
    var q=$('szukaj');if(q.value)grid.search(q.value);
    podsumujUmowy();pozycje(-1);
    $('sel').innerHTML='Kliknij umowę, a poniżej pojawią się jej dostawy i sprzedaże.';
  }

  // lista pozycji przypisanych do zaznaczonej umowy
  function pozycje(y){
    var box=$('poz');
    if(y===undefined)y=box.getAttribute('data-y')===null?-1:+box.getAttribute('data-y');
    box.setAttribute('data-y',y);
    var nr=y>-1&&grid.options.data[y]?grid.options.data[y][idx('nr')]:'';
    if(!nr){box.innerHTML='<h2>Pozycje umowy</h2><p class="poz-pusto">Kliknij wiersz umowy w tabeli powyżej, aby zobaczyć, z których dostaw i sprzedaży liczy się jej realizacja.</p>';return}
    var r=grid.options.data[y],R=realizacja()[nr],il=liczba(r[idx('ilosc')]);
    var h='<h2>Pozycje umowy '+esc(nr)+'</h2><p class="poz-op">'+esc(r[idx('typ')]||'')+' · '+esc(r[idx('kontr')]||'')+' · '+esc(r[idx('towar')]||'')+(isNaN(il)?'':' · '+fmt(il)+' t w umowie')+'</p>';
    if(!R||!R.poz.length){box.innerHTML=h+'<p class="poz-pusto">Do tej umowy nie przypisano jeszcze żadnej pozycji. W zakładce miesiąca wybierz ją w kolumnie „Umowa '+(r[idx('typ')]==='Sprzedaż'?'sprzedaży':'zakupu')+'”.</p>';return}
    h+='<div class="poz-t"><table><thead><tr><th>Miesiąc</th><th>Data</th><th>'+(r[idx('typ')]==='Sprzedaż'?'Komu sprzedane':'Od kogo kupione')+'</th><th>Towar</th><th class="pr">Ilość (t)</th><th></th></tr></thead><tbody>';
    R.poz.forEach(function(p,i){
      h+='<tr><td>'+esc(p.m.name)+'</td><td>'+esc(data(p.data))+'</td><td>'+esc(p.kto||'')+'</td><td>'+esc(p.towar||'')+'</td><td class="pr">'+(isNaN(p.ile)?'-':fmt(p.ile))+'</td><td><button type="button" class="b4" data-i="'+i+'">Pokaż w tabeli</button></td></tr>';
    });
    h+='</tbody><tfoot><tr><td colspan="4">Razem zrealizowano</td><td class="pr">'+fmt(R.t)+'</td><td></td></tr></tfoot></table></div>';
    box.innerHTML=h;
    [].forEach.call(box.querySelectorAll('.b4'),function(b){b.onclick=function(){var p=R.poz[+b.getAttribute('data-i')];pokaz(p.m.id);setTimeout(function(){grid.updateSelectionFromCoords(0,p.y,grid.options.columns.length-1,p.y);var td=grid.records[p.y]&&grid.records[p.y][0];if(td&&td.scrollIntoView)td.scrollIntoView({block:'center',inline:'nearest'})},50)}});
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  function zaznaczenie(x1,y1,x2,y2){
    var a=Math.min(x1,x2),b=Math.max(x1,x2),c=Math.min(y1,y2),d=Math.max(y1,y2),n=0,s=0,k=0;
    for(var y=c;y<=d;y++)for(var x=a;x<=b;x++){var v=grid.options.data[y]&&grid.options.data[y][x];if(v===''||v==null)continue;k++;var q=liczba(v);if(!isNaN(q)&&!/^\d{4}-\d{2}-\d{2}/.test(String(v))&&!/[A-Za-z]/.test(String(v))){n++;s+=q}}
    if(k<2&&n<2){$('sel').innerHTML=wUmowach()?'Kliknij umowę, a poniżej pojawią się jej dostawy i sprzedaże.':'Zaznacz kilka komórek z liczbami, a tu pojawi się ich suma.';return}
    $('sel').innerHTML='Zaznaczone: <b>'+k+'</b>'+(n?' · Suma: <b>'+fmt(s)+'</b> · Średnia: <b>'+fmt(s/n)+'</b>':'');
  }

  function zakladki(){
    var t=$('tabs');t.innerHTML='';
    var bu=document.createElement('button');bu.type='button';bu.className='tab tab-um';bu.setAttribute('role','tab');
    bu.setAttribute('aria-selected',wUmowach()?'true':'false');bu.innerHTML='<span class="material-icons" aria-hidden="true">description</span>Umowy';
    bu.onclick=function(){if(!wUmowach())pokaz(UM)};t.appendChild(bu);
    S.months.forEach(function(m){
      var b=document.createElement('button');b.type='button';b.className='tab';b.setAttribute('role','tab');
      b.setAttribute('aria-selected',m.id===S.akt?'true':'false');b.textContent=m.name;
      b.onclick=function(){if(m.id!==S.akt)pokaz(m.id)};t.appendChild(b);
    });
    var add=document.createElement('button');add.type='button';add.className='tab tab-add';add.textContent='+ Nowy miesiąc';
    add.onclick=nowyMiesiac;t.appendChild(add);
    var akt=t.querySelector('[aria-selected=true]');if(akt&&akt.scrollIntoView)akt.scrollIntoView({block:'nearest',inline:'nearest'});
  }

  function nowyMiesiac(){
    var o=S.months[S.months.length-1],p=o.id.split('-'),r=+p[0],mm=+p[1]+1;if(mm>12){mm=1;r++}
    var id=r+'-'+(mm<10?'0':'')+mm;
    S.months.push({id:id,name:MIES[mm-1]+' '+r,data:[],style:{},cols:o.cols||null});
    pokaz(id);dziennik('dodano zakładkę');zapiszLS();
  }

  function eksport(){
    if(!window.XLSX){alert('Trwa ładowanie modułu eksportu, spróbuj za chwilę.');return}
    zapisz();
    var wb=XLSX.utils.book_new();
    function arkusz(cols,dane,nazwa){
      var head=cols.map(function(c){return c.title});
      var rows=(dane||[]).filter(pelny).map(function(r){
        return r.map(function(v,i){var c=cols[i]||{};if(c.type==='calendar'&&v)return data(v);if(c.type==='numeric'){var n=liczba(v);return isNaN(n)?v:n}return v});
      });
      var ws=XLSX.utils.aoa_to_sheet([head].concat(rows));
      ws['!cols']=cols.map(function(c){return {wch:Math.max(10,Math.round((c.width||110)/7))}});
      XLSX.utils.book_append_sheet(wb,ws,nazwa.slice(0,31));
    }
    // arkusz umów z aktualną realizacją
    var R=realizacja(),iN=idxW(UMOWY_KOL,'nr'),iI=idxW(UMOWY_KOL,'ilosc');
    var um=(S.umowy||[]).filter(pelny).map(function(r){r=r.slice();var re=R[r[iN]]?r2(R[r[iN]].t):0,il=liczba(r[iI]);r[idxW(UMOWY_KOL,'zreal')]=re;if(!isNaN(il)){r[idxW(UMOWY_KOL,'zost')]=r2(il-re);r[idxW(UMOWY_KOL,'proc')]=il>0?Math.round(re/il*100)+'%':''}return r});
    arkusz(UMOWY_KOL,um,'Umowy');
    S.months.forEach(function(m){arkusz(kolumnyMiesiaca(m),m.data,m.name)});
    XLSX.writeFile(wb,'Agro-Ros_dostawy.xlsx');
    dziennik('eksport do Excela');zapiszLS();
  }

  function historia(){
    var l=$('histL');l.innerHTML='';
    if(!S.hist.length){l.innerHTML='<li>Brak zmian. Każda zmiana w tabeli pojawi się tutaj z nazwą konta i godziną.</li>'}
    S.hist.slice(0,200).forEach(function(h){
      var li=document.createElement('li'),d=new Date(h.t);
      var tm=document.createElement('time');tm.textContent=d.toLocaleDateString('pl-PL')+' '+d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
      var k=document.createElement('span');k.className='kto';k.textContent=' '+h.kto+' ';
      li.appendChild(tm);li.appendChild(k);li.appendChild(document.createTextNode('('+h.m+'): '+h.o));l.appendChild(li);
    });
    var dl=$('hist');if(dl.showModal)dl.showModal();else dl.setAttribute('open','');
  }

  function start(){
    $('log').hidden=true;$('app').hidden=false;
    var k=konto(user);$('who').textContent=k.s;$('who').title=k.n;
    pokaz(S.akt||S.months[S.months.length-1].id);
  }

  // lista kont na ekranie logowania
  (function(){var sel=$('logUser');sel.innerHTML='';KONTA.forEach(function(k){var o=document.createElement('option');o.value=k.s;o.textContent=k.n+' ('+k.s+')';sel.appendChild(o)})})();

  $('logForm').addEventListener('submit',function(e){
    e.preventDefault();user=$('logUser').value;
    try{sessionStorage.setItem(KEY+'-u',user)}catch(x){}
    start();
  });
  $('btnOut').onclick=function(){zapisz();try{sessionStorage.removeItem(KEY+'-u')}catch(x){}location.reload()};
  $('btnXlsx').onclick=eksport;
  var tq=null;$('szukaj').addEventListener('input',function(){var v=this.value;clearTimeout(tq);tq=setTimeout(function(){if(grid)grid.search(v)},200)});
  $('btnHist').onclick=historia;
  $('histX').onclick=function(){$('hist').close()};
  $('btnRow').onclick=function(){
    // nowy wiersz za ostatnim wypełnionym
    var d=grid.options.data,ost=-1;for(var y=0;y<d.length;y++)if(pelny(d[y]))ost=y;
    if(ost>=d.length-2)grid.insertRow(5);
    grid.updateSelectionFromCoords(0,ost+1,0,ost+1);
    var td=grid.records[ost+1]&&grid.records[ost+1][0];if(td&&td.scrollIntoView)td.scrollIntoView({block:'center',inline:'nearest'});
  };

  // zmiany z drugiej karty przeglądarki
  window.addEventListener('storage',function(e){if(e.key===KEY&&grid){S=wczytaj();wTrakcie=true;jspreadsheet.destroy($('grid'),false);grid=null;pokaz(S.akt)}});

  try{var su=sessionStorage.getItem(KEY+'-u');if(su){user=su;start()}}catch(x){}
})();
