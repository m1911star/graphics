import React from 'react';
import vertCode from './cube.vert';
import fragCode from './cube.frag';
import { getProjection, rotateX, rotateY, rotateZ } from '@/utils/matrix';

export default () => {
  const init = () => {
    const canvas = document.getElementById('webgl-cube') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    const vertices = [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1,
      1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1,
      -1, 1, 1, 1, 1, 1, 1, 1, -1,
    ];

    const colors = [
      5, 3, 7, 5, 3, 7, 5, 3, 7, 5, 3, 7, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1,
      0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    ];

    const indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];
    const vert_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const color_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    const index_buf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

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
    const pMatrix = gl.getUniformLocation(shaderProgram, 'Pmatrix')!;
    const vMatrix = gl.getUniformLocation(shaderProgram, 'Vmatrix')!;
    const mMatrix = gl.getUniformLocation(shaderProgram, 'Mmatrix')!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buf);
    const position = gl.getAttribLocation(shaderProgram, 'position')!;
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buf);
    const color = gl.getAttribLocation(shaderProgram, 'color')!;
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.useProgram(shaderProgram);

    const projectionMat = getProjection(
      40,
      canvas.width / canvas.height,
      1,
      100,
    );
    const movMat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const viewMat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    viewMat[14] = viewMat[14] - 6;

    const animate = function (time: number) {
      rotateZ(movMat, 0.05); //time
      rotateY(movMat, 0.0);
      rotateX(movMat, 0.05);
      // time_old = time;

      gl.enable(gl.DEPTH_TEST);
      // gl.depthFunc(gl.LEQUAL);
      gl.clearColor(0.5, 0.5, 0.8, 0.9);
      gl.clearDepth(2.0);

      gl.viewport(0.0, 0.0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(pMatrix, false, projectionMat);
      gl.uniformMatrix4fv(vMatrix, false, viewMat);
      gl.uniformMatrix4fv(mMatrix, false, movMat);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buf);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      window.requestAnimationFrame(animate);
    };
    animate(0);
  };

  React.useEffect(init, []);

  return (
    <canvas
      className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
      width={640}
      height={640}
      id="webgl-cube"
    />
  );
};
