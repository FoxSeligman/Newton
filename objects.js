// Use
var canvas;
var gl;
var vertexBuffers = [];
var colorBuffers = [];
var nIndices = [];

// Under
var P = [mat4()];
var MV = [mat4()];
var S = [mat4()];
var T = [mat4()];
var Rz = [mat4()];
var Ry = [mat4()];
var Rx = [mat4()];
var PLoc, MVLoc, SLoc, TLoc, RzLoc, RyLoc, RxLoc;
var vPosition, vColor;
var stackLevel = 0;

// Initialize
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //gl.enable(gl.DEPTH_TEST);

    // Load program
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vPosition = gl.getAttribLocation( program, "vPosition");
    vColor = gl.getAttribLocation( program, "vColor");

    PLoc = gl.getUniformLocation( program, "P" );
    MVLoc = gl.getUniformLocation( program, "MV" );
    SLoc = gl.getUniformLocation( program, "S" );
    TLoc = gl.getUniformLocation( program, "T" );
    RzLoc = gl.getUniformLocation( program, "Rz" );
    RyLoc = gl.getUniformLocation( program, "Ry" );
    RxLoc = gl.getUniformLocation( program, "Rx" );

    auxInit();

    beginRender();
};

function beginRender() {
    render();
    window.requestAnimFrame(beginRender);
}

function pushMatrices() {
    P[stackLevel + 1] = P[stackLevel];
    MV[stackLevel + 1] = MV[stackLevel];
    S[stackLevel + 1] = S[stackLevel];
    T[stackLevel + 1] = T[stackLevel];
    Rz[stackLevel + 1] = Rz[stackLevel];
    Ry[stackLevel + 1] = Ry[stackLevel];
    Rx[stackLevel + 1] = Rx[stackLevel];
    stackLevel++;
}

function popMatrices() {
    if (stackLevel == 0) {
        P[stackLevel] = mat4();
        MV[stackLevel] = mat4();
        S[stackLevel] = mat4();
        T[stackLevel] = mat4();
        Rz[stackLevel] = mat4();
        Ry[stackLevel] = mat4();
        Rx[stackLevel] = mat4();
    } else {
        stackLevel--;
    }
}

function setScale(x, y, z) {
    if (typeof x === 'undefined') {
        x = 1;
    }
    if (typeof y === 'undefined') {
        y = x;
        z = x;
    }
    if (typeof z === 'undefined') {
        alert("setScale used improperly");
    }
    S[stackLevel] = scale(x, y, z);
}

function setTranslate(x, y, z) {
    if (typeof x === 'undefined') {
        x = 0;
        y = 0;
        z = 0;
    }
    if (typeof y === 'undefined' || typeof z === 'undefined') {
        alert("setTranslate used improperly");
    }
    T[stackLevel] = translate(x, y, z);
}

function setRotateX(degrees) {
    Rx[stackLevel] = rotate(degrees, [1,0,0]);
}

function setRotateY(degrees) {
    Ry[stackLevel] = rotate(degrees, [0,1,0]);
}

function setRotateZ(degrees) {
    Rz[stackLevel] = rotate(degrees, [0,0,1]);
}

function addTetrahedron(name, va, vb, vc, vd, nSubdivisions) {
    var pointsArray = tetrahedron(va, vb, vc, vd, nSubdivisions);
    var vertexCount = 3 * Math.pow(4, nSubdivisions+1);

    registerShape(name, pointsArray, vertexCount);
}

function addRect(name, va, vb, vc, vd) {
    var pointsArray = rect(va, vb, vc, vd);
    var vertexCount = 3 * 2;

    registerShape(name, pointsArray, vertexCount);
}

function registerShape(name, pointsArray, vertexCount) {
    var buffer = vertexBuffers[name] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vPosition);
    nIndices[name] = vertexCount;

    var colorArray = [];
    for (var i = 0; i < vertexCount; i++)
        colorArray.push(vec4(Math.random(),Math.random(),Math.random()));
    buffer = colorBuffers[name] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vColor);
}

function drawObject(name, method) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[name]);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffers[name]);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv( PLoc, false, flatten(P[stackLevel]) );
    gl.uniformMatrix4fv( MVLoc, false, flatten(MV[stackLevel]) );
    gl.uniformMatrix4fv( SLoc, false, flatten(S[stackLevel]) );
    gl.uniformMatrix4fv( TLoc, false, flatten(T[stackLevel]) );
    gl.uniformMatrix4fv( RzLoc, false, flatten(Rz[stackLevel]) );
    gl.uniformMatrix4fv( RyLoc, false, flatten(Ry[stackLevel]) );
    gl.uniformMatrix4fv( RxLoc, false, flatten(Rx[stackLevel]) );

    if (typeof method !== 'number') {
        method = gl.TRIANGLE_STRIP;
    }
    for (var i = 0; i < nIndices[name]; i+=3)
        gl.drawArrays(method, i, 3);
}