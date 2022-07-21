//
//  ofxHPGL.cpp
//  emptyExample
//
//  Created by Nick Hardeman on 2/4/16.
//

#include "ofxHPGL.h"

//--------------------------------------------------------------
ofxHPGL::Settings::Settings() {
    paperSize           = PAPER_SIZE_A3;
    serialDevicePath    = "";
    baud                = 9600;
}

//--------------------------------------------------------------
ofxHPGL::ofxHPGL() {
    penIndex    = -1;
    _inWidth    = -1;
    _inHeight   = -1;
    bTryToConnectToPrinter  = false;
    lastTryToConnectTime    = 0;
    bPause      = false;
    _bCapturing = false;
    
    penColors.push_back( ofFloatColor( 0.2, 0.2, 0.2 ));
    penColors.push_back( ofFloatColor( 0.9, 0.1, 0.1 ));
    penColors.push_back( ofFloatColor( 0.1, 0.1, 0.9 ));
    penColors.push_back( ofFloatColor( 0.9, 0.92, 0.05 ));
    penColors.push_back( ofFloatColor( 0.2, 0.9, 0.1 ));
    penColors.push_back( ofFloatColor( 0.9, 0.2, 0.9 ));
}

//--------------------------------------------------------------
ofxHPGL::~ofxHPGL() {
    if( isConnected() ) sendCommand( "SP;" );
    stop();
}

//--------------------------------------------------------------
bool ofxHPGL::shouldRemoveSentCommand( const ofxHPGLSerialCommand& ac ) {
    return ac.bSent;
}

//--------------------------------------------------------------
void ofxHPGL::setup( int aDeviceIndedex ) {
    setup( getSerialDevices()[aDeviceIndedex].getDevicePath() );
}

//--------------------------------------------------------------
void ofxHPGL::setup( string aPortName ) {
    ofxHPGL::Settings tsettings;
    tsettings.serialDevicePath = aPortName;
    setup( tsettings );
}

//--------------------------------------------------------------
void ofxHPGL::setup( Settings asettings ) {
    _settings = asettings;
    if( _settings.serialDevicePath == "" ) {
        _settings.serialDevicePath = getSerialDevices()[0].getDevicePath();
    }
    serial.listDevices();
    start();
    if( _inWidth < 10 ) {
        setInputWidth( ofGetWidth() );
    }
    if( _inHeight < 10 ) {
        setInputHeight( ofGetHeight() );
    }
}

//--------------------------------------------------------------
bool ofxHPGL::load( string aFilePath ) {
    
    ofFile tfile( aFilePath );
    
    bool bOk = false;
    
    if( tfile.getExtension() == "ofxhpgl" ) {
        bool bWasCaptureEnabled = isCapturing();
        enableCapture();
        
        ofBuffer tbuff = ofBufferFromFile( aFilePath );
        bOk = tbuff.size() > 0;
        if( bOk ) {
            ofBuffer::Lines tlines = tbuff.getLines();
            for( auto& tline : tlines ) {
//                cout << tline << endl;
                if( tline.size() < 3 ) continue;
                unsigned char c1 = tline[0];
                unsigned char c2 = tline[1];
                if( c1 == 'I' && c2 == 'N' ) {
                    string nstr = tline.substr(2);
                    vector< string > tvals = ofSplitString( nstr, "," );
                    if( tvals.size() == 2 ) {
                        setInputWidth( ofToFloat( tvals[0] ));
                        setInputHeight( ofToFloat( tvals[1] ));
                    }
                } else if( c1 == 'P' && c2 == 'S' ) {
                    // setting the paper size //
//                    int val = tline[2];
//                    setPaperSize( val );
                } else if( c1 == 'S' && c2 == 'P') {
                    // setting the pen index //
                    string nstr = tline.substr(2);
                    int val = ofToInt( nstr );
                    setPen( val );
                } else if( c1 == 'V' && c2 == 'S' ) {
                    // this value is a float, so go all the way to the end //
                    string nstr = tline.substr(2);
                    float tvelocity = ofToFloat( nstr );
//                    cout << "setting the pen velocity from the loaded file: " << tvelocity << endl;
                    setPenVelocity( tvelocity );
                } else if( (c1 == 'C' && c2 == 'I') || (c1 == 'W' && c2 == 'G') ) {
                    string nstr = tline.substr(2);
                    vector< string > tvals = ofSplitString( nstr, "," );
                    if( tvals.size() == 3 ) {
                        circle( ofToFloat(tvals[0]), ofToFloat(tvals[1]), ofToFloat(tvals[2]) );
                        if( c1 == 'W' && c2 == 'G' ) {
                            commands.back().bFilled = true;
                        }
                    }
                } else if( (c1 == 'R' && c2 == 'A') || (c1 == 'E' && c2 == 'A') ) {
                    // ss<<"EA"<<tc.pos.x<<","<<tc.pos.y<<","<<tc.width<<tc.height;//<<";";
                    string nstr = tline.substr(2);
                    vector< string > tvals = ofSplitString( nstr, "," );
                    if( tvals.size() == 4 ) {
                        rectangle( ofToFloat(tvals[0]), ofToFloat(tvals[1]), ofToFloat(tvals[2]), ofToFloat(tvals[3]));
                        if( c1 == 'R' && c2 == 'A' ) {
                            commands.back().bFilled = true;
                        }
                    }
                } else if( c1 == 'P' && c2 == 'L' ) {
                    string nstr = tline.substr(2);
                    vector< string > tvals = ofSplitString( nstr, "," );
                    if( tvals.size() >= 2 ) {
                        ofPolyline tpoly;
                        int tsize = (int) tvals.size();
                        for( int k = 0; k < tsize; k+=2 ) {
                            tpoly.addVertex( ofToFloat(tvals[k]), ofToFloat(tvals[k+1]) );
                        }
                        polyline( tpoly );
                        
                    }
                }
                
            }
        }
        
        if( !bWasCaptureEnabled ) {
            disableCapture();
        }
    }
    
    return bOk;
}

