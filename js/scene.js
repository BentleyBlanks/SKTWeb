// local var
var renderer;
var camera, controls;
var scene, cube, sky, sunSphere;

// GUI
function Demo() {
  this.Demo1 = 'SKT';
  this.Demo2 = 0.8;
  this.Demo3 = false;
  this.Demo4 = function() {};
};

function initSky() {
 //  	var text = new Demo();
 //    var gui = new dat.GUI();
	// gui.add(text, 'Demo1');
	// gui.add(text, 'Demo2', -5, 5);
	// gui.add(text, 'Demo3');
	// gui.add(text, 'Demo4');

	// Sky
	sky = new THREE.Sky();
	sky.scale.setScalar( 450000 );
	scene.add(sky);

	sunSphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry( 20000, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	sunSphere.position.y = - 700000;
	sunSphere.visible = false;
	scene.add( sunSphere );

	/// GUI
	var effectController  = {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: 0.49, // elevation / inclination
		azimuth: 0.25, // Facing front,
		sun: ! true
	};
	var distance = 400000;
	function guiChanged() {
		var uniforms = sky.material.uniforms;
		uniforms.turbidity.value = effectController.turbidity;
		uniforms.rayleigh.value = effectController.rayleigh;
		uniforms.luminance.value = effectController.luminance;
		uniforms.mieCoefficient.value = effectController.mieCoefficient;
		uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
		var theta = Math.PI * ( effectController.inclination - 0.5 );
		var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
		sunSphere.position.x = distance * Math.cos(phi);
		sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
		sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
		sunSphere.visible = effectController.sun;
		uniforms.sunPosition.value.copy(sunSphere.position);
		renderer.render(scene, camera);
	}
	var gui = new dat.GUI();
	gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange(guiChanged);
	gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange(guiChanged);
	gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange(guiChanged);
	gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange(guiChanged);
	gui.add( effectController, "luminance", 0.0, 2 ).onChange(guiChanged);
	gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange(guiChanged);
	gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange(guiChanged);
	gui.add( effectController, "sun" ).onChange(guiChanged);
	guiChanged();
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
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);

    // Objects
    var geometry = new THREE.SphereBufferGeometry(1, 16, 16);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, dithering: true });
    object = new THREE.Mesh(geometry, material);
    scene.add(object);

	scene.background = new THREE.Color( 0xf0f0f0 );
	
    // Lighting
	// var ambient = new THREE.AmbientLight(0xffffff, 0.4);
	// scene.add(ambient);

	var light = new THREE.DirectionalLight(0xffffff, 0.7);
	light.position.set(0.5, 0.5, 1);
	light.castShadow = true;
	light.shadow.camera.zoom = 4; // tighter shadow map
	scene.add(light);

	// spotLight = new THREE.SpotLight( 0xffffff, 1 );
	// spotLight.position.set( 15, 40, 35 );
	// spotLight.angle = Math.PI / 4;
	// spotLight.penumbra = 0.05;
	// spotLight.decay = 2;
	// spotLight.distance = 200;
	// spotLight.castShadow = true;
	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	// spotLight.shadow.camera.near = 10;
	// spotLight.shadow.camera.far = 200;
	// scene.add( spotLight );

    // initSky();

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
    