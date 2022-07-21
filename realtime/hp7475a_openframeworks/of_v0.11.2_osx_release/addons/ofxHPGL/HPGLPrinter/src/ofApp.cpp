#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
    ofBackground(230);
    hp.setup( "/dev/tty.usbserial-A10172HG" );
    
    hp.setPaperSize( ofxHPGL::Settings::PAPER_SIZE_A3 );
    
    penSpeed.addListener( this, &ofApp::penSpeedChanged );
    buttonPaperSizeA3.addListener( this, &ofApp::paperSizeA3Pressed );
    buttonPaperSizeA4.addListener( this, &ofApp::paperSizeA4Pressed );
    buttonRotateNeg90.addListener( this, &ofApp::rotateHPGLNeg90 );
    buttonSelectFile.addListener( this, &ofApp::promptSelectFile );
    buttonPrint.addListener( this, &ofApp::print );
    buttonOutputError.addListener( this, &ofApp::outputError );
    buttonClearCommands.addListener( this, &ofApp::clearPrinterCommands );
    
    penParams.setName( "Pens" );
    penParams.add( paramPen0.set("Pen0", true ));
    penParams.add( paramPen1.set("Pen1", false ));
    penParams.add( paramPen2.set("Pen2", false ));
    penParams.add( paramPen3.set("Pen3", false ));
    penParams.add( paramPen4.set("Pen4", false ));
    penParams.add( paramPen5.set("Pen5", false ));
    penParams.add( paramPen6.set("Pen6", false ));
    
    ofAddListener( penParams.parameterChangedE(), this, &ofApp::parameterChanged );
    
    // const std::string& collectionName="", const std::string& filename="settings.xml", float x = 10, float y = 10
    gui.setup( "ofxHPGL", "settings.xml", 10, 200 );
    gui.add( buttonPause.setup("Pause", false));
    gui.add( penSpeed.set( "PenSpeed", 0.5, 0, 1.0 ));
    gui.add( buttonPaperSizeA3.setup("PaperSizeA3"));
    gui.add( buttonPaperSizeA4.setup("PaperSizeA4"));
    gui.add( buttonRotateNeg90.setup("RotateNeg90") );
    gui.add( buttonPrint.setup("Print"));
    gui.add( buttonSelectFile.setup("SelectFileToPrint"));
    gui.add( buttonOutputError.setup("GetError"));
    gui.add( paramProgressPct.set("Progress"));
    gui.add( paramEstTimeLeft.set("EstTimeRemaining"));
    gui.add( paramTotalTime.set("TotalTime") );
    gui.add( buttonClearCommands.setup("ClearPrinterCommands"));
    
    gui.add( penParams );
    
    gui.loadFromFile("settings.xml");
    
    buttonPause = false;
    
    hp.setPenColor( 2, ofColor( 1, 27, 77 ));
    //hp.setPenColor( 2, ofColor( 169, 47, 132 )); // rose
    hp.setPenColor( 1, ofColor(211, 132, 19) );
    
    ofAddListener( hp.PenChangeEvent, this, &ofApp::onHPGLPenChangeEvent );
    ofAddListener( hp.PrintFinishEvent, this, &ofApp::onHPGLPrintFinishEvent );
}

//--------------------------------------------------------------
void ofApp::update() {
    
    // check the pens //
    if( buttonPause ) {
        hp.pause();
    } else {
        hp.resume();
    }
    
    if( ofGetKeyPressed('x') ) {
        hp.skip( 250 );
    }
    
    // this is a super rough estimate, does not account for pen speed or distance needed to travel //
    paramEstTimeLeft    = "ETR: "+hp.getEstTimeRemaintingFormatted();
    paramTotalTime      = hp.getTotalPrintTimeFormatted();
    paramProgressPct    = "Progress: "+ofToString( hp.getProgress() * 100, 0 ) + " % ";
    
    hp.update();
}

//--------------------------------------------------------------
void ofApp::draw() {
    ofSetColor( 60 );
    hp.draw();
//    polyline.draw();
    
    ofSetColor( hp.isConnected() ? ofColor( 20, 230, 10 ) : ofColor( 220, 10, 50 ) );
    if( bDrawGui ) ofDrawCircle( 20, 20, 6 );
    
    stringstream ss;
    //ss << "print(p): " << endl;
    //ss << "load(l): parent dir: " << folder.getAbsolutePath() << endl;
    ss << "clear(DEL)" << endl;
//    if( hp.isPrinting() ) {
//        ss << "progress: " << ofToString( hp.getProgress() * 100, 0 ) + " % " << endl;
//        paramProgressPct = ofToString( hp.getProgress() * 100, 0 ) + " % ";
//    }
    
    ss << "paused(spacebar): " << (buttonPause?"yes":"no") << endl;
    
    ofSetColor( 30 );
    if( bDrawGui ) ofDrawBitmapStringHighlight( ss.str(), 80, 20 );
    
    if(bDrawGui) gui.draw();
}

