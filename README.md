# GeoPhoto App

GeoPhoto is a React Native application that lets users capture photos and automatically tag them with geolocation data. This README provides an overview of the application, setup instructions, and usage guidelines.

## Table of Contents

- [GeoPhoto App](#geophoto-app)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Contributing](#contributing)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/hsyndeniz/GeoPhoto.git
   ```

2. Navigate to the project directory:

   ```
   cd GeoPhoto
   ```

3. Install dependencies using yarn:

   ```
   yarn install
   ```

4. Install iOS dependencies using CocoaPods:

   ```
   yarn pod-install
   ```

## Usage

1. Run the Metro Bundler:

   ```
   yarn start
   ```

2. Run the app on Android:

   ```
   yarn android
   ```

3. Run the app on iOS:

   ```
   yarn ios
   ```

## Scripts

Here are some useful scripts available for the project:

- `lint`: Run ESLint to analyze and identify code issues.
- `lint:fix`: Run ESLint with auto-fixing of identified issues.
- `test`: Run Jest tests to ensure code functionality.
- `type-check`: Run TypeScript type checking.
- `test:report`: Run Jest tests with coverage reporting.
- `pod-install`: Install iOS dependencies using CocoaPods.

## Contributing

Contributions to GeoPhoto are welcome! If you find a bug, have an enhancement in mind, or want to contribute in any way, feel free to open an issue or a pull request.
