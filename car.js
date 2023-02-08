class Car{
   constructor(x,y,controlType,maxSpeed=3,width=30,height=50){
      this.x=x;
      this.y=y;
      this.width=width;
      this.height=height;

      this.speed=0;
      this.acceleration=0.2;
      this.maxSpeed=maxSpeed;
      this.friction=0.05;

      this.angle=0;
      this.damaged=false;

      this.useBrain=controlType=="AI";

      this.img=new Image();
      this.img.src="car.png";

      if(controlType!="DUMMY"){
         this.sensor=new Sensor();
         this.brain=new NeuralNetwork(
            [this.sensor.rayCount,6,4]
         );
      }
      this.controls=new Controls(controlType);
   }

   update(borders=[]){
      if(!this.damaged){
         this.#move();
         this.polygon=this.#createPolygon();
         this.damaged=this.#assessDamage(borders);
      }
      if(this.sensor){
         this.sensor.update(this.x,this.y,this.angle,borders);
         const inputs=this.sensor.rays.map(
            r=>r.reading.offset
         );
         const outputs=NeuralNetwork.feedForward(
            inputs,this.brain
         );
         if(this.useBrain){
            this.controls.forward=outputs[0];
            this.controls.left=outputs[1];
            this.controls.right=outputs[2];
            this.controls.reverse=outputs[3];
         }
      }
   }

   #assessDamage(borders){
      for(const border of borders){
         if(polysIntersect(this.polygon,border)){
            return true;
         }
      }
      return false;
   }

   #createPolygon(){
      const points=[];
      const rad=Math.hypot(this.width,this.height)/2;
      const alpha=Math.atan2(this.width,this.height);
      points.push({
         x:this.x-Math.sin(this.angle-alpha)*rad,
         y:this.y-Math.cos(this.angle-alpha)*rad
      });
      points.push({
         x:this.x-Math.sin(this.angle+alpha)*rad,
         y:this.y-Math.cos(this.angle+alpha)*rad
      });
      points.push({
         x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
         y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
      });
      points.push({
         x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
         y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
      });
      points.push(points[0]);
      return points;
   }  

   #move(){
      if(this.controls.forward){
         this.speed+=this.acceleration;
      }
      if(this.controls.reverse){
         this.speed-=this.acceleration;
      }

      if(this.speed>this.maxSpeed){
         this.speed=this.maxSpeed;
      }
      if(this.speed<-this.maxSpeed/2){
         this.speed=-this.maxSpeed/2;
      }

      if(this.speed>0){
         this.speed-=this.friction;
      }
      if(this.speed<0){
         this.speed+=this.friction;
      }

      if(Math.abs(this.speed)<this.friction){
         this.speed=0;
      }

      if(this.speed!=0){
         const flip=Math.sign(this.speed);
         if(this.controls.left){
            this.angle+=flip*0.03;
         }
         if(this.controls.right){
            this.angle-=flip*0.03;
         }
      }

      this.x-=Math.sin(this.angle)*this.speed;
      this.y-=Math.cos(this.angle)*this.speed;
   }

   draw(ctx,showSensor=true){
      
      ctx.fillStyle=this.damaged?"gray":"black";
      ctx.beginPath();
      ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
      for(let i=1;i<this.polygon.length;i++){
         ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
      }
      ctx.fill();
      /*
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(-this.angle);

      ctx.beginPath();
      ctx.drawImage(this.img,
         -this.width/2,
         -this.height/2,
         this.width,
         this.height
      );
      ctx.fill();

      ctx.restore();
      */
      if(this.sensor&&showSensor){
         this.sensor.draw(ctx);
      }
   }
}