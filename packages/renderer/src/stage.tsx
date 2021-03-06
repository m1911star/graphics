import React from 'react';
import { default as GPUTriangle } from '@/samples/webgpu/triangle';
import { default as GPUCube } from '@/samples/webgpu/cube';
import { default as GLTriangle } from '@/samples/webgl/triangle';
import { default as GLCube } from '@/samples/webgl/cube';
import { default as GLSier } from '@/samples/webgl/sierpinski';
import { default as GPUShaer } from '@/samples/webgpu/shader';
import { default as GPUWireFrame } from '@/samples/webgpu/wireframe';

const samples = [
  <GLCube />,
  <GLSier />,
  <GPUCube />,
  <GLTriangle />,
  <GPUTriangle />,
  <GPUShaer />,
  <GPUWireFrame />,
];
export const Stage = () => {
  return (
    <>
      {/* {samples.map(sample => <>{sample}</>)} */}
      <ul
        role="list"
        className="m-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {samples.map((sample, index) => (
          <li
            key={`index-${index}`}
            className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="w-full flex items-center flex-col justify-between p-6">
              {sample}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
