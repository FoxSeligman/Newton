var near = 1;
var far = 20;
var radius = 6.0;
var theta  = 0.0;
var phi    = 0.0;

var eye;
const at = [0.0, 0.0, 0.0];
const up = [0.0, 1.0, 0.0];

var pressed = [];
window.onkeydown = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = true;
}
window.onkeyup = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = false;
}

var gl

function auxInit() {
    var va = [0.0, 0.0, -1.0];
    var vb = [0.0, 0.942809, 0.333333];
    var vc = [-0.816497, -0.471405, 0.333333];
    //var vd = [0.816497, -0.471405, 0.333333];
    //addTetrahedron("pyramid", va, vb, vc, vd, 0);
    //addTetrahedron("sphere", va, vb, vc, vd, 3);
    addTriangle("sphere", va, vb, vc);

    //var size = 5;
    //va = vec4(-size, 0.0, -size, 1);
    //vb = vec4(size, 0, -size, 1);
    //vc = vec4(-size, 0, size, 1);
    //vd = vec4(size, 0, size, 1);
    //addRect("plane", va, vb, vc, vd);
}

var vel = [0,0,0];
var pos = [0,0,0];
var jetpackForce = 0.005;
function render() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(P[stackLevel], 45, gl.viewportWidth / gl.viewportHeight, near, far);
    mat4.identity(MV[stackLevel]);

    // Input
    //var allForce = [0,0];
    //if (pressed[0])
    //{
    //    allForce [0] += -jetpackForce;
    //    allForce [1] += 0;
    //}
    //if (pressed[2]) {
    //    allForce [0] += jetpackForce;
    //    allForce [1] += 0;
    //}
    //
    //if (pressed[1]) {
    //    allForce [0] += 0;
    //    allForce [1] += jetpackForce;
    //}
    //if (pressed[3]) {
    //    allForce [0] += 0;
    //    allForce [1] += -jetpackForce;
    //}
    //vel[0] += allForce[0];
    //vel[1] += allForce[1];
    //
    //pos[0] += vel[0];
    //pos[1] += vel[1];
    //
    //at[1] += vel[1];

    // World
    //setScale(1);

    // Sphere
    mat4.rotateX(MV[stackLevel], MV[stackLevel], Math.PI / 2);
    //setRotateX(90);
    //setRotateY(0);
    //setRotateZ(0);

    mat4.translate(MV[stackLevel], MV[stackLevel], vec3.fromValues(0,0,0));   //can be just pos?
    //setTranslate(pos[0], pos[1], pos[2]);
    //drawObject("sphere", gl.LINE_LOOP);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers["sphere"]);
    gl.vertexAttribPointer(pr.vertexPositionAttribute, vertexBuffers["sphere"].itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    console.log(vertexBuffers["sphere"].numItems);
    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffers["sphere"].numItems);

    //// Pyramid
    //setTranslate(pos[0], pos[1] + 1, pos[2]);
    //drawObject("pyramid");
    //
    //
    //// Plane
    //setRotateX(0);
    //setTranslate(pos[0], pos[1] - 1, pos[2]);
    //drawObject("plane");

}
