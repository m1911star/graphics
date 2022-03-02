import {
  InitGPU,
  CreateGPUBuffer,
  CreateTransforms,
  CreateViewProjection,
  CreateAnimation,
} from '../../../utils/helper';
import { Shaders } from '@/samples/webgpu/cube/shaders';
import { CubeData } from '@/samples/webgpu/cube/vertex';

import { mat4, vec3 } from 'gl-matrix';
import { useEffect } from 'react';
// import createCamera from '3d-view-controls';

const init = async () => {
  const gpu = await InitGPU();
  console.log(gpu);
  const device = gpu.device;

  const cubeData = CubeData();
  const numberOfVertices = cubeData.positions.length / 3;
  const vertexBuffer = CreateGPUBuffer(device, cubeData.positions);
  const colorBuffer = CreateGPUBuffer(device, cubeData.colors);

  const shader = Shaders();
  const pipeline = device.createRenderPipeline({
    vertex: {
      module: device.createShaderModule({
        code: shader.vertex,
      }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 3 * 4,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x3',
              offset: 0,
            },
          ],
        },
        {
          arrayStride: 3 * 4,
          attributes: [
            {
              shaderLocation: 1,
              format: 'float32x3',
              offset: 0,
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: shader.fragment,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: gpu.format as GPUTextureFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'back',
    },
    depthStencil: {
      format: 'depth24plus',
      depthWriteEnabled: true,
      depthCompare: 'less',
    },
  });
  const modelMatrix = mat4.create();
  const mvpMatrix = mat4.create();
  let vpMatrix = mat4.create();
  const vp = CreateViewProjection(gpu.canvas.width / gpu.canvas.height);
  vpMatrix = vp.viewProjectionMatrix;

  let rotation = vec3.fromValues(0, 0, 0);
  // let camera = createCamera(gpu.canvas, vp.cameraOption);

  const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
          offset: 0,
          size: 64,
        },
      },
    ],
  });
  let textureView = gpu.context.getCurrentTexture().createView();
  const depthTexture = device.createTexture({
    size: [gpu.canvas.width, gpu.canvas.height, 1],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const renderPassDesc = {
    colorAttachments: [
      {
        view: textureView,
        loadValue: {
          r: 0.5,
          g: 0.9,
          b: 0.1,
          a: 0.5,
        },
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthLoadValue: 1.0,
      depthStoreOp: 'store',
      stencilLoadValue: 1,
      stencilStoreOp: 'store',
    },
  };

  const draw = () => {
    // if (!isAnimation) {
    //   if (camera.tick()) {
    //     const pMatrix = vp.projectionMatrix;
    //     vMatrix = camera.matrix;
    //     mat4.multiply(vpMatrix, pMatrix, vMatrix);
    //   }
    // }
    CreateTransforms(modelMatrix, [0, 0, 0], rotation);
    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);

    device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix as ArrayBuffer);
    textureView = gpu.context.getCurrentTexture().createView();
    renderPassDesc.colorAttachments[0].view = textureView;
    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(
      renderPassDesc as GPURenderPassDescriptor,
    );

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.draw(numberOfVertices);
    renderPass.endPass();
    device.queue.submit([commandEncoder.finish()]);
  };
  CreateAnimation(draw, rotation, true);
};

export default () => {
  useEffect(() => {
    init();
  }, []);
  return (
    <canvas
      className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
      width={384}
      height={424}
      id="webgpu-cube"
    />
  );
};