//--------------------------------------------------------------
bool ofxHPGL::save( string aFilePath ) {
    
//    ofFile tfile( aFilePath );
    string filepath = aFilePath;
    if( !ofIsStringInString(aFilePath, ".ofxhpgl")) {
        filepath += ".ofxhpgl";
    }
    
    if( _inWidth < 1 ) setInputWidth( ofGetWidth() );
    if( _inHeight < 1 ) setInputHeight( ofGetHeight() );
    
    if( ofFilePath::getFileExt( filepath ) == "ofxhpgl" ) {
        ofBuffer tbuff;
        // set the paper size //
        stringstream tss;
        tss<<"IN"<<_inWidth<<","<<_inHeight<<endl;
        tbuff.append( tss.str() );
        tss.clear();
//        tss<<"PS"<<_settings.paperSize<<endl;
//        tbuff.append( tss.str() );
//        tss.clear();
        
        int ncommands = (int) commands.size();
        for( int i = 0; i < ncommands; i++ ) {
            ofxHPGLCommand& tc = commands[i];
            stringstream ss;
            if( tc.type == ofxHPGLCommand::PEN ) {
                ss<<"SP" << tc.penIndex;
            } else if( tc.type == ofxHPGLCommand::PEN_VELOCITY ) {
                ss<<"VS" << tc.penVelocity;
            } else if( tc.type == ofxHPGLCommand::RECTANGLE ) {
                if( tc.bFilled ) {
                    ss<<"RA";
                } else {
                    ss<<"EA";
                }
                ss<<tc.pos.x<<","<<tc.pos.y<<","<<tc.width<<","<<tc.height;//<<";";
            } else if( tc.type == ofxHPGLCommand::CIRCLE ) {
                if( tc.bFilled ) {
                    ss<<"WG";
                } else {
                    ss<<"CI";
                }
                ss<<tc.pos.x<<","<<tc.pos.y<<","<<tc.radius;
            } else if( tc.type == ofxHPGLCommand::SHAPE ) {
                int polySize = (int) tc.polyline.size();
                if( polySize >= 2 ) {
                    ss<<"PL";
                    for( int j = 0; j < polySize; j++ ) {
                        ss<<tc.polyline[j].x<<","<<tc.polyline[j].y;
                        if( j != polySize-1 ) {
                            ss<<",";
                        }
                    }
                    //ss<<";";
                }
            }
            ss<<endl;
            tbuff.append(ss.str());
        }
        cout << "ofxHPGL :: ofxHPGL file type save : " << filepath << endl;
        return ofBufferToFile( filepath, tbuff );
    }
    return false;
    
}

//--------------------------------------------------------------
void ofxHPGL::setInputWidth( float aw ) {
    _inWidth = aw;
}

//--------------------------------------------------------------
void ofxHPGL::setInputHeight( float ah ) {
    _inHeight = ah;
}

//--------------------------------------------------------------
bool ofxHPGL::start() {
    bool bOk = false;
    if( serial.isInitialized() ) {
        serial.close();
    }
    bOk = serial.setup( _settings.serialDevicePath, _settings.baud );
    bTryToConnectToPrinter = true;
    return bOk;
}

//--------------------------------------------------------------
void ofxHPGL::stop() {
    if( serial.isInitialized() ) {
        serial.close();
    }
    bTryToConnectToPrinter = false;
}

//--------------------------------------------------------------
vector<ofSerialDeviceInfo> ofxHPGL::getSerialDevices() {
    return serial.getDeviceList();
}

//--------------------------------------------------------------
bool ofxHPGL::isConnected() {
    return serial.isInitialized();
}

