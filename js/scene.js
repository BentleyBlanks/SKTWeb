var scene = new THREE.Scene();
// local var
var renderer;
var camera, controls;
var scene, cube;

// GUI
function Demo() {
  this.Demo1 = 'SKT';
  this.Demo2 = 0.8;
  this.Demo3 = false;
  this.Demo4 = function() {};
};

function initGUI() {
  	var text = new Demo();
    var gui = new dat.GUI();
	gui.add(text, 'Demo1');
	gui.add(text, 'Demo2', -5, 5);
	gui.add(text, 'Demo3');
	gui.add(text, 'Demo4');
}

// Scene
function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Camera drag event support
	controls = new THREE.OrbitControls(camera, renderer.domElement );
	controls.addEventListener('change', render);

    // Objects
    var geometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } );
    object = new THREE.Mesh(geometry, material);
    scene.add(object);

    // Lighting
	var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
	scene.add( ambient );

	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.position.set( 15, 40, 35 );
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 200;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 200;
	scene.add( spotLight );

	// GUI
    initGUI();

    // resize the canvas when window changed
    window.addEventListener('resize', resize, false);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// frame loop
init();
render();
    