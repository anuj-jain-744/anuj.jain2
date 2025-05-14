import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./App.scss";

/**
 * Renders the main application component.
 * @returns The JSX element representing the application.
 */
function App() {
  return (
    <div className="app-container text-center">
      <h1 className="display-4">
        Welcome to <span>Corporate Portal</span>, Walaa!
      </h1>
      <p className="lead">
        This is a basic template to get you started.<br/> Feel free to start editing
        and make this project your own.
      </p>
    </div>
  );
}

export default App;
