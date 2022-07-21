#include "ofMain.h"
#include "ofApp.h"

//========================================================================
int main( ){

	int windowH = 1200.f * (float)(11./17.);
	ofSetupOpenGL( 1200, windowH, OF_WINDOW );

	// this kicks off the running of my app
	// can be OF_WINDOW or OF_FULLSCREEN
	// pass in width and height too:
	ofRunApp( new ofApp());

}
