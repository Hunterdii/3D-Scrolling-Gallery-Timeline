window.onload=()=>{
  
  gsap.set('#scrollDist', {
    width: '100%',
    height: gsap.getProperty('#app', 'height'), // apply the height of the image stack
    onComplete:()=>{
      gsap.set('#app, #imgGroup', {opacity:1, position:'fixed', width:'100%', height:'100%', top:0, left:0, perspective:300}) 
      gsap.set('#app img', {
        position: 'absolute',
        attr:{ id:(i,t,a)=>{ //use GSAP's built-in loop to setup each image
          initImg(i,t);
          return 'img'+i;
        }}
      })

      gsap.timeline({
        defaults:{ duration:1 },
        onUpdate:()=>{ if (gsap.getProperty('#cursorClose','opacity')==1) closeDetail() }, //close detail view on scroll
        scrollTrigger:{
        trigger: '#scrollDist',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }})
      .fromTo('#txt1', {scale:0.6, transformOrigin:'50%'}, {scale:2, ease:'power1.in'}, 0)
      .to('#txt1 path', {duration:0.3, drawSVG:0, stagger:0.05, ease:'power1.in'}, 0)
      .fromTo('.imgBox', {z:-5000}, {z:350, stagger:-0.3, ease:'none'}, 0.3)
      .fromTo('.imgBox img', {scale:3}, {scale:1.15, stagger:-0.3, ease:'none'}, 0.3)      
      .to('.imgBox', {duration:0, pointerEvents:'auto', stagger:-0.3}, 0.5)
      .from('.imgBox img', {duration:0.3, opacity:0, stagger:-0.3, ease:'power1.inOut'}, 0.3)
      .to('.imgBox img', {duration:0.1, opacity:0, stagger:-0.3, ease:'expo.inOut'}, 1.2)      
      .to('.imgBox', {duration:0, pointerEvents:'none', stagger:-0.3}, 1.27)
      .add('end')
      .fromTo('#txt2', {scale:0.1, transformOrigin:'50%'},{scale:0.6, ease:'power3'}, 'end-=0.2')
      .from('#txt2 path', {duration:0.4, drawSVG:0, ease:'sine.inOut', stagger:0.15}, 'end-=0.2')      
            
      // intro animation
      gsap.from(window, {duration:1.4, scrollTo:gsap.getProperty('#scrollDist','height')/3, ease:'power2.in'});
      gsap.from('.imgBox', {duration:0.2, opacity:0, stagger:0.06, ease:'power1.inOut'})
    }  

  })  
  
  function initImg(i,t){
    const box = document.createElement('div') // make a container div
    box.appendChild(t) // move the target image into the container
    document.getElementById('imgGroup').appendChild(box) // put the container into the imgGroup div
    gsap.set(box, {
        pointerEvents:'none',
        position:'absolute',
        attr:{ id:'box'+i, class:'imgBox' },
        width:t.width,
        height:t.height,
        overflow:'hidden',
        top:'50%',
        left:'50%',
        x:t.dataset.x,
        y:t.dataset.y,
        xPercent:-50,
        yPercent:-50,
        perspective:500
      })

    t.onmouseover =()=> gsap.to('#cursorCircle', {duration:0.2, attr:{r:30, 'stroke-width':4}})
    
    t.onmousedown =()=> {
      gsap.to(t, {z:-25, ease:'power2'})
      gsap.to('#cursorCircle', {attr:{r:40}, ease:'power3'})
    }
    
    t.onmouseup =()=> gsap.to(t, {z:0, ease:'power1.inOut'})
    
    t.onmouseout =()=> gsap.to('#cursorCircle', {duration:0.2, attr:{r:11, 'stroke-width':3}})
    
    t.onclick =()=> showDetail(t)
  }  
  
  function showDetail(t){
    gsap.timeline()
        .set('#detailTxt', {textContent:t.alt}, 0)
        .set('#detailImg', {background:'url('+t.src+') center no-repeat'}, 0)
        .fromTo('#detail', {top:'100%'}, {top:0, ease:'expo.inOut'}, 0)
        .fromTo('#detailImg', {y:'100%'}, {y:'0%', ease:'expo', duration:0.7}, 0.2)
        .fromTo('#detailTxt', {opacity:0}, {opacity:1, ease:'power2.inOut'}, 0.4)
        .to('#cursorCircle', {duration:0.2, opacity:0}, 0.2)
        .to('#cursorClose', {duration:0.2, opacity:1}, 0.4)
  }
  
  function closeDetail(){
    gsap.timeline()
        .to('#detailTxt', {duration:0.3, opacity:0}, 0)    
        .to('#detailImg', {duration:0.3, y:'-100%', ease:'power1.in'}, 0)
        .to('#detail', {duration:0.3, top:'-100%', ease:'expo.in'}, 0.1)
        .to('#cursorClose', {duration:0.1, opacity:0}, 0)
        .to('#cursorCircle', {duration:0.2, opacity:1}, 0.1)
  }
  document.getElementById('detail').onclick = closeDetail;
  
  if (ScrollTrigger.isTouch==1) { // on mobile, hide mouse follower + remove the x/y positioning from the images
    gsap.set('#cursor', {opacity:0}) 
    gsap.set('.imgBox', {x:0, y:0})
  } else {
    
    // quickTo can be used to optimize x/y movement on the cursor...but it doesn't work on fancier props like 'xPercent'
    cursorX = gsap.quickTo('#cursor', 'x', {duration:0.3, ease:'power2'})
    cursorY = gsap.quickTo('#cursor', 'y', {duration:0.3, ease:'power2'})
    
    window.onmousemove =(e)=> {      
      gsap.to('.imgBox', { // move + rotate imgBoxes relative to mouse position
        xPercent:-e.clientX/innerWidth*100,
        yPercent:-25-e.clientY/innerHeight*50,
        rotateX:8-e.clientY/innerHeight*16,
        rotateY:-8+e.clientX/innerWidth*16
      })
      
      gsap.to('.imgBox img', { // move images inside each imgBox, creates additional parallax effect
        xPercent:-e.clientX/innerWidth*10,
        yPercent:-5-e.clientY/innerHeight*10
      })
      
      // mouse follower
      cursorX(e.clientX)
      cursorY(e.clientY)
    }
  }
}