//--------------------------------------------------------------
void ofApp::penSpeedChanged( float& aPenSpeed ) {
    hp.setPenVelocity( penSpeed );
}

//--------------------------------------------------------------
void ofApp::paperSizeA3Pressed() {
    hp.setPaperSize( ofxHPGL::Settings::PAPER_SIZE_A3 );
    // check the dimensions of the window, since that is what determines the output //
    int windowH = 1200.f * (float)(11./17.);
    ofSetWindowShape( 1200, windowH );
//    hp.setInputWidth( ofGetWidth() );
//    hp.setInputHeight( ofGetHeight() );
}

//--------------------------------------------------------------
void ofApp::paperSizeA4Pressed() {
    hp.setPaperSize( ofxHPGL::Settings::PAPER_SIZE_A4 );
    int windowH = 1000.f * (float)(8.27/11.69);
    ofSetWindowShape( 1000, windowH );
//    hp.setInputWidth( ofGetWidth() );
//    hp.setInputHeight( ofGetHeight() );
}

//--------------------------------------------------------------
void ofApp::rotateHPGLNeg90() {
    hp.rotateCommandsNeg90();
}

//--------------------------------------------------------------
void ofApp::promptSelectFile() {
    hp.disableCapture();
    ofFileDialogResult result = ofSystemLoadDialog("Select ofxHPGL or SVG file", false, folder.getAbsolutePath() );
    if( result.bSuccess ) {
        ofFile tfile( result.getPath() );
        folder = ofFile(tfile.getEnclosingDirectory());
        
        if( tfile.getExtension() != "ofxhpgl" && tfile.getExtension() != "svg" ) {
            ofSystemAlertDialog( "Must select an ofxhpgl or svg file." );
            tfile.close();
            return;
        }
        hp.clear();
        
        if( tfile.getExtension() == "svg" ) {
            // parse the svg file //
            if(!paseSvgFile( tfile.getAbsolutePath() )) {
                ofSystemAlertDialog( "Error loading the svg file." );
                tfile.close();
                return;
            }
        } else if( tfile.getExtension() == "ofxhpgl" ) {
            if( !hp.load( tfile.getAbsolutePath() )) {
                ofSystemAlertDialog( "Error loading the hpgl file." );
                tfile.close();
                return;
            }
        }
        
        
        
        fileToPrint = tfile;
    }
}

//--------------------------------------------------------------
void ofApp::print() {
    hp.print();
    hp.setPenVelocity( penSpeed );
}

//--------------------------------------------------------------
void ofApp::outputError() {
    if( hp.isConnected() ) {
        int terror = hp.getError();
        cout << "ofApp :: outputError : " << terror << endl;
    }
}

//--------------------------------------------------------------
void ofApp::clearPrinterCommands() {
    if( hp.isConnected() ) {
        hp.sendCommand( "IN;" );
    }
}

//--------------------------------------------------------------
void ofApp::onHPGLPenChangeEvent( int& arg ) {
    cout << "Change the pen to " << arg << endl;
    say("Please Change pen to "+ofToString(arg,0));
    ofSystemAlertDialog( "Please change the pen to" + ofToString(arg,0 ));
}

//--------------------------------------------------------------
void ofApp::onHPGLPrintFinishEvent( int& arg ) {
    say("Print Complete!");
    ofSystemAlertDialog( "Print Complete!");
}

//--------------------------------------------------------------
void ofApp::parameterChanged( ofAbstractParameter& aparameter ) {
    string pname = aparameter.getName();
    if( ofIsStringInString( pname, "Pen" ) && pname.length() < 6 ) {
        // now loop throuh and uncheck the other ones //
        if( aparameter.type() == typeid( ofParameter<bool>).name() ) {
            ofParameter< bool > godDamnThisIsAlotOfTypeing = static_cast<ofParameter<bool>& >( aparameter );
            if( godDamnThisIsAlotOfTypeing == false ) {
                return;
            }
        }
        
//        cout << "Pen index: " << pname << " | " << ofGetFrameNum() << endl;
        
        for( int i = 0; i < penParams.size(); i++ ) {
            if( penParams.get(i).getName() != pname ) {
                // set it to false //
                if( penParams.get(i).type() == typeid(ofParameter<bool>).name() ) {
                    ofParameter<bool>& oparam = penParams.get<bool>(i);
                    //oparam.disableEvents();
                    if( oparam == true ) {
                        oparam = false;
                    }
                }
            }
        }
        for( int i = 0; i < penParams.size(); i++ ) {
            if( penParams.get(i).type() == typeid(ofParameter<bool>).name() ) {
                ofParameter<bool>& oparam = penParams.get<bool>(i);
                oparam.enableEvents();
            }
        }
        
        string penIndex = pname;
        ofStringReplace( penIndex, "Pen", "" );
        int penIndexI = ofToInt( penIndex );
//        if( penIndexI > 0 ) {
//            hp.sendCommand( hp.getCommand("SP", penIndexI ) );
//        } else {
//            hp.sendCommand( "SP;" );
//        }
        hp.disableCapture();
        hp.setPen( penIndexI );
    }
}

