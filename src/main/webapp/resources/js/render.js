/**
 * Created by user on 30.04.2016.
 */

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true});
var parentTransform = new THREE.Object3D();
var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10});
var dashedLineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 100});
var signLineMaterial = new THREE.LineBasicMaterial({color: 0x010102, linewidth: 10});
var signsMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

var horizont;
var leftEdge;
var rightEdge;
var lastDashedLineX = 0;

var xzLast = 0;
var speed = 0;

var distancesMaxSpeeds = [];
var mistakesCount = 0;

var cars = [];

function init() {
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(1400, 490);
    var axes = new THREE.AxisHelper(30);
    camera.position.x = -10;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);
    scene.add(parentTransform);
    $('#renderPlace').append(renderer.domElement);

    for (var i = 0; i < 30000; i += 1000) {
        var maxSpeed = Math.round(Math.random() * 10 + 1) * 10;
        distancesMaxSpeeds[i / 1000] = maxSpeed;
        drawSign(i, maxSpeed.toString());
    }

    for (var j = 1000; j < 30000; j += 2000) {
        drawCar(j);
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    drawBase();
}

function drawBase() {
    camera.position.y = 20;
    $('#speed').text(speed);
    camera.position.x = camera.position.x + speed * 0.1;
    camera.position.z = camera.position.z - xzLast * 0.01;
    var vectorHor1 = new THREE.Vector3();
    vectorHor1.set(camera.position.x + 1000, 0, -10000);
    var vectorHor2 = new THREE.Vector3();
    vectorHor2.set(camera.position.x + 1000, 0, 10000);
    var horizontGeo = new THREE.Geometry();
    horizontGeo.vertices.push(
        vectorHor1,
        vectorHor2
    );

    var vector3 = new THREE.Vector3();
    vector3.set(camera.position.x, 0, -45);
    var vector4 = new THREE.Vector3();
    vector4.set(camera.position.x + 1000, 0, -70);
    var leftEdgeGeo = new THREE.Geometry();
    leftEdgeGeo.vertices.push(
        vector3,
        vector4
    );

    var vector5 = new THREE.Vector3();
    vector5.set(camera.position.x, 0, 45);
    var vector6 = new THREE.Vector3();
    vector6.set(camera.position.x + 1000, 0, 70);
    var rightEdgeGeo = new THREE.Geometry();
    rightEdgeGeo.vertices.push(
        vector5,
        vector6
    );

    horizontGeo.computeLineDistances();
    leftEdgeGeo.computeLineDistances();
    rightEdgeGeo.computeLineDistances();

    parentTransform.remove(horizont);
    parentTransform.remove(leftEdge);
    parentTransform.remove(rightEdge);
    horizont = new THREE.Line(horizontGeo, lineMaterial);
    leftEdge = new THREE.Line(leftEdgeGeo, lineMaterial);
    leftEdge.name = 'edge';
    rightEdge = new THREE.Line(rightEdgeGeo, lineMaterial);
    rightEdge.name = 'edge';

    if (lastDashedLineX < camera.position.x + 800) {
        var vectorDashed1 = new THREE.Vector3();
        vectorDashed1.set(camera.position.x + 900, 0, 0);
        var vectorDashed2 = new THREE.Vector3();
        vectorDashed2.set(camera.position.x + 1000, 0, 0);
        var vectorDashedGeo = new THREE.Geometry();
        vectorDashedGeo.vertices.push(
            vectorDashed1,
            vectorDashed2
        );
        vectorDashedGeo.computeLineDistances();
        var dashedLine = new THREE.Line(vectorDashedGeo, dashedLineMaterial);
        lastDashedLineX = camera.position.x + 1000;
        parentTransform.add(dashedLine);
    }

    parentTransform.add(horizont);
    parentTransform.add(leftEdge);
    parentTransform.add(rightEdge);

    $('#mistakesCount').text(mistakesCount);
    var distanceNumber = Math.floor(camera.position.x / 1000);
    var maxSpeed = distancesMaxSpeeds[Math.floor(camera.position.x / 1000)];
    if (maxSpeed < speed && $('#mistakes>[data-id=' + distanceNumber + ']').length == 0) {
        mistakesCount = mistakesCount + 1;
        $('#mistakes').append('<div data-id="' + distanceNumber + '" class="mistake-text">' + 'Нарушение скоростного режима: ' + speed.toString() + ' км/ч ' + '(разрешенная - ' + maxSpeed.toString() + ' км/ч)' + '</div>');
    }

    if (camera.position.z < -45 || camera.position.z > 45) {
        camera.position.z = 0;
        $('#mistakes').append('<div class="mistake-text" style="color: #ff5619">Съезд с дороги</div>');
    }

    var origin = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    var direction = new THREE.Vector3(1, 0, 0);
    var raycaster = new THREE.Raycaster(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z), direction, 1, 10);
    var raycaster2 = new THREE.Raycaster(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 20), direction, 1, 10);
    var raycaster3 = new THREE.Raycaster(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z + 20), direction, 1, 10);
    var intersects = raycaster.intersectObjects(parentTransform.children, false);
    var intersects2 = raycaster2.intersectObjects(parentTransform.children, false);
    var intersects3 = raycaster3.intersectObjects(parentTransform.children, false);
    intersects = intersects.concat(intersects2).concat(intersects3);
    for (var i = 0; i < intersects.length; ++i) {
        if (intersects[i].object.name == 'car') {
            $('#mistakes').append('<div class="mistake-text" style="color: #ff5619">Авария</div>');
            speed = -1000;
        }
    }
    for (var i = 0; i < cars.length; ++i) {
        cars[i].position.x = cars[i].position.x + Math.round(Math.random() * 10);
    }

}

