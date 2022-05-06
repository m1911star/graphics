import {
  InitGPU,
  CreateGPUBuffer,
  CreateGPUBufferUint,
  CreateTransforms,
  CreateViewProjection,
  CreateAnimation,
} from '../../../utils/helper';

import { Shaders } from './shaders';
import { vec3, mat4 } from 'gl-matrix';
const createCamera = require('3d-view-controls');

export const CreateWireFrame = async (
  wireframeData: Float32Array,
  isAnimation: boolean,
) => {
  const gpu = await InitGPU('webgpu-frame');
  const device = gpu.device;

  const numberOfVertices = wireframeData.length / 3;

  const vertexBuffer = CreateGPUBuffer(device, wireframeData);

  const shaders = Shaders();

  const pipeline = device.createRenderPipeline({
    vertex: {
      module: device.createShaderModule({
        code: shaders.vertex,
      }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 12,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x3',
              offset: 0,
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: shaders.fragment,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: gpu.format,
        },
      ],
    },
    primitive: {
      topology: 'line-list',
    },
  });

  const modelMatrix = mat4.create();
  const mvpMatrix = mat4.create();

  let vMatrix = mat4.create();
  let vpMatrix = mat4.create();

  const vp = CreateViewProjection(gpu.canvas.width / gpu.canvas.height);
  vpMatrix = vp.viewProjectionMatrix;

  let rotation = vec3.fromValues(0, 0, 0);
  const camera = createCamera(gpu.canvas, vp.cameraOption);

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

  const renderPassDescription = {
    colorAttachments: [
      {
        view: textureView,
        loadValue: { r: 0.2, g: 0.246, b: 0.3, a: 1.0 },
        storeOp: 'store',
      },
    ],
  };

  const draw = () => {
    if (!isAnimation) {
      if (camera.tick()) {
        const pMatrix = vp.projectionMatrix;
        vMatrix = camera.matrix;
        mat4.multiply(vpMatrix, pMatrix, vMatrix);
      }
    }

    CreateTransforms(modelMatrix, [0, 0, 0], rotation);
    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);

    device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix as ArrayBuffer);

    textureView = gpu.context.getCurrentTexture().createView();

    renderPassDescription.colorAttachments[0].view = textureView;

    const commandEncoder = device.createCommandEncoder();

    const renderPass = commandEncoder.beginRenderPass(
      renderPassDescription as GPURenderPassDescriptor,
    );
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);

    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.draw(numberOfVertices);
    renderPass.endPass();

    device.queue.submit([commandEncoder.finish()]);
  };
  CreateAnimation(draw, rotation, false);
};
