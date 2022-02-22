// @ts-nocheck
import React from 'react';
import vs from './cube.vert';
import fs from './cube.frag';

export default () => {
  const init = () => {
    const canvas = document.getElementById('webgl-cube') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }

    if (!initShaders(gl, vs, fs)) {
      console.log('Failed to initialize shaders.');
      return;
    }

    const n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };
  const initVertexBuffers = (gl) => {
    const dim = 3;
    const vertices = new Float32Array([0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0]);
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(gl.program, 'a_Position');
    if (aPos < 0) {
      return -1;
    }

    gl.vertexAttribPointer(aPos, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);
    return vertices.length / dim;
  };
  const initShaders = (gl, vs_source, fs_source) => {
    const vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
    const fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER);
    const glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(glProgram));
      return false;
    }

    gl.useProgram(glProgram);
    gl.program = glProgram;
    return true;
  };
  const makeShader = (gl, src, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  React.useEffect(() => {
    init();
  }, [init]);
  return (
    <figure className="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
      <canvas
        className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
        width={640}
        height={640}
        id="webgl-cube"
      />
      <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p className="text-lg font-medium">
            “Tailwind CSS is the only framework that I've seen scale on large
            teams. It’s easy to customize, adapts to any design, and the build
            size is tiny.”
          </p>
        </blockquote>
        <figcaption className="font-medium">
          <div className="text-sky-500 dark:text-sky-400">Sarah Dayan</div>
          <div className="text-slate-700 dark:text-slate-500">
            Staff Engineer, Algolia
          </div>
        </figcaption>
      </div>
    </figure>
  );
};
