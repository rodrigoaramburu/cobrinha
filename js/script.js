
const cobrinha = function(){
    return {
        canvas: null,
        context: null,
        box: 0,
        boxTotal: 0,

        cobrinhaBody: [],

        food: {},
        direction: 'RIGHT',

        timeout: 200,
        point: 0,
        perdeu: false,

        generateFood: function(){
            let colide;
            let xRandom;
            let yRandom;
            do{
                xRandom = Math.floor(Math.random() * (this.boxTotal-1) +1) * this.box;
                yRandom = Math.floor(Math.random() * (this.boxTotal-1) +1) * this.box;
                
                colide = false;
                for(i = 0 ; i < this.cobrinhaBody.length; i++){
                    if(this.cobrinhaBody[i].x == xRandom && this.cobrinhaBody[i].y == yRandom ){
                        colide = true;
                    }                    
                }

            }while(colide);

            this.food=  {
                x: xRandom,
                y: yRandom
            }
        },

        drawBG: function(){
            this.context.fillStyle = 'lightgreen';
            this.context.fillRect(
                0, 
                0, 
                this.boxTotal * this.box, 
                this.boxTotal * this.box
            );
        },

        drawCobrinha: function(){

            for(i = 0 ; i < this.cobrinhaBody.length; i++){
                this.context.fillStyle = 'green';
                this.context.fillRect(
                    this.cobrinhaBody[i].x, 
                    this.cobrinhaBody[i].y, 
                    this.box, 
                    this.box
                );
            }
        },

        drawFood: function(){
            const img = new Image();
            img.onload = function() {
                game.context.drawImage(
                    img,
                    game.food.x, 
                    game.food.y , 
                    game.box, 
                    game.box
                );
            };
            img.src = "data:image/png;base64,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";

           

        },

        move: function(){
            
            let newSectionX = this.cobrinhaBody[0].x;
            let newSectionY = this.cobrinhaBody[0].y;

            switch(this.direction){
                case 'RIGHT': newSectionX += this.box; break ;
                case 'LEFT': newSectionX -= this.box; break ;
                case 'UP': newSectionY -= this.box; break ;
                case 'DOWN': newSectionY += this.box; break ;
            }

            if(newSectionX != this.food.x || newSectionY != this.food.y){
                this.cobrinhaBody.pop();
            }else{
                this.eatFood();
            }

            this.cobrinhaBody.unshift({
                x: newSectionX,
                y: newSectionY
            })
        },

        eatFood: function(){
            this.generateFood();
            this.timeout = this.timeout > 10 ? this.timeout - 10 : 10;
            this.point += 10;
            document.querySelector('#points').innerHTML = 'Pontos: ' + this.point;
        },

        checkColision: function(){
            if(this.cobrinhaBody[0].x < 0 || this.cobrinhaBody[0].x >= this.boxTotal * this.box ){
                this.encerra();
                return true;
            }
            if(this.cobrinhaBody[0].y < 0 || this.cobrinhaBody[0].y >= this.boxTotal * this.box ){
                this.encerra();
                return true;
            }

            for(i = 1 ; i < this.cobrinhaBody.length; i++){
                if(this.cobrinhaBody[0].x == this.cobrinhaBody[i].x && this.cobrinhaBody[0].y == this.cobrinhaBody[i].y){
                    this.encerra();
                    return true;
                }
            }
        },

        encerra: function(){
            this.perdeu = true;
            let record = localStorage.getItem('record');
            if(record == null || this.point > record){
                localStorage.setItem('record', this.point);
                document.querySelector('#record').innerHTML = 'Record: '+(record ?? 0);
            }    
            this.context.fillStyle = 'red';        
            this.context.font = "bold 36px Roboto";
			this.context.fillText("Perdeu!!!", this.boxTotal/2 * this.box - 50, this.boxTotal/2 * this.box);
        },

        loop: function(){
            this.move();
            if( this.checkColision() ) return;
            this.drawBG();
            this.drawCobrinha();
            this.drawFood();  

            if(!this.perdeu){
                setTimeout(() => {
                    this.loop();
                }, this.timeout);
            }
            
        },


        init: function(canvasSize, box){
            this.canvas = document.getElementById('cobrinha');
            this.context = this.canvas.getContext('2d');

            this.box = 16;
            this.boxTotal = canvasSize / box;

            let record = localStorage.getItem('record');

            document.querySelector('#record').innerHTML = 'Record: '+(record ?? 0);

            document.addEventListener('keydown', function(ev){
                if(ev.key == 'ArrowLeft' && game.direction != 'RIGHT') {
                    game.direction = 'LEFT'
                }
                if(ev.key == 'ArrowUp' && game.direction != 'DOWN') {
                    game.direction = 'UP'
                }
                if(ev.key == 'ArrowRight' && game.direction != 'LEFT') {
                    game.direction = 'RIGHT'
                }
                if(ev.key == 'ArrowDown' && game.direction != 'UP') {
                    game.direction = 'DOWN'
                }
                if(ev.key == 'Enter'){
                    game.start();
                }
            });
            this.drawBG();
            this.context.fillStyle = 'black';        
            this.context.font = "bold 36px Roboto";
			this.context.fillText("Pressione Enter para iniciar ", this.boxTotal/2 * this.box - 210, this.boxTotal/2 * this.box);
        },

        start: function(){
            this.cobrinhaBody = [{
                x: this.boxTotal / 2 * this.box,
                y: this.boxTotal / 2 * this.box,
            }];
            this.perdeu = false;
            this.timeout = 200;
            this.generateFood();
            this.loop();
        }


    };
}


var game = cobrinha();
game.init(512, 16);

document.querySelector('#iniciar').addEventListener('click',function(){
    game.start();
});

