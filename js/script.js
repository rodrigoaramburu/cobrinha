
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
            img.src = "../imgs/apple.png";
            this.context.drawImage(
                    img,
                    this.food.x, 
                    this.food.y , 
                    this.box, 
                    this.box
            );

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