//--------------------------------------------------------------
void ofxHPGL::update() {
    int eTimeMillis = (int) ofGetElapsedTimeMillis();
    float eTime = ofGetElapsedTimef();
    
    // try to connect to the serial if not connected //
    
    if( bTryToConnectToPrinter ) {
        if( eTimeMillis - lastTryToConnectTime > 2000 ) {
            if( !isConnected() ) {
                start();
            }
            lastTryToConnectTime = eTimeMillis;
        }
    }
    
    
    _progressPct = 0.0;
    if( _startNumPrinterCommands > 0 ) {
        _progressPct = (( (float)_startNumPrinterCommands - (float)printerCommands.size() ) / (float)_startNumPrinterCommands);
        if( printerCommands.size() == 0 ) {
            _progressPct = 1.0;
        }
    }
    
//    cout << "printerCommands.size() " << printerCommands.size() << " progress: " << _progressPct << " start: " << _startNumPrinterCommands << " | " << ofGetFrameNum() << endl;
    
    
    if( isPaused() ) {
        _lastEstFinishedTimeGuess = eTime;
    }
    
    // based on the printer buffer size avail ...
    if( printerCommands.size() ) {
        if( eTime - _lastEstFinishedTimeGuess >= 0.5 ) {
            float tdiff = eTime - _lastEstFinishedTimeGuess;
            
            // now figure out the time per command to figure out a guess //
            if( _lastEstNumPrinterCommands > 0 && _lastEstFinishedTimeGuess > 0.0 ) {
                float timePerCmd = tdiff / (((float)_lastEstNumPrinterCommands - (float)printerCommands.size())+1.f);
                _estFinishedTimes.push_back( timePerCmd );
                if( _estFinishedTimes.size() > 500 ) {
                    _estFinishedTimes.erase( _estFinishedTimes.begin() );
                }
//                cout << "Time Per Cmd: " << timePerCmd << " getEstTeim: " << getEstTimeRemaining() << " | " << ofGetFrameNum() << endl;
            }
            
            _lastEstNumPrinterCommands = (int) printerCommands.size();
            _lastEstFinishedTimeGuess = eTime;
        }
    } else {
        if( _startNumPrinterCommands ) {
//            _progressPct = 1.0;
            if( !_bPassedFinishEvent ) {
                int temp=1;
                ofNotifyEvent( PrintFinishEvent, temp, this );
                _bPassedFinishEvent=true;
                _endPrintTime = ofGetUnixTime();
            }
        }
    }
    
    
    int penChangeIndex = -1;
    // based on the printer buffer size avail ...
    if( printerCommands.size() && !isPaused() ) {
        
        if( _numPrinterCmdsToSkip > 0 ) {
            if( isConnected() && ofGetFrameNum() % 2 == 0 ) {
                sendCommand( "PU;" );
            }
            for( int i = 0; i < _numPrinterCmdsToSkip && i < printerCommands.size(); i++ ) {
                printerCommands[i].bSent = true;
            }
            cout << "printer cmds: " << printerCommands.size() << " | " << ofGetFrameNum() << endl;
        }
        
        //int terror = getError();
        //cout << "Error: " << terror << endl;
        
        if( _numPrinterCmdsToSkip <= 0 ) {
            // generally on the hp7475 it's 1024 bytes //
            int availBuff = getAvailBufferSize();
    //        cout << "availBuff: " << availBuff << " | " << ofGetFrameNum() << endl;
    //        ofSleepMillis( 10 );
            if( availBuff > 512 ) {
                int totalBytesToSend = 0;
                string pcommandStr = "";
                for( int i = 0; i < printerCommands.size(); i++ ) {
                    
                    if( printerCommands[i].penIndex > -1 ) {
                        printerCommands[i].bSent = true;
                        penChangeIndex = printerCommands[i].penIndex;
                        pause();
                        break;
                    }
                    
                    if( printerCommands[i].command == "" ) continue;
                    
                    int tbytes = (int) printerCommands[i].command.size();
                    if( tbytes + totalBytesToSend >= availBuff-512 ) {
                        break;
                    }
                    totalBytesToSend += tbytes;
                    printerCommands[i].bSent = true;
                    
                    pcommandStr += printerCommands[i].command;
    //                cout << "Sending: " << printerCommands[i].command << " | " << ofGetFrameNum() << endl;
    //                break;
                }
                
                if( totalBytesToSend > 0 && pcommandStr != "" ) {
                    // GOOD FOR DEBUG: cout << "Sending printer commands: " << totalBytesToSend << " avail: " << availBuff << " cmds left: " << printerCommands.size() << " | " << ofGetFrameNum() << endl;
                    sendCommand( pcommandStr );
                }
            }
        }
    }
    
    // clean up the sent commands //
    ofRemove( printerCommands, shouldRemoveSentCommand );
    
    if( penChangeIndex > -1 ) {
        ofNotifyEvent( PenChangeEvent, penChangeIndex, this );
    }
    
    _numPrinterCmdsToSkip=0;
};

//--------------------------------------------------------------
void ofxHPGL::draw() {
    ofRectangle screenRect( 0, 0, ofGetWidth(), ofGetHeight() );
    draw( screenRect );
}

//--------------------------------------------------------------
void ofxHPGL::draw( ofRectangle abounds ) {
    ofRectangle screenRect = abounds;
    ofRectangle frect( 0, 0, getInputWidth(), getInputHeight() );
    frect.scaleTo( screenRect );
    
    ofPushMatrix(); {
        ofTranslate( frect.x, frect.y );
        ofRectangle trect( 0, 0, getInputWidth(), getInputHeight() );
        float tscale = frect.getWidth() / trect.getWidth();
        ofScale( tscale, tscale );
        //    cout << "i: " << drawPolys.size() << " colors: " << drawColors.size() << " | " << ofGetFrameNum() << endl;
        for( int i = 0; i < drawPolys.size(); i++ ) {
            if( i < drawColors.size() ) ofSetColor( drawColors[i] );
            drawPolys[i].draw();
        }
    } ofPopMatrix();
}

#pragma mark - Drawing Commands

//--------------------------------------------------------------
void ofxHPGL::circle( float ax, float ay, float aradius ) {
    _checkInputDims();
    
    ofPolyline tpoly;
    tpoly.arc( ofPoint( ax, ay, 0), aradius, aradius, 0, 360, 60 );
    
    drawPolys.push_back( tpoly );
    drawColors.push_back( getPenColor(penIndex));
    ofxHPGLCommand tc;
    tc.circle( ax, ay, aradius );
    if( isCapturing() ) {
        commands.push_back( tc );
    } else {
        _parseHPGLCommandToPrinterCommand( tc );
    }
}

//--------------------------------------------------------------
void ofxHPGL::rectangle( ofRectangle arect ) {
    _checkInputDims();
    
    ofPolyline tpoly;
    
    tpoly.addVertex( arect.getTopLeft() );
    tpoly.addVertex( arect.getTopRight() );
    tpoly.addVertex( arect.getBottomRight() );
    tpoly.addVertex( arect.getBottomLeft() );
    tpoly.addVertex( arect.getTopLeft() );
    
    drawPolys.push_back( tpoly );
    drawColors.push_back( getPenColor(penIndex));
    
    ofxHPGLCommand tc;
    tc.rectangle( arect.x, arect.y, arect.width, arect.height );
    if( isCapturing() ) {
        commands.push_back( tc );
    } else {
        _parseHPGLCommandToPrinterCommand( tc );
    }
}

//--------------------------------------------------------------
void ofxHPGL::rectangle( float ax, float ay, float awidth, float aheight ) {
    rectangle( ofRectangle(ax, ay, awidth, aheight ));
}

