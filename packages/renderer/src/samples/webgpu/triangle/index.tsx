import { useEffect } from 'react';
import Renderer from '@/samples/webgpu/triangle/renderer';

export default () => {
  useEffect(() => {
    const canvas = document.getElementById(
      'webgpu-triangle',
    ) as HTMLCanvasElement;
    const renderer = new Renderer(canvas);
    renderer.start().then(() => {});
  }, []);
  return (
    <canvas
      className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
      width={640}
      height={640}
      id="webgpu-triangle"
    />
  );
};
