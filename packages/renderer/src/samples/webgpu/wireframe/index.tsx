import React from 'react';
import styles from './style.module.scss';
import { CreateWireFrame } from './frame';
import { SphereWireframeData } from './vertex';
import { vec3 } from 'gl-matrix';

const Create3DObject = async (
  radius: number,
  u: number,
  v: number,
  center: vec3,
  isAnimation: boolean,
) => {
  const wireframeData = SphereWireframeData(
    radius,
    u,
    v,
    center,
  ) as Float32Array;
  await CreateWireFrame(wireframeData, isAnimation);
};
export default () => {
  let radius = 2;
  let u = 20;
  let v = 15;
  let center: vec3 = [0, 0, 0];
  let isAnimation = true;
  React.useLayoutEffect(() => {
    Create3DObject(radius, u, v, center, isAnimation);
  }, []);
  return (
    <>
      <canvas
        className={`md:rounded-none rounded-full mx-auto ${styles.canvas}`}
        width={384}
        height={384}
        id="webgpu-frame"
      />
      <div className="flex space-x-2 justify-center py-3">
        <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-200 text-gray-700 rounded">
          Wireframe
        </span>
      </div>
    </>
  );
};
