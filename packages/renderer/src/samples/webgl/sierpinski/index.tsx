import React from 'react';
import { mix, flatten } from '@/utils/mv';
import { WebGLUtils } from '@/utils/webgl-utils';
import { vec2 } from 'gl-matrix';
// @ts-ignore
import vertCode from './sier.vert';
// @ts-ignore
import fragCode from './sier.frag';

const points: any[] = [];

// const divideTriangle = (
//   a: number[],
//   b: number[],
//   c: number[],
//   count: number,
// ) => {
//   if (count === 0) {
//     points.push(a, b, c);
//   } else {
//     const ab = mix(a, b, 0.5);
//     const ac = mix(a, c, 0.5);
//     const bc = mix(b, c, 0.5);
//     --count;
//     divideTriangle(a, ab, ac, count);
//     divideTriangle(c, ac, bc, count);
//     divideTriangle(b, bc, ab, count);
//   }
// };
const baseColors = [
  [1.0, 0.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0],
];
const colors: any[] = [];

const divideTetra = (a: number[], b:number[], c: number[], d: number[], count: number) => {
  if (count === 0) {
    tetra(a, b, c, d);
  } else {
    const ab = mix(a, b, 0.5);
    const ac = mix(a, c, 0.5);
    const ad = mix(a, d, 0.5);
    const bc = mix(b, c, 0.5);
    const bd = mix(b, d, 0.5);
    const cd = mix(c, d, 0.5);
    --count;
    divideTetra(a, ab, ac, ad, count);
    divideTetra(ab, b, bc, bd, count);
    divideTetra(ac, bc, c, cd, count);
    divideTetra(ad, bd, cd, d, count);
  }
}

const tetra = (a: number[], b:number[], c: number[], d: number[]) => {
  triangle(a, c, b, 0);
  triangle(a, c, d, 1);
  triangle(a, b, d, 2);
  triangle(b, c, d, 3);
}
function triangle(a: number[], b: number[], c: number[], color: number)
{

  colors.push(baseColors[Math.floor(Math.random() * 3)]);
  points.push(a);
  colors.push(baseColors[Math.floor(Math.random() * 3)]);
  points.push(b);
  colors.push(baseColors[Math.floor(Math.random() * 3)]);
  points.push(c);
}
export default () => {
  React.useLayoutEffect(() => {
    const canvas = document.getElementById('gl-sier') as HTMLCanvasElement;
    const NumTimesToSubdivide = 3;
    const gl = WebGLUtils.setupWebGL(canvas, {});
    if (!gl) {
      return;
    }
    const vertices = [
      [0,  0.0, -1.0],
      [0.0, 1.0, 0.3333],
      [-0.8165, -0.4714,  0.3333],
      [0.8165, -0.4714,  0.3333]
    ];
    console.log(vertices, 'vertices');
    // divideTriangle(vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);
    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader!, vertCode);
    gl.compileShader(vertShader!);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(shaderProgram, 'vColor');
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
  
    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(shaderProgram, 'vPosition');
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
  }, []);
  return (
    <>
      <canvas
        id="gl-sier"
        className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
        width={1000}
        height={1000}
      />
    </>
  );
};
