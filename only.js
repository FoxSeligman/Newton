var gl;
var pr;

window.onload = function init() {

    //Initialize gl
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext("experimental-webgl");
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor( 0.5, 0.0, 0.0, 1.0 );


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

    pr.pLoc = gl.getUniformLocation(pr, "P");
    pr.mvLoc = gl.getUniformLocation(pr, "MV");


    //Custom geometry
    var va = [-1.0, -1.0, 0.0];
    var vb = [1.0, -1.0, 0.0];
    var vc = [-1.0, 1.0, 0.0];
    var vertexArray = triangle(va, vb, vc);

    var buffer = makeBuffer(vertexArray);


    //Render
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var P = mat4.create();
    var MV = mat4.create();
    mat4.perspective(P, 45, gl.viewportWidth / gl.viewportHeight, 1, 20);
    mat4.translate(MV, MV, [0, 0, -6]);
    gl.uniformMatrix4fv(pr.pLoc, false, P);
    gl.uniformMatrix4fv(pr.mvLoc, false, MV);

    gl.vertexAttribPointer(pr.vPositionLoc, buffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, buffer.numItems);
};

function makeBuffer(vertexArray) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    buffer.itemSize = vertexArray.itemSize;
    buffer.numItems = vertexArray.numItems;

    return buffer;
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