import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import App from './examples/basic1'

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  document.getElementById('root')
)
