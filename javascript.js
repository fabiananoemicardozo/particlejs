const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArray;

//posición del mouse.
let mouse = {
	x: null,
	y: null,
	radius: ((canvas.height/80) * (canvas.width/80))
}

window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

//crear Particulas.
class Particle {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
		this.speedX = this.directionX;
		this.speedY = this.directionY;
	}
	//method draw - para dibujar particulas individuales.
	draw() {
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);
		ctx.fillStyle = 'rgb(80, 83, 85)';
		ctx.fill();
	}
	//comprueba la posición de la particula, comprueba la posición del mouse, mueve la particula y dibuja la particula.
	update() {
		//comprueba si la partícula todavía está dentro del lienzo.
		if (this.x > canvas.width || this.x < 0){
			this.directionX = -this.directionX;
			this.speedX = this.directionX;
		}
		if (this.y + this.size > canvas.height || this.y - this.size < 0){
			this.directionY = -this.directionY;
			this.speedY = this.directionY;
		}
		//comprueba la posición del mouse, comprueba la posición de las particulas y detiene las coliciones.
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let distance = Math.sqrt(dx*dx + dy*dy);
		if (distance < mouse.radius + this.size){
			if(mouse.x < this.x && this.x < canvas.width - this.size*10){
				this.x+=10;
			}
			if (mouse.x > this.x && this.x > this.size*10){
				this.x-=10;
			}
			if (mouse.y < this.y && this.y < canvas.height - this.size*10){
				this.y+=10;
			}
			if (mouse.y > this.y && this.y > this.size*10){
				this.y-=10;
			}
		}
		//mueve las particulas
		this.x += this.directionX;
		this.y += this.directionY;
		//llama al method draw
		this.draw();
	}
}

//comprueba si las partículas están lo suficientemente cerca para trazar una línea entre ella.
function connect() {
	let opacityValue = 1;
	for (let a = 0; a < particleArray.length; a++) {
		for (let b = a; b < particleArray.length; b++){
			let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
			+ ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
			if  (distance < (canvas.width/7) * (canvas.height/7)){
				opacityValue = 1-(distance/20000);
				ctx.strokeStyle='rgba(14, 47, 70,' + opacityValue +')';
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.moveTo(particleArray[a].x, particleArray[a].y);
				ctx.lineTo(particleArray[b].x, particleArray[b].y);
				ctx.stroke();
			}
		}
	}
}

//crear array de particulas.
function init(){
	particleArray = [];
	let numberOfParticles = (canvas.height*canvas.width)/9000;
	for (let i=0; i<numberOfParticles*2; i++){
		let size = (Math.random()*5)+1;
		let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
		let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
		let directionX = (Math.random() * 5) - 2.5;
		let directionY = (Math.random() * 5) - 2.5;
		let color = 'rgb(60,66,66)';
		particleArray.push(new Particle(x, y, directionX, directionY, size, color));
	}
}

//crear bucle de animación
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0,0,innerWidth,innerHeight);
	for (let i = 0; i < particleArray.length; i++){
		particleArray[i].update();
	}
	connect();
}
init();
animate();


//vacía y rellena la matriz de partículas cada vez que la ventana o lienzo cambian de tamaño.
window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		mouse.radius = ((canvas.height/80) * (canvas.width/80));
		init();
	}
)
//configura la posición del mouse como indefinida cuando sale del lienzo.
window.addEventListener('mouseout',
	function(){
		mouse.x = undefined;
		mouse.y = undefined;
		console.log('mouseout');
	}
)