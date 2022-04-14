import React from 'react';
import styles from '@/styles/app.module.scss';
import 'tailwindcss/tailwind.css';
import 'tw-elements';
import { Stage } from './stage';

const App = () => {
  return (
    <div className={styles.app}>
      <Stage />
    </div>
  );
};

export default App;
