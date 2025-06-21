# Walaa Consumer Portal
 
This module serves for the consumers of Walaa Insurance. Using this portal consumers can login and check the relevent details like list of active and expired insurence details, submitted claims and its status, policy renewal and Policy purchase etc.
This portal will display relevent details in the dashbord with all the notifications.
 
## Features

- **Localization**: The content of the website is handled from a CMS and here in this website based on the language selection (Englist or Arabic) content is fetched and displayed occordingly.

- **React with Typescript**: Typescript enhances React.js app development by adding static typing, enabling early error detection.

- **SASS and SCSS**: Supports theming to allow for easy customization and branding across all pages. This is acheived using Sass(Syntactically Awesome Stylesheet) is a CSS preprocessor that extends CSS with variables, nested rules and mixins, Scss is its newer syntax fully compatible with CSS, making it easy to integrate with existing stylesheets. This simplifies complex stylesheet management and enhances maintainability by enabling modular code and reusability.

- **Custom Hooks**: Implements custom React hooks for common functionality, enhancing code reuse and abstraction.

- **Axios-interceptors**: Interceptors are commonly used in web development to intercept and modify requests and responses. In the context of React and TypeScript, interceptors are implemented, a popular HTTP client, to handle HTTP requests and responses. Whenever we are making HTTP request to backend server.

- **Bootstrap**: Bootstrap includes HTML and CSS based design templates like typography, forms, buttons, tables, navigation, modals, image carousels and many others. Bootstrap has the ability to easily create responsive designs, Bootstrap's responsive CSS adjusts to phones, tablets, and desktops.
 
## Getting Started
 
To start using or contributing to the Shared Module UI, follow these steps:
 
1. **Installation**: Ensure you have Node.js and Yarn installed. Then, run `yarn` in the root directory to install dependencies.

2. **Development**: To start the development server, run `yarn dev`. This will launch the module in development mode with HMR enabled.

3. **Building**: For production builds, use `yarn build`. This will generate optimized assets for deployment.
 
## Adding Test Cases for New Modules
 
When creating a new module within the `@dpm/consumer-portal`, it's crucial to ensure both functionality and robustness through comprehensive testing. This includes writing both positive and negative test cases. Here's a guide to get you started:
 
### Writing Positive Test Cases
 
Positive test cases are designed to test if the module works as expected under normal conditions. For each function or component in your module, consider the following:
 
1. **Identify Expected Behavior**: Clearly define what success looks like for the function or component under test.
2. **Create Test Scenarios**: Write test scenarios that cover all the use cases of the function or component.
3. **Implement Test Cases**: Use your testing framework (e.g., Jest for React components) to implement the test cases.
 
### Writing Negative Test Cases
 
Negative test cases help ensure that your module can gracefully handle invalid input or unexpected situations. For these tests:
 
1. **Identify Failure Conditions**: Determine how the function or component should behave when faced with invalid input or conditions.
2. **Create Test Scenarios**: Write scenarios that intentionally cause the function or component to fail or handle error conditions.
3. **Implement Test Cases**: Use assertions to verify that the function or component behaves as expected in failure scenarios.
 
 
### Setting Up Your Development Environment
 
1. **Fork and Clone the Repository**: Start by forking the repository and then cloning it to your local machine.
 
2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies:
 
```bash
yarn
```
 
3. **Start the Development Server**: To start the development server on port 4200, run:
 
```bash
yarn dev
```
 
This command uses Vite for a fast development experience and opens the project in 'sandbox' mode.
 
### Making Changes
 
- **Follow the Project Structure**: Ensure your changes align with the existing project structure and coding standards.
- **Write and Run Tests**: If you add new features or fix bugs, please write appropriate tests. Run existing tests with:
 
### Submitting Your Contributions
 
1. **Push Your Changes**: After making your changes, push them to your fork.
 
2. **Create a Pull Request**: Submit a pull request (PR) from your fork to the main repository. Provide a clear description of the changes and any relevant issue numbers.
 
3. **Code Review**: Your PR will be reviewed by maintainers. 

## Official Plugins
 
The project uses the following official Vite plugins for React:
 
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) for Babel-based Fast Refresh.
 
For more details on how to use or contribute to the Shared Module UI, please refer to the project documentation.
 