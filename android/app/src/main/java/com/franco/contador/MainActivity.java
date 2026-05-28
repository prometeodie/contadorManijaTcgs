package com.franco.contador;

import android.os.Bundle;
import android.view.WindowManager;

import androidx.activity.EdgeToEdge;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {

    // Android 15+ edge-to-edge compatible
    EdgeToEdge.enable(this);

    super.onCreate(savedInstanceState);

    // Permitir usar toda la pantalla incluyendo la cámara frontal
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {

      WindowManager.LayoutParams lp = getWindow().getAttributes();

      lp.layoutInDisplayCutoutMode =
        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;

      getWindow().setAttributes(lp);
    }
  }
}
