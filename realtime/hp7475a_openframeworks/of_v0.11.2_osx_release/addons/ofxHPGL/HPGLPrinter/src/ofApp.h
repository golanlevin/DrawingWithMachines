#pragma once
#include "ofxHPGL.h"
#include "ofxGui.h"
#include "ofxSvg.h"
#ifdef OFX_SVG_LOADER
#include "ofxSvgLoader.h"
#endif

class ofApp : public ofBaseApp {
public:
    void setup();
    void update();
    void draw();
    
    void penSpeedChanged( float& aPenSpeed );
    void paperSizeA3Pressed();
    void paperSizeA4Pressed();
    void rotateHPGLNeg90();
    void promptSelectFile();
    void print();
    void outputError();
    void clearPrinterCommands();
    
    void onHPGLPenChangeEvent( int& arg );
    void onHPGLPrintFinishEvent( int& arg );
    void parameterChanged( ofAbstractParameter& aparameter );
    
    bool paseSvgFile( string aPath );
    
    void say( string aStr );
    void exit();
    
    void keyPressed(int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y);
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void mouseEntered(int x, int y);
    void mouseExited(int x, int y);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);
    
    ofxHPGL hp;
    
    ofFile fileToPrint;
    ofFile folder;
    
    bool bDrawGui = true;
    ofxPanel gui;
    
    ofParameter< float > penSpeed;
    ofxButton buttonPaperSizeA3, buttonPaperSizeA4;
    ofxButton buttonSelectFile, buttonPrint;
    ofxToggle buttonPause;
    ofxButton buttonOutputError;
    ofxButton buttonClearCommands;
    
    ofParameter< string > paramProgressPct;
    ofParameter< string > paramEstTimeLeft;
    ofParameter< string > paramTotalTime;
    
    ofParameterGroup penParams;
    ofParameter< bool > paramPen0;
    ofParameter< bool > paramPen1;
    ofParameter< bool > paramPen2;
    ofParameter< bool > paramPen3;
    ofParameter< bool > paramPen4;
    ofParameter< bool > paramPen5;
    ofParameter< bool > paramPen6;
    
    ofxButton buttonRotateNeg90;
    
};
