import * as helper from '../../../utils/helper';
import { Shaders } from "@/samples/webgpu/shader/shaders";
import { CubeData1 } from "@/samples/webgpu/shader/vertex";
import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { CreateGPUBuffer, CreateGPUBufferUint, CreateViewProjection } from "../../../utils/helper";
import React from "react";
// import * as control from '3d-view-controls';
// const createCamera = require('3d-view-controls');
// console.log(control);
const Create = async (isAnimation = true) => {
    const gpu = await helper.InitGPU('webgpu-shader');
    const {device } = gpu;
    const cubeData = CubeData1();
    const numberOfVertices = cubeData.indexData.length;
    const vertexBuffer = CreateGPUBuffer(
        device, cubeData.vertexData
    );
    const indexBuffer = CreateGPUBufferUint(
        device, cubeData.indexData
    );
    const shader = Shaders();
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader.vertex
            }),
            entryPoint: 'main',
            buffers: [{
                arrayStride: 24,
                attributes: [{
                    shaderLocation: 0,
                    format: 'float32x3',
                    offset: 0
                }, {
                    shaderLocation: 1,
                    format: 'float32x3',
                    offset: 12
                }]
            }]
        },
        fragment: {
            module: device.createShaderModule({
                code: shader.fragment
            }),
            entryPoint: 'main',
            targets: [{
                format: gpu.format
            }]
        },
        primitive: {
            topology: 'triangle-list',
        },
        depthStencil: {
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less",
        }
    });
    
    const modelMatrix = mat4.create();
    const mvpMatrix = mat4.create();
    let vMatrix = mat4.create();
    let vpMatrix = mat4.create();
    const vp = CreateViewProjection(gpu.canvas.width/gpu.canvas.height);
    vpMatrix = vp.viewProjectionMatrix;
    
    let rotation = vec3.fromValues(0, 0, 0);
    // let camera = createCamera(gpu.canvas, vp.cameraOption);
    
    const uniformBuffer = device.createBuffer({
        size: 4 * 4 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    
    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: uniformBuffer,
                offset: 0,
                size: 4 * 4 * 4
            }
        }]
    });
    
    let textureView = gpu.context.getCurrentTexture().createView();
    
    const depthTexture = device.createTexture({
        size: [gpu.canvas.width, gpu.canvas.height, 1],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    
    const renderPassDescription = {
        colorAttachments: [{
            view: textureView,
            loadValue: {
                r: 0.2,
                g: 0.246,
                b: 0.314,
                a: 1.0
            },
            storeOp: 'store',
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthLoadValue: 1.0,
            depthStoreOp: 'store',
            stencilLoadValue: 0,
            stencilStoreOp: 'store',
        }
    };
    function draw() {
        if(!isAnimation){
            // if(camera.tick()){
            //     const pMatrix = vp.projectionMatrix;
            //     vMatrix = camera.matrix;
            //     mat4.multiply(vpMatrix, pMatrix, vMatrix);
            // }
        }
        
        helper.CreateTransforms(modelMatrix,[0,0,0], rotation);
        mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
        device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix as ArrayBuffer);
        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);
        
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.drawIndexed(numberOfVertices);
        renderPass.endPass();
        
        device.queue.submit([commandEncoder.finish()]);
    }
    helper.CreateAnimation(draw, rotation, isAnimation);
};

export default () => {
    React.useLayoutEffect(() => {
        Create();
    }, []);
    return (
        <canvas
            className="md:rounded-none rounded-full mx-auto"
            style={{
                width: '192px',
                height: '192px'
            }}
            width={384}
            height={384}
            id="webgpu-shader"
        />
    );
}