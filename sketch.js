let screen_w = screen.width*0.95;
let screen_h = screen.height*0.85;
let movers = [];
let gravity = false;
let mouseEvent = true;

function setup() {
  createCanvas(screen_w, screen_h);
  
  drag_slider = createSlider(0, 1, 0.5, 0.01);
  drag_slider.position(150, 15);
  repultion_slider = createSlider(1, 10, 5, 0.5);
  repultion_slider.position(150, 45);
  repultion_limit_slider = createSlider(1, 100, 10, 1);
  repultion_limit_slider.position(150, 75);
  population_slider = createSlider(2, 150, 50, 1);
  population_slider.position(150, 105);
  mass_slider = createSlider(5, 500, 150, 5);
  mass_slider.position(150, 135);

  mouse_checkbox = createCheckbox('Mouse Event', true);
  mouse_checkbox.position(5, screen_h-80);
  mouse_checkbox.changed(function(){mouseEvent = this.checked()});
  gravity_checkbox = createCheckbox('Gravity', false);
  gravity_checkbox.position(5, screen_h-50);
  gravity_checkbox.changed(gravityEvent);

  button = createButton('Reset Population');
  button.position(2, screen_h-20);
  button.mousePressed(reset);

  //noCursor();
}

function draw() {
  background(250);
  fill(0);
  stroke(0);
  text('Drag Coefficient: (' + drag_slider.value() + ')', 15, 30);
  text('Repultion Distance: (' + repultion_slider.value() + ')', 15, 60);
  text('Repultion Limit: (' + repultion_limit_slider.value() + ')', 15, 90);
  text('Population Size: (' + population_slider.value() + ')', 15, 120);
  text('Mass: (' + mass_slider.value() + ')', 15, 150);

  if (movers.length < population_slider.value())
  {
    for (let i=0; i<population_slider.value()-movers.length; i++)
    {
      movers.push(createNewMover());
    }
  }
  else if (population_slider.value() < movers.length)
  {
    for (let i=movers.length-population_slider.value()-1; i>=0; i--)
    {
      movers.splice(i,1);
    }
  }
  for (let i=movers.length-1; i>=0; i--)
  {
    if (movers[i].isDead)
    {
      movers.splice(i,1);
    }
    else
    {
      applyForces(movers[i]);
      movers[i].update();
      movers[i].show();
    }
  }
  //showPointer();  
}

function showPointer()
{
  fill(220);
  stroke(0);
  ellipse(mouseX,mouseY,2,2);
}

function applyForces(o)
{
  //gravity
  if (gravity)
  {
    o.applyForce(createVector(0,0.001));
  }
  
  //attraction
  o.applyAttraction(movers);
  
  //attraction
  o.applyRepultion(movers, repultion_slider.value(), repultion_limit_slider.value());
  
  //wind
  //o.applyForce(createVector(random(-0.005),0));
  
  //drag
  o.applyDrag(drag_slider.value());
  
  if (mouseIsPressed && mouseEvent)
  {
    if (mouseX < 320 && mouseY < 200) return;
    let mouse = createVector(mouseX,mouseY);
    let force = p5.Vector.sub(o.pos,mouse);
    o.applyForce(force.normalize().mult(-0.1));
  }  
}

function reset()
{
  for (let i=movers.length-1; i>=0; i--)
  {
    movers.splice(i,1);
  }
  movers = [];
  for (let i=0; i<population_slider.value(); i++)
  {
    movers.push(createNewMover());
  }
}

function createNewMover()
{
  let mass = mass_slider.value();
  return new Mover(createVector(random(0,width),random(0,height)),createVector(random(-0.1,0.1),random(-0.1,0.1)),random(2,mass));
}

function gravityEvent()
{
  gravity = this.checked();
}