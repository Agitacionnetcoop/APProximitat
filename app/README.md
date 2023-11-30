#APPROXIMITAT README

### INSTALLATION

This guide provides instructions on cloning and running a React Native app on iOS and Android using Xcode and Android Studio. Additionally, it includes information on configuring OneSignal for push notifications. Ensure you have the necessary tools installed before proceeding.

#### Prerequisites

- Node.js
- npm (Node Package Manager)
- Watchman (Optional but recommended)
- React Native CLI (`npm install -g react-native-cli`)
- Xcode (For iOS development)
- Android Studio (For Android development)

#### 1. Clone the repository:

First of all, you need to clone the repository to your local machine. Open a terminal and type the following command:

```bash
git clone https://github.com/Agitacionnetcoop/APProximitat.git
```

#### 2. Install dependencies

Once you have the repository in your local machine, you need to install the dependencies and Pods (iOS). To do so, in the terminal, go to the root folder of the project and type the following command:

```bash
cd app && npm install
```

The command `install` should install dependencies and pods. If pods are not installed properly, navigate to `ios` folder and install the pods:

```bash
cd ios && npm pod install
```

#### 3. OneSignal Configuration

To set up OneSignal for push notifications, follow the instructions on the [official OneSignal documentation](https://documentation.onesignal.com/docs/react-native-sdk-setup).

##### iOS Configuration

Follow the [iOS Push Certificate](https://documentation.onesignal.com/docs/generate-an-ios-push-certificate) guide to generate an iOS Push Certificate for your app.

##### Android Configuration

Follow the [Firebase credentials](https://documentation.onesignal.com/docs/generate-firebase-credentials) Setup guide to generate a Firebase Cloud Messaging API Credentials.

#### 4. Environtment variables

You will need a `.env` file in the root folder of the project with the following variables:

```bash
API_URL=
ONESIGNAL_APP_ID=
```

#### 5. Run on iOS

Go back to the root folder (`app`) and type the following command on your terminal to open iOS simulator:

```bash
npx react-native run-ios
```

This command will build the iOS app and run it in the iOS simulator. Make sure you have Xcode installed and configured properly.

#### 6. Run on Android

Ensure that you have an Android Virtual Device (AVD) configured in Android Studio. Type the following command on your terminal to open iOS simulator:

```bash
npx react-native run-android
```

This command will build the Android app and run it in the Android emulator. Make sure you have Android Studio installed and configured properly.

### Folder structure

Inside the `src` folder you will find the source code of the application. It contains configuration files, global styles, and other files that are directly related to the entire application:

- `/assets`: Holds static assets as fonts and onboarding videos.
- `/components`: Central directory to organize and store React components used throughout the application. This folder is structured to enhance modularity, reusability, and maintainability:

  - `/common`: Contains components that are designed for reuse across various parts of the project.
  - **screen specific folders**: Each screen in the application has its own dedicated folder within the `components` directory. This structure ensures that components specific to a particular screen are organized and easily accessible.
  - `/types`: This directory is dedicated to defining TypeScript types for components.

- `/helpers`: Includes utility functions used across different parts of the application.
- `/hooks`: Holds all the React hooks used in the project.
- `/lib`: Contains a file with local common literals.
- `/services`: Contains modules responsible for interfacing with the API, encompassing functions related to data fetching and authentication.
- `/settings`: This folder holds the `theme` file, which plays a crucial role in defining the global styles for the application.
- `/store`: Within this folder we have a file named `useStore`. This file serves as a store for user-related data, allowing you to manage and persist this information on the device.
