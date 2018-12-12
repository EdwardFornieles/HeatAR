const ThreeHelper = function(){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-30, 30, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    const control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    control.update();

    this.clock = new THREE.Clock();
    this.mixers = [];
    var modelObj;
    window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    this.render = function() {
        this.renderer.render(this.scene, this.camera);

        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }

        window.requestAnimationFrame(() => {
            this.render();
        });
    };

    this.loadObject = function(modelUrl) {
        const loader = new THREE.FBXLoader();
        loader.load(modelUrl, (object) => {
            object.scale.setScalar(0.1);
            object.position.set(0, 0, 0);
            object.rotation.x = Math.PI / 8;
            object.rotation.y = Math.PI / 4;
            object.rotation.z = Math.PI / 4;
            this.scene.add(object);
            modelObj = object;

            webAR.trace('Loading model');

            if (object.animations.length > 0) {
                console.log(object.animations.length);
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                 object.mixer.clipAction(object.animations[0]).play();
            }
        })
    };
    this.removeObject = function() {
        this.scene.remove(modelObj);        
        this.mixers = [];
    }

    this.render();
};