//--------------------------------------------------------------
void ofxHPGL::line( float ax, float ay, float ax2, float ay2 ) {
    ofPolyline tpoly;
    tpoly.addVertex( ax, ay );
    tpoly.addVertex( ax2, ay2 );
    
    polyline( tpoly );
}

//--------------------------------------------------------------
void ofxHPGL::triangle( float ax, float ay, float ax2, float ay2, float ax3, float ay3 ) {
    triangle( ofVec2f(ax, ay), ofVec2f(ax2,ay2), ofVec2f(ax3,ay3) );
}

//--------------------------------------------------------------
void ofxHPGL::triangle( ofVec2f ap1, ofVec2f ap2, ofVec2f ap3 ) {
    ofPolyline tpoly;
    tpoly.addVertex( ap1.x, ap1.y );
    tpoly.addVertex( ap2.x, ap2.y );
    tpoly.addVertex( ap3.x, ap3.y );
    tpoly.addVertex( ap1.x, ap1.y );
    
    polyline( tpoly );
}

//--------------------------------------------------------------
void ofxHPGL::polyline( ofPolyline aline ) {
    if( aline.size() < 2 ) return;
    
    _checkInputDims();
    
    ofxHPGLCommand tcom( aline );
    
    ofFloatColor tcolor = getPenColor(penIndex);
//    cout << drawPolys.size() << " colors: " << drawColors.size() << " color: " << tcolor << " penIndex: " << penIndex << endl;
    
    drawPolys.push_back( aline );
    drawColors.push_back( tcolor );
    if( isCapturing() ) {
        commands.push_back( tcom );
    } else {
        _parseHPGLCommandToPrinterCommand( tcom );
    }
}

//--------------------------------------------------------------
void ofxHPGL::setPenColor( int aPenNumber, ofColor aColor ) {
    _checkInputDims();
    // for visuals only. //
    int tpenIndex = aPenNumber-1;
    if( tpenIndex >= 0 && tpenIndex < penColors.size() ) {
        penColors[ tpenIndex ] = aColor;
    }
}

//--------------------------------------------------------------
ofFloatColor ofxHPGL::getPenColor( int aPenNumber ) {
    int tpenIndex = aPenNumber-1;
    if( tpenIndex >= 0 && tpenIndex < penColors.size() ) {
        return penColors[ tpenIndex ];
    }
    return ofFloatColor( 0.1 );
}

//--------------------------------------------------------------
vector< ofFloatColor > ofxHPGL::getPenColors() {
    return penColors;
}

//--------------------------------------------------------------
void ofxHPGL::setPen( int aPenIndex ) {
    //_checkInputDims();
    
//    if( aPenIndex < 0 || aPenIndex > 6 ) {
//        cout << ("ofxHPGL :: setPen : pen index ( "+ofToString( aPenIndex,0)+" ) is out of range (0-6)" ) << endl;
//        return;
//    }
    
    if( aPenIndex >= 0 ) {
        if( penIndex == aPenIndex ) {
            return;
        }
    }
    
    cout << "setting the pen to " << aPenIndex << endl;
    
    penIndex = aPenIndex;
    ofxHPGLCommand com;
    com.setPen( penIndex );
    
    if( isCapturing() ) {
        commands.push_back( com );
    } else {
        sendCommand( getCommand("SP", com.penIndex ) );
//        sendCommands( _parseHPGLCommandToPrinterCommand(com) );
    }
}

//--------------------------------------------------------------
void ofxHPGL::setPenVelocity( float aVel ) {
    
    // if we are printing, then send it immediately //
//    string outCommand = getCommand("VS", ofMap(aVel, 0.0, 1.0, 0.0, 38, true ));
//    if( aVel < 0 ) {
//        outCommand = "VS;";
//    }
    
    ofxHPGLCommand tcom;
    tcom.setPenVelocity( aVel );
    
    if( isCapturing() ) {
        commands.push_back( tcom );
    } else {
        // send the commands immediately //
        sendCommands( _parseHPGLCommandToPrinterCommand( tcom ) );
    }
}

//--------------------------------------------------------------
void ofxHPGL::setPaperSize( int aPaperSize ) {
    _settings.paperSize = (Settings::PaperSize)aPaperSize;
    // clear the clip rect, so when we query it later, it has adjusted to the new paper size //
    _clipLimitRect.setWidth( 0 );
    _clipLimitRect.setHeight( 0 );
    sendCommand( getCommand( "PS", aPaperSize ));
}

//--------------------------------------------------------------
ofVec2f ofxHPGL::getPrinterPosFromInput( ofVec2f aInput ) {
    ofRectangle drect = getHardClipLimits();
    ofVec2f nvert;
    nvert.x = ofMap( aInput.x, 0, _inWidth, 0, drect.width, true );
    nvert.y = ofMap( aInput.y, 0, _inHeight, drect.height, 0, true );
    return nvert;
}

//--------------------------------------------------------------
ofVec2f ofxHPGL::getPrinterPosFromInput( ofVec2f aInput, ofRectangle& aDestRect ) {
    ofVec2f nvert;
    nvert.x = ofMap( aInput.x, 0, _inWidth, 0, aDestRect.width, true );
    nvert.y = ofMap( aInput.y, 0, _inHeight, aDestRect.height, 0, true );
    return nvert;
}

//--------------------------------------------------------------
void ofxHPGL::skip( int aNumCmdsToSkip ) {
    _numPrinterCmdsToSkip = aNumCmdsToSkip;
}

//--------------------------------------------------------------
void ofxHPGL::clear() {
    penIndex = -1;
    commands.clear();
    printerCommands.clear();
    drawPolys.clear();
    drawColors.clear();
    _startPrintTime = 0;
    _endPrintTime = 0;
    _progressPct = 0;
    _bPassedFinishEvent=false;
    _startNumPrinterCommands=0;
    if( isConnected() ) {
        sendCommand( "PU;" );
    }
}

