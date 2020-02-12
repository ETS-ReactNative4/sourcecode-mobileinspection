package com.bluezoneinspection.app;

import android.widget.Toast;

import android.location.GpsSatellite;
import android.location.GpsStatus;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationListener;
import android.content.Context;
import android.os.Bundle;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class SatelliteModule extends ReactContextBaseJavaModule {
    class SatelliteModel{
        double latitude;
        double longitude;
        int satelliteCount;

        SatelliteModel(double latitude, double longitude, int satelliteCount) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.satelliteCount = satelliteCount;
        }
    }
    ReactApplicationContext mReactContext;
    private LocationManager locationManager;

    public SatelliteModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ReactApplicationContext mReactContext = reactContext;
        locationManager = (LocationManager) mReactContext.getSystemService(Context.LOCATION_SERVICE);
    }

    @Override
    public String getName() {
        return "Satellite";
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void getCoors(){
        LocationListener locationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                if(location.getExtras() != null){
                    double latitude = location.getLatitude();
                    double longitude = location.getLongitude();
                    int satelliteCount = location.getExtras().getInt("satellites");

                    WritableMap satelliteParams = Arguments.createMap();
                    satelliteParams.putDouble("latitude", latitude);
                    satelliteParams.putDouble("longitude", longitude);
                    satelliteParams.putInt("satelliteCount", satelliteCount);

                    sendEvent(getReactApplicationContext(), "getSatellite", satelliteParams);
                }
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {}

            public void onProviderEnabled(String provider) {}

            public void onProviderDisabled(String provider) {}

        };

// Register the listener with the Location Manager to receive location updates
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
//        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);

    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
