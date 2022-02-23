import styles from '@/styles/app.module.scss';
import 'tailwindcss/tailwind.css';
import { default as GPUTriangle } from '@/samples/webgpu/triangle';
import { default as GLTriangle } from '@/samples/webgl/triangle';
import { default as GLCube } from '@/samples/webgl/cube';

const App = () => {
  return (
    <div className={styles.app}>
      <GPUTriangle />
      <GLTriangle />
      <GLCube />
    </div>
  );
};

export default App;