// http://www.piclist.com/techref/language/hpgl/commands.htm
//--------------------------------------------------------------
void ofxHPGL::print() {
    if( !serial.isInitialized() ) {
        ofLogWarning("ofxHPGL :: print : printer not available.");
        return;
    }
    
    if( serial.isInitialized() ) {
        serial.flush( true, true );
    }
    
    resume();
    
    _estFinishedTimes.clear();
    _lastEstFinishedTimeGuess   = -100;
    _lastEstNumPrinterCommands  = 0;
    _progressPct                = 0.0;
    _bPassedFinishEvent         = false;
    _startPrintTime             = ofGetUnixTime();
    _endPrintTime               = 0;
    
//    cout << "Sending to print : " << commands.size() << " | " << ofGetFrameNum() << endl;
    
    // clear the incoming commands to the printer //
//    addPrinterCommand("IN;");
//    addPrinterCommand("PA;");
//    addPrinterCommand("IM128;");
//    addPrinterCommand("DC;");
    
    addPrinterCommand( "IN;" );
//    addPrinterCommand( "RO;" );
//    addPrinterCommand( "IP;" );
//    addPrinterCommand( "DF;" );
    
    // set no echo //
    // 27 == 'ESC'
    // carriage return = 13
    // line feed = 10
    // 3 terminates labels I think
//    string noEchoStr;
//    noEchoStr.push_back( 27 );
//    noEchoStr.push_back('.');
//    noEchoStr.push_back('M');
//    noEchoStr.push_back('0');
//    noEchoStr.push_back(';');
//    noEchoStr.push_back('0');
//    noEchoStr.push_back(';');
//    noEchoStr.push_back('0');
//    noEchoStr.push_back(';');
//    noEchoStr.push_back('1');
//    noEchoStr.push_back('3');
//    noEchoStr.push_back(':');
//    addPrinterCommand( noEchoStr );
    
    
    
//    string tstr;
//    tstr.resize( 4 );
//    tstr[0] = 27;
//    tstr[1] = '.';
//    tstr[2] = '@';
//    sendCommand( tstr );
    
//    addPrinterCommand("IM0;");
//    addCommand("DF;");
//    addCommand("PU;");
//    addCommand("SC;");
//    addPrinterCommand("PA;");
//    addCommand( getCommand("PS", 1 ));
    
    // make sure to set the pen //
    // add in a command for that //
//    if( penIndex < 1 ) {
//        penIndex = 1;
//        ofxHPGLCommand com;
//        com.setPen( penIndex );
//        commands.insert( commands.begin(), com );
//    }
    
    ofRectangle destRect = getHardClipLimits();
    
    // GOOD FOR DEBUG: cout << "dest Rect: " << destRect << endl;
    
//    float dscalex = destRect.width / _inWidth;
//    float dscaley = destRect.height / _inHeight;
//    addCommand( getCommand("SP", penIndex ));
    
    for( int i = 0; i < commands.size(); i++ ) {
        ofxHPGLCommand& com = commands[i];
        vector< ofxHPGLSerialCommand > serialCmds = _parseHPGLCommandToPrinterCommand( com );
        if( serialCmds.size() ) {
            addPrinterCommands( serialCmds );
        }
        
//        if( com.type == ofxHPGLCommand::SHAPE ) {
//            ofPolyline& cpoly = com.polyline;
//            vector< ofPoint > verts = cpoly.getVertices();
//            if( verts.size() < 2 ) continue;
//            
//            bool bSetPenUp = true;
//            
//            for( int j = 0; j < verts.size(); j++ ) {
//                // move the verts into the right place for the plotter //
//                if( verts[j].x < 0  || verts[j].y < 0 || verts[j].x > _inWidth || verts[j].y > _inHeight ) {
//                    bSetPenUp = true;
////                    addCommand("PU;");
//                    continue;
//                }
//                
//                ofVec2f nvert = getPrinterPosFromInput( verts[j], destRect );
//                
//                if( bSetPenUp ) {
//                    addCommand(getCommand("PU", nvert.x, nvert.y ));
//                    bSetPenUp = false;
//                }
//                
//                addCommand(getCommand("PD", nvert.x, nvert.y ));
//            }
//            addCommand("PU;");
//        } else if( com.type == ofxHPGLCommand::PEN ) {
//            cout << i << " - Setting the pen to " << com.penIndex << endl;
//            addCommand( getCommand("SP", com.penIndex ));
//        } else if( com.type == ofxHPGLCommand::CIRCLE ) {
////            PU1500,1500;
////            CI500;
//            // circle filled // ss<<"WG"<<tc.radius<<","<<0<<","<<360<<","<<5;
//            
//            ofVec2f nvert = getPrinterPosFromInput( ofVec2f(com.pos.x, com.pos.y), destRect );
//            addCommand( getCommand("PU", nvert.x, nvert.y ));
//            addCommand( getCommand("CI", com.radius*dscalex ));
//            addCommand("PU;");
//        } else if( com.type == ofxHPGLCommand::RECTANGLE ) {
////            RA (Rectangle Absolute - Filled, from current position to diagonal x,y):
////            EA (rEctangle Absolute - Unfilled, from current position to diagonal x,y):
////            EA x, y;
//            ofVec2f nvert = getPrinterPosFromInput( ofVec2f(com.pos.x, com.pos.y), destRect );
//            addCommand( getCommand("PU", nvert.x, nvert.y ));
//            addCommand( getCommand("EA", nvert.x+com.width*dscalex, nvert.y+com.height*dscaley ));
//            addCommand( "PU;" );
//        } else if( com.type == ofxHPGLCommand::STRING_COMMAND ) {
//            addCommand( com.strCommand );
//        }
    }
    
    addPrinterCommand("PU;");
    
    _startNumPrinterCommands = (int) printerCommands.size();
    // GOOD FOR DEBUG: cout << "printerCommands size(): " << printerCommands.size() << " num commands: " << commands.size() << endl;
    
//    clear();
//    string pstring = "";
//    for( int i = 0; i < printerCommands.size(); i++ ) {
//        pstring += printerCommands[i].command;
//    }
    
//    printerCommands.clear();
//    
//    cout << " PRINTING about to send string " << endl;
//    cout << pstring << endl;
//    cout << "---------------------------- " << endl;
//    
//    sendCommand( pstring );

    
    
//    sendCommand( getCommand("SP", penIndex ));
    
    // a4 size - A Size
    // p1 250, 596
    // p2 10250, 7796
    // xaxis max 0 to 10365
    // yaxis max 0 to 7962
    
    // a3 size - B Size
    // p1 522, 259
    // p2 15722, 10259
    // xaxis max 0 to 16640
    // yaxis max 0 to 10365
    // xaxis max 0 to 16158
    // yaxis max 0 to 11040
    
    
    
    // fill type
//    FT type, spacing and angle
    // types
    // 1. solid lines with spacing defined in the PT instruction, bidirectional
    // 2. solid lines with spacing defined in the PT instructino, unidirectional
    // 3. parallel lines
    // 4. cross-hatch
    
    // spacing: distance between the lines, between 0 and 32767
    // angle: += 45 degree increments, 0, 45, or 90
    
    
    // input window
    // IW xlo, ylo, x hi, y hi
    
    // Set line type(i) and pattern length(d)
    // LT pattern #, pattern length
    
    // user -unit scaling(i)
    // xmin, xmax, ymin, ymax
    
}

