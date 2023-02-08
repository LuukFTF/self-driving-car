class Sensor{
   constructor(count=5,length=150,spread=Math.PI/2){
      this.rayCount=count;
      this.rayLength=length;
      this.raySpread=spread;

      this.rays=[];
   }

   update(x,y,angle,borders){
      this.#castRays(x,y,angle);
      for(const ray of this.rays){
         ray.reading=this.#getReading(ray,borders);
      }
   }

   #getReading(ray,borders){
      let touches=[];

      for(const border of borders){
         const res=polysIntersect(
            [ray.end,ray.start],border
         );
         if(res){
            touches=touches.concat(res);
         }
      }

      if(touches.length==0){
         return {...ray.end,offset:0};
      }else{
         const offsets=touches.map((t)=>t.offset);
         const maxOffset=Math.max(...offsets);
         return touches.find(t=>t.offset==maxOffset);
      }
   }

   #castRays(x,y,angle){
      this.rays=[];
      for(let i=0;i<this.rayCount;i++){
         const rayAngle=lerp(
            this.raySpread/2,
            -this.raySpread/2,
            this.rayCount==1?0.5:i/(this.rayCount-1)
         )+angle;
         const start={x,y};
         const end={
            x:x-Math.sin(rayAngle)*this.rayLength,
            y:y-Math.cos(rayAngle)*this.rayLength
         };

         this.rays.push({start,end});
      }
   }
   draw(ctx){
      for(const ray of this.rays){
         ctx.beginPath();
         ctx.lineWidth=2;
         ctx.strokeStyle="yellow";
         ctx.moveTo(ray.start.x,ray.start.y);
         ctx.lineTo(ray.reading.x,ray.reading.y);
         ctx.stroke();
      }
   }
}