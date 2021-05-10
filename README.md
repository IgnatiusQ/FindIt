# FindIt

An anti-theft mobile application that functions as a secondary device locking system developed for devices that use the Android Operating System.

Once configured, when the device is locked, the "Lock Screen" is activated.

While the Lock Screen is active, the screen utilizes the ‘CAMERA_ROLL’ which requires the READ_EXTERNAL_STORAGE and WRITE_EXTERNAL_STORAGE permissions in the Android manifest. The permissions are only asked once when the feature is used for the first time unless the user manually clears the cache.

In the case of a failed pin attempt;

- The application captures a picture using the device’s front-camera. This process is done in the background to eliminate the ‘snap’ feature.

- A copy of the captured picture is stored inside a cached folder and another copy is created from it and stored inside a folder created automatically on the device’s root-storage by the application upon the feature’s first usage. This allows the user to view the pictures either directly from the application or by navigating to the ‘FindIt’ folder on the device’s root-storage.



Features such as the "Device Info", "Recent Device Location", "Recent Activity", and the option to reset the device pin-lock are available in the main application.
