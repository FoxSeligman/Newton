function triangle(va, vb, vc) {
    var vertexArr = [].concat(va, vb, vc);
    var indexArr = [0, 1, 2];

    return processArray(vertexArr, indexArr);
}

function rect(va, vb, vc, vd) {
    var vertexArr = [].concat(va, vb, vc, vd);
    var indexArr = [0, 1, 2,    1, 2, 3];

    return processArray(vertexArr, indexArr);
}

function rprism(sx, sy, sz) {
    var vertexArr = [
        // Front face
        -sx/2, -sy/2,  sz/2,
         sx/2, -sy/2,  sz/2,
         sx/2,  sy/2,  sz/2,
        -sx/2,  sy/2,  sz/2,

        // Back face
        -sx/2, -sy/2, -sz/2,
        -sx/2,  sy/2, -sz/2,
         sx/2,  sy/2, -sz/2,
         sx/2, -sy/2, -sz/2,

        // Top face
        -sx/2,  sy/2, -sz/2,
        -sx/2,  sy/2,  sz/2,
         sx/2,  sy/2,  sz/2,
         sx/2,  sy/2, -sz/2,

        // Bottom face
        -sx/2, -sy/2, -sz/2,
         sx/2, -sy/2, -sz/2,
         sx/2, -sy/2,  sz/2,
        -sx/2, -sy/2,  sz/2,

        // Right face
         sx/2, -sy/2, -sz/2,
         sx/2,  sy/2, -sz/2,
         sx/2,  sy/2,  sz/2,
         sx/2, -sy/2,  sz/2,

        // Left face
        -sx/2, -sy/2, -sz/2,
        -sx/2, -sy/2,  sz/2,
        -sx/2,  sy/2,  sz/2,
        -sx/2,  sy/2, -sz/2
    ];
    var indexArr = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];
    var textureCoordinates = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0
    ];

    return processArray(vertexArr, indexArr, textureCoordinates);
}

function processArray(vertexArr, indexArr, textureCoordinates) {
    var object = Object();


    var vertexBuffer = object.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArr), gl.STATIC_DRAW);


    var indexBuffer = object.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArr), gl.STATIC_DRAW);


    if (textureCoordinates) {
        var textureBuffer = object.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    }


    object.itemSize = 3;
    object.numItems = indexArr.length;


    return object;
}