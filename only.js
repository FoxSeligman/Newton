var gl;
var pr;
var canvas;

var theta = 0;
var phi = 0;

var worlds;

var pressed = [0,0,0,0];
window.onkeydown = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = 1;
};
window.onkeyup = function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        pressed[e.keyCode - 37] = 0;
};

function lockChangeAlert() {
    if(document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas ||
        document.webkitPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", cursorMoved, false);
    } else {
        console.log('The pointer lock status is now unlocked');
        document.removeEventListener("mousemove", cursorMoved, false);
    }
}

var x = 0;
var y = 0;
function cursorMoved(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

    x += movementX;
    y += movementY;

    theta += movementX * 0.01;
    phi += movementY * 0.01;

    if (phi > Math.PI / 2)
        phi = Math.PI / 2;
    else if (phi < -Math.PI / 2)
        phi = -Math.PI / 2;

    //console.log("X position: " + movementX + ', Y position: ' + movementY);
}

window.onload = function init() {

    //Initialize gl
    canvas = document.getElementById( "gl-canvas" );



    //Pointer lock
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);




    gl = canvas.getContext("experimental-webgl");
    if (gl) {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        //gl.enable(gl.BLEND);


        //Attach shaders
        pr = gl.createProgram();

        var vertexShader = getShader(gl, "vertex-shader");
        var fragmentShader = getShader(gl, "fragment-shader");

        gl.attachShader(pr, vertexShader);
        gl.attachShader(pr, fragmentShader);

        gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
            alert("Could not initialise shaders");


        //Register program
        gl.useProgram(pr);


        //Get locations
        pr.vPositionLoc = gl.getAttribLocation(pr, "vPosition");
        gl.enableVertexAttribArray(pr.vPositionLoc);

        pr.aTextureCoordLoc = gl.getAttribLocation(pr, "aTextureCoord");
        gl.enableVertexAttribArray(pr.aTextureCoordLoc);

        pr.aVertexNormalLoc = gl.getAttribLocation(pr, "aVertexNormal");
        gl.enableVertexAttribArray(pr.aVertexNormalLoc);

        pr.pLoc = gl.getUniformLocation(pr, "P");
        pr.mvLoc = gl.getUniformLocation(pr, "MV");
        pr.nLoc = gl.getUniformLocation(pr, "uNormalMatrix");
        pr.playerPosLoc = gl.getUniformLocation(pr, "playerPos");
        pr.isLitLoc = gl.getUniformLocation(pr, "isLit");
        pr.pointLightPosLoc = gl.getUniformLocation(pr, "uPointLightingLocation");


        //Generate uniform matrices
        pr.P = mat4.create();
        pr.MV = mat4.create();
        pr.N = mat4.create();


        //Custom geometry
        tri = rprism(5, 5, 0.5);
        tri2 = rprism(1, 1, 1);


        var s = 1;
        var special = Math.sqrt(3) / 2;
        var va = vec3.fromValues(-s/2, -special/2, -special/2);
        var vb = vec3.fromValues(s/2, -special/2, -special/2);
        var vc = vec3.fromValues(0, -special/2, special/2);
        var vd = vec3.fromValues(0, special/2, 0);
        tet = tetrahedron(24,24,1);


        //Initialize textures
        cubeTexture = loadTexture("cubetexture2.png");
        cubeTexture2 = loadTexture("cubetexture.png");


        //Build worlds
        //var beegees = Object();
        //beegees.audio = new Audio('http://localhost:63343/Newton/beegees.mp3');


        //Render
        animate();
    }
};

function loadTexture(uri) {
    var cubeTexture = gl.createTexture();
    var cubeImage = new Image();
    cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); };
    cubeImage.src = uri;
    return cubeTexture;
}