//--------------------------------------------------------------
bool ofxHPGL::isPrinting() {
    return printerCommands.size();
}

//--------------------------------------------------------------
void ofxHPGL::pause() {
    bPause = true;
}

//--------------------------------------------------------------
void ofxHPGL::resume() {
    bPause = false;
}

//--------------------------------------------------------------
bool ofxHPGL::isPaused() {
    return bPause;
}

//--------------------------------------------------------------
void ofxHPGL::enableCapture() {
    _bCapturing = true;
}

//--------------------------------------------------------------
void ofxHPGL::disableCapture() {
    _bCapturing = false;
}

//--------------------------------------------------------------
bool ofxHPGL::isCapturing() {
    return _bCapturing;
}

//--------------------------------------------------------------
void ofxHPGL::rotateCommandsNeg90() {
//    vector< ofxHPGLCommand > commands;
//    vector< ofPolyline > drawPolys;
    float pw = getInputWidth();
    float ph = getInputHeight();
    
    setInputHeight( pw );
    setInputWidth( ph );
    
    for( auto& cmd : commands ) {
        cmd.pos.rotate( -90 );
        cmd.pos.y += _inHeight;
        
        for(auto& v : cmd.polyline.getVertices() ) {
//            v.rotate( -90, ofVec3f(0,0,1));
            v = glm::angleAxis( ofDegToRad(-90.f), glm::vec3(0,0,1)) * v;
            v.y += _inHeight;
        }
    }
    for( auto& dp : drawPolys ) {
        for( auto& v : dp.getVertices() ) {
//            v.rotate( -90, ofVec3f(0,0,1) );
            v = glm::angleAxis( ofDegToRad(-90.f), glm::vec3(0,0,1)) * v;
            v.y += _inHeight;
        }
    }
}

//--------------------------------------------------------------
ofVec2f ofxHPGL::getPenPosition() {
    ofVec2f tpos;
    ofxHPGLSerialCommand com;
    com.command = "OA;";
    sendBlockingResponse( com );
    if( com.didReceiveResponse() ) {
        vector< string > tstrings = ofSplitString( com.printerResponse, "," );
        if( tstrings.size() == 3 ) {
            tpos.set( ofToInt(tstrings[0]), ofToInt(tstrings[1]) );
        }
    }
    return tpos;
}

//--------------------------------------------------------------
int ofxHPGL::getPenStatus() {
    int tstatus = -1;
    ofxHPGLSerialCommand com;
    com.command = "OA;";
    sendBlockingResponse( com );
    if( com.didReceiveResponse() ) {
        vector< string > tstrings = ofSplitString( com.printerResponse, "," );
        if( tstrings.size() == 3 ) {
            tstatus = ofToInt( tstrings[2] );
        }
    }
    return tstatus;
}

//--------------------------------------------------------------
ofRectangle ofxHPGL::getHardClipLimits() {
    
    _checkInputDims();
    
    if( _clipLimitRect.width > 0 && _clipLimitRect.height > 0 ) {
        return _clipLimitRect;
    }
    
    
    ofRectangle trect;
    ofxHPGLSerialCommand com;
    com.command = "OH;";
    sendBlockingResponse( com );
    if( com.didReceiveResponse() ) {
        vector< string > tstrings = ofSplitString( com.printerResponse, "," );
        if( tstrings.size() == 4 ) {
            trect.set( ofToInt(tstrings[0]), ofToInt(tstrings[1]), ofToInt(tstrings[2]), ofToInt(tstrings[3]) );
            _clipLimitRect = trect;
            cout << "Getting hard clip limits: " << _clipLimitRect << endl;
        }
    }
    return trect;
}

//--------------------------------------------------------------
float ofxHPGL::getProgress() {
    return _progressPct;
}

