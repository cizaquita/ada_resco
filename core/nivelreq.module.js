/**
 * @file LevelRequeriments
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE - fabian @fabianv
 */
(function() { 


    app.modules = app.modules || {};
    app.modules.nivelreq = Nivelreq;

    Nivelreq.initMessage = '/level';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Nivelreq(message) {
        this.chat = message.chat.id,
        this.message_id = message.message_id;
        this.resos = [];
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Nivelreq.prototype.onMessage = function (message) {
        var resp, markup, nivel,
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
                    ["1","2","3","4","5","6"],
                    ["7","8","9","10","11"],
                    ["12","13","14","15","16"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };

                if (text != "/level") {
			if(text == 1){

		            app.telegram.sendMessage(this.chat, "Para nivel <b>1</b> solo requieres escoger facción, recuerda escoge <b>Resistencia</b> y ayudanos a salvar el mundo de la influencia de los shaper." +
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>" +
			"\n\t3.000" +
			"\n<b>Rango máximo de recarga:</b>" +
			"\n\t250Km " , null);
                this.complete = true;

		        }
			else if(text == 2){

		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>2</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t2.500"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 4.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t500Km ", null);
                this.complete = true;

		        }

		        else if(text == 3){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>3</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t20.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 5.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t750Km ", null);
                this.complete = true;
		        }

		        else if(text == 4){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>4</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t70.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 6.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t1.000Km ", null);
                this.complete = true;
		        }

		        else if(text == 5){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>5</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t150.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 7.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t1.250Km ", null);
                this.complete = true;
		        }
		        else if(text == 6){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>6</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t300.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 8000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t1.500Km ", null);
                this.complete = true;
		        }

		        else if(text == 7){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>7</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t600.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 9.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t1.750Km ", null);
                this.complete = true;
		        }

		        else if(text == 8){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>8</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t1'200.000"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 10.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t2.000Km ", null);
                this.complete = true;
		        }

		        else if(text == 9){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>9</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t2'400.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n4 de plata + 1 de oro"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 11.500"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t2.250Km ", null);
                this.complete = true;
		        }

		        else if(text == 10){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>10</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t4'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n5 de plata + 2 de oro"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 13.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t2.500Km ", null);
                this.complete = true;
		        }

		        else if(text == 11){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>11</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t6'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n6 de plata + 4 de oro"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 14.500"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t2.750Km ", null);
                this.complete = true;
		        }

		        else if(text == 12){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>12</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t8'400.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n7 de plata + 6 de oro"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 16.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t3.000Km ", null);
                this.complete = true;
		        }

		        else if(text == 13){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>13</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t12'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n7 de oro + 1 de platino"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 17.500"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t3.250Km ", null);
                this.complete = true;
		        }

		        else if(text == 14){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>14</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t17'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n2 de platino"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 19.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t3.500Km ", null);
                this.complete = true;
		        }

		        else if(text == 15){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>15</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t24'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n3 de platino"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 20.500"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t3.750Km ", null);
                this.complete = true;
		        }

		        else if(text == 16){
		            app.telegram.sendMessage(this.chat, "<i>Para alcanzar el nivel</i> <b>16</b> <i>necesitas:</i>"+
			"\n<b>Ap mínimo:</b>"+
			"\n\t40'000.000"+
			"\n<b>Medallas Mínimas:</b> (recuerda que por ejemplo una medalla de oro cuenta también por una de plata y una de bronce)"+
			"\n4 de platino + 2 onix"+
			"\n\n<i>En este nivel tienes:</i>"+
			"\n<b>Capacidad de XM:</b>"+
			"\n\t 22.000"+
			"\n<b>Rango máximo de recarga:</b>"+
			"\n\t4.000Km ", null);
                this.complete = true;
			}

                }else{
                    app.telegram.sendMessage(this.chat, "Selecciona el nivel que quieres consultar:-", markup);
                }

            }
        }
    };
}());
