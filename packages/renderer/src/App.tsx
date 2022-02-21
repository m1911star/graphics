import styles from '@/styles/app.module.scss'
import 'tailwindcss/tailwind.css'
import { useState, useEffect } from 'react'
import Renderer from "@/renderer";

const App = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const renderer = new Renderer(canvas);
    renderer.start().then(() => {});
  }, []);
  return (
    <div className={styles.app}>
      <figure className="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
        <canvas className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" width={640} height={640} id="canvas"/>
          <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
            <blockquote>
              <p className="text-lg font-medium">
                “Tailwind CSS is the only framework that I've seen scale
                on large teams. It’s easy to customize, adapts to any design,
                and the build size is tiny.”
              </p>
            </blockquote>
            <figcaption className="font-medium">
              <div className="text-sky-500 dark:text-sky-400">
                Sarah Dayan
              </div>
              <div className="text-slate-700 dark:text-slate-500">
                Staff Engineer, Algolia
              </div>
            </figcaption>
          </div>
      </figure>

    </div>
  )
}

export default App
