# Weather Dashboard Refactoring Assignment

## Overview

Welcome to the Weather Dashboard Refactoring Assignment! This project involves a basic weather dashboard application that provides current weather, a 7-day forecast, and historical weather data for a selected city using the Open-Meteo API. The application is built using plain HTML, JavaScript, and custom web components.

The goal of this assignment is to assess your ability to understand existing code, identify areas for improvement, refactor for better structure and readability, and implement new features.

## App Functionality

The Weather Dashboard application currently supports the following features:

- **Search for a City:** Users can search for any city to get the current weather, a 7-day forecast, and historical weather data.
- **Favorites Management:** Users can add cities to their list of favorite cities for quick access.
- **Custom Web Components:** The app uses custom web components (`<weather-info>`, `<weather-forecast>`, `<historical-weather>`) to display weather information.
- **Settings Modal:** Allows users to change settings (like temperature units).

## What You Are Expected to Do

1. **Refactor the Code:**
   - Review the existing codebase and identify areas that could benefit from improved structure, readability, and maintainability.
   - Refactor the code to reduce redundancy, improve modularity, and follow best practices.

2. **Enhance the Application:**
   - **Add New Features:** Introduce at least one new feature to the application (e.g., wind speed display, humidity data, or a dark mode toggle).
   - **Improve Existing Features:** Enhance the functionality of existing features (e.g., allow users to remove cities from their favorites list, improve error handling and user feedback).

3. **Write Unit Tests:**
   - Implement unit tests for key functions or components of the application to ensure their correctness and reliability.
   - You may use any JavaScript testing framework you are comfortable with (e.g., Playwright, Vitest, Jest).

4. **Optimize Performance:**
   - Analyze the app for any performance bottlenecks and optimize where possible (e.g., reduce API calls, optimize DOM manipulation).

5. **Update Documentation:**
   - Update this README file to reflect the changes you have made to the application, including a summary of the refactorings, new features, and instructions for setting up and running tests.

## Evaluation Criteria

Your submission will be evaluated based on the following criteria:

- **Code Quality and Organization:**
  - Is the code well-organized and easy to understand?
  - Are there any unnecessary complexities or redundancies?
  - Does the code follow best practices (e.g., meaningful variable names, proper use of comments)?

- **Refactoring:**
  - How effectively did you refactor the existing code?
  - Did you successfully improve the structure, readability, and maintainability?

- **Feature Implementation:**
  - How effectively did you implement new features or enhance existing ones?
  - Are the new features well-integrated and do they follow the app's design?

- **Testing:**
  - Have you provided adequate test coverage for key functions and components?
  - Are the tests well-written and effective in verifying the functionality?

- **Performance Optimization:**
  - Have you identified and optimized performance bottlenecks in the application?

- **Documentation:**
  - Is the updated README clear and comprehensive?
  - Does it accurately describe the setup, usage, and any changes made to the application?

## Getting Started

In order to get started install the node dependencies and start the Vite.Js dev server.

```bash
npm install
npm run dev
```

Good Luck!
We look forward to seeing your work. If you have any questions or need clarification on the assignment, please feel free to reach out.
