# HMS JSB GameService


## 1. Introduction
In this project show us to how to implement js sdk game service to Cordova platform. 

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

### Cordova Platform

**Step 1:** Make sure you have installed Node, npm and Ionic CLI in your computer.


**Step 2:** Install required tools.

```bash
npm install
```

**Step 3:** Add the **Android platform** to the project if haven't done before.

```bash
cordova platform add android
```

**Step 4:** Download plugin using command below.

```bash
cordova plugin add @hmscore/hms-js-gameservice
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

**Step 10:** Run the app

```bash
cordova run android
```