//--------------------------------------------------------------
bool ofApp::paseSvgFile( string aPath ) {
    
#ifdef OFX_SVG_LOADER
    ofxSvgLoader svg;
    if( !svg.load( aPath )) return false;
    
    hp.clear();
    hp.enableCapture();
    // now loop through and add everything to the printer //
    vector< shared_ptr< ofxSvgBase > > elements = svg.getAllElements();
    for( auto& e : elements ) {
        if( !e ) continue;
        
        cout << "Element: " << e->getName() << endl;
        
        // check the name for setting the pen //
        string ename = e->getName();
        if( ofIsStringInString( ename, "pen") && ename.length() > 3 ) {
            string penStr = ename;
            ofStringReplace( penStr, "pen", "" );
            hp.setPen( ofToInt( string(&penStr.front()) ));
        }
        
        if( !e->isGroup() ) {
            if(e->getType() == ofxSvgBase::OFX_SVG_TYPE_RECTANGLE ||
               e->getType() == ofxSvgBase::OFX_SVG_TYPE_PATH ||
               e->getType() == ofxSvgBase::OFX_SVG_TYPE_CIRCLE ||
               e->getType() == ofxSvgBase::OFX_SVG_TYPE_ELLIPSE ) {
                
                shared_ptr< ofxSvgElement > ele = dynamic_pointer_cast<ofxSvgElement>( e );
                if( ele ) {
                    
                    
                    ofPath& path = ele->path;
                    vector< ofPolyline > tlines = path.getOutline();
//                    cout << "This element has something to show us " << tlines.size() << endl;
                    
                    for( auto& line : tlines ) {
//                        cout << "Adding a polyline: " << " | " << ofGetElapsedTimef() << endl;
                        hp.polyline( line );
                    }
                }
            }
        }
    }
#else
    if(!ofFile::doesFileExist(aPath)) { return false; }
    
    hp.clear();
    hp.enableCapture();
    ofxSVG svg;
    svg.load(aPath);
    for (ofPath p : svg.getPaths()){
        // svg defaults to non zero winding which doesn't look so good as contours
        p.setPolyWindingMode(OF_POLY_WINDING_ODD);
        const vector<ofPolyline>& lines = p.getOutline();
        for(const ofPolyline & line: lines){
            hp.polyline( line.getResampledBySpacing(2) );
        }
    }
    
#endif
    hp.disableCapture();
    return true;
}

//--------------------------------------------------------------
void ofApp::say( string aStr ) {
#ifdef TARGET_OSX
    string sysCmnd = "say -v Vicki "+aStr;
    system( sysCmnd.c_str() );
#endif
}

//--------------------------------------------------------------
void ofApp::exit() {
    
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
    
    if( key == 'p' ) {
        print();
    }
    if( key == 127 || key == OF_KEY_DEL ) {
        hp.clear();
    }
    
    if( key == ' ' ) {
        buttonPause = !buttonPause;
    }
    
    if( key == 'd' ) {
        bDrawGui = !bDrawGui;
        if( bDrawGui ) {
            gui.registerMouseEvents();
        } else {
            gui.unregisterMouseEvents();
        }
    }
    
//    if( key == 'x' ) {
//        ofPolyline tempPoly;
//        for( int i = 0; i < 320; i++ ) {
//            float tang = (float)i*0.1;
//            tempPoly.addVertex( ofPoint( cos( tang ) * (float)i*2 + 500, sin(tang) * (float)i + 500) );
//        }
//        
//        ofPolyline tempPoly2;
//        for( int i = 0; i < 200; i++ ) {
//            tempPoly2.addVertex( ofPoint((float)i * 2 + 80, (float)i + 50 ) );
//        }
//        
//        hp.clear();
//        hp.enableCapture();
//        hp.setPen( 1 );
//        hp.polyline( tempPoly );
//        hp.setPen( 2 );
//        hp.polyline( tempPoly2 );
//        hp.disableCapture();
//        hp.save( ofGetTimestampString() );
//        
//    }
    
//    if( key == 'a' ) {
//        cout << hp.getPenPosition() << endl;
//    }
//    if( key == '0' ) {
//        hp.sendCommand( "SP;" );
//    }
//    if( key == '1' ) {
//        hp.sendCommand( hp.getCommand("SP", 1 ) );
//    }
//    if( key == '2' ) {
//        hp.sendCommand( hp.getCommand("SP", 2 ) );
//    }
//    if( key == '3' ) {
//        hp.sendCommand( hp.getCommand("SP", 3 ) );
//    }
//    if( key == '4' ) {
//        hp.sendCommand( hp.getCommand("SP", 4 ) );
//    }
//    if( key == '5' ) {
//        hp.sendCommand( hp.getCommand("SP", 5 ) );
//    }
//    if( key == '6' ) {
//        hp.sendCommand( hp.getCommand("SP", 6 ) );
//    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
    
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
