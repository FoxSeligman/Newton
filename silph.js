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


var program;

// Initialize
window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );
    initGL(canvas);
    initShaders("vertex-shader", "fragment-shader");

    auxInit();

    animate();
};

function initGL(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    if ( !gl ) { alert( "WebGL isn't available" ); }
}

function initShaders(vertex, fragment) {
    var vertexShader = getShader(gl, vertex);
    var fragmentShader = getShader(gl, fragment);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(program);

    program.vPositionLoc = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vPositionLoc);

    program.pLoc = gl.getUniformLocation(program, "P");
    program.mvLoc = gl.getUniformLocation(program, "MV");
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

function animate() {
    render();
    requestAnimationFrame(animate);
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(program.pLoc, false, P[stackLevel]);
    gl.uniformMatrix4fv(program.mvLoc, false, MV[stackLevel]);
}