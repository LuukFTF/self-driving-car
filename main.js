carCanvas.width=200;
networkCanvas.width=300;

const ctx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");

const road=new Road(
   carCanvas.width/2,
   carCanvas.width*0.9
);

const N=1000;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
   for(let i=0;i<cars.length;i++){
      cars[i].brain=JSON.parse(
         localStorage.getItem("bestBrain")
      );
      if(i!=0){
         NeuralNetwork.mutate(cars[i].brain,0.1);
      }
   }
}

const traffic=[
   new Car(road.getLaneCenter(1),-100,"DUMMY",2),
   new Car(road.getLaneCenter(0),-300,"DUMMY",2),
   new Car(road.getLaneCenter(2),-300,"DUMMY",2),
   new Car(road.getLaneCenter(0),-500,"DUMMY",2),
   new Car(road.getLaneCenter(1),-500,"DUMMY",2),
   new Car(road.getLaneCenter(1),-700,"DUMMY",2),
   new Car(road.getLaneCenter(2),-700,"DUMMY",2)
];

animate();

function generateCars(N){
   const cars=[];
   for(let i=1;i<=N;i++){
      cars.push(
         new Car(road.getLaneCenter(1),100,"AI")
      );
   }
   return cars;
}

function animate(){
   for(const t of traffic){
      t.update();
   }
   for(const car of cars){
      car.update(
         [...road.borders,...traffic.map(t=>t.polygon)]
      );
   }
   bestCar=cars.find(
      c=>c.y==Math.min(
         ...cars.map(c=>c.y)
      )
   );

   carCanvas.height=window.innerHeight;
   networkCanvas.height=window.innerHeight;

   ctx.translate(0,-bestCar.y+carCanvas.height*0.7);
   road.draw(ctx);
   
   ctx.globalAlpha=0.2;
   for(const car of cars){
      car.draw(ctx,false);
   }
   ctx.globalAlpha=1;
   bestCar.draw(ctx);
   
   for(const t of traffic){
      t.draw(ctx);
   }

   Visualizer.drawNetwork(networkCtx,bestCar.brain);
   requestAnimationFrame(animate);
}

function save(){
   localStorage.setItem("bestBrain",
      JSON.stringify(bestCar.brain)
   );
}

function discard(){
   localStorage.removeItem("bestBrain");
}