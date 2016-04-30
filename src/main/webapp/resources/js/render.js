/**
 * Created by user on 30.04.2016.
 */

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true});
var parentTransform = new THREE.Object3D();

var horizont;
var leftEdge;
var rightEdge;
var lastDashedLineX = 0;

var xzLast = 0;
var speed = 0;

function init() {
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(1200, 490);
    var axes = new THREE.AxisHelper(30);
//    parentTransform.add(axes);
    raycaster = new THREE.Raycaster();
    camera.position.x = -10;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);
    scene.add(parentTransform);
    $('#renderPlace').append(renderer.domElement);
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
    camera.position.x = camera.position.x + speed * 0.01;
    camera.position.z = camera.position.z - xzLast * 0.001;
    var vectorHor1 = new THREE.Vector3();
    vectorHor1.set(camera.position.x + 1000, 0, -1000);
    var vectorHor2 = new THREE.Vector3();
    vectorHor2.set(camera.position.x + 1000, 0, 1000);
    var horizontGeo = new THREE.Geometry();
    horizontGeo.vertices.push(
        vectorHor1,
        vectorHor2
    );

    var vector3 = new THREE.Vector3();
    vector3.set(camera.position.x, 0, camera.position.z - 30);
    var vector4 = new THREE.Vector3();
    vector4.set(camera.position.x + 1000, 0, camera.position.z - 70);
    var leftEdgeGeo = new THREE.Geometry();
    leftEdgeGeo.vertices.push(
        vector3,
        vector4
    );

    var vector5 = new THREE.Vector3();
    vector5.set(camera.position.x, 0, camera.position.z + 30);
    var vector6 = new THREE.Vector3();
    vector6.set(camera.position.x + 1000, 0, camera.position.z + 70);
    var rightEdgeGeo = new THREE.Geometry();
    rightEdgeGeo.vertices.push(
        vector5,
        vector6
    );

    horizontGeo.computeLineDistances();
    leftEdgeGeo.computeLineDistances();
    rightEdgeGeo.computeLineDistances();
    var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10});

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

}
