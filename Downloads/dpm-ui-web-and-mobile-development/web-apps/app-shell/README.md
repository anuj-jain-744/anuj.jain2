# React App Shell

This module serves as the app shell for the website components. It provides the structure and routing for the application, integrating components from various submodules. It leverages React, TypeScript, and Vite to provide a fast and efficient development experience with Hot Module Replacement (HMR). Content for this website is fetched from a separate CMS, allowing clients to update content as needed.

## Features

- **Localization**: The content of the website is handled from a CMS. Based on the language selection (English or Arabic), content is fetched and displayed accordingly.

- **React with TypeScript**: TypeScript enhances React.js app development by adding static typing, enabling early error detection.

- **SASS and SCSS**: Supports theming to allow for easy customization and branding across all pages. This is achieved using Sass (Syntactically Awesome Stylesheet), a CSS preprocessor that extends CSS with variables, nested rules, and mixins. SCSS is its newer syntax fully compatible with CSS, making it easy to integrate with existing stylesheets. This simplifies complex stylesheet management and enhances maintainability by enabling modular code and reusability.

- **Custom Hooks**: Implements custom React hooks for common functionality, enhancing code reuse and abstraction.


- **Bootstrap**: Bootstrap includes HTML and CSS-based design templates like typography, forms, buttons, tables, navigation, modals, image carousels, and many others. Bootstrap's responsive CSS adjusts to phones, tablets, and desktops, enabling easy creation of responsive designs.

## Getting Started

To start using or contributing to the app shell, follow these steps:

1. **Installation**: Ensure you have Node.js and Yarn installed. Then, run `yarn` in the root directory to install dependencies.
2. **Development**: To start the development server, run `yarn dev`. This will launch the module in development mode with HMR enabled.
3. **Building**: For production builds, use `yarn build`. This will generate optimized assets for deployment.

## Adding Test Cases for New Modules

When creating a new module within the app shell, it's crucial to ensure both functionality and robustness through comprehensive testing. This includes writing both positive and negative test cases. Here's a guide to get you started:

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
    