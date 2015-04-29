// Use
var gl;
var vertexBuffers = [];
var colorBuffers = [];
var nIndices = [];

// Under
var P = [mat4.create()];
var MV = [mat4.create()];
//var PLoc, MVLoc;
//var vPosition, vColor;
var stackLevel = 0;

//function setScale(x, y, z) {
//    if (typeof x === 'undefined') {
//        x = 1;
//    }
//    if (typeof y === 'undefined') {
//        y = x;
//        z = x;
//    }
//    if (typeof z === 'undefined') {
//        alert("setScale used improperly");
//    }
//    S[stackLevel] = scale(x, y, z);
//}
//
//function setTranslate(x, y, z) {
//    if (typeof x === 'undefined') {
//        x = 0;
//        y = 0;
//        z = 0;
//    }
//    if (typeof y === 'undefined' || typeof z === 'undefined') {
//        alert("setTranslate used improperly");
//    }
//    T[stackLevel] = translate(x, y, z);
//}
//
//function setRotateX(degrees) {
//    Rx[stackLevel] = rotate(degrees, [1,0,0]);
//}
//
//function setRotateY(degrees) {
//    Ry[stackLevel] = rotate(degrees, [0,1,0]);
//}
//
//function setRotateZ(degrees) {
//    Rz[stackLevel] = rotate(degrees, [0,0,1]);
//}

function addTriangle(name, va, vb, vc) {
    var pointsArray = triangle(va, vb, vc);
    var vertexCount = 3;

    registerShape(name, pointsArray, vertexCount);
}

//function addTetrahedron(name, va, vb, vc, vd, nSubdivisions) {
//    var pointsArray = tetrahedron(va, vb, vc, vd, nSubdivisions);
//    var vertexCount = 3 * Math.pow(4, nSubdivisions+1);
//
//    registerShape(name, pointsArray, vertexCount);
//}
//
//function addRect(name, va, vb, vc, vd) {
//    var pointsArray = rect(va, vb, vc, vd);
//    var vertexCount = 3 * 2;
//
//    registerShape(name, pointsArray, vertexCount);
//}

function registerShape(name, pointsArray, vertexCount) {
    var buffer = vertexBuffers[name] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsArray), gl.STATIC_DRAW);
    buffer.itemSize = 3;
    buffer.numItems = vertexCount;

    //gl.enableVertexAttribArray(vPosition);
    //nIndices[name] = vertexCount;

    //var colorArray = [];
    //for (var i = 0; i < vertexCount; i++)
    //    colorArray.push(vec4(Math.random(),Math.random(),Math.random()));
    //buffer = colorBuffers[name] = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW);
    //gl.enableVertexAttribArray(vColor);
}

//function drawObject(name, method) {
//    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[name]);
//    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
//
//    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffers[name]);
//    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
//
//    gl.uniformMatrix4fv( PLoc, false, flatten(P[stackLevel]) );
//    gl.uniformMatrix4fv( MVLoc, false, flatten(MV[stackLevel]) );
//
//    if (typeof method !== 'number') {
//        method = gl.TRIANGLE_STRIP;
//    }
//    for (var i = 0; i < nIndices[name]; i+=3)
//        gl.drawArrays(method, i, 3);
//}