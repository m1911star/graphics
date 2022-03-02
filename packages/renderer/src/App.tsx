import styles from '@/styles/app.module.scss';
import 'tailwindcss/tailwind.css';
import { default as GPUTriangle } from '@/samples/webgpu/triangle';
import { default as GPUCube } from '@/samples/webgpu/cube';
import { default as GLTriangle } from '@/samples/webgl/triangle';
import { default as GLCube } from '@/samples/webgl/cube';
import Wrapper from '@/wrapper';

const App = () => {
  return (
    <div className={styles.app}>
      <Wrapper>
        <GLCube />
      </Wrapper>
      <Wrapper>
        <GPUCube />
      </Wrapper>
      <Wrapper>
        <GLTriangle />
      </Wrapper>
      <Wrapper>
        <GPUTriangle />
      </Wrapper>
    </div>
  );
};

export default App;