function handleTextureLoaded(image, texture) {
    console.log("handleTextureLoaded, image = " + image);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var size = 10;
var vel = [0,0,0];
var pos = [size/2,0,size/2];
var jetpackForce = 0.005;
var dampening = 0.002;
var time = 0;
var isLit = false;
var pointLightPos = vec3.fromValues(size/2, 0, size/2);
function animate() {
    time+=0.01;

    // Input
    var allForce = [0,0];
    allForce[0] += jetpackForce * (pressed[0] - pressed[2]);
    allForce[1] += jetpackForce * (pressed[3] - pressed[1]);

    vel[0] += allForce[0];
    vel[1] += allForce[1];

    if (vel[0])
        vel[0] = Math.max(0, Math.abs(vel[0]) - dampening) * (Math.abs(vel[0]) / vel[0]);
    if (vel[1])
        vel[1] = Math.max(0, Math.abs(vel[1]) - dampening) * (Math.abs(vel[1]) / vel[1]);

    pos[0] -= vel[0];
    pos[2] += vel[1];

    if (pos[0] <= 0.5) {
        pos[0] = 0.5;
        vel[0] = 0;
    } else if (pos[0] >= size - 0.5) {
        pos[0] = size - 0.5;
        vel[0] = 0;
    }

    if (pos[2] <= 0.5) {
        pos[2] = 0.5;
        vel[1] = 0;
    } else if (pos[2] >= size - 0.5) {
        pos[2] = size - 0.5;
        vel[1] = 0;
    }

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var P = pr.P;
    var MV = pr.MV;
    mat4.identity(P);
    mat4.perspective(P, 45, gl.viewportWidth / gl.viewportHeight, 1, 50);

    mat4.identity(MV);

    eye = [Math.cos(theta),-Math.sin(phi),Math.sin(theta)];
    mat4.lookAt(MV, [0,0,0], eye, [0,1,0]);

    mat4.translate(MV, MV, [-pos[0],-pos[1],-pos[2]]);

    //mat4.translate(MV, MV, pos);
    //mat4.translate(MV, MV, vec3.fromValues(0, 0, -6));
    //mat4.rotateY(MV, MV, time);

    var MV2 = mat4.create();
    mat4.copy(MV2, MV);

    mat4.translate(MV, MV2, pointLightPos);
    mat4.rotateX(MV, MV, time);
    mat4.rotateY(MV, MV, time);
    updateUniforms();

    //renderObject(tri2, cubeTexture2);
    renderObject(tet, cubeTexture2);

    mat4.copy(MV, MV2);
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            mat4.translate(MV, MV2, vec3.fromValues(row, -3, col));
            isLit = (row%2)^(col%2);
            updateUniforms();
            if (Math.abs(row + pos[0]) <= 5 && Math.abs(col + pos[2]) <= 5)
                renderObject(tri2, cubeTexture2);
            else
                renderObject(tri2, cubeTexture);
        }
    }

    requestAnimationFrame(animate);
}

function updateUniforms() {
    gl.uniformMatrix4fv(pr.pLoc, false, pr.P);
    gl.uniformMatrix4fv(pr.mvLoc, false, pr.MV);

    mat4.invert(pr.N, pr.MV);
    mat4.transpose(pr.N, pr.N);
    gl.uniformMatrix4fv(pr.nLoc, false, pr.N);

    gl.uniformMatrix4fv(pr.playerPosLoc, false, vec3.fromValues(pos[0],pos[1],pos[2]));

    gl.uniform1i(pr.isLitLoc, isLit);
    gl.uniform3f(pr.pointLightPosLoc, pointLightPos[0],pointLightPos[1],pointLightPos[2]);
}

function renderObject(object, texture) {
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
    gl.vertexAttribPointer(pr.vPositionLoc, object.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
    gl.vertexAttribPointer(pr.aVertexNormalLoc, object.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);

    if (object.textureBuffer && texture)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.textureBuffer);
        gl.vertexAttribPointer(pr.aTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(pr, "uSampler"), 0);
    }

    gl.drawElements(gl.TRIANGLES, object.numItems, gl.UNSIGNED_SHORT, 0);
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}