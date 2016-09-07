/**
 * @file Distance
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE
 */
(function() {
    app.modules = app.modules || {};
    app.modules.distancecalc = Distancecalc;

    Distancecalc.initMessage = '/distance';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Distancecalc(message) {
        this.chat = message.chat.id,
        this.modsCount = 0;
        this.message_id = message.message_id;
        this.i = 0;
	this.j = 0;
        this.resos = [];
	this.LAmp = 0;
	this.VRLAmp = 0;
	this.SBUL = 0;
	this.mods = [0,0,0,0];
	this.mod = [];
	this.amp = 1;
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Distancecalc.prototype.onMessage = function (message) {
        var resp, markup, distancia,
            keyboard = [],
            text = message.text;
            console.log("texto calculadora " + text);
        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Ir"
        inline_button_califica.url = "https://telegram.me/ada_resco_bot?start";
        //
        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////
        if (this.chat < 0) {
            app.telegram.sendMessage(this.chat, "<i>Utiliza esta funionalidad por privado!</i>", inline_markup);
            this.complete = true;
        }else{
            if (text == "Cancelar") {
                app.telegram.sendMessage(this.chat, "Tarea cancelada.", null);
                this.complete = true;
            }else{
                /////////////////////////////////////
                console.log("numero reso" + this.resos.length);
                //this.complete = true;              
                keyboard = [
                    ["1","2","3","4"],
                    ["5","6","7","8"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                        keyboardm = [
                            ["Link Amp Rare"],
                            ["Link Amp Very Rare"],
                            ["Softbank Ultra Link"],
                            ["No mas"]
                        ];
                markupm = {
                    keyboard: keyboardm,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                if (text != "/distance") {
                    this.resos[this.i] = text;
                    this.i++;
                    if(this.resos.length <= 7){
                        app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador(" + (this.i+1) + "):", markup);                            
                    }else{
                        keyboard = [
                            ["Link Amp"],
                            ["Link Amp Very Rare"],
                            ["Softbank Ultra Link"],
                            ["Ninguno"]
                        ];
			var suma = 0;
			var elevar = 0;
			var resultado = 0;
                        suma = ((Number(this.resos[0]) + Number(this.resos[1]) + Number(this.resos[2]) + Number(this.resos[3]) +
                                      Number(this.resos[4]) + Number(this.resos[5]) + Number(this.resos[6]) + Number(this.resos[7]))/8);
                        elevar = Math.pow(suma, 4);
                        resultado = elevar * 160;
			if ((text != 1) && (text != 2) && (text != 3) && (text != 4) && (text != 5) && (text != 6) && (text != 7) && (text != 8)){
				if((text != "No mas") && (this.modsCount <3)){
				app.telegram.sendMessage(this.chat, "Selecciona los mods instalados en el portal:", markupm);
					if (text == "Link Amp Rare") {
		                   		 this.LAmp ++;
		                    		this.modsCount++;
		               		 }else if(text == "Link Amp Very Rare"){
		                   		 this.VRLAmp ++;
		                   		 this.modsCount++;
		                	}else if(text == "Softbank Ultra Link"){
		                   		 this.SBUL ++;
		                   		 this.modsCount++;
		             		}				
				}
				else{
					if (text == "Link Amp Rare") {
		                   		 this.LAmp ++;
		               		 }else if(text == "Link Amp Very Rare"){
		                   		 this.VRLAmp ++;
		                	}else if(text == "Softbank Ultra Link"){
		                   		 this.SBUL ++;
		             		}
					this.mod[0]=this.VRLAmp;
					this.mod[1]=this.SBUL;
					this.mod[2]=this.LAmp;	
					while (this.VRLAmp > 0){
						this.mods[this.j]=7;
						this.VRLAmp--;
						this.j++;
					}
					while (this.SBUL > 0){
						this.mods[this.j]=5;
						this.SBUL--;
						this.j++;	
					}
					while (this.LAmp > 0){
						this.mods[this.j]=2;
						this.LAmp--;
						this.j++;	
					}
					if ( this.j !=0){
						this.amp=this.mods[0]+(this.mods[1]*.25)+(this.mods[2]*.125)+(this.mods[3]*.125);
					}
					resultado = resultado*this.amp;
					var medida = new String();
					if (resultado < 1000){
						medida = "m";
					}
				        if (resultado >= 1000){
						resultado = resultado /1000;
						medida = "Km";
					}
					app.telegram.sendMessage(this.chat, "Resonadores: " +
                                                    "\n<b>1</b> - L" +this.resos[0] +
                                                    "\n<b>2</b> - L" +this.resos[1] +
                                                    "\n<b>3</b> - L" +this.resos[2] +
                                                    "\n<b>4</b> - L" +this.resos[3] +
                                                    "\n<b>5</b> - L" +this.resos[4] +
                                                    "\n<b>6</b> - L" +this.resos[5] +
                                                    "\n<b>7</b> - L" +this.resos[6] +
                                                    "\n<b>8</b> - L" +this.resos[7] +
						    "\n<b>MODS</b>"+
                                                    "\n<b>Link Amp Rare</b>           - " +this.mod[2] +
                                                    "\n<b>Softbank Ultra Link</b>  - " +this.mod[1] +
                                                    "\n<b>Link Amp Very Rare</b>  - " +this.mod[0] +
                                                    "\n\nLa Distancia máxima del portal es: " + resultado + medida + ", ¿que planes tienes para hoy?", null);
               						 this.complete = true;
				}
			}
			else{
			app.telegram.sendMessage(this.chat, "Selecciona los mods instalados en el portal:-", markupm);			
			}
                    }
                }else{
                    app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador(" + (this.i+1) + "):-", markup);                        
                }

            }
        }
    };
}());
