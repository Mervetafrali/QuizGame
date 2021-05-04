# JSB GameService

## Contents

- [1. Introduction](#1-introduction)
- [2. Installation Guide](#2-installation-guide)
  - [Creating a Project in App Gallery Connect](#creating-a-project-in-appgallery-connect)
  - [Configuring the Signing Certificate Fingerprint](#configuring-the-signing-certificate-fingerprint)
  - [React-Native Integration](#react-native-integration)
  - [Cordova Integration](#cordova-integration)
  - [Ionic Integration](#ionic-integration)
    - [Ionic with Cordova Runtime](#ionic-with-cordova-runtime)
    - [Ionic with Capacitor Runtime](#ionic-with-capacitor-runtime)
- [3. API Reference](#3-api-reference)
  - [HMSGameService](#hmsgameservice)
  - [Data Types](#data-types)
  - [ResultCodes](#result-codes)
- [4. Configuration and Description](#4-configuration-and-description)
- [5. Questions or Issues](#5-questions-or-issues)
- [6. Licensing and Terms](#6-licensing-and-terms)

## 1. Introduction

## 2. Installation Guide

### Creating a Project in AppGallery Connect

Creating an app in AppGallery Connect is required in order to communicate with the Huawei services. To create an app, perform the following steps:

**Step 1.** Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) and select **My projects**.

**Step 2.** Select your project from the project list or create a new one by clicking the **Add Project** button.

**Step 3.** Go to **Project Setting** > **General information**, and click **Add app**.
If an app exists in the project and you need to add a new one, expand the app selection area on the top of the page and click **Add app**.

**Step 4.** On the **Add app** page, enter the app information, and click **OK**.

- A signing certificate fingerprint is used to verify the authenticity of an app when it attempts to access an HMS Core service through the HMS Core SDK. Before using HMS Core (APK), you must locally generate a signing certificate fingerprint and configure it in AppGallery Connect. Ensure that the JDK has been installed on your computer.

### Configuring the Signing Certificate Fingerprint

**Step 1.** Go to **Project Setting > General information**. In the **App information** field, click the icon next to SHA-256 certificate fingerprint, and enter the obtained **SHA256 certificate fingerprint**.

**Step 2.** After completing the configuration, click check mark.

### React-Native Integration

**Step 1:** Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) and select **My projects**.

**Step 2:** Find your app project, and click the desired app name.

**Step 3:** Go to **Project Setting** > **General information**. In the **App information** section, click **agconnect-service.json** to download the configuration file.

**Step 4:** Create a React Native project if you do not have one.

**Step 5:** Copy the **agconnect-service.json** file to the **android/app** directory of your React Native project.

**Step 6:** Copy the signature file that generated in [Generating a Signing Certificate](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#3) section, to the android/app directory of your React Native project.

**Step 7:** Check whether the **agconnect-services.json** file and signature file are successfully added to the **android/app** directory of the React Native project.

**Step 8:** Open the **AndroidManifest.xml** file, add the following lines, and replace the value **<app_id>** with the value you found in the **agconnect-services.json** file.

```xml
<application>
...
  <meta-data
    android:name="com.huawei.hms.client.appid"
    android:value="appid=<app_id>" />
</application>
```

**Step 9:** Open the **build.gradle** file in the **android** directory of your React Native project.

- Go to **buildscript** then configure the Maven repository address and agconnect plugin for the HMS SDK.

```groovy
buildscript {
  repositories {
    google()
    jcenter()
    maven { url 'https://developer.huawei.com/repo/' }
  }

  dependencies {
    /*
      * <Other dependencies>
      */
    classpath 'com.huawei.agconnect:agcp:1.4.2.301'
  }
}
```

- Go to **allprojects** then configure the Maven repository address for the HMS SDK.

```groovy
allprojects {
  repositories {
    /*
      * <Other repositories>
      */
    maven { url 'https://developer.huawei.com/repo/' }
  }
}
```

**Step 10:** Open the **build.gradle** file in the **android/app** directory of your React Native project.

- Package name must match with the **package_name** entry in **agconnect-services.json** file.

```groovy
defaultConfig {
  applicationId "<package_name>"
  minSdkVersion 19
  /*
   * <Other configurations>
   */
}
```

```groovy
android {
  /*
   * <Other configurations>
   */

  signingConfigs {
    config {
      storeFile file('<keystore_file>.jks')
      storePassword '<keystore_password>'
      keyAlias '<key_alias>'
      keyPassword '<key_password>'
    }
  }

  buildTypes {
    debug {
      signingConfig signingConfigs.config
    }
    release {
      signingConfig signingConfigs.config
      minifyEnabled enableProguardInReleaseBuilds
      ...
    }
  }
}
```

**Step 11:** Open the **build.gradle** file in the **android/app** directory of your React Native project.

- Configure build dependencies.

```groovy
buildscript {
  ...
  dependencies {
    /*
    * <Other dependencies>
    */
    implementation ('com.huawei.hms:rn-adapter:5.2.0.300'){
        exclude group: 'com.facebook.react'
    }
    ...
  }
}
```

**Step 12:** Import the following class to the **MainApplication.java** file of your project.

```java
import com.huawei.hms.jsb.adapter.rn.RnJSBReactPackage;
```

Then, add the **RnJSBReactPackage()** to your **getPackages** method. In the end, your file will be similar to the following:

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new RnJSBReactPackage()); // <-- Add this line
    return packages;
}
...
```

**Step 13:** Download js-sdk using command below.

```bash
npm i @hmscore/hms-js-gameservice
```

**Step 14:** Import **HMSGameService** in App.js as following line. 

```js
import HMSGameService from "@hmscore/hms-js-gameservice";
```

**Step 15:** First you have to call the init function.

```js
import {NativeModules, DeviceEventEmitter} from "react-native";
...
HMSGameService.init(NativeModules, DeviceEventEmitter);
```

**Step 16:** Run your project.

- Run the following command to the project directory.

```bash
react-native run-android
```

### Cordova Integration

**Step 1:** Install Cordova CLI if haven't done before.

```bash
npm install -g cordova
```

**Step 2:** Create a new Cordova project or use the existing one.

- To create new Cordova project, you can use **`cordova create path [id [name [config]]] [options]`** command. For more details please follow [CLI Reference - Apache Cordova](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-create-command).

**Step 3:** Update the widget **`id`** property which is specified in the **`config.xml`** file. It must be same with **package_name** value of the **`agconnect-services.json`** file.

**Step 4:** Add the **Android platform** to the project if haven't done before.

```bash
cordova platform add android
```

**Step 5:** Download plugin using command below.

```bash
cordova plugin add @hmscore/hms-js-gameservice
```

**Step 6:** Copy **`agconnect-services.json`** file to **`<project_root>/platforms/android/app`** directory.

**Step 7:** Add **`keystore(.jks)`** and **`build.json`** files to your project's root directory.

- You can refer to 3rd and 4th steps of [Generating a Signing Certificate](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#2) Codelab tutorial page for generating keystore file.

- Fill **`build.json`** file according to your keystore information. For example:

  ```json
  {
    "android": {
      "debug": {
        "keystore": "<keystore_file>.jks",
        "storePassword": "<keystore_password>",
        "alias": "<key_alias>",
        "password": "<key_password>"
      },
      "release": {
        "keystore": "<keystore_file>.jks",
        "storePassword": "<keystore_password>",
        "alias": "<key_alias>",
        "password": "<key_password>"
      }
    }
  }
  ```
```

**Step 8:** Import the following class to the **MainActivity.java** file of your project. You can find this file in **`platforms/android/app/src/main/java/<your_package_name>`** directory.

​```java
import com.huawei.hms.jsb.adapter.cordova.CordovaJSBInit;
```

**Step 9:** In the same file, add **CordovaJSBInit.initJSBFramework(this)** line after the **super.onCreate(savedInstanceState)** method call.

- In the end, your file will be similar to the following:

```java
  ...

  import com.huawei.hms.jsb.adapter.cordova.CordovaJSBInit;

  public class MainActivity extends CordovaActivity
  {
      @Override
      public void onCreate(Bundle savedInstanceState)
      {
          super.onCreate(savedInstanceState);
          CordovaJSBInit.initJSBFramework(this);

          ...
      }
      ...
  }
```
```

**Step 10:** Open the **AndroidManifest.xml** file, add the following lines, and replace the value **<app_id>** with the **app_id** value that can be found in the **agconnect-services.json** file.

​```xml
<application>
...
     <meta-data
            android:name="com.huawei.hms.client.appid"
            android:value="appid=<app_id>" />
</application>
```

**Step 11:** Run the app

```bash
cordova run android
```

### Ionic Integration

Install Ionic CLI and other required tools if haven't done before.

```bash
npm install -g @ionic/cli cordova-res native-run
```

#### Ionic with Cordova Runtime

**Step 1:** Enable the **Cordova integration** if haven't done before.

```bash
ionic integrations enable cordova
```

**Step 2:** Update the widget **`id`** property which is specified in the **`config.xml`** file. It must be same with **package_name** value of the **`agconnect-services.json`** file.

**Step 3:** Add the **Android platform** to the project if haven't done before.

```bash
ionic cordova platform add android
```

**Step 4:** Install `HMS Game Service Plugin` to the project.

```bash
ionic cordova plugin add @hmscore/hms-js-gameservice
```

**Step 5:** Copy **`agconnect-services.json`** file to **`<project_root>/platforms/android/app`** directory.

**Step 6:** Add **`keystore(.jks)`** and **`build.json`** files to your project's root directory.

- You can refer to 3rd and 4th steps of [Generating a Signing Certificate](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#2) Codelab tutorial page for generating keystore file.

- Fill **`build.json`** file according to your keystore information. For example:

```json
{
  "android": {
    "debug": {
      "keystore": "<keystore_file>.jks",
      "storePassword": "<keystore_password>",
      "alias": "<key_alias>",
      "password": "<key_password>"
    },
    "release": {
      "keystore": "<keystore_file>.jks",
      "storePassword": "<keystore_password>",
      "alias": "<key_alias>",
      "password": "<key_password>"
    }
  }
}
```

**Step 7:** Import the following class to the **MainActivity.java** file of your project. You can find this file in **`platforms/android/app/src/main/java/<your_package_name>`** directory.

```java
import com.huawei.hms.jsb.adapter.cordova.CordovaJSBInit;
```

**Step 8:** In the same file, add **CordovaJSBInit.initJSBFramework(this)** line after the **super.onCreate(savedInstanceState)** method call.

- In the end, your file will be similar to the following:

```java
...

import com.huawei.hms.jsb.adapter.cordova.CordovaJSBInit;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        CordovaJSBInit.initJSBFramework(this);

        ...
    }
    ...
}
```

**Step 9:** Open the **AndroidManifest.xml** file, add the following lines, and replace the value **<app_id>** with the **app_id** value that can be found in the **agconnect-services.json** file.

```xml
<application>
...
  <meta-data
    android:name="com.huawei.hms.client.appid"
    android:value="appid=<app_id>" />
</application>
```

**Step 10:** Run the application.

```bash
ionic cordova run android --device
```

#### Ionic with Capacitor Runtime

**Step 1:** Enable the **Capacitor integration** if haven't done before.

```bash
ionic integrations enable capacitor
```

**Step 2:** Initialize **Capacitor** if haven't done before.

```bash
npx cap init [appName] [appId]
```

- For more details please follow [Initialize Capacitor with your app information](https://capacitorjs.com/docs/getting-started/with-ionic#initialize-capacitor-with-your-app-information).

**Step 3:** Update the **`appId`** property which is specified in the **`capacitor.config.json`** file according to your project. It must be same with **package_name** value of the **`agconnect-services.json`** file.

**Step 4:** Install `HMS Game Service plugin` to the project.

```bash
npm install @hmscore/hms-js-gameservice
```

**Step 5:** Build Ionic app to generate resource files.

```bash
ionic build
```

**Step 6:** Add the **Android platform** to the project.

```bash
npx cap add android
```

**Step 7:** Copy **`keystore(.jks)`** and **`agconnect-services.json`** files to **`<project_root>/android/app`** directory.

- You can refer to 3rd and 4th steps of [Generating a Signing Certificate](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#2) Codelab tutorial page for generating keystore file.

**Step 8:** Open the **`build.gradle`** file in the **`<project_root>/android/app`** directory.

- Add `signingConfigs` entry to the **android** section and modify it according to your keystore.

- Enable `signingConfig` configuration for **debug** and **release** flavors.

```groovy
...

android {

    ...

    // Modify signingConfigs according to your keystore
    signingConfigs {
        config {
            storeFile file('<keystore_file>.jks')
            storePassword '<keystore_password>'
            keyAlias '<key_alias>'
            keyPassword '<key_password>'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.config // Enable signingConfig for debug flavor
        }
        release {
            signingConfig signingConfigs.config // Enable signingConfig for release flavor
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

...
```

- Add **apply plugin:'com.huawei.agconnect** to top of your build gradle file in the **`<project_root>/android/app`** directory.

**Step 9:** Open the **`build.gradle`** file in the **`<project_root>/android`** directory. Add **Huawei's maven repositories** and **agconnect classpath** to the file.

```groovy
buildscript {
    repositories {
        /*
            <Other repositories>
        */
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        /*
            <Other dependencies>
        */
        classpath 'com.huawei.agconnect:agcp:1.4.2.301'
    }
}

/*
    <Other build.gradle entries>
*/

allprojects {
    repositories {
        /*
            <Other repositories>
        */
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```

**Step 10:** Import the following class to the **MainActivity.java** file of your project. You can find this file in **`android/app/src/main/java/<your_package_name>`** directory.

```java
import com.huawei.hms.js.gameservice.HMSGameService;
```

**Step 11:** In the same file, add **add(HMSGameService.class);** line to the **ArrayList**.

- In the end, your file will be similar to the following:

  ```java
  ...
  import com.huawei.hms.js.gameservice.HMSGameService;
  public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
        add(HMSGameService.class);
    }});
  }
  ...
  ```

**Step 12:** Open the **AndroidManifest.xml** file, add the following lines, and replace the value **<app_id>** with the **app_id** value that can be found in the **agconnect-services.json** file.

```xml
<application>
...
     <meta-data
            android:name="com.huawei.hms.client.appid"
            android:value="appid=<app_id>" />
</application>
```

**Step 13:** Updates dependencies, and copy any web assets to your project.

```bash
npx cap sync
```

**Step 14:** Open the project in Android Studio and run it.

```bash
npx cap open android
```

## 3. API Reference

### **HMSGameService**

#### Public Method Summary

| Method                                                       | Return Type                                                  | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [signIn](#signIn)                                            | Promise<Result\<void>>                                       | This API allows you to log in for the huawei game service.   |
| [silenSignIn](#silenSignIn)                                  | Promise<Result\<void>>                                       | The silentSignIn method allows users to use the same HUAWEI ID without authorization for subsequent sign-ins. |
| [signOut](#signout)                                          | Promise<Result\<void>>                                       | This API allows you to log out for the huawei game service.  |
| [isShowBuoy](#isShowBuoy)                                    | Promise<Result\<void>>                                       | Displays the floating window.                                |
| [getCurrentPlayer](#getCurrentPlayer)                        | [Promise<Result\<Player>>](#player)                          | Obtains the object of the current player.                    |
| [getCachePlayerId()](#getCachePlayerId)                      | Promise<Result\<String>>                                     | Obtains the locally cached player ID of the current player.  |
| [getCachePlayer()](#getCachePlayer)                          | [Promise<Result\<Player>>](#player)                          | Obtains the locally cached player information of the current player. |
| [getAchievementsIntent()](#getAchievementsIntent)            | Promise<Result\<void>>                                       | Obtains the list of all game achievements of the current player. |
| [incrementAchievement(achievementId,numSteps)](#incrementAchievementachievementIdnumSteps) | Promise<Result\<void>>                                       | Asynchronously increases an achievement by the given number of steps. |
| [incrementAchievementImmediate(achievementId,numSteps)](#incrementAchievementImmediateachievementIdnumSteps) | Promise<Result\<Boolean>>                                    | Synchronously increases an achievement by the given number of steps. |
| [loadAchievementList(forceLoad)](#loadAchievementListforceload)       | [Promise<Result\<List\<Achievement>>>](#Achievement)         | Obtains the list of achievements in all statuses for the current player. |
| [eventIncrement(eventId,incrementAmount)](#eventIncrement)   | Promise<Result\<void>>                                       | Submits the event data of the current player.                |
| [revealAchievement(achievementId)](#revealAchievementachievementid)       | Promise<Result\<void>>                                       | Asynchronously reveals a hidden achievement to the current player. |
| [revealAchievementImmediate(achievementId)](#revealAchievementImmediate) | Promise<Result\<void>>                                       | Synchronously reveals a hidden achievement to the current player. |
| [setAchievementSteps(achievementId,numSteps)](#setAchievementStepsachievementidnumsteps) | Promise<Result\<void>>                                       | Asynchronously sets an achievement to have the given number of steps completed. |
| [setAchievementStepsImmediate(achievementId,numSteps)](#setAchievementStepsImmediate) | Promise<Result\<Boolean>>                                    | Synchronously sets an achievement to have the given number of steps completed. |
| [unlockAchievement(achievementId)](#unlockAchievement)       | Promise<Result\<void>>                                       | Asynchronously unlocks an achievement for the current player. |
| [unlockAchievementImmediate(achievementId)](#unlockAchievementImmediate) | Promise<Result\<void>>                                       | Synchronously unlocks an achievement for the current player. |
| [loadEventList(forceReload, eventIds)](#loadEventList)       | [Promise<Result\<List\<Event>>>](#Event)                     | Obtains all event data of the current player with ID or without ID. |
| [getAllRankingsIntent()](#getAllRankingsIntent)              | Promise<Result\<void>>                                       | Obtains the Intent object of the leaderboard list page.      |
| [getRankingByTimeIntent(rankingId,timeDimension)](#getRankingByTimeIntent) | Promise<Result\<void>>                                       | Obtains the Intent object of the page for a specified leaderboard in a specified time frame. |
| [getRankingIntent(rankingId)](#getRankingByTimeIntent)       | Promise<Result\<void>>                                       | Obtains the Intent object of the page for a specified leaderboard in all time frames. |
| [loadTopScorePage(rankingId,timeDimension, maxResults,offsetPlayerRank,pageDirection)](#loadTopScorePage) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains the scores on the first page of a leaderboard from Huawei game server. |
| [loadTopScore(rankingId,timeDimension, maxResults,isRealTime)](#loadTopScore) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains scores on the first page of a leaderboard. The data can be obtained from the local cache. |
| [submitScore(rankingId,score)](#submitScore)                 | Promise<Result\<void>>                                       | Asynchronously submits the score of the current player without a custom unit. |
| [submitScoreTag(rankingId,score,scoreTips)](#submitScoreTag) | Promise<Result\<void>>                                       | Asynchronously submits the score of the current player with a custom unit. |
| [submitScoreImmediate(rankingId,score)](#submitScoreImmediate) | [Promise<Result\<ScoreSubmissionInfo>>](#ScoreSubmissionInfo) | Synchronously submits the score of the current player without a custom unit. |
| [submitScoreImmediateTag(rankingId,score,scoreTips)](#submitScoreImmediateTag) | [Promise<Result\<ScoreSubmissionInfo>>](#ScoreSubmissionInfo) | Synchronously submits the score of the current player with a custom unit. |
| [getRankingsSwitchStatus()](#getRankingsSwitchStatus)        | Promise<Result\<Number>>                                     | Obtains the current player's leaderboard switch setting.     |
| [setRankingsSwitchStatus(status)](#setRankingsSwitchStatusstatus) | Promise<Result\<Number>>                                     | Sets the leaderboard switch for the current player.          |
| [getCurrentGameMetadata()](#getCurrentGameMetadata)          | [Promise<Result\<GameSummary>>](#GameSummary)                | Obtains the information about the current game from the local cache. |
| [loadGameMetadata()](#loadGameMetadata)                      | [Promise<Result\<GameSummary>>](#GameSummary)                | Obtains the information about the current game from Huawei game server. If the obtaining fails, the information will then be obtained from the local cache. |
| [loadGamePlayerStats(isRealTime)](#loadGamePlayerStats)      | [Promise<Result\<GamePlayerStatistics>>](#GamePlayerStatistics) | Obtains the statistics of the current player, such as the session duration and rank. |
| [loadCurrentPlayerRankingScore(rankingId,timeDimension)](#loadCurrentPlayerRankingScorerankingidtimedimension) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains the score of a player on a specified leaderboard in a specified time frame. |
| [loadRankingMetadata(rankingId,isRealTime)](#loadRankingMetadata) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains the data of a leaderboard. The data can be obtained from the local cache. |
| [loadRankingsMetadata(isRealTime)](#loadRankingsMetadata)    | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains all leaderboard data. The data can be obtained from the local cache. |
| [loadMoreScores(rankingId,offsetPlayerRank,maxResults, pageDirection,timeDimension)](#loadMoreScoresrankingIdoffsetPlayerRankmaxResultspageDirectiontimeDimension) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains scores on a leaderboard in a specified time frame in pagination mode. |
| [loadPlayerCenteredPageScores(rankingId,timeDimension,maxResults,offsetPlayerRank, pageDirection)](#loadPlayerCenteredPageScoresrankingIdtimeDimensionmaxResultsoffsetPlayerRankpageDirection) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains scores of a leaderboard with the current player's score displayed in the page center from Huawei game server. |
| [loadPlayerCenteredScores(rankingId,timeDimension,maxResults, isRealTime)](#loadPlayerCenteredScoresrankingIdtimeDimensionmaxResultsisRealTime) | [Promise<Result\<RankingScores>>](#RankingScores)            | Obtains scores of a leaderboard with the current player's score displayed in the page center. The data can be obtained from the local cache. |
| [getPlayerExtraInfo(transactionId)](#getPlayerExtraInfotransactionid)     | [Promise<Result\<PlayerExtraInfo>>](#PlayerExtraInfo)        | Obtains the additional information about a player.           |
| [submitPlayerEvent(playerId,eventId,eventType)](#submitPlayerEventplayerIdeventIdeventType) | Promise<Result\<String>>                                     | Reports player behavior events.                              |
| [savePlayerInfo(rank, role, area, sociaty, playerId, openId)](#savePlayerInforankroleareasociatyplayerIdopenId) | Promise<Result\<String>>                                        | Saves the information about the player in the current game.  |
| [checkGameServiceLite()](#checkGameServiceLite)              | Promise<Result\<void>>                                       | Checks game service.                                         |
| [checkMobile(checkWithOpenId, mobile, gameAppId, playerId, ts, transactionId, inputSign)](#checkMobilecheckWithOpenId-mobile-gameAppId-playerId-ts-transactionId-inputSign)                                | Promise<Result\<void>>                                       |                                                              |
| [cancelGameService()](#cancelGameService)                    | Promise<Result\<Boolean>>                                    | Revokes the authorization to HUAWEI Game Service.            |
| [getPlayerRestTime(transactionId)](#getPlayerRestTime)       | Promise<Result\<String>>                                     | Returns player real name                                     |

### 3.1.2 Public Methods

#### signIn()

| Return Type            | Description                                 |
| ---------------------- | ------------------------------------------- |
| Promise<Result\<void>> | Returns object containing login information |

Call Example

```js
HMSGameService.signIn()
    .then((res) =>{console.log(JSON.stringify(res))})    
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### signOut()

| Return Type            | Description                                  |
| ---------------------- | -------------------------------------------- |
| Promise<Result\<void>> | Returns object containing logout information |

Call Example

```js
HMSGameService.signOut()
    .then((res) =>{console.log(JSON.stringify(res))})    
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### silenSignIn ()

| Return Type            | Description                                  |
| ---------------------- | -------------------------------------------- |
| Promise<Result\<void>> | Returns object containing sign in information |

Call Example

```js
HMSGameService.silenSignIn()
    .then((res) =>{console.log(JSON.stringify(res))})    
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### isShowBuoy()

| Return Type            | Description                   |
| ---------------------- | ----------------------------- |
| Promise<Result\<void>> | Displays the floating window. |

Call Example

```js
HMSGameService.isShowBuoy()
     .then((res) =>{console.log(JSON.stringify(res))})
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### getCurrentPlayer()

| Return Type              | Description                         |
| ------------------------ | ----------------------------------- |
| Promise<Result\<Player>> | Returns the details about a player. |

Call Example

```js
HMSGameService.getCurrentPlayer()
     .then((player) => {console.log(JSON.stringify(player))})     
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### getCachePlayerId()

| Return Type              | Description               |
| ------------------------ | ------------------------- |
| Promise<Result\<string>> | ID of a player in a game. |

Call Example

```js
HMSGameService.getCachePlayerId()
     .then((player) => {console.log(JSON.stringify(player))})
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### getCachePlayer()

| Return Type              | Description               |
| ------------------------ | ------------------------- |
| Promise<Result\<Player>> | ID of a player in a game. |

Call Example

```js
HMSGameService.getCachePlayer()
     .then((player) => {console.log(JSON.stringify(player))})     
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### getAchievementsIntent()

| Return Type            | Description                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Promise<Result\<void>> | Intent object containing the achievement list. An app can call the startActivityForResult method to access the achievement list. |

Call Example

```js
HMSGameService.getAchievementsIntent()
     .then((res) =>{console.log(JSON.stringify(res))})    
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### incrementAchievement(achievementId,numSteps)

| Parameter     | Type   | Description                                                        |
| ------------- | ------ | ------------------------------------------------------------------ |
| achievementId | string | ID of the achievement requiring step increase.                     |
| numSteps      | number | Number of steps to be increased. The value must be greater than 0. |

| Return Type            | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Promise<Result\<void>> | Asynchronously increases an achievement by the given number of steps. |

Call Example

```js
HMSGameService.getAchievementsIntent()
     .then((res) =>{console.log(JSON.stringify(res))})
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### incrementAchievementImmediate(achievementId,numSteps)

| Parameter     | Type   | Description                                                        |
| ------------- | ------ | ------------------------------------------------------------------ |
| achievementId | string | ID of the achievement requiring step increase.                     |
| numSteps      | number | Number of steps to be increased. The value must be greater than 0. |

| Return Type               | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Promise<Result\<boolean>> | true if the execution is successful; false if the API call is successful but the execution fails. If false is returned, ensure that the achievement ID and number of steps to be increased are correct. |

Call Example

```js
const achievementId = "958D2546B5663BE6D439A7A2C505422127CB661952D**********"
const numSteps = 1
HMSGameService.incrementAchievementImmediate(achievementId,numSteps)
     .then((res) =>{console.log(JSON.stringify(res))})
     .catch((err) =>{console.log(JSON.stringify(err))})
```

#### loadAchievementList(forceLoad)

| Parameter | Type    | Description                                                                                             |
| --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| forceLoad | boolean | Indicates whether to obtain the achievement list from the server or client. The options are as follows:true: server false: client |

| Return Type                                     | Description                 |
| ----------------------------------------------- | --------------------------- |
| [Promise<Result\<Achievement[]>>](#Achievement) | Return a Achievement array. |

Call Example

```js
const forceReload = true
HMSGameService.loadAchievementList(forceReload)   
    .then((res) =>{console.log(JSON.stringify(res))})    
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### eventIncrement(eventId,incrementAmount)

| Parameter       | Type   | Description                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------- |
| eventId         | string | ID of the event to be submitted. The value is obtained after you configure the event. |
| incrementAmount | number | Increment amount of the existing event value.                                         |

| Return Type            | Description         |
| ---------------------- | ------------------- |
| Promise<Result\<void>> | Submits event data. |

Call Example

```js
const eventId = "E5E02A4A2D6A0C36C45A77CDF11D24D785C030ABE49A*********"
const growAmount = 1
HMSGameService.eventIncrement(eventId, growAmount)
    .then((res) =>{console.log(JSON.stringify(res))})
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### revealAchievement(achievementId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| achievementId | string | ID of the achievement to be revealed. |

| Return Type            | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| Promise<Result\<void>> | Asynchronously reveals a hidden achievement of a game. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
HMSGameService.revealAchievement(achievementId)
    .then((res) =>{console.log(JSON.stringify(res))})
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### revealAchievementImmediate(achievementId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| achievementId | string | ID of the achievement to be revealed. |

| Return Type            | Description                                         |
| ---------------------- | --------------------------------------------------- |
| Promise<Result\<void>> | Immediately reveals a hidden achievement of a game. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
HMSGameService.revealAchievementImmediate(achievementId)
    .then((res) =>{console.log(JSON.stringify(res))})
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### setAchievementSteps(achievementId,numSteps)

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| achievementId | string | ID of the achievement requiring step setting.                |
| numSteps      | number | Number of steps to be set. The value must be greater than 0. |

| Return Type            | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Promise<Result\<void>> | Asynchronously sets the number of completed steps of an achievement. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
var numSteps = 3;
HMSGameService.setAchievementSteps(achievementId, numSteps)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### setAchievementStepsImmediate(achievementId,numSteps)

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| achievementId | string | ID of the achievement requiring step setting.                |
| numSteps      | number | Number of steps to be set. The value must be greater than 0. |

| Return Type               | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Promise<Result\<boolean>> | true if the execution is successful; false if the API call is successful but the execution fails. If false is returned, ensure that the achievement ID and number of steps to be increased are correct. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
var numSteps = 3;
HMSGameService.setAchievementSteps(achievementId, numSteps)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### unlockAchievement(achievementId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| achievementId | string | ID of the achievement to be unlocked. |

| Return Type            | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Promise<Result\<void>> | Asynchronously unlocks an achievement for the current player. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
HMSGameService.unlockAchievement(achievementId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### unlockAchievementImmediate(achievementId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| achievementId | string | ID of the achievement to be unlocked. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Promise<Result\<void>> | Immediately unlocks an achievement for the current player. |

Call Example

```js
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
HMSGameService.unlockAchievementImmediate(achievementId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))})
```

#### loadEventList(forceReload, eventIds)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| achievementId | string | Indicates whether to load the event list stored on the server or cached locally. The options are as follows: true: server false: local cache |
| eventIds | string[] | IDs of the events to be obtained. The value is a string array. |

| Return Type                         | Description            |
| ----------------------------------- | ---------------------- |
| [Promise<Result\<Event[]>>](#Event) | Return an Event array. |

Call Example

```js
const forceReload = true;
const achievementId ="958D2546B5663BE6D439A7A2C505422127CB661952D356**********"
HMSGameService.loadEventList(forceReload, eventId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))})   
```

#### getAllRankingsIntent()

| Return Type            | Description                     |
| ---------------------- | ------------------------------- |
| Promise<Result\<void>> | Intent object of a leaderboard. |

Call Example

```js
HMSGameService.getAllRankingsIntent()
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### getRankingByTimeIntent()

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| rankingId     | string | ID of a leaderboard for which data is to be obtained.        |
| timeDimension | number | Time frame. The options are as follows: 0: The daily leaderboard is obtained. 1: The weekly leaderboard is obtained. 2: The all-time leaderboard is obtained. |

| Return Type            | Description                                 |
| ---------------------- | ------------------------------------------- |
| Promise<Result\<void>> | Intent object of the leaderboard list page. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const timeDimension = 1;
HMSGameService.getRankingByTimeIntent(rankingId, timeDimension)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### getRankingIntent(rankingId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |

| Return Type            | Description                     |
| ---------------------- | ------------------------------- |
| Promise<Result\<void>> | Intent object of a leaderboard. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
HMSGameService.getRankingIntent(rankingId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadTopScorePage(rankingId,timeDimension, maxResults,offsetPlayerRank,pageDirection)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| timeDimension | number | Time frame. The options are as follows: 0: daily 1: weekly 2: all-time |
| maxResults | number | Maximum number of records on each page. The value is an number ranging from 1 to 21. |
| offsetPlayerRank | number | IRank specified by offsetPlayerRank. Then one page of scores before or after (specified by pageDirection) a rank will be loaded. The value of offsetPlayerRank must be 0 or a positive number. |
| pageDirection | number | Data obtaining direction. Currently, only the value 0 is supported, indicating that data of the next page is obtained. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<RankingScores>>](#RankingScores) | Scores on the first page of a leaderboard.|

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const timeDimension = 2;
const maxResults = 20;
const offsetPlayerRank = 0;
const pageDirection = 0;
HMSGameService.loadTopScorePage(
rankingId,
    timeDimension,
    maxResults,
    offsetPlayerRank,
    pageDirection
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadTopScore(rankingId,timeDimension, maxResults,isRealTime)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| timeDimension | number | Time frame. The options are as follows: 0: daily1: weekly2: all-time |
| maxResults | number | Maximum number of records on each page. The value is an number ranging from 1 to 21. |
| isRealTime | boolean | Indicates whether to obtain leaderboard data from Huawei game server. The options are as follows:true: Obtain data from Huawei game server. false: Obtain data from the local cache.|

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<RankingScores>>](#RankingScores) | Scores on the first page of a leaderboard.|

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const timeDimension = 2;
const maxResults = 20;
const isRealTime = true;
HMSGameService.loadTopScore(
    rankingId,
    timeDimension,
    maxResults,
    isRealTime
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### submitScore(rankingId,score)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| score | number | Score of the current player. |

| Return Type            | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Promise<Result\<void>> | Asynchronously submits the score of the current player without a custom unit. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const score = 20
HMSGameService.submitScore(rankingId, score)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### submitScoreTag(rankingId,score,scoreTips)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| score | number | Score of the current player. |
| scoreTips | number | Score custom unit. Only letters, digits, underscores (_), and hyphens (-) are supported. |

| Return Type            | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Promise<Result\<void>> | Asynchronously submits the score of the current player with a custom unit. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const score = 10;
const scoreTips = "scoreTips";
HMSGameService.submitScoreTag(rankingId, score, scoreTips)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### submitScoreImmediate(rankingId,score)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| score | number | Score of the current player. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<ScoreSubmissionInfo>>](#ScoreSubmissionInfo) | Score submission result. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const score = 10;
HMSGameService.submitScoreImmediate(rankingId, score)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### submitScoreImmediateTag(rankingId,score,scoreTips)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| score | number | Score of the current player. |
| scoreTips | number | Score custom unit. Only letters, digits, underscores (_), and hyphens (-) are supported. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<ScoreSubmissionInfo>>](#ScoreSubmissionInfo) | Score submission result. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const score = 100;
const scoreTips = "scoreTips";
HMSGameService.submitScoreImmediateTag(
  rankingId,
  score,
  scoreTips
)
    .then((res) => {console.log(JSON.stringify(res))})
    .catch((err) => {console.log(JSON.stringify(err))})
```

#### getRankingsSwitchStatus()

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<number>> | Leaderboard switch setting. The setting is returned asynchronously and has the following options: 0: off 1: no |

Call Example

```js
 HMSGameService.getRankingsSwitchStatus()
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### setRankingsSwitchStatus(status)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| status | number | Status of the leaderboard switch to be set. 0: off 1: no |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<number>> | Leaderboard switch setting. The setting is returned asynchronously and has the following options: 0: off 1: no |

Call Example

```js
const status = 0 
HMSGameService.setRankingsSwitchStatus(status)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### getCurrentGameMetadata()

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<GameSummary>>](#GameSummary) | A GameSummary object that contains the information about the current game. |

Call Example

```js
HMSGameService.getCurrentGameMetadata()
    .then((res) => {console.log(JSON.stringify(res))})
    .catch((err) => {console.log(JSON.stringify(err))})
```

#### loadGameMetadata()

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<GameSummary>>](#GameSummary) | Information about the current game. |

Call Example

```js
HMSGameService.loadGameMetadata()
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadGamePlayerStats(isRealTime)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| isRealTime | number | Indicates whether to obtain data from Huawei game server. The options are as follows: true: Obtain data from Huawei game server false: Obtain data from the local cache. Data is kept in the local cache for 5 minutes. If there is no local cache or the cache times out, data will be obtained from the game server. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<GamePlayerStatistics>>](#GamePlayerStatistics) | Statistics of the current player. |

Call Example

```js
const isRealTime = true
HMSGameService.loadGamePlayerStats(isRealTime)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadCurrentPlayerRankingScore(rankingId,timeDimension)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| timeDimension | number |Time frame. The options are as follows: 0: The daily leaderboard is obtained. 1: The weekly leaderboard is obtained. 2: The all-time leaderboard is obtained. |

| Return Type                                       | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| [Promise<Result\<RankingScores>>](#RankingScores) | Score of a player on a leaderboard, which is obtained from the RankingScores object that is returned. |

Call Example

```js
const timeDimension = 2;
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
HMSGameService.loadCurrentPlayerRankingScore(
    rankingId,
    timeDimension
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadRankingMetadata(rankingId,isRealTime)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string | ID of a leaderboard for which data is to be obtained. |
| isRealTime | number |Indicates whether to obtain leaderboard data from Huawei game server. The options are as follows: true: Obtain data from Huawei game server. false: Obtain data from the local cache. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<RankingScore>>](#RankingScore) | Data of the current leaderboard. |

Call Example

```js
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
const isRealTime = "true";
HMSGameService.loadRankingMetadata(
    rankingId,
    isRealTime
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadRankingsMetadata(isRealTime)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| isRealTime | number |Indicates whether to obtain leaderboard data from Huawei game server. The options are as follows: true: Obtain data from Huawei game server. false: Obtain data from the local cache. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<RankingScore>>](#RankingScore) | Data of the current leaderboard. |

Call Example

```js
const isRealTime = "true";
HMSGameService.loadRankingsMetadata(isRealTime)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadMoreScores(rankingId,offsetPlayerRank,maxResults,pageDirection,timeDimension)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string |ID of a leaderboard for which data is to be obtained. |
| offsetPlayerRank | number |Rank specified by offsetPlayerRank. Then one page of scores before or after (specified by pageDirection) a rank will be loaded. |
| maxResults | number |Maximum number of records on each page. The value is an number ranging from 1 to 21.|
| pageDirection | number |Data obtaining direction. The options are as follows: 0: next page 1: previous page |
| timeDimension | number | Time frame in which a leaderboard is to be obtained. The options are as follows:                                                                                                               0: The daily leaderboard is obtained.                                                                                  1: The weekly leaderboard is obtained.                                                                                                               2: The all-time leaderboard is obtained. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [Promise<Result\<RankingScore>>](#RankingScore) | Data of the current leaderboard. |

Call Example

```js
const offsetPlayerRank = 5;
const maxResults = 15;
const pageDirection = 0;
const timeDimension = 2;
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
HMSGameService.loadMoreScores(
  rankingId,
  offsetPlayerRank,
  maxResults,
  pageDirection,
  timeDimension
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadPlayerCenteredPageScores(rankingId,timeDimension,maxResults,offsetPlayerRank,pageDirection)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string |ID of a leaderboard for which data is to be obtained. |
| offsetPlayerRank | number |Rank specified by offsetPlayerRank. Then one page of scores before or after (specified by pageDirection) a rank will be loaded. |
| maxResults | number |Maximum number of records on each page. The value is an number ranging from 1 to 21.|
| pageDirection | number |Data obtaining direction. The options are as follows:                                 0: next page                                                                                                                  1: previous page |
| timeDimension | number | Time frame in which a leaderboard is to be obtained. The options are as follows:                                                                                                                 0: The daily leaderboard is obtained.                                                                     1: The weekly leaderboard is obtained.                                                               2: The all-time leaderboard is obtained. |

| Return Type                                       | Description                      |
| ------------------------------------------------- | -------------------------------- |
| [Promise<Result\<RankingScores>>](#RankingScores) | Data of the current leaderboard. |

Call Example

```js
const timeDimension = 2;
const maxResults = 15;
const offsetPlayerRank = 0;
const pageDirection = 1;
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
HMSGameService.loadPlayerCenteredPageScores(
    rankingId,
    timeDimension,
    maxResults,
    offsetPlayerRank,
    pageDirection
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### loadPlayerCenteredScores(rankingId,timeDimension,maxResults,isRealTime)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rankingId | string |ID of a leaderboard for which data is to be obtained. |
| timeDimension | number | Time frame in which a leaderboard is to be obtained. The options are as follows: 0: The daily leaderboard is obtained.1: The weekly leaderboard is obtained.2: The all-time leaderboard is obtained. |
| maxResults | number |Maximum number of records on each page. The value is an number ranging from 1 to 21.|
| isRealTime | number | Indicates whether to obtain leaderboard data from Huawei game server. The options are as follows:true: Obtain data from Huawei game server.false: Obtain data from the local cache.|

| Return Type                                       | Description                      |
| ------------------------------------------------- | -------------------------------- |
| [Promise<Result\<RankingScores>>](#RankingScores) | Data of the current leaderboard. |

Call Example

```js
const timeDimension = 2;
const maxResults = 15;
const isRealTime = true;
const rankingId = "29B6B039B259E8E90F379785B868C5F23E81A02D640E7*******"
HMSGameService.loadPlayerCenteredScores(
  rankingId,
  timeDimension,
  maxResults,
  isRealTime
)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### getPlayerExtraInfo(transactionId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| transactionId | string | Transaction ID returned by Huawei game server after an app calls the submitPlayerEvent method to report a player event of entering a game. If a transaction ID exists, the ID is passed. If a transaction ID does not exist, null is passed. |

| Return Type                                           | Description                      |
| ----------------------------------------------------- | -------------------------------- |
| [Promise<Result\<PlayerExtraInfo>>](#PlayerExtraInfo) | Return a PlayerExtraInfo object. |

Call Example

```js
const transactionId = "A1:736563***************"
HMSGameService.getPlayerExtraInfo(transactionId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### submitPlayerEvent(playerId,eventId,eventType)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| playerId | string | ID of the current player. |
| eventId | string | Player event ID. |
| eventType | string | Event type. The options are as follows:GAMEBEGIN: A player enters your game. GAMEEND: A player exits your game. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Promise<Result\<string>> | Transaction ID allocated by Huawei game server to a player in the scenario where eventType is set to GAMEBEGIN. In other scenarios, null is returned |

Call Example

```js
const playerId = "718*******"
const eventType = "GAMEBEGIN"
const eventId = "F3845094040940********"
HMSGameService.submitPlayerEvent(playerId, eventId, eventType)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### savePlayerInfo(rank,role,area,sociaty,playerId,openId)

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| rank | string | Obtains the level of a player in a game. |
| role | string | Obtains the role of a player in a game. |
| area | string | Obtains the server region of a player in a game. |
| sociaty | string | Obtains the guild information of a player in a game. |
| playerId | string | Obtains the ID of a player in a game. |
| openId | string | Obtains the OpenId of a player in a game. The OpenId uniquely identifies a HUAWEI ID in an app. |

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Promise<Result\<void>> | Return a Result object. |

Call Example

```js
const rank = 1
const role = 0
const area = 1
const sociaty = 1
const playerId = "718*******"
const openId = "718*******"
HMSGameService.savePlayerInfo(rank, role, area, sociaty, playerId, openId)
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### checkGameServiceLite()

| Return Type            | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Promise<Result\<void>> | Return a Result object. |

Call Example

```js
HMSGameService.checkGameServiceLite()
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### checkMobile(checkWithOpenId, mobile, gameAppId, playerId, ts, transactionId, inputSign)

| Return Type            | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Promise<Result\<void>> | After verifying the mobile phone number, a Result object returns if verification is successful. |

Call Example

```js
const checkWithOpenId = true
const mobile = "0251585053****"
const gameAppId = "********"
const playerId = "718*******"
const openId = "718*******"
const ts = "1614000348"
const transactionId="A1:B2:************************"
const inputSign = "60:1F:9C:FE:E8:8D:27:CD:81:22:FF:15:17:64:DF:**************************"
HMSGameService.checkMobile(
  checkWithOpenId,
  mobile,
  gameAppId,
  playerId,
  openId,
  ts,
  transactionId,
  inputSign
)
    .then((res) => {console.log(JSON.stringify(res))})    
    .catch((err) => {console.log(JSON.stringify(err))})
```

#### cancelGameService()

| Return Type            | Description |
| ---------------------- | ----------- |
| Promise<Result\<void>> | Revokes the authorization to HUAWEI Game Service.     |

Call Example

```js
HMSGameService.cancelGameService()
    .then((res) =>{console.log(JSON.stringify(res))})       
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

#### getPlayerRestTime()

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| transactionId | string | A parameter binding ID returned from the SubmitPlayerEvent function. |

| Return Type            | Description             |
| ---------------------- | ----------------------- |
| Promise<Result\<void>> | Return a Result object. |

Call Example

```js
const transactionId = "A1:736563***************"
HMSGameService.getPlayerRestTime(transactionId)    
    .then((res) =>{console.log(JSON.stringify(res))})   
    .catch((err) =>{console.log(JSON.stringify(err))}) 
```

### Data Types

#### Overview

| Type                                          | Description                                                  |
| --------------------------------------------- | ------------------------------------------------------------ |
| [Player](#player)                             | Returns the details about a player. An instance of the Player type is returned when the HMSGameServices.getCurrentPlayer() function is called. |
| [GameSummary](#gamesummary)                   | Returns basic game information                               |
| [GamePlayerStatistics](#GamePlayerStatistics) | Returns the statistics information of a player when the HMSGameService.loadGamePlayerStats(isRealTime) function  is called. |
| [RankingScores](#rankingscores)               | Returns the details about a score on a leaderboard when the score obtaining function is called. |
| [Achievement](#achievement)                   | Returns the details about an achievement.                    |
| [Event](#event)                               | Obtains the details about an event.                          |
| [Leaderboard](#leaderboard)                   | Obtains a leaderboard.                                       |
| [Score](#score)                               | Obtains all scores on a leaderboard.                         |
| [ScoreResult](#scoreresult)                   | Obtains all scores on a leaderboard in a RankingScores object. |
| [ScoreSubmissionInfo](#ScoreSubmissionInfo)   | Returns the result of submitting a score to a leaderboard when one of the methods  HMSGameService.submitScoreImmediate(rankingId,score) or HMSGameService.submitScoreImmediateTag(rankingId,score,scoreTips). |
| [PlayerExtraInfo](#playerextrainfo)           | Returns the additional information of a player when the HMSGameService.getPlayerExtraInfo(transactionId)method is called. |
| [Result](#result)                             | It is an object that contains common information on the returns of all functions. |

#### Player

Returns the details about a player. An instance of the Player type is returned when the HMSGameServices.getCurrentPlayer() function is called.

| Name        | Type   | Description                                                                                                                                                                                                         |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| displayName | string | Obtains a player's nickname.                                                                                                                                                                                        |
| playerId    | string | Obtains the game account ID assigned by Huawei to a player. The ID uniquely identifies the player in the app.                                                                                                       |
| playerLevel | string | Obtains the player level information. Currently, this method can obtain only the level information for players in the Chinese mainland. For players outside the Chinese mainland, this method returns 1 by default. |
| playerSign  | string | Obtains the sign-in signature of a player.   |
| signTs      | string | Obtains the timestamp information to be submitted during sign-in signature verification.                                                                                                                            |

#### Achievement

Returns the details about an achievement.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| achievementId        | string | Obtains the achievement ID.                                                             |
| name                 | string | Obtains the achievement name.                                                           |
| type                 | string | Obtains the achievement type.                                                           |
| appId                | string | Obtains the app ID                                                                      |
| description          | string | Obtains the description of the achievement.                                             |
| totalSteps           | string | Obtains the total number of steps required for unlocking the achievement.               |
| currentSteps         | string | Obtains the number of steps that the player has gone toward unlocking the achievement. |
| state                | string | Obtains the achievement status.   |
| unlockedUsers        | string | Obtains the number of people who lock unlocked achievement.                             |
| lastUpdatedTimestamp | string | Obtains the timestamp when the achievement is updated the last time.                    |

#### Event

Obtains the details about an event.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| eventId        | string | Obtains the ID of an event. |
| name                 | string | Obtains the name of an event. |
| appId                | string | Obtains the app ID |
| value                 | string | Obtains the current event value of the current player.|
| formattedValue          | string | Obtains the localized event value.|
| state           | string | Obtains the events status.      |
| updateTime         | string | Obtains updated time. |

#### RankingScores

Returns the details about a score on a leaderboard when the score obtaining function is called.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| [Leaderboard](#Leaderboard)        | [Leaderboard](#Leaderboard)  | Obtains a leaderboard.                                                             |
| scores          | [Score](#score)[] | Obtains all scores on a leaderboard.                 |

#### Leaderboard

Obtains a leaderboard.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| leaderboardId        | string | Obtains the ID of a leaderboard.  |
| name                 | string | Obtains the display name of a leaderboard.                  |
| appId        | string | Obtains the appID  |
| scoreOrder        | string | Obtains the ordering mode of scores for a leaderboard.  |
| updateTime        | string | Obtains the updated time.  |
| score   | [Score](#Score) | Obtains the score information of the current player  |

#### Score

Obtains all scores on a leaderboard.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| timeSpan        | string | Obtains the timestamp when the player achieved a specified score.   |
| displayScore                 | string |Obtains the display value of a score on a leaderboard.             |
| rank                 | string | Obtains the rank of a score on a leaderboard.                  |
| rawScore                 | string | Obtains the raw value of a score. |
| player                 | string | Obtains the information about the player who achieved a specified score.                 |
| numScores                 | string | Obtains the display value of a score on a leaderboard.              |
| updateTime                 | string | Obtains the updated time.  |

#### ScoreSubmissionInfo

Returns the result of submitting a score to a leaderboard when one of the methods  HMSGameService.submitScoreImmediate(rankingId,score) or HMSGameService.submitScoreImmediateTag(rankingId,score,scoreTips).

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| rankingId        | string | Obtains the ID of the leaderboard to which a score is to be submitted. |
| playerId                 | string | Obtains the PlayerId or OpenId of the player who has achieved a specified score. |
| [scoreResults](#scoreResults)               | [scoreResults](#scoreResults)[] | Obtains the submission result by time frame. |

#### ScoreResult

Obtains all scores on a leaderboard in a RankingScores object.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| displayScore        | string | Localized score on a leaderboard. |
| newBest                 | boolean | Indicates whether the score is the best score ever achieved by the player. The options are as follows:                                                                                   true: yes                                                                                                                        false: no |
| score                 | string | Raw value of a submitted score.|
| timeSpan                 | string | Custom unit of a submitted score. If no custom unit is defined, null is returned. |

#### GamePlayerStatistics

Returns the statistics information of a player when the HMSGameService.loadGamePlayerStats(isRealTime) function  is called.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| averageSessionLength        | string | Obtains the ID of the leaderboard to which a score is to be submitted. |
| daysSinceLastPlayed                 | string | Obtains the number of days elapsed since a player last played. |
| numberOfSessions                 | string | Obtains the number of sessions for a player in the statistical period of the past 12 months. |
| numberOfPurchases                 | string | Obtains the number of in-app purchases for a player in the statistical period of the past 12 months.|
| totalPurchasesAmountRange                 | string | Obtains the total spending rank of a player in the statistical period of the past 12 months. |

#### GameSummary

Returns basic game information.

| Name                 | Type   | Description                                                                             |
| -------------------- | ------ | --------------------------------------------------------------------------------------- |
| leaderboardId        | string | Obtains the ID of a leaderboard.  |
| name                 | string | Obtains the display name of a leaderboard.                  |
| appId        | string | Obtains the appID  |
| scoreOrder        | string | Obtains the ordering mode of scores for a leaderboard.  |
| updateTime        | string | Obtains the updated time.  |
| score  | [Score](#Score) | Obtains the score information of the current player  |

#### PlayerExtraInfo

Returns the additional information of a player when the HMSGameService.getPlayerExtraInfo(transactionId) method is called.

| Name           | Type    | Description                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| playerDuration | number  | Played time of a player on the current day, in minutes. If the time is less than 1 minute, 1 minute is returned. |
| isAdult        | boolean | Whether a player is an adult. The options are as follows:                        true: The player is an adult.                                                                                 false: The player is not an adult. |
| isRealName     | boolean | Whether a player is a real-name player. The options are as follows:                            true: The player is a real-name player.                                                                                   false: The player is not a real-name player. |

#### Result

It is an object that contains common information on the returns of all functions.

| Name       | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| status     | string | Status.Success: "GAME_STATE_SUCCESS"Error: "GAME_STATE:ResultCode" |
| resultCode | number | One of the [ResultCodes](#result-codes) returns. |
| data       | object | It contains the object or value returned from the respective api.All "void" methods will also be null. |

### Result Codes

| Result Code | Result Code                           | Descriptive Name                                             |
| ----------- | ------------------------------------- | ------------------------------------------------------------ |
| 0           | GAME_STATE_SUCCESS                    | Success.                                                     |
| -1          | GAME_STATE_FAILED                     | Common game API failure.                                     |
| 7001        | GAME_STATE_ERROR                      | Common error.                                                |
| 7002        | GAME_STATE_NETWORK_ERROR              | Network error or incorrect service address setting on HUAWEI AppGallery. |
| 7003        | GAME_STATE_USER_CANCEL                | The user cancels the operation.                              |
| 7004        | GAME_STATE_USER_CANCEL_LOGIN          | The user cancels the sign-in.                                |
| 7005        | GAME_STATE_PARAM_ERROR                | Incorrect input parameters.                                  |
| 7006        | GAME_STATE_NO_SUPPORT                 | Game Service is unavailable in the region.                   |
| 7010        | GAME_STATE_NOT_SUPPORT                | The current device does not support Game Service.            |
| 7011        | GAME_STATE_PARAM_NULL                 | Empty input parameter.                                       |
| 7012        | GAME_STATE_CALL_REPEAT                | Repeated API call.                                           |
| 7013        | GAME_STATE_NOT_LOGIN                  | The HUAWEI ID is not signed in.                              |
| 7016        | GAME_STATE_REALNAME_REGISTER          | The user has completed identity verification.                |
| 7017        | GAME_STATE_REGISTER_FAIL              | Incorrect system settings (game registration failure).       |
| 7018        | GAME_STATE_NOT_INIT                   | The initialization API is not called.                        |
| 7019        | GAME_STATE_ACCOUNT_NOT_MATCH          | The signed-in HUAWEI ID is different from that of the device. |
| 7020        | GAME_STATE_GAME_NOT_FOUND             | No game is found when obtaining the basic game information.  |
| 7021        | GAME_STATE_REALNAME_CANCEL            | The user has canceled identity verification.                 |
| 7022        | GAME_STATE_REALNAME_NOT_SUPPORT       | The real-name duration statistics function is not supported for adult users or users whose identity is not verified. |
| 7023        | GAME_STATE_CALL_FREQUENTLY            | Too frequent calls.                                          |
| 7024        | GAME_STATE_APPGALLERY_NOT_SUPPORT     | The HUAWEI AppGallery APK has not been installed, or the HUAWEI AppGallery version does not support this function. |
| 7200        | GAME_STATE_ACHIEVEMENT_NO_UPGRADE     | The achievement is not increased.                            |
| 7201        | GAME_STATE_ACHIEVEMENT_NONEXIST       | The achievement is not found.                                |
| 7202        | GAME_STATE_ACHIEVEMENT_UNLOCKED       | The achievement is unlocked.                                 |
| 7203        | GAME_STATE_ACHIEVEMENT_UNLOCK_FAILED  | The achievement fails to be unlocked.                        |
| 7204        | GAME_STATE_ACHIEVEMENT_NOT_SUPPORT    | HUAWEI AppAssistant does not support achievement display. (The EMUI version is earlier than 10.0, HUAWEI AppAssistant is not installed, the HUAWEI AppAssistant version is earlier than 10.1, or the app has not been released.) |
| 7205        | GAME_STATE_RANKINGS_NOT_SUPPORT       | HUAWEI AppAssistant does not support leaderboard display. (The EMUI version is earlier than 10.0, HUAWEI AppAssistant is not installed, the HUAWEI AppAssistant version is earlier than 10.3, or the app has not been released.) |
| 7207        | GAME_STATE_ARCHIVE_CONFLICT_LOST      | The conflict does not exist.                                 |
| 7208        | GAME_STATE_ARCHIVE_OPEN_FAILED        | An error occurred when reading the content of the archive file. |
| 7209        | GAME_STATE_ARCHIVE_ADD_FAILED         | Failed to create the archive.                                |
| 7210        | GAME_STATE_ARCHIVE_DIRECTORY_FAILED   | The root folder for the archive is not found or cannot be created when the archive is submitted. |
| 7211        | GAME_STATE_ ARCHIVE_NOT_FOUND         | The specified archive does not exist.                        |
| 7212        | GAME_STATE_ARCHIVE_NOT_SUPPORT        | HUAWEI AppAssistant does not support saved game display. (The EMUI version is earlier than 10.0, HUAWEI AppAssistant is not installed, the HUAWEI AppAssistant version is earlier than 10.3, or the app has not been released.) |
| 7213        | GAME_STATE_ARCHIVE_NUM_MAX_LIMIT      | The number of archives has reached the upper limit.          |
| 7214        | GAME_STATE_ARCHIVE_SIZE_MAX_LIMIT     | The size of the archive image or file has reached the upper limit. |
| 7215        | GAME_STATE_RINGINGS_NOT_FOUND         | No leaderboard data found.                                   |
| 7216        | GAME_STATE_ARCHIVE_IMAGE_NOT_SUPPORT  | Unsupported archive image format.                            |
| 7217        | GAME_STATE_ARCHIVE_COMMIT_CACHED      | The archive is not uploaded, but only cached locally.        |
| 7218        | GAME_STATE_GAMESERVICE_AUTHOR_FAILURE | Game Service authorization fails. The user does not agree to the AppGallery agreement. |
| 7219        | GAME_STATE_ARCHIVE_NO_DRIVE           | The user has not enabled HUAWEI Drive Kit.                   |

## 4. Configuration and Description

### Configuring Obfuscation Scripts

#### React Native

In order to prevent error while release build, you may need to add following lines in **`proguard-rules.pro`** file.

```text
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keep class com.hianalytics.android.**{*;}
-keep class com.huawei.updatesdk.**{*;}
-keep class com.huawei.hms.**{*;}
-repackageclasses
```

#### Cordova

Before building the APK, configure the obfuscation configuration file to prevent the HMS Core SDK from being obfuscated.

**NOTE**: This step is required only if you want to minify and obfuscate your app. By default obfuscation is disabled in Cordova and Ionic apps.

The obfuscation is done by **`ProGuard`.** By default, in Cordova and Ionic apps ProGuard is disabled. Even though ProGuard is not available, ProGuard support can be added through 3rd party ProGuard plugins. If ProGuard is enabled in your project, the Huawei Cordova Game Service plugin's ProGuard rules need to be added to your project. These rules are as follows:

```text
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keep class com.huawei.hianalytics.**{*;}
-keep class com.huawei.updatesdk.**{*;}
-keep class com.huawei.hms.**{*;}
-repackageclasses
```

---

## 5. Questions or Issues

If you have questions about how to use HMS samples, try the following options:

- [Stack Overflow](https://stackoverflow.com/questions/tagged/huawei-mobile-services) is the best place for any programming questions. Be sure to tag your question with **huawei-mobile-services**.
- [Huawei Developer Forum](https://forums.developer.huawei.com/forumPortal/en/home?fid=0101187876626530001) HMS Core Module is great for general questions, or seeking recommendations and opinions.
- [Huawei Developer Docs](https://developer.huawei.com/consumer/en/doc/overview/HMS-Core-Plugin) is place to official documentation for all HMS Core Kits, you can find detailed documentations in there.

---

## 6. Licensing and Terms

Huawei JS SDK is licensed under [Apache 2.0 license](LICENCE).
