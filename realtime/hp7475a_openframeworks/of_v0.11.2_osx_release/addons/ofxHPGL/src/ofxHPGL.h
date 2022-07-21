//
//  ofxHPGL.h
//  emptyExample
//
//  Created by Nick Hardeman on 2/4/16.
//

#pragma once
#include "ofMain.h"

class ofxHPGLSerialCommand {
public:
    ofxHPGLSerialCommand() {
        command                 = "";
        printerResponse         = "";
        bSent                   = false;
        timeout                 = 3000;
        bDidReceiveResponse     = false;
    }
    
    ofxHPGLSerialCommand( string ac ) {
        command                 = ac;
        printerResponse         = "";
        bSent                   = false;
        timeout                 = 3000;
        bDidReceiveResponse     = false;
    }
    
    void sent() {
        timeSent = (int) ofGetElapsedTimeMillis();
        bSent = true;
    }
    void received( string aresponse ) {
        timeReceived    = (int) ofGetElapsedTimeMillis();
        printerResponse = aresponse;
        bDidReceiveResponse = true;
//        cout << "Setting the printer response: " << printerResponse << endl;
    }
    bool didReceiveResponse() {
        return ( bDidReceiveResponse );
    }
    int penIndex = -1;
    
    bool bSent;
    string command;
    string printerResponse;
    unsigned int timeSent;
    unsigned int timeReceived;
    unsigned int timeout;
protected:
    bool bDidReceiveResponse;
};

class ofxHPGLCommand {
public:
    enum CommandType {
        SHAPE = 0,
        PEN,
        CIRCLE,
        RECTANGLE,
        PEN_VELOCITY,
        STRING_COMMAND
    };
    
    ofxHPGLCommand() {
        penIndex    = -1;
        type        = SHAPE;
        bFilled     = false;
    }
    ofxHPGLCommand( ofPolyline aline ) {
        penIndex    = -1;
        type        = SHAPE;
        polyline    = aline;
        bFilled     = false;
    }
    
    void circle( float ax, float ay, float aradius ) {
        pos.set( ax, ay );
        type    = CIRCLE;
        radius  = aradius;
        
    }
    
    void rectangle( float ax, float ay, float aw, float ah ) {
        pos.set( ax, ay );
        type    = RECTANGLE;
        width   = aw;
        height  = ah;
        
    }
    
    void setPen( int aPen ) {
        type        = PEN;
        penIndex    = aPen;
    }
    
    void setCommand( string aCommand ) {
        strCommand  = aCommand;
        type        = STRING_COMMAND;
    }
    
    void setPenVelocity( float aVel ) {
        type        = PEN_VELOCITY;
        penVelocity = aVel;
    }
    
    ofVec2f pos;
    float radius;
    int penIndex;
    float width, height;
    int type;
    ofPolyline polyline;
    bool bFilled;
    string strCommand;
    float penVelocity;
};

class ofxHPGL {
public:
    
    static bool shouldRemoveSentCommand( const ofxHPGLSerialCommand& ac );
    
    class Settings {
    public:
        enum PaperSize {
            PAPER_SIZE_A3 = 1, // 297 x 420 mm | 11.7 x 16.5 in
            PAPER_SIZE_A4 = 4 // 210 x 297 mm | 8.3 x 11.7 in
        };
        
        Settings();
        
        PaperSize paperSize;
        string serialDevicePath;
        int baud;
    };
    
    ofxHPGL();
    ~ofxHPGL();
    
    void setup( int aDeviceIndedex );
    void setup( string aPortName );
    void setup( Settings asettings );
    
    bool load( string aFilePath );
    bool save( string aFilePath );
    
    void setInputWidth( float aw );
    void setInputHeight( float ah );
    float getInputWidth() { return _inWidth; }
    float getInputHeight() { return _inHeight; }
    
    bool start();
    void stop();
    vector<ofSerialDeviceInfo> getSerialDevices();
    
    bool isConnected();
    
    void update();
    void draw();
    void draw( ofRectangle abounds );
    
    void circle( float ax, float ay, float aradius );
    void rectangle( ofRectangle arect );
    void rectangle( float ax, float ay, float awidth, float aheight );
    void line( float ax, float ay, float ax2, float ay2 );
    void triangle( float ax, float ay, float ax2, float ay2, float ax3, float ay3 );
    void triangle( ofVec2f ap1, ofVec2f ap2, ofVec2f ap3 );
    void polyline( ofPolyline aline );
    
    void setPenColor( int aPenNumberCy, ofColor aColor );
    ofFloatColor getPenColor( int aPenNumber );
    vector< ofFloatColor > getPenColors();
    
    void setPen( int aPenIndex );
    void setPenVelocity( float aVel ); // from 0 - 1 // -1 sets back to default //
    void setPaperSize( int aPaperSize );
    
    ofVec2f getPrinterPosFromInput( ofVec2f aInput );
    ofVec2f getPrinterPosFromInput( ofVec2f aInput, ofRectangle& aDestRect );
    
    void skip( int aNumCmdsToSkip );
    void clear();
    void print();
    bool isPrinting();
    void pause();
    void resume();
    bool isPaused();
    bool hasCommands() { return commands.size(); }
    int getNumCommands() { return (int) commands.size(); }
    
    void enableCapture();
    void disableCapture();
    bool isCapturing();
    
    void rotateCommandsNeg90();
    
    ofVec2f getPenPosition();
    int getPenStatus();
    ofRectangle getHardClipLimits();
    
    // 0 - 1 //
    float getProgress();
    // in seconds //
    float getEstTimeRemaining();
    string getEstTimeRemaintingFormatted();
    string getTotalPrintTimeFormatted();
    
    int getError();
    
    int getNumPrinterCommands() { return (int) printerCommands.size(); }
    void addPrinterCommand( string astr );
    void addPrinterCommands( vector< ofxHPGLSerialCommand > aCmds );
    string getCommand( string aprefix, int ax );
    string getCommand( string aprefix, int ax, int ay );
    
    void sendCommand( string astr );
    void sendCommands( vector< ofxHPGLSerialCommand > aCmds );
    
    ofSerial serial;
    
    string message;
    
    ofEvent< int > PenChangeEvent;
    ofEvent< int > PrintFinishEvent;
    
    int getAvailBufferSize();
    void sendBlockingResponse( ofxHPGLSerialCommand& aCommand );
    
protected:
    vector< ofxHPGLSerialCommand > _parseHPGLCommandToPrinterCommand( ofxHPGLCommand& aCommand );
    void _checkInputDims();
    string getTimeNumberString( int anum );
    
    bool bthreadReceivedPrinterResponse;
    
    vector< ofxHPGLSerialCommand > printerCommands;
    
    vector< ofxHPGLCommand > commands;
    vector< ofPolyline > drawPolys;
    vector< ofFloatColor > drawColors;
    int penIndex;
    Settings _settings;
    string serialIn;
    
    float _inWidth, _inHeight;
    bool bTryToConnectToPrinter;
    unsigned int lastTryToConnectTime;
    bool bPause;
    
    ofRectangle _clipLimitRect;
    bool _bCapturing;
    
    vector< ofFloatColor > penColors;
    
    int _startNumPrinterCommands=0;
    
    vector< float > _estFinishedTimes;
    float _lastEstFinishedTimeGuess=-100;
    int _lastEstNumPrinterCommands = 0;
    float _progressPct=0.0;
    bool _bPassedFinishEvent=false;
    uint64_t _startPrintTime=0;
    uint64_t _endPrintTime=0;
    int _numPrinterCmdsToSkip=0;
};






