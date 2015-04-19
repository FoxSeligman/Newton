// Use
var canvas;
var gl;
var buffers = [];
var nIndices = [];

// Under
var P = [];
var MV = [];
var S = [];
var T = [];
var Rz = [];
var Ry = [];
var Rx = [];
var PLoc, MVLoc, SLoc, TLoc, RzLoc, RyLoc, RxLoc;

// Initialize
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load program
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vPosition = gl.getAttribLocation( program, "vPosition");

    PLoc = gl.getUniformLocation( program, "P" );
    MVLoc = gl.getUniformLocation( program, "MV" );
    SLoc = gl.getUniformLocation( program, "S" );
    TLoc = gl.getUniformLocation( program, "T" );
    RzLoc = gl.getUniformLocation( program, "Rz" );
    RyLoc = gl.getUniformLocation( program, "Ry" );
    RxLoc = gl.getUniformLocation( program, "Rx" );

    P = MV = S = T = Rz = Ry = Rx = mat4();

    auxinit();

    beginRender();
};

function beginRender() {
    render();
    window.requestAnimFrame(beginRender);
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
    S = scale(x, y, z);
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
    T = translate(x, y, z);
}

function setRotateX(degrees) {
    Rx = rotate(degrees, [1,0,0]);
}

function setRotateY(degrees) {
    Ry = rotate(degrees, [0,1,0]);
}

function setRotateZ(degrees) {
    Rz = rotate(degrees, [0,0,1]);
}

function addTetrahedron(name, va, vb, vc, vd, nSubdivisions) {
    var pointsArray = tetrahedron(va, vb, vc, vd, nSubdivisions);
    var indexCount = 3 * Math.pow(4, nSubdivisions+1);

    registerShape(name, pointsArray, indexCount);
}

function addRect(name, va, vb, vc, vd) {
    var pointsArray = rect(va, vb, vc, vd);
    var indexCount = 3 * 2;

    registerShape(name, pointsArray, indexCount);
}

function registerShape(name, pointsArray, indexCount) {
    var buffer = buffers[name] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    nIndices[name] = indexCount;
}

function drawObject(name, method) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniformMatrix4fv( PLoc, false, flatten(P) );
    gl.uniformMatrix4fv( MVLoc, false, flatten(MV) );
    gl.uniformMatrix4fv( SLoc, false, flatten(S) );
    gl.uniformMatrix4fv( TLoc, false, flatten(T) );
    gl.uniformMatrix4fv( RzLoc, false, flatten(Rz) );
    gl.uniformMatrix4fv( RyLoc, false, flatten(Ry) );
    gl.uniformMatrix4fv( RxLoc, false, flatten(Rx) );

    if (typeof method !== 'number') {
        method = gl.TRIANGLE_STRIP;
    }
    for (var i = 0; i < nIndices[name]; i+=3)
        gl.drawArrays(method, i, 3);
}