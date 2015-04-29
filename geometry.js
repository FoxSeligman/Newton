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
    var va = [-sx/2, -sy/2,  sz/2];
    var vb = [ sx/2, -sy/2,  sz/2];
    var vc = [-sx/2,  sy/2,  sz/2];
    var vd = [ sx/2,  sy/2,  sz/2];

    var ve = [-sx/2, -sy/2, -sz/2];
    var vf = [ sx/2, -sy/2, -sz/2];
    var vg = [-sx/2,  sy/2, -sz/2];
    var vh = [ sx/2,  sy/2, -sz/2];

    var vertexArr = [].concat(va, vb, vc, vd, ve, vf, vg, vh);
    var indexArr = [
        0, 1, 2,    1, 2, 3,
        1, 5, 3,    5, 3, 7,
        5, 4, 7,    4, 7, 6,
        4, 0, 6,    0, 6, 2,
        4, 5, 0,    5, 0, 1,
        2, 3, 6,    3, 6, 7
    ];

    return processArray(vertexArr, indexArr);
}

function processArray(vertexArr, indexArr) {
    var object = Object();


    var vertexBuffer = object.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArr), gl.STATIC_DRAW);


    var indexBuffer = object.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArr), gl.STATIC_DRAW);


    object.itemSize = 3;
    object.numItems = indexArr.length;


    return object;
}