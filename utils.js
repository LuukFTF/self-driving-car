function lerp(a,b,t){
   return a+(b-a)*t;
}

function polysIntersect(poly1,poly2){
   const touches=[];
   for(let i=1;i<poly1.length;i++){
      for(let j=1;j<poly2.length;j++){
         const touch=getIntersection(
            poly1[i-1],poly1[i],
            poly2[j-1],poly2[j]
         );
         if(touch){
            touches.push(touch);
         }
      }
   }
   if(touches.length==0){
      return false;
   }else{
      return touches;
   }
}