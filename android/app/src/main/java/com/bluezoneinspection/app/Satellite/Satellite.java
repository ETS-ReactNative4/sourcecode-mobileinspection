package com.bluezoneinspection.app.satellite;

import android.widget.Toast;

import android.location.Location;
import android.location.LocationManager;
import android.location.LocationListener;
import android.content.Context;
import com.facebook.react.bridge.ReadableMap;
import android.os.Bundle;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



public class Satellite extends ReactContextBaseJavaModule {

    ReactApplicationContext mReactContext;
    private LocationManager locationManager;

    public Satellite(ReactApplicationContext reactContext) {
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
        // Define a listener that responds to location updates
        LocationListener locationListener = new LocationListener() {

            public void onLocationChanged(Location location) {
                // Called when a new location is found by the network location provider.
                show("Latitude:" + location.getLatitude() + ", Longitude:" + location.getLongitude()+", Satellites:" +location.getExtras().getInt("satellites"),1);
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {}

            public void onProviderEnabled(String provider) {}

            public void onProviderDisabled(String provider) {}

        };

// Register the listener with the Location Manager to receive location updates
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);

    }

}
