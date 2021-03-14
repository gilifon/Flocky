class Mover {
  constructor(pos,vel,mass) {
    this.height = Math.pow(mass,1/1.7);
    this.width = Math.pow(mass,1/1.7);
    this.pos = pos;
    this.vel = vel;
    this.acc = createVector(0,0);
    this.mass = mass;
    this.isDead = false;
  }
  
  applyForce(force)
  {
    this.acc.add(force);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  applyAttraction(objectList)
  {
    for(let i = 0; i<objectList.length; i++)
    {
      let force_dir = p5.Vector.sub(objectList[i].pos,this.pos);
      let dist_sq = force_dir.magSq();
      if (dist_sq == 0) continue;
      let force = force_dir.setMag(this.mass*objectList[i].mass/dist_sq).limit(0.0001);
      this.applyForce(force);
    }
  }
  
  applyRepultion(objectList, distance_threshold, coefficient)
  {
    for(let i = 0; i<objectList.length; i++)
    {
      let distance = p5.Vector.sub(objectList[i].pos,this.pos);
      let distance_sq = distance.magSq();
      if (distance.mag() > distance_threshold*10 || distance_sq === 0) continue;
      let force = distance.setMag(this.mass*objectList[i].mass/distance_sq).limit(-1/(10*coefficient));
      this.applyForce(force);
    }
  }
  
  applyDrag(dc)
  {
    let force = this.vel.copy().setMag(-dc*this.vel.magSq());
    this.applyForce(force);
  }
  
  update()
  {
    this.pos.add(this.vel);
    this.isDead = this.pos.y > height || this.pos.y < 0 || this.pos.x > width || this.pos.x < 0
  }
  
  show()
  {
    fill(220,0,0,200);
    stroke(0);    
    ellipse(this.pos.x,this.pos.y,this.height,this.width);
  }  
}