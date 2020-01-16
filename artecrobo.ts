/**
 * Types of DC motor control
 */
enum LEDmotion {
	//% block="ON"
	ON,
	//% block="OFF"
	OFF
}

enum connectorLED {
	//% block="P0"
	P0,
	//% block="P1"
	P1,
	//% block="P2"
	P2
}

enum DCmotion {
	//% block="Forward"
	Forward,
	//% block="Backward"
	Backward,
	//% block="Brake"
	Brake,
	//% block="Coast"
	Coast
}

enum connectorDCMotor {
	//% block="M1"
	M1,
	//% block="M2"
	M2
}

enum connectorServoMotor {
	//% block="P13"
	P13 = AnalogPin.P13,
	//% block="P14"
	P14 = AnalogPin.P14,
	//% block="P15"
	P15 = AnalogPin.P15
}

/**
 * ArtecRobo control package
 */
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo"
namespace artecrobo {

	/* spped initial value */
	
	/* spped initial value */
	let speedM1 = 1023;
	let speedM2 = 1023;
	let state = DCmotion.Brake;

	// Move DC motor
	//% blockId=artec_move_dc_motor group="Motor"
	//% block="DC motor %_connector| motion: %_motion"
	export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
		switch(_motion) {
			case DCmotion.Forward:
				/*
					Move Forward
					M1:P8 = speed, P12 = 0
					M2:P0 = speed, P16 = 0
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.analogWritePin(AnalogPin.P12, speedM1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.analogWritePin(AnalogPin.P16, speedM2);
				}
				break;
			case DCmotion.Backward:
				/*
					Move Backward
					M1:P8 = 0, P12 = speeed
					M2:P0 = 0, P16 = speeed
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.analogWritePin(AnalogPin.P8, speedM1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.analogWritePin(AnalogPin.P0, speedM2);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Brake:
				/*
					Brake
					M1:P8 = 1, P12 = 1
					M2:P0 = 1, P16 = 1
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Coast:
				/*
					Coast
					M1:P8 = 0, P12 = 0
					M2:P0 = 0, P16 = 0
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 0);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
		}
		state = _motion;
	}

	//% blockId=artec_set_speed_dc_motor group="Motor"
	//% block="DC motor %_connector| speed: %_speed"
	//% _speed.min=0 _speed.max=1023
	export function setSpeedDCMotor(_connector: connectorDCMotor, _speed: number): void {
		if (_speed < 0)		{ _speed = 0; }
		if (_speed > 1023)	{ _speed = 1023; }
		if (_connector == connectorDCMotor.M1) {
			speedM1 = 1023 - _speed;
		} else {
			speedM2 = 1023 - _speed;
		}
		if (state == DCmotion.Forward || state == DCmotion.Backward) {
			moveDCMotor(_connector, state);
		}
	}
	let angleP13 = 90;
	let angleP14 = 90;
	let angleP15 = 90;
	pins.servoWritePin(AnalogPin.P13, angleP13);
	pins.servoWritePin(AnalogPin.P14, angleP14);
	pins.servoWritePin(AnalogPin.P15, angleP15);

	//% blockId=artec_move_servo_motor_max group="Motor"
	//% block="move servo pin %_connector| to (degrees) %_angle"
	//% _angle.min=0 _angle.max=180
	export function moveServoMotorMax(_connector: connectorServoMotor, _angle: number): void {
		if (_angle < 0)		{ _angle = 0; }
		if (_angle > 180)	{ _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.P13:
				pins.servoWritePin(AnalogPin.P13, _angle);
				angleP13 = _angle;
				break;
			case connectorServoMotor.P14:
				pins.servoWritePin(AnalogPin.P14, _angle);
				angleP14 = _angle;
				break;
			case connectorServoMotor.P15:
				pins.servoWritePin(AnalogPin.P15, _angle);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	//% blockId=artec_move_servo_motor group="Motor"
	//% block="move servo pin %_connector| to (degrees) %_angle| speed: %_speed"
	//% _angle.min=0 _angle.max=180
	//% _speed.min=0 _speed.max=20
	export function moveServoMotor(_connector: connectorServoMotor, _angle: number, _speed: number): void {
		if (_speed < 1)		{ _speed = 1; }
		if (_speed > 20)	{ _speed = 20; }
		if (_angle < 0)		{ _angle = 0; }
		if (_angle > 180)	{ _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.P13:
				moveservo(AnalogPin.P13, angleP13, _angle, _speed);
				angleP13 = _angle;
				break;
			case connectorServoMotor.P14:
				moveservo(AnalogPin.P14, angleP14, _angle, _speed);
				angleP14 = _angle;
				break;
			case connectorServoMotor.P15:
				moveservo(AnalogPin.P15, angleP15, _angle, _speed);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	function moveservo (_pin: AnalogPin, _FromAngle: number, _ToAngle: number, _speed: number): void {
		const diff = Math.abs(_ToAngle - _FromAngle );
		if (diff == 0) return;

		const interval = Math.abs(_speed - 20) + 3;
		let dir = 1;
		if(_ToAngle - _FromAngle < 0) {
			dir = -1;
		}
		for(let i = 1; i <= diff; i++ ) {
			_FromAngle = _FromAngle + dir;
			pins.servoWritePin(_pin, _FromAngle);
			basic.pause(interval);
		}
	}

	/**
	 * Move Servo Motor Async.
	 * @param speed speed
	 * @param angle13 ServoMotor Angle P13
	 * @param angle14 ServoMotor Angle P14
	 * @param angle15 ServoMotor Angle P15
	 */
	//% weight=84 group="Motor"
	//% blockId=artec_async_move_servo_motor
	//% block="move servo synchronously | speed: %_speed| P13 (degrees): %_angle13| P14 (degrees): %_angle14 |P15 (degrees): %_angle15"
	//% _speed.min=1 _speed.max=20
	//% _angle13.min=0 _angle13.max=180
	//% _angle14.min=0 _angle14.max=180
	//% _angle15.min=0 _angle15.max=180
	export function AsyncMoveServoMotor(_speed: number,  _angle13: number,  _angle14: number, _angle15: number): void {
		if (_speed < 0)		{ _speed = 0; }
		if (_speed > 20)	{ _speed = 20; }
		if (_angle13 < 0)	{ _angle13 = 0; }
		if (_angle13 > 180)	{ _angle13 = 180; }
		if (_angle14 < 0)	{ _angle14 = 0; }
		if (_angle14 > 180)	{ _angle14 = 180; }
		if (_angle15 < 0)	{ _angle15 = 0; }
		if (_angle15 > 180)	{ _angle15 = 180; }
		const interval = Math.abs(_speed - 20) + 3;
		// サーボモーターを動かす方向
		let dirP13 = 1;
		if(_angle13 - angleP13 < 0) {
			dirP13 = -1;
		}

		let dirP14 = 1;
		if(_angle14 - angleP14 < 0) {
			dirP14 = -1;
		}

		let dirP15 = 1;
		if(_angle15 - angleP15 < 0) {
			dirP15 = -1;
		}

		const diffP13 = Math.abs(angleP13 - _angle13);    // 変化量
		const diffP14 = Math.abs(angleP14 - _angle14);    // 変化量
		const diffP15 = Math.abs(angleP15 - _angle15);    // 変化量
		let maxData = Math.max(diffP13, diffP14);
		maxData = Math.max(maxData, diffP15);

		let divideP13 = 0;
		if (diffP13 != 0) {
			divideP13 = maxData / diffP13;  // 1度変化させる間隔
		}

		let divideP14 = 0;
		if (diffP14 != 0) {
			divideP14 = maxData / diffP14;  // 1度変化させる間隔
		}

		let divideP15 = 0;
		if (diffP15 != 0) {
			divideP15 = maxData / diffP15;  // 1度変化させる間隔
		}

		for(let i = 1; i <= maxData; i++ ) {
			if (diffP13 != 0) {
				if( i % divideP13 == 0 ){
					angleP13 = angleP13 + dirP13;
					pins.servoWritePin(AnalogPin.P13, angleP13);
				}
			}
			if (diffP14 != 0) {
				if( i % divideP14 == 0 ){
					angleP14 = angleP14 + dirP14;
					pins.servoWritePin(AnalogPin.P14, angleP14);
				}
			}
			if (diffP15 != 0) {
				if( i % divideP15 == 0 ){
					angleP15 = angleP15 + dirP15;
					pins.servoWritePin(AnalogPin.P15, angleP15);
				}
			}
			basic.pause(interval);
		}
		// 最後に全部そろえる。
		angleP13 = _angle13;
		angleP14 = _angle14;
		angleP15 = _angle15;
		if (diffP13 != 0) pins.servoWritePin(AnalogPin.P13, angleP13);
		if (diffP14 != 0) pins.servoWritePin(AnalogPin.P14, angleP14);
		if (diffP15 != 0) pins.servoWritePin(AnalogPin.P15, angleP15);
	}
	
	//serial
    let _SERIAL_INIT = false
    let _WIFI_CONNECTED = false
    let _SERIAL_TX = SerialPin.P15
    let _SERIAL_RX = SerialPin.P14
    let _WIFI_SSID = ""
    let _WIFI_PASSWORD = ""
    let _IP = ""
    let cityID = ""
    let weatherKey = ""
    let aa = 0

    function WriteString(text: string): void {
        serial.writeString(text)
    }
    
    /*
    function startWork():void{
        basic.clearScreen()
        led.plot(1, 2)
        led.plot(2, 2)
        led.plot(3, 2)
    }
    */

    function _serial_init(): void {
        WriteString("123")
        let item = serial.readString()
        item = serial.readString()
        item = serial.readString()
        serial.redirect(
            _SERIAL_TX,
            _SERIAL_RX,
            BaudRate.BaudRate9600
        )
        serial.setRxBufferSize(200)
        serial.setTxBufferSize(100)
        WriteString("\r")
        item = serial.readString()
        WriteString("|1|1|\r")
        item = serial.readUntil("\r")
        item = serial.readString()
        item = serial.readString()
        item = serial.readString()
        item = serial.readString()
        _SERIAL_INIT = true
    }

    function getTimeStr(myTimes: number): string {
        let myTimeStr = ""
        let secs = myTimes % 60
        let mins = Math.trunc(myTimes / 60)
        let hours = Math.trunc(mins / 60)
        mins = mins % 60
        hours = hours % 24
        if (hours < 10)
            myTimeStr = "0" + hours
        else
            myTimeStr = "" + hours
        myTimeStr += ":"
        if (mins < 10)
            myTimeStr = myTimeStr + "0" + mins
        else
            myTimeStr = myTimeStr + mins
        myTimeStr += ":"
        if (secs < 10)
            myTimeStr = myTimeStr + "0" + secs
        else
            myTimeStr = myTimeStr + secs
        return myTimeStr
    }

    function _connect_wifi(): void {
        if (_SERIAL_INIT) {
            if (!_SERIAL_INIT) {
                _serial_init()
            }
            let item = "test"
            WriteString("|2|1|" + _WIFI_SSID + "," + _WIFI_PASSWORD + "|\r") //Send wifi account and password instructions
            item = serial.readUntil("\r")
            while (item.indexOf("|2|3|") < 0) {
                item = serial.readUntil("\r")
            }
            _IP = item.substr(5, item.length - 6)
            _WIFI_CONNECTED = true
            basic.showIcon(IconNames.Yes)
        }

    }


    /**
     * Setup  Tx Rx to micro:bit pins and WIFI SSID, password.
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param receive to receive ,eg: SerialPin.P1
     * @param send to send ,eg: SerialPin.P2
    */
    //% weight=100 group="IOT"
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=_WIFI_setup blockGap=5
    //% block=" setup WIFI | Pin set: | Receive data (RX): %receive| Send data (TX): %send | Wi-Fi: | Name: %SSID| Password: %PASSWORD| Start connection"
    export function _WIFI_setup(/*serial*/receive: SerialPin, send: SerialPin,
                                     /*wifi*/SSID: string, PASSWORD: string
    ):
        void {
        basic.showLeds(`
        . . . . .
        . . . . .
        . # # # .
        . . . . .
        . . . . .
        `)
        _WIFI_SSID = SSID
        _WIFI_PASSWORD = PASSWORD
        _SERIAL_TX = send
        _SERIAL_RX = receive
        _serial_init()
        _connect_wifi()
    }
/*
    //% weight=99
    //% blockId=_serial_disconnect
    //% block=" serial disconnect"
    export function _serial_disconnect(): void {
        _SERIAL_INIT = false
    }
    //% weight=98
    //% blockId=_serial_reconnect
    //% block=" serial reconnect"
    export function _serial_reconnect(): void {
        _serial_init()
    }
*/

    /**
     * connect to https://thingspeak.com/ to store the data from micro:bit
    */
    //% weight=92 group="IOT"
    //% blockId=saveToThingSpeak blockGap=5
    //% expandableArgumentMode"toggle" inlineInputMode=inline
    //% block="send data to ThingSpeak :| write key: %myKey field1: %field1 || field2: %field2 field3: %field3 field4: %field4 field5: %field5 field6: %field6 field7: %field7 field8: %field8"
    export function saveToThingSpeak(myKey: string, field1:number, field2?:number, field3?:number, field4?:number, field5?:number, field6?:number, field7?:number, field8?:number): void {
        _serial_init()
        basic.showLeds(`
        . . . . .
        . . . . .
        . # # # .
        . . . . .
        . . . . .
        `)
        let returnCode=""
        let myArr:number[]=[field1,field2,field3,field4,field5,field6,field7,field8]
        let myUrl = "http://api.thingspeak.com/update?api_key=" + myKey
        for(let i=0;i<myArr.length;i++)
        {
            if (myArr[i]!=null)
                myUrl+="&field"+(i+1)+"="+myArr[i]
            else
                break
        }
        serial.readString()
        WriteString("|3|1|" + myUrl + "|\r")
        for (let i = 0; i < 3; i++) {
            returnCode = serial.readUntil("|")
        }
        if (returnCode == "200")
            basic.showIcon(IconNames.Yes)
        else
            basic.showIcon(IconNames.No)
    }

    /**
     * connect to IFTTT to trig some event and notify you
    */
    //% weight=91  group="IOT"
    //% blockId=sendToIFTTT blockGap=5
    //% expandableArgumentMode"toggle" inlineInputMode=inline
    //% block="send data to IFTTT to trig other event:| event name: %eventName| your key: %myKey || value1: %value1 value2: %value2 value3: %value3"
    export function sendToIFTTT(eventName:string, myKey: string, value1?:number, value2?:number, value3?:number): void {
        _serial_init()
        basic.showLeds(`
        . . . . .
        . . . . .
        . # # # .
        . . . . .
        . . . . .
        `)
        let returnCode=""
        let myArr:number[]=[value1,value2,value3]
        let myUrl = "http://maker.ifttt.com/trigger/"+eventName+"/with/key/" + myKey+"?"
        for(let i=0;i<myArr.length;i++)
        {
            if (myArr[i]!=null)
                myUrl+="&value"+(i+1)+"="+myArr[i]
            else
                break
        }
        serial.readString()
        WriteString("|3|1|" + myUrl + "|\r")
        for (let i = 0; i < 3; i++) {
            returnCode = serial.readUntil("|")
        }
        if (returnCode == "200")
            basic.showIcon(IconNames.Yes)
        else
            basic.showIcon(IconNames.No)
    }

	// Turn LED 
	//% blockId=artec_turn_led group="Sensor"
	//% block="turn LED %_connector|: %_motion"
	export function turnLED(_connector: connectorLED, _motion: LEDmotion): void {
		switch(_motion) {
			case LEDmotion.ON:
				if (_connector == connectorLED.P0) {
					pins.digitalWritePin(DigitalPin.P0, 1);
				} else if (_connector == connectorLED.P1) {
					pins.digitalWritePin(DigitalPin.P1, 1);
				} else {
					pins.digitalWritePin(DigitalPin.P2, 1);
				}
				break;
			case LEDmotion.OFF:
				if (_connector == connectorLED.P0) {
					pins.digitalWritePin(DigitalPin.P0, 0);
				} else if (_connector == connectorLED.P1) {
					pins.digitalWritePin(DigitalPin.P1, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P2, 0);
				}
				break;
		}
	}
	
	/**
     * Measure the sound level as a number between 0 and 100
     * @param pin The pin that the mic is attached to.
     */
    //% block = "sound sensor value" group="Sensor"
    export function soundLevel(pin: AnalogPin): number {
        let n = 1000
        let max = 0
        for (let i = 0; i < n; i++) {
            let value = Math.round((pins.analogReadPin(pin) - 511) / 5);
            if (value > 100) {
                value = 100;
            }
            if (value > max) {
                max = value;
            }
        }
        return max;
    }

    /**
     * Measure the temperature in degrees C
     * @param pin The pin that the temerature sensor is attached to.
     */
    //% block group="Sensor"
    export function tempC(pin: AnalogPin): number {
        let R2 = 100000.0;
        let R25 = 100000.0;
        let B = 4275.0;
        let t0k = 273.15;
        let t0 = t0k + 25;

        let reading = pins.analogReadPin(pin);
        let vout = reading * 3.3 / 1023.0;
        let r = (R2 * (3.3 - vout)) / vout;
        let inv_t = 1.0 / t0 + (1.0 / B) * Math.log(r / R25);
        let t = (1.0 / inv_t) - t0k;
        return (Math.round(t));
    }

    /**
    * Measure the temperature in degrees F
    * @param pin The pin that the temerature sensor is attached to.
    */
    //% block group="Sensor"
    export function tempF(pin: AnalogPin): number {
        let temp_c = tempC(pin);
        return (Math.round(temp_c * 9.0 / 5.0) + 32);
    }

    /**
     * Measure the light level as a number between 0 and 100
     * @param pin The pin that the light sensor is attached to.
     */
    //% block group="Sensor"
    export function lightLevel(pin: AnalogPin): number {
        let max_reading = 28;
        let value = Math.sqrt(pins.analogReadPin(pin)); // to compensate for inverse square indoor lack of sensitivity
        let light_level = Math.round(pins.map(value, 0, max_reading, 0, 100));
        if (light_level > 100) {
            light_level = 100;
        }
        return light_level;
    }
	
	/**
     * Measure the light level as a number between 0 and 100
     * @param pin The pin that the light sensor is attached to.
     */
    //% block group="Sensor"
    export function IRLevel(pin: AnalogPin): number {
        let max_reading = 28;
        let value = Math.sqrt(pins.analogReadPin(pin)); // to compensate for inverse square indoor lack of sensitivity
        let IR_level = Math.round(pins.map(value, 0, max_reading, 0, 100));
        if (IR_level > 100) {
            IR_level = 1;
        }
		else{
			IR_level = 0;
		}
        return IR_level;
    }
	
}