//--------------------------------------------------------------
float ofxHPGL::getEstTimeRemaining() {
    float tnumToAvg = (float)_estFinishedTimes.size();
    if( tnumToAvg < 1 ) return 0;
    float totesAvg = 0.0;
    for( int i = 0; i < tnumToAvg; i++ ) {
        totesAvg += _estFinishedTimes[i];
    }
    return (totesAvg / tnumToAvg ) * (float)getNumPrinterCommands();
}

//--------------------------------------------------------------
string ofxHPGL::getEstTimeRemaintingFormatted() {
//    days = input_seconds / 60 / 60 / 24;
    int tsecs   = getEstTimeRemaining();
    //int days    = tsecs / 60 / 60 / 24;
    int hours   = (tsecs / 60 / 60);// % 24;
    int minutes = (tsecs / 60) % 60;
    int seconds = tsecs % 60;
    return getTimeNumberString( hours )+" : " +getTimeNumberString(minutes) + " : " +getTimeNumberString(seconds);
}

//--------------------------------------------------------------
string ofxHPGL::getTotalPrintTimeFormatted() {
    uint64_t ctime = _endPrintTime;
    if( ctime <= 0 ) {
        ctime = ofGetUnixTime();
    }
    uint64_t stime = _startPrintTime;
    int tsecs = (int)(ctime - stime);// / 1000;
    if( stime <= 0 ) tsecs = 0;
    
//    cout << "stime: " << stime << " etime: " << ctime << " | " << ofGetFrameNum() << endl;
    
//    int days    = tsecs / 60 / 60 / 24;
    int hours   = (tsecs / 60 / 60);// % 24;
    int minutes = (tsecs / 60) % 60;
    int seconds = tsecs % 60;
    return getTimeNumberString( hours )+" : " +getTimeNumberString(minutes) + " : " +getTimeNumberString(seconds);
}

//--------------------------------------------------------------
string ofxHPGL::getTimeNumberString( int anum ) {
    string tstr = ofToString( anum, 0 );
    if( anum < 10 ) {
        tstr = "0"+tstr;
    }
    return tstr;
}

//--------------------------------------------------------------
int ofxHPGL::getError() {
    
//    ofxHPGLSerialCommand com;
//    com.command = "OE;";
    
    
    ofxHPGLSerialCommand com;
    com.sent();
    string tstr;
    tstr.resize( 4 );
    tstr[0] = 27;
    tstr[1] = '.';
    tstr[2] = 'E';
    tstr[3] = ';';
    com.command = tstr;
    
//    cout << "avail buff: " << getAvailBufferSize() << endl;
    
    
//    sendBlockingResponse( com );
//    if( com.didReceiveResponse() ) {
//        cout << "ofxHPGL getError : " << com.printerResponse << " | " << ofGetFrameNum() << endl;
//        int terror = ofToInt( com.printerResponse );
////        return terror;
////        vector< string > tstrings = ofSplitString( com.printerResponse, "," );
////        if( tstrings.size() == 4 ) {
////            
////        }
//    }
    
    ofxHPGLSerialCommand tcom;
    tcom.command = "OE;";
    sendBlockingResponse( tcom );
    if( tcom.didReceiveResponse() ) {
        cout << "ofxHPGL getError : " << tcom.printerResponse << " | " << ofGetFrameNum() << endl;
        int terror = ofToInt( tcom.printerResponse );
        return terror;
//        vector< string > tstrings = ofSplitString( com.printerResponse, "," );
//        if( tstrings.size() == 4 ) {
//
//        }
    }
    
//    ofxHPGLSerialCommand tstat;
//    tstat.command = "OS;";
//    sendBlockingResponse( tstat );
//    if( tstat.didReceiveResponse() ) {
//        cout << "ofxHPGL status : " << tstat.printerResponse << " | " << ofGetFrameNum() << endl;
//        int terror = ofToInt( tstat.printerResponse );
//    }
    
    
//    sendCommand( "IN;" );
    
    return -1;
}

//--------------------------------------------------------------
void ofxHPGL::addPrinterCommand( string astr ) {
    ofxHPGLSerialCommand com;
    com.command = astr;
    printerCommands.push_back( com );
}

//--------------------------------------------------------------
void ofxHPGL::addPrinterCommands( vector< ofxHPGLSerialCommand > aCmds ) {
    if( !aCmds.size() ) return;
    printerCommands.insert( printerCommands.end(), aCmds.begin(), aCmds.end() );
}

//--------------------------------------------------------------
int ofxHPGL::getAvailBufferSize() {
    
    ofxHPGLSerialCommand tcom;
    tcom.sent();
    string tstr;
    tstr.resize( 4 );
    tstr[0] = 27;
    tstr[1] = '.';
    tstr[2] = 'B';
    tcom.command = tstr;
    
    sendBlockingResponse( tcom );
    if( tcom.didReceiveResponse() ) {
        return ofToInt( tcom.printerResponse );
    }
    return 0;
}

//--------------------------------------------------------------
void ofxHPGL::sendBlockingResponse( ofxHPGLSerialCommand& aCommand ) {
    if( !isConnected() ) return;
    aCommand.sent();
    
    sendCommand( aCommand.command );
    int tnumCountTries = 0;
    string tserialIn = "";
    
    while ( tnumCountTries < 1000 && !aCommand.didReceiveResponse() ) {
        if( serial.available() ) {
            
            unsigned char buffer[1];
            while( serial.readBytes( buffer, 1) > 0){
                if (buffer[0] == '\n' || buffer[0] == '\r' || buffer[0] == '\t' || buffer[0] == 13) {
//                    cout << "received an escape character " << endl;
                    aCommand.received( tserialIn );
                    tserialIn = "";
                    break;
                }
                tserialIn.push_back( buffer[0] );
            };
        }
        tnumCountTries++;
        ofSleepMillis( 10 );
    }
}

