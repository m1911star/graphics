import { vec3 } from 'gl-matrix';
import { SpherePosition } from './math';

export const SphereWireframeData = (
  radius: number,
  u: number,
  v: number,
  center: vec3 = [0, 0, 0],
) => {
  if (u < 2 || v < 2) return;
  let pts = [];
  let pt: vec3;
  for (let i = 0; i < u; i++) {
    let pt1: vec3[] = [];
    for (let j = 0; j < v; j++) {
      pt = SpherePosition(
        radius,
        (i * 180) / (u - 1),
        (j * 360) / (v - 1),
        center,
      );
      pt1.push(pt);
    }
    pts.push(pt1);
  }

  let p = [] as any;
  let p0, p1, p2, p3;
  for (let i = 0; i < u - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      p0 = pts[i][j];
      p1 = pts[i + 1][j];
      //p2 = pts[i+1][j+1];
      p3 = pts[i][j + 1];
      p.push([
        p0[0],
        p0[1],
        p0[2],
        p1[0],
        p1[1],
        p1[2],
        p0[0],
        p0[1],
        p0[2],
        p3[0],
        p3[1],
        p3[2],
      ]);
    }
  }
  return new Float32Array(p.flat());
};

export const CubeData1 = () => {
  const vertexData = new Float32Array([
    // position,   color
    -1,
    -1,
    1,
    0,
    0,
    1, // vertex a, index 0
    1,
    -1,
    1,
    1,
    0,
    1, // vertex b, index 1
    1,
    1,
    1,
    1,
    1,
    1, // vertex c, index 2
    -1,
    1,
    1,
    0,
    1,
    1, // vertex d, index 3
    -1,
    -1,
    -1,
    0,
    0,
    0, // vertex e, index 4
    1,
    -1,
    -1,
    1,
    0,
    0, // vertex f, index 5
    1,
    1,
    -1,
    1,
    1,
    0, // vertex g, index 6
    -1,
    1,
    -1,
    0,
    1,
    0, // vertex h, index 7
  ]);

  const indexData = new Uint32Array([
    // front
    0, 1, 2, 2, 3, 0,

    // right
    1, 5, 6, 6, 2, 1,

    // back
    4, 7, 6, 6, 5, 4,

    // left
    0, 3, 7, 7, 4, 0,

    // top
    3, 2, 6, 6, 7, 3,

    // bottom
    0, 4, 5, 5, 1, 0,
  ]);

  return {
    vertexData,
    indexData,
  };
};

export const CubeData = () => {
  const positions = new Float32Array([
    // front
    -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1,

    // right
    1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,

    // back
    -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,

    // left
    -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1,

    // top
    -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1, 1,

    // bottom
    -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
  ]);

  const colors = new Float32Array([
    // front - blue
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

    // right - red
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

    //back - yellow
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,

    //left - aqua
    0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,

    // top - green
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

    // bottom - fuchsia
    1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
  ]);

  return {
    positions,
    colors,
  };
};
