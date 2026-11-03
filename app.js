(function(){
  var b=document.getElementById('burger'),n=document.getElementById('nav');
  function close(){n.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu')}
  b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});

  // telefon w nagłówku (komputer) i dolny pasek (telefon) dopiero po przewinięciu za przyciski w hero
  var mob=document.getElementById('mob'),cta=document.getElementById('heroCta'),kontakt=document.getElementById('kontakt');
  var past=false,inContact=false;
  function upd(){document.body.classList.toggle('po-hero',past);mob.classList.toggle('widac',past&&!inContact)}
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){past=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;upd()}).observe(cta);
    new IntersectionObserver(function(e){inContact=e[0].isIntersecting;upd()},{threshold:.1}).observe(kontakt);
  }else{document.body.classList.add('po-hero')}

  // formularz - podgląd, nic nie wysyła
  var f=document.getElementById('form'),m=document.getElementById('formMsg');
  f.addEventListener('submit',function(e){e.preventDefault();m.hidden=false;m.scrollIntoView({block:'nearest',behavior:'smooth'})});
})();
