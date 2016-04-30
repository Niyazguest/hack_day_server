/**
 * Created by user on 30.04.2016.
 */

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true});
var parentTransform = new THREE.Object3D();
var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10});
var signLineMaterial = new THREE.LineBasicMaterial({color: 0x010102, linewidth: 10});
var signsMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

var horizont;
var leftEdge;
var rightEdge;
var lastDashedLineX = 0;

var xzLast = 0;
var speed = 0;

var currentSpeed;
var distancesMaxSpeeds = [];
var mistakesCount = 0;

function init() {
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(1300, 490);
    var axes = new THREE.AxisHelper(30);
    raycaster = new THREE.Raycaster();
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

    for (var j = 2000; j < 30000; j += 2000) {
        drawBlock(j, (Math.random()) < 0.5 ? true : false);
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
    vector3.set(camera.position.x, 0, -30);
    var vector4 = new THREE.Vector3();
    vector4.set(camera.position.x + 1000, 0, -70);
    var leftEdgeGeo = new THREE.Geometry();
    leftEdgeGeo.vertices.push(
        vector3,
        vector4
    );

    var vector5 = new THREE.Vector3();
    vector5.set(camera.position.x, 0, 30);
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
    rightEdge = new THREE.Line(rightEdgeGeo, lineMaterial);

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
        var dashedLine = new THREE.Line(vectorDashedGeo, lineMaterial);
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
}

function drawSign(position, text) {
    if (position == 0)
        position = 50;
    var vectorSign60_1 = new THREE.Vector3();
    vectorSign60_1.set(position, 0, 45);
    var vectorSign60_2 = new THREE.Vector3();
    vectorSign60_2.set(position, 20, 45);
    var vectorSign60Geo = new THREE.Geometry();
    vectorSign60Geo.vertices.push(
        vectorSign60_1,
        vectorSign60_2
    );
    vectorSign60Geo.computeLineDistances();
    var signStick = new THREE.Line(vectorSign60Geo, signLineMaterial);
    parentTransform.add(signStick);
    var ringGeometry = new THREE.TorusGeometry(10, 0.1, 32, 32);
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
