import styles from '@/styles/app.module.scss'
import 'tailwindcss/tailwind.css'
import { default as GPUCube } from '@/samples/webgpu/cube';
import { default as GLCube } from '@/samples/webgl/cube';

const App = () => {
  return (
    <div className={styles.app}>
      <GPUCube />
      <GLCube />
    </div>
  );
}

export default App
