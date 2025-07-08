# Shared Module
 
This module serves as a shared component library for the Walaa Insurance Digital Transformation project. It leverages React, TypeScript, and Vite to provide a fast and efficient development experience with Hot Module Replacement (HMR) and ESLint rules for code quality.
This can be leveraged across web and mobile applicaiton in same workspace.
 
## Features
 
- **Reusable Components**: Offers a collection of UI components that can be shared across different parts of the project to ensure consistency and reduce duplication.

- **Custom Hooks**: Implements custom React hooks for common functionality, enhancing code reuse and abstraction.

- **Theme Support**: Supports theming to allow for easy customization and branding across all shared components.
 
## Getting Started
 
To start using or contributing to the Shared Module UI, follow these steps:
 
1. **Installation**: Ensure you have Node.js and Yarn installed. Then, run `yarn install` in the root directory to install dependencies.

2. **Development**: To start the development server, run `yarn dev:@dpm/shared-module`. This will launch the module in development mode with HMR enabled.

3. **Building**: For production builds, use `yarn build:@dpm/shared-module`. This will generate optimized assets for deployment.
 
## Adding Test Cases for New Modules
 
When creating a new module within the `@dpm/shared-module`, it's crucial to ensure both functionality and robustness through comprehensive testing. This includes writing both positive and negative test cases. Here's a guide to get you started:
 
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

## Integrations


### Web Application Integration
 1. **Installaion**: First, install `@dpm/shared-module` module as dev dependency in your applicaiton 
 
```javascript
yarn add '@dpm/shared-module';
```

2. **Import Components**: First, import the desired components from the `@dpm/shared-module` into your web application:
 
```javascript
import { Button } from '@dpm/shared-module';
```
 
3. **Utilize the Component**: Use the imported components within your application's components:
 
```jsx
function WebApp() {
  return (
    <div>
      <Button onClick={() => console.log('Button clicked!')}>Click Me</Button>
    </div>
  );
}
```
 
### Mobile Application Integration
 
For mobile applications using React Native:

1. **Installaion**: First, install `@dpm/shared-module` module as dev dependency in your applicaiton 
 
```javascript
yarn add '@dpm/shared-module';
```

2. **Import Components**: Import the components from the `@dpm/shared-module`, ensuring they are compatible with React Native:
 
```javascript
import { Button } from '@dpm/shared-module';
```
 
3. **Utilize the Component**: Incorporate the components into your mobile application:
 
```jsx
import React from 'react';
import { View } from 'react-native';
 
function MobileApp() {
  return (
    <View>
      <Button onPress={() => console.log('Button pressed!')}>Press Me</Button>
    </View>
  );
}
```
 
This guide helps you integrate shared components into different platforms, promoting code reuse and maintaining consistency across your applications.

## Contributing to `@dpm/shared-module`
 
 
### Setting Up Your Development Environment
 
1. **Fork and Clone the Repository**: Start by forking the repository and then cloning it to your local machine.
 
2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies:
 
```bash
yarn
```
 
3. **Start the Development Server**: To start the development server on port 4200, run:
 
```bash
yarn dev:shared-module
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
 