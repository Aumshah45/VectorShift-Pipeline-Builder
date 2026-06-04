import { PipelineToolbar } from './components/PipelineToolbar';
import { PipelineUI } from './components/PipelineUI';
import { SubmitButton } from './components/SubmitButton';

function App() {
  return (
    <div className="vs-app">
      <header className="vs-header">
        <div className="vs-header__brand">
          <span className="vs-header__mark">Vector<span className="vs-header__mark-accent">Shift</span></span>
          <span className="vs-header__divider" />
          <span className="vs-header__eyebrow">Pipeline Builder</span>
        </div>
      </header>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
