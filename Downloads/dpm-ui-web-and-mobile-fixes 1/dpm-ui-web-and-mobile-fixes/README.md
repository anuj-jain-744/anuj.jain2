# WALAA Digital Transformation Project

Welcome to the WALAA Digital Transformation project, a comprehensive suite that includes both a web application built with React.js and a mobile application developed using React Native. This project leverages module federation to streamline code management and sharing across a unified monorepo structure, ensuring efficient and cohesive development practices.

## Getting Started
To contribute effectively to this project, familiarity with React.js, Bootstrap, SASS, UIMaterialIcon, React Native, Postman, and the monorepo approach is essential.

For a deeper understanding of these concepts, consider exploring the following resources:

- **Monorepo**: [Understanding npm workspaces in a monorepo](https://earthly.dev/blog/npm-workspaces-monorepo/)
- **React**: [Understanding comcepts of React](https://react.dev/learn)
- **Bootstrap**: [Styling Framework](https://rikiphukon.medium.com/how-i-start-my-frontend-projects-ddd3a31390fb)

### Prerequisites
Ensure you have the following tools installed before proceeding:
- nvm 
- node v20.11.1 // or v22.2.0
- yarn 4.1.1
- Visual Studio Code
- Git CLI

### Application Architecture & Codebase Navigation
Our project adopts a modular architecture within a monorepo setup, facilitating seamless code sharing and management across the following main directories:
- `web-app`: Houses the React.js web application.
- `mobile-app`: Contains the React Native mobile application.
- [`Shared-common`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FReact%2Ftemp-app%2Fdpm-ui-web-and-mobile%2Fdpm-ui-web-and-mobile%2FShared-common%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\React\temp-app\dpm-ui-web-and-mobile\dpm-ui-web-and-mobile\Shared-common"): Stores components shared between the web and mobile applications.

### Installation Instructions

To ensure a smooth setup, prefer using Yarn over npm. If you encounter any issues, please open an issue with the appropriate label.

1. Clone the main project repository:
   ```bash
   git clone https://github.walaa.com/WALAA/digital-transformation.git
   ```

2. Clone the Web & Mobile app repository / Git Module:
   ```bash
   git clone https://github.walaa.com/WALAA/dpm-ui-web-and-mobile.git
   ```

3. Navigate to the repository and install dependencies:
   ```bash
   cd repo
   nvm use 22.2.0
   corepack enable
   yarn install
   ```

   Note: The project uses ESBuild for installation. If you encounter any issues, please raise them for team support.

### Starting the Development Server

#### Shared-module

To launch the development server for the shared module, execute:
```bash
yarn dev:shared-module
```

#### Main App

To launch the development server for the App shell, execute:
```bash
yarn
yarn dev:main-app
```

#### Corporate Portal

To launch the development server for the Corporate Portal, execute:
```bash
yarn
yarn dev:corporate-portal
```

#### Consumer Portal

To launch the development server for the Consumer Portal, execute:
```bash
yarn
yarn dev:consumer-portal
```



### Development Guidelines - Best Practices

1. **Commit Messages**: Write clear, concise commit messages that describe the changes made.
2. **Code Style**: Adhere to the established coding standards and conventions.
3. **Testing**: Ensure thorough testing of features and fixes.
4. **Documentation**: Update documentation to reflect code changes accurately.
5. **Image Optimization**: Optimize images to enhance performance.
6. **Error Handling**: Implement robust error handling, including try-catch blocks and meaningful error messages.
7. **Input Validation**: Validate all inputs to prevent security vulnerabilities and ensure code reliability.
8. **Version Control**: Utilize version control systems like Git for efficient codebase management.
9. **Code Reviews**: Participate in code reviews to maintain code quality and facilitate knowledge sharing.
10. **Security**: Avoid hardcoding sensitive data and adhere to security best practices.

### Styling Guidelines
- Avoid inline styles for better maintainability.
- Keep CSS selectors specific yet simple for easier management.