//--------------------------------------------------------------
string ofxHPGL::getCommand( string aprefix, int ax ) {
    string outstr = aprefix;
    outstr += ofToString( ax, 0 );
    outstr += ";";
//    outstr += '\n';
    return outstr;
}

//--------------------------------------------------------------
string ofxHPGL::getCommand( string aprefix, int ax, int ay ) {
    string outstr = aprefix;
    outstr += ofToString( ax, 0 );
    outstr += ",";
    outstr += ofToString( ay, 0 );
    outstr += ";";
//    outstr += '\n';
    return outstr;
}


// protected
//--------------------------------------------------------------
void ofxHPGL::sendCommand( string astr ) {
    if( !astr.length() ) return;
    if( serial.isInitialized() ) {
        // GOOD FOR DEBUG: cout << "Sending command: " << astr << endl;
        unsigned char buf[ (int)astr.size() ];
        for( int i = 0; i < astr.size(); i++ ) {
            buf[ i ] = astr[i];
        }
        serial.writeBytes(buf, (int)astr.size() );
    } else {
        cout << "serial not initialized " << endl;
    }
}

//--------------------------------------------------------------
void ofxHPGL::sendCommands( vector< ofxHPGLSerialCommand > aCmds ) {
    for( auto& sc : aCmds ) {
        sendCommand( sc.command );
    }
}

//--------------------------------------------------------------
vector< ofxHPGLSerialCommand > ofxHPGL::_parseHPGLCommandToPrinterCommand( ofxHPGLCommand& aCommand ) {
    vector< ofxHPGLSerialCommand > returnCommands;
    
    ofRectangle destRect = getHardClipLimits();
    float dscalex = destRect.width / _inWidth;
    float dscaley = destRect.height / _inHeight;
    
    if( aCommand.type == ofxHPGLCommand::SHAPE ) {
        ofPolyline& cpoly = aCommand.polyline;
        vector< glm::vec3 > verts = cpoly.getVertices();
        if( verts.size() < 2 ) {
            ofLogWarning() << "_parseHPGLCommandToPrinterCommand :: SHAPE : num verts less than 2 ";
            return returnCommands;
        }
        
        bool bSetPenUp = true;
        
        for( int j = 0; j < verts.size(); j++ ) {
            // move the verts into the right place for the plotter //
            if( verts[j].x < 0  || verts[j].y < 0 || verts[j].x > _inWidth || verts[j].y > _inHeight ) {
                bSetPenUp = true;
                continue;
            }
            
            ofVec2f nvert = getPrinterPosFromInput( verts[j], destRect );
            if( bSetPenUp ) {
                returnCommands.push_back(ofxHPGLSerialCommand(getCommand("PU", nvert.x, nvert.y )));
                bSetPenUp = false;
            }
            returnCommands.push_back(ofxHPGLSerialCommand(getCommand("PD", nvert.x, nvert.y )));
        }
        returnCommands.push_back(ofxHPGLSerialCommand("PU;") );
    } else if( aCommand.type == ofxHPGLCommand::PEN ) {
//        cout << i << " - Setting the pen to " << com.penIndex << endl;
//        if( aCommand.penIndex < 1 ) {
////            returnCommands.push_back( ofxHPGLSerialCommand( "SP;" ));
//        } else {
//            returnCommands.push_back( ofxHPGLSerialCommand( getCommand("SP", aCommand.penIndex ) ));
        returnCommands.push_back( ofxHPGLSerialCommand(""));
        returnCommands.back().penIndex = aCommand.penIndex;
//        }
    } else if( aCommand.type == ofxHPGLCommand::CIRCLE ) {
//            PU1500,1500;
//            CI500;
// circle filled // ss<<"WG"<<tc.radius<<","<<0<<","<<360<<","<<5;
        ofVec2f nvert = getPrinterPosFromInput( ofVec2f( aCommand.pos.x, aCommand.pos.y), destRect );
        returnCommands.push_back( ofxHPGLSerialCommand( getCommand("PU", nvert.x, nvert.y )));
        returnCommands.push_back( ofxHPGLSerialCommand( getCommand("CI", aCommand.radius*dscalex )));
        returnCommands.push_back( ofxHPGLSerialCommand("PU;"));
    } else if( aCommand.type == ofxHPGLCommand::RECTANGLE ) {
//            RA (Rectangle Absolute - Filled, from current position to diagonal x,y):
//            EA (rEctangle Absolute - Unfilled, from current position to diagonal x,y):
//            EA x, y;
        ofVec2f nvert = getPrinterPosFromInput( ofVec2f(aCommand.pos.x, aCommand.pos.y), destRect );
        returnCommands.push_back( ofxHPGLSerialCommand( getCommand("PU", nvert.x, nvert.y )));
        returnCommands.push_back( ofxHPGLSerialCommand( getCommand("EA", nvert.x+aCommand.width*dscalex, nvert.y+aCommand.height*dscaley )));
        returnCommands.push_back( ofxHPGLSerialCommand( "PU;" ));
    } else if( aCommand.type == ofxHPGLCommand::STRING_COMMAND ) {
        returnCommands.push_back( ofxHPGLSerialCommand( aCommand.strCommand ));
    } else if( aCommand.type == ofxHPGLCommand::PEN_VELOCITY ) {
        string outCommand = getCommand("VS", ofMap( aCommand.penVelocity, 0.0, 1.0, 0.0, 38, true ));
        if( aCommand.penVelocity < 0 ) {
            outCommand = "VS;";
        }
        returnCommands.push_back( ofxHPGLSerialCommand( outCommand ));
    }
    return returnCommands;
}

//--------------------------------------------------------------
void ofxHPGL::_checkInputDims() {
    if( _inWidth < 0 ) {
        _inWidth = ofGetWidth();
    }
    if( _inHeight < 0 ) {
        _inHeight = ofGetHeight();
    }
}




