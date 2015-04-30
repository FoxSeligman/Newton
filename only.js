var gl;
var pr;

window.onload = function init() {

    //Initialize gl
    var canvas = document.getElementById( "gl-canvas" );

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

        //pr.aTextureCoordLoc = gl.getAttribLocation(pr, "aTextureCoord");
        //gl.enableVertexAttribArray(pr.aTextureCoordLoc);

        pr.pLoc = gl.getUniformLocation(pr, "P");
        pr.mvLoc = gl.getUniformLocation(pr, "MV");


        //Generate uniform matrices
        pr.P = mat4.create();
        pr.MV = mat4.create();


        //Custom geometry
        tri = rprism(5, 5, 0.5);
        tri2 = rprism(1, 1, 1);


        //Initialize textures
        cubeTexture = gl.createTexture();
        cubeImage = new Image();
        cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
        cubeImage.src = "cubetexture2.png";


        //Render
        animate();
    }
};

function handleTextureLoaded(image, texture) {
    console.log("handleTextureLoaded, image = " + image);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var time = 0;
function animate() {
    time+=0.01;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var P = pr.P;
    var MV = pr.MV;
    mat4.identity(P);
    mat4.perspective(P, 45, gl.viewportWidth / gl.viewportHeight, 1, 20);
    mat4.identity(MV);
    mat4.translate(MV, MV, vec3.fromValues(0, 0, -6));
    mat4.rotateY(MV, MV, time);
    //mat4.rotateZ(MV, MV, time);
    gl.uniformMatrix4fv(pr.pLoc, false, P);
    gl.uniformMatrix4fv(pr.mvLoc, false, MV);

    renderObject(tri);
    renderObject(tri2);

    requestAnimationFrame(animate);
}

function renderObject(object) {
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
    gl.vertexAttribPointer(pr.vPositionLoc, object.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);

    //if (object.textureBuffer)
    //{
    //    gl.bindBuffer(gl.ARRAY_BUFFER, object.textureBuffer);
    //    gl.vertexAttribPointer(pr.aTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);
    //
    //    gl.activeTexture(gl.TEXTURE0);
    //    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    //    gl.uniform1i(gl.getUniformLocation(pr, "uSampler"), 0);
    //}

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