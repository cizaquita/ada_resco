/**
 * @file Distance
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE
 */
(function() {
    app.modules = app.modules || {};
    app.modules.biocard = Biocard;

    //Biocard.initMessage = '/biocard';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Biocard(message) {
        this.chat = message.chat.id,
        this.message_id = "",
        this.nickname = "",
        this.faction = "",
        this.template = "",
        this.title = "",
        this.description = "",
        this.bg_color = 
                                [
                                    //NOMBRE            HEXADECIMAL
                                    //bg_color[0][0]    bg_color[0][1]
                                    ['Blanco', 'FFFFFF'],
                                    ['Plateado', 'C0C0C0'],
                                    ['Gris', '808080'],
                                    ['Negro', '000000'],
                                    ['Rojo', 'FF0000'],
                                    ['Marrón', '800000'],
                                    ['Amarillo', 'FFFF00'],
                                    ['Oliva', '808000'],
                                    ['Lima', '00FF00'],
                                    ['Verde', '008000'],
                                    ['Agua', '00FFFF'],
                                    ['Verde Azulado', '008080'],
                                    ['Azul', '0000FF'],
                                    ['Navy', '000080'],
                                    ['Fucsia', 'FF00FF'],
                                    ['Purpura', '800080']
                                ],
        this.sello = null,
        this.bg_color_sel = "",
        this.logo_sel = "",
        this.logo_tmp = "";
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Biocard.prototype.onMessage = function (message) {
        var resp, markup, distancia,
            keyboard = [],
            text = message.text,
            message_id = message.message_id,
            logos;

        app.api.getBioLogos(function(data){
            logos = data;
        });


        console.log("texto biocard " + text);
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
            if (text == "/biocard") {
                app.telegram.sendMessage(this.chat, "Ingresa tu nombre de agente:", null, message_id);
            }
            else if (text == "Cancelar") {
                app.telegram.sendMessage(this.chat, "Tarea cancelada.", null);
                this.complete = true;
            }else if (this.nickname == "") {
                this.nickname = text.replace(" ", "%20");
                //
                keyboard = [
                    ["Resistencia","Iluminado"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                app.telegram.sendMessage(this.chat, "Selecciona tu facción:", markup, message_id);   

            }else if (this.faction == "") {
                keyboard = [
                    ["Resistencia","Iluminado"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                if (text == "Resistencia" ) {
                    this.faction = "res";
                    //
                    keyboard = [
                        ["Negro","Gris"],
                        ["Cancelar"]
                    ];
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: false,
                        resize_keyboard: true
                    };
                    app.telegram.sendMessage(this.chat, "Selecciona color de la plantilla:", markup, message_id);
                }else if (text == "Iluminado") {
                    this.faction = "enl";
                    //
                    keyboard = [
                        ["Negro","Gris"],
                        ["Cancelar"]
                    ];
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: false,
                        resize_keyboard: true
                    };
                    app.telegram.sendMessage(this.chat, "Selecciona color de la plantilla:", markup, message_id);
                }else{
                    app.telegram.sendMessage(this.chat, "Selecciona tu facción:", markup, message_id);   
                }
                console.log("texto faction: " + text + ", faction = " + this.faction);
            }else if (this.template == "" && text == "Negro" || this.template == "" && text == "Gris") {
                keyboard = [
                    ["Negro","Gris"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                if (text == "Negro" ) {
                    this.template = "negro";
                    //
                    keyboard = [];
                    for (var i = logos.length - 1; i >= 0; i--) {                    
                        keyboard.push([logos[i]]);
                    };// http://rescol.co/smart/biocard/logos/NOMBRE.png
                    keyboard.push(["Cancelar"]);
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: false,
                        resize_keyboard: true
                    };
                    app.telegram.sendMessage(this.chat, "Selecciona un logo:", markup, message_id);                       
                
                }else if (text == "Gris") {
                    this.template = "gris";
                    //
                    keyboard = [];
                    for (var i = logos.length - 1; i >= 0; i--) {                    
                        keyboard.push([logos[i]]);
                    };// http://rescol.co/smart/biocard/logos/NOMBRE.png
                    keyboard.push(["Cancelar"]);
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: false,
                        resize_keyboard: true
                    };
                    app.telegram.sendMessage(this.chat, "Selecciona un logo:", markup, message_id);  
                }else{
                    app.telegram.sendMessage(this.chat, "Selecciona color de la plantilla:", markup, message_id);   
                }
                console.log("texto template: " + text + ", template = " + this.template);

            }else if (logos != null && this.logo_sel == "") {
                this.logo_tmp = text;
                keyboard = [];
                for (var i = logos.length - 1; i >= 0; i--) {                    
                    keyboard.push([logos[i]]);
                };// http://rescol.co/smart/biocard/logos/NOMBRE.png
                keyboard.push(["Cancelar"]);
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                if(this.isLogoSelected(keyboard, this.logo_tmp)){
                    this.logo_sel = logo_tmp;
                    keyboard = [
                        ["Seleccionar", "Volver"],
                        ["Cancelar"]
                    ];
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: false,
                        resize_keyboard: true
                    };
                    if (text == "Seleccionar") {
                        this.logo_sel = this.logo_tmp;
                    }else{
                        app.telegram.sendPhotoEx(this.chat, "http://rescol.co/smart/biocard/logos/" + this.logo_tmp, this.logo_tmp, message_id, markup, function(data){});
                    }

                }
                                                
            }
            else{
                //http://rescol.co/smart/biocard/front.php?plantilla=negro&nickname=Cizaquita&sello=true&faction=enl
                //http://rescol.co/smart/biocard/back.php?plantilla=negro&nickname=Cizaquita&faction=enl&logo=rescol&bgcolor=3d3d3d&title=Presidente%20de%20la%20FriendZone&desc=Borracho%20y%20Programador

			}
        }
    };

    Biocard.prototype.isLogoSelected = function(keyboard, logo_tmp){    
        for (var i = keyboard.length - 1; i >= 0; i--) {
            if(keyboard[i] == this.logo_tmp){
                return true;
            }
        }
    };
    Biocard.prototype.getLogos = function(){
        app.api.getBioLogos(function(data){
            return data;
        });
    };
}());
