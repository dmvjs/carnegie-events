# carnegie-events

keytool -genkey -v -keystore carnegie-events.keystore -alias Events -keyalg RSA -keysize 2048 -validity 10000


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore carnegie-events.keystore android-release-unsigned.apk Events
/Users/kirk/Apps/carnegie-global-not/platforms/android/build/outputs/apk/zipalign -v 4 android-release-unsigned.apk Events.apk