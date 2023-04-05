import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './App.css';



const g = 9.81;
const circleCenter = { x: 0, y: 0, z: 0 }
const circleRadius = 2

//position: [x, y, z]

//line equation for 2 points (y - y1)(x1 - x2) - (y1 - y2)(x - x1) = 0

//line equation: 0x + y + 2 = 0

// function line([x, y, z]) {
//   return {A:}
// }

function distanceBetweenPoints(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x , 2) + Math.pow(point1.y - point2.y , 2))
}

function distancePointToCircle(point, pointOffset) {
  return {
    total: circleRadius - pointOffset - Math.sqrt(Math.pow(point.x - circleCenter.x, 2) + Math.pow(point.y - circleCenter.y, 2)),
    x: Math.abs(point.x - circleCenter.x, 2),
    y: Math.abs(point.y - circleCenter.y, 2),
  }
}

//TODO: co jesli predkosc w x jest 0?...

function calculateBounceAngle(point, velocity) {
  if (velocity.x === 0) return Math.PI
  let a0 = (point.y - circleCenter.y) / (point.x - circleCenter.x); // wspolczynnik kierunkowy prostej przechodzaca przez srodek zewnetrznego okregu i kulki zderzajacej sie z nim
  let a1 = (-1) / a0; // wspolczynnik kierunkowy stycznej do okregu w punkcie zderzenia
  let a2 = velocity.y / velocity.x; // wspolczynnik kierunkowy wektora predkosci
  let alpha = (a1 - a2) / (1 + a1 * a2) // tangens kata miedzy wektorem predkosci a styczna do okregu w punkcie zderzenia
  return  2 * Math.atan(alpha) // kat o jaki nalezy obrocic wektor predkosci
  
  // metoda wektorowa: 
  // let cos_alpha = ((point.x - circleCenter.x) * velocity.x + (point.y - circleCenter.y) * velocity.y) / (Math.sqrt(Math.pow(point.x - circleCenter.x, 2) + Math.pow(point.y - circleCenter.y, 2)) * Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)))
  // let alpha = 2 * Math.acos(cos_alpha)
  // return ...
}

function BouncingBallArray(props) {
  const circle_refs = useRef([]);
  let allow_collisions = false;
  let time_elapsed = 0;

  let velocity = (() => {
    let res = []
    for (let i = 0;i < props.amount;++i) {
      res.push({speed_x: 0, speed_y: 0})
    }
    return res
  })()

  function deltaX(distance, x) {
    return distance * (x - circleCenter.x) / (circleRadius - props.radius - distance)
  }

  function deltaY(distance, y) {
    return distance * (y - circleCenter.y) / (circleRadius - props.radius - distance)
  }

  useFrame((state, delta) => {
    time_elapsed += delta;
    allow_collisions = (time_elapsed > 2)
    
    // collisions between balls
    if (allow_collisions) {
      console.log('zaczynamy')
      for (let i = 0;i < props.amount;++i) {
        for (let j = i + 1;j < props.amount;++j) {
          if(distanceBetweenPoints(circle_refs.current[i].position, circle_refs.current[j].position) <= 2 * props.radius) {
            let temp = velocity[i]
            velocity[i] = velocity[j]
            velocity[j] = temp
          }
        }
      }
    }

    // collisions with big circle
    for (let i = 0;i < props.amount;++i) {
      circle_refs.current[i].position.x += velocity[i].speed_x * delta / 1000;
      circle_refs.current[i].position.y += velocity[i].speed_y * delta / 1000;
      if (!velocity[i].stop_y) velocity[i].speed_y -= (1/2) * Math.pow(g, 2)
      //console.log(`speedX = ${velocity[i].speed_x}`)
      let distance = distancePointToCircle(circle_refs.current[i].position, props.radius);
      if (distance.total <= 0){
        circle_refs.current[i].position.x += deltaX(distance.total, circle_refs.current[i].position.x);
        circle_refs.current[i].position.y += deltaY(distance.total, circle_refs.current[i].position.y);
        
        let phi = calculateBounceAngle(circle_refs.current[i].position, { x: velocity[i].speed_x, y: velocity[i].speed_y })
        
        let speed_x = velocity[i].speed_x
        let speed_y = velocity[i].speed_y

        velocity[i].speed_x = (Math.cos(phi) * speed_x - Math.sin(phi) * speed_y) * 0.97;
        velocity[i].speed_y = (Math.sin(phi) * speed_x + Math.cos(phi) * speed_y) * 0.97;
      }
    }
  })
  
  const BallArray = (() => {
    let res = []
    console.log(props.amount)
    for(let i = 0;i < props.amount;++i) {
      res.push(
        <mesh key={i} ref={(ball) => { circle_refs.current.push(ball)}} position={[props.position[0] + Math.random() * 0.2 - 0.1, props.position[1] + Math.random() * 0.2 - 0.1, props.position[2]]} >
          <circleGeometry args={props.radius} />
          <meshStandardMaterial color={props.color} />
        </mesh>
      )
      velocity[i].speed_x = Math.random() * 800 - 400;
      velocity[i].speed_y = Math.random() * 800 - 400;
    }
    return res
  })()

  return (
    <>
      {BallArray}
    </>
  );
}

function App(){
  const outerRing = new THREE.RingGeometry(circleRadius, circleRadius + 0.1, 80)

  return (
    <Canvas style={{ backgroundColor: 'black' }} camera={{ position: [0, 0, 4]}}>
      <ambientLight intensity={0.5} />
      <BouncingBallArray amount={8} position={[0, 0, 0]} radius={[0.05]} color='orange' />
      <BouncingBallArray amount={8} position={[0, 0, 0]} radius={[0.05]} color='forestgreen' />
      <BouncingBallArray amount={8} position={[0, 0, 0]} radius={[0.05]} color='ivory' />
      <BouncingBallArray amount={8} position={[0, 0, 0]} radius={[0.05]} color='plum' />
      <BouncingBallArray amount={8} position={[0, 0, 0]} radius={[0.05]} color='royalblue' />
      <mesh geometry={outerRing} position={[circleCenter.x, circleCenter.y, circleCenter.z]} >
        <meshStandardMaterial color='white' />
      </mesh>
    </Canvas>
   )
}

export default App;
