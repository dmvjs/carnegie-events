# carnegie-events

keytool -genkey -v -keystore carnegie-events.keystore -alias Events -keyalg RSA -keysize 2048 -validity 10000


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Apps/certs/carnegie-events.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Events

~/Apps/carnegie-global-not/platforms/android/build/outputs/apk/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/Events.apk

cd platforms/android/build/outputs/apk/ && open .