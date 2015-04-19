var near = 0;
var far = 1;
var radius = 6.0;
var theta  = 0.0;
var phi    = 0.0;

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var pressed = [];
window.onkeydown = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = true;
}
window.onkeyup = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = false;
}

function auxInit() {
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    addTetrahedron("pyramid", va, vb, vc, vd, 0);
    addTetrahedron("sphere", va, vb, vc, vd, 3);

    var size = 5;
    va = vec4(-size, 0.0, -size, 1);
    vb = vec4(size, 0, -size, 1);
    vc = vec4(-size, 0, size, 1);
    vd = vec4(size, 0, size, 1);
    addRect("plane", va, vb, vc, vd);
}

var vel = [0,0,0];
var pos = [0,0,0];
var jetpackForce = 0.005;
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta));
    P[stackLevel] = perspective(70, 1, near, far);
    MV[stackLevel] = lookAt(eye, at, up);

    // Input
    var allForce = vec2();
    if (pressed[0]) {
        allForce [0] += -jetpackForce;
        allForce [1] += 0;
    }
    if (pressed[2]) {
        allForce [0] += jetpackForce;
        allForce [1] += 0;
    }

    if (pressed[1]) {
        allForce [0] += 0;
        allForce [1] += jetpackForce;
    }
    if (pressed[3]) {
        allForce [0] += 0;
        allForce [1] += -jetpackForce;
    }
    vel[0] += allForce[0];
    vel[1] += allForce[1];

    pos[0] += vel[0];
    pos[1] += vel[1];

    at[1] += vel[1];


    // World
    setScale(1);


    // Sphere
    setRotateX(90);
    setRotateY(0);
    setRotateZ(0);
    setTranslate(pos[0], pos[1], pos[2]);
    drawObject("sphere", gl.LINE_LOOP);


    // Pyramid
    setTranslate(pos[0], pos[1] + 1, pos[2]);
    drawObject("pyramid");


    // Plane
    setRotateX(0);
    setTranslate(pos[0], pos[1] - 1, pos[2]);
    drawObject("plane");

}
