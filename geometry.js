function triangle(va, vb, vc, vertexArray) {
    vertexArray = vertexArray || [];
    vertexArray = vertexArray.concat(va, vb, vc);
    vertexArray.itemSize = va.length;
    vertexArray.numItems = vertexArray.length / vertexArray.itemSize;
    return vertexArray;
}