function drawSign(position, text) {
    if (position == 0)
        position = 50;
    var vectorSign60_1 = new THREE.Vector3();
    vectorSign60_1.set(position, 0, 45);
    var vectorSign60_2 = new THREE.Vector3();
    vectorSign60_2.set(position, 10, 45);
    var vectorSign60Geo = new THREE.Geometry();
    vectorSign60Geo.vertices.push(
        vectorSign60_1,
        vectorSign60_2
    );
    vectorSign60Geo.computeLineDistances();
    var signStick = new THREE.Line(vectorSign60Geo, signLineMaterial);
    parentTransform.add(signStick);
    var ringGeometry = new THREE.TorusGeometry(10, 0.5, 32, 32);
    var ring = new THREE.Mesh(ringGeometry, signsMaterial);
    ring.position.x = position;
    ring.position.y = 20;
    ring.position.z = 45;
    ring.rotation.y = 1.6;
    parentTransform.add(ring);
    var textGeo = new THREE.TextGeometry(text, {size: 7, height: 0.1, font: "helvetiker"});
    textGeo.computeBoundingBox();
    var coordsText = new THREE.Mesh(textGeo, signsMaterial);
    coordsText.position.x = position;
    coordsText.position.y = 20;
    coordsText.position.z = 38;
    coordsText.rotation.y = 4.5;
    parentTransform.add(coordsText);
}


function drawBlock(position, leftSide) {
    var offset = 0;
    if (leftSide)
        offset = -30;

    var vector1 = new THREE.Vector3();
    vector1.set(position, 0, offset);
    var vector2 = new THREE.Vector3();
    vector2.set(position, 20, offset);
    var vector3 = new THREE.Vector3();
    vector3.set(position, 0, 5 + offset);
    var vector4 = new THREE.Vector3();
    vector4.set(position, 20, 5 + offset);
    var vector5 = new THREE.Vector3();
    vector5.set(position, 0, 10 + offset);
    var vector6 = new THREE.Vector3();
    vector6.set(position, 20, 10 + offset);
    var vector7 = new THREE.Vector3();
    vector7.set(position, 0, 15 + offset);
    var vector8 = new THREE.Vector3();
    vector8.set(position, 20, 15 + offset);
    var vectorBlockGeo = new THREE.Geometry();
    vectorBlockGeo.vertices.push(
        vector1,
        vector2,
        vector3,
        vector4,
        vector5,
        vector6,
        vector7,
        vector8
    );
    vectorBlockGeo.computeLineDistances();
    var block = new THREE.Line(vectorBlockGeo, signsMaterial);
    parentTransform.add(block);
}


function drawCar(position) {

    var light = new THREE.DirectionalLight(0xffffff);

    light.position.set(0, 100, 60);
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 1000;
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 1024;
    light.shadowDarkness = .7;

    parentTransform.add(light);

    var loader = new THREE.JSONLoader();
    var mesh;
    loader.load('/resources/js/car.js', function (geometry, materials) {
        var material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/resources/js/gtare.jpg'),
            colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
        });

        mesh = new THREE.Mesh(
            geometry,
            material
        );
        mesh.scale.set(0.4, 0.4, 0.4);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.y = Math.PI / 2;
        mesh.position.x = position;
        mesh.position.y = 0;
        mesh.position.z = 15;
        mesh.name = 'car';
        parentTransform.add(mesh);
        cars[cars.length] = mesh;
    });

}

