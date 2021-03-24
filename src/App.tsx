import './App.scss';
import { Switch, Route, Link } from 'react-router-dom';
import Upload from './Upload';
import Download from './Download';

function App() {
  return (
    <div>
      <header>
        <h1>file.tel</h1>
        <img alt="logo" src="/logo.svg" />
        <p className="is-size-7">
          Simple and secure peer-to-peer file transfer
        </p>
      </header>
      <section>
        <div className="container">
          <Switch>
            <Route path="/:code+" component={Download} />
            <Route path="/" component={Upload} />
          </Switch>
        </div>
      </section>
    </div>
  );
}

export default App;
