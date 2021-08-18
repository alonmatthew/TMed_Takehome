import './App.css';

import { useRoutes} from 'hookrouter';

// Components
import { Wrapper } from './components/Wrapper';
import { CoreDiabetes } from './components/CoreDiabetes';
import { NotFound } from './components/NotFound';

const routes = {
  '/': () => <CoreDiabetes />
};

function App() {
  const match = useRoutes(routes);
  return (
    <Wrapper>
      { match || <NotFound /> }
    </Wrapper>
  );
};

export default App;
