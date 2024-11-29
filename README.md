# ChordMaster Monorepo

Welcome to the **ChordMaster Monorepo**, a centralized repository for the ChordMaster app. ChordMaster is a powerful and user-friendly chord sheet application designed for musicians. It allows you to display sheet music, chords, and tabs, providing everything you need for creating and sharing musical compositions.

## Overview

This monorepo uses **pnpm** to manage dependencies and organizes the codebase into multiple packages and apps, each serving a specific purpose.

### Features of ChordMaster

- Display sheet music with aligned chords and lyrics.
- Show chord diagrams and tablature (tabs) for various instruments.
- Support for transposing and editing chord sheets.
- Multiple platform support:
  - **Web**: Built with Remix.
  - **CLI**: A Node.js command-line tool for managing chord sheets.
  - **Mobile**: A React Native Expo app for on-the-go access.

---

## Repository Structure

This repository follows a **pnpm workspace** structure. Below are the primary packages and apps:

### Apps

- **Remix App**:
  - A web application built using [Remix](https://remix.run/).
  - Offers a user-friendly interface for managing and viewing chord sheets.
  - Location: `apps/remix-app/`

- **Node CLI App**:
  - A command-line tool for musicians to manage chord sheets via the terminal.
  - Location: `apps/cli/`

- **React Native Expo App**:
  - A mobile app built with [Expo](https://expo.dev/).
  - Allows users to manage and view chord sheets on their mobile devices.
  - Location: `apps/react-native-app/`

---

## Getting Started

### Prerequisites

1. Install **pnpm** globally:

   ```bash
   npm install -g pnpm
   ```

2. Ensure you have the following tools installed:
   - Node.js (>= 16.x)
   - Git

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/chordmaster.git
    cd chordmaster
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Bootstrap the monorepo:

    ```bash
    pnpm run build
    ```

## Running Each App

1. Remix App:

    ```bash
    cd apps/remix-app
    pnpm dev
    ```

2. Node CLI App:

    ```bash
    cd apps/cli
    pnpm build
    pnpm start
    ```

3. React Native Expo App:

    ```bash
    cd apps/react-native-app
    pnpm start
    ```

## Scripts

Here are the key scripts available in the monorepo:

- `pnpm dev`: Start all apps in development mode.
- `pnpm build`: Build all packages and apps.
- `pnpm lint`: Run lint checks across all packages.
- `pnpm test`: Run tests across all packages.

## Contributing

We welcome contributions to the ChordMaster project! To get started:

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature-name
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Add a feature"
    ```

4. Push to your branch:

    ```bash
    git push origin feature-name
    ```

5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, please feel free to reach out to us via email or open an issue in the repository.

Happy coding!