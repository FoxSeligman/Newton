function triangle(pointsArray, a, b, c) {
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
}

function divideTriangle(pointsArray, a, b, c, count) {
    if ( count > 0 ) {

        var ab = normalize(mix( a, b, 0.5), true);
        var ac = normalize(mix( a, c, 0.5), true);
        var bc = normalize(mix( b, c, 0.5), true);

        divideTriangle( pointsArray, a, ab, ac, count - 1 );
        divideTriangle( pointsArray, ab, b, bc, count - 1 );
        divideTriangle( pointsArray, bc, c, ac, count - 1 );
        divideTriangle( pointsArray, ab, bc, ac, count - 1 );
    }
    else { // draw tetrahedron at end of recursion
        triangle( pointsArray, a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    var pointsArray = [];
    divideTriangle(pointsArray, a, b, c, n);
    divideTriangle(pointsArray, d, c, b, n);
    divideTriangle(pointsArray, a, d, b, n);
    divideTriangle(pointsArray, a, c, d, n);
    return pointsArray;
}

function rect(a, b, c, d) {
    var pointsArray = [];
    triangle(pointsArray, a, b, c);
    triangle(pointsArray, c, b, d);
    return pointsArray;